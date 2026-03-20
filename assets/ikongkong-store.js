(() => {
  const App = window.IkongkongApp = window.IkongkongApp || {};
  const { CONFIG } = App.config;
  const helpers = App.helpers;
  const factories = App.factories;

  function createStore() {
    const state = {
      data: factories.createDefaultData(),
      session: { role: 'guest', remember: false, adminId: '', customerContractId: '' },
      view: { active: 'landing', landingPortal: 'customer', customerTab: 'overview', adminTab: 'dashboard' },
      filters: { contractKeyword: '', contractWarranty: 'all', asKeyword: '', asStatus: 'all', customerAsStatus: 'all' },
      drafts: {
        contract: factories.createEmptyContractDraft(),
        customerAs: factories.createEmptyCustomerAsDraft(),
        adminAs: {},
        confirm: factories.createEmptyConfirmDraft(),
        profile: factories.createEmptyProfileDraft()
      },
      ui: {
        contractComposerOpen: false,
        expandedAsIds: {},
        activeConfirmAsId: '',
        busy: {
          customerLogin: false,
          adminLogin: false,
          contractSave: false,
          customerAsSave: false,
          profileSave: false,
          confirmSave: false,
          asSaveById: {}
        },
        dirty: {
          contract: false,
          customerAs: false,
          profile: false,
          confirm: false,
          adminAsById: {}
        }
      },
      toasts: []
    };

    function hydrate() {
      const saved = helpers.safeParse(localStorage.getItem(CONFIG.storageKey));
      if (saved && Array.isArray(saved.contracts) && Array.isArray(saved.asRequests)) {
        state.data = factories.normalizeDataStore(saved);
      } else {
        state.data = factories.normalizeDataStore(factories.createDefaultData());
        persistData();
      }

      mergeLegacyInstallerProfiles();
      hydrateDrafts();
      hydrateSession();
    }

    function hydrateDrafts() {
      const contractDraft = helpers.safeParse(localStorage.getItem(CONFIG.contractDraftKey));
      const customerAsDraft = helpers.safeParse(localStorage.getItem(CONFIG.customerAsDraftKey));
      const adminAsDraft = helpers.safeParse(localStorage.getItem(CONFIG.adminAsDraftKey));
      const confirmDraft = helpers.safeParse(localStorage.getItem(CONFIG.asConfirmDraftKey));

      if (contractDraft && typeof contractDraft === 'object') {
        state.drafts.contract = factories.normalizeContractDraft(contractDraft);
        state.ui.contractComposerOpen = !!contractDraft.isOpen;
        state.ui.dirty.contract = !!contractDraft.isDirty;
      }
      if (customerAsDraft && typeof customerAsDraft === 'object') {
        state.drafts.customerAs = factories.normalizeCustomerAsDraft(customerAsDraft);
        state.ui.dirty.customerAs = !!customerAsDraft.isDirty;
      }
      if (adminAsDraft && typeof adminAsDraft === 'object') {
        state.drafts.adminAs = adminAsDraft;
        state.ui.dirty.adminAsById = adminAsDraft.__dirtyMap || {};
      }
      if (confirmDraft && typeof confirmDraft === 'object') {
        state.drafts.confirm = factories.normalizeConfirmDraft(confirmDraft);
        state.ui.dirty.confirm = !!confirmDraft.isDirty;
      }
    }

    function hydrateSession() {
      const currentSession = helpers.safeParse(sessionStorage.getItem(CONFIG.sessionKey));
      if (currentSession && isValidSession(currentSession)) {
        state.session = currentSession;
        state.view.active = currentSession.role === 'admin' ? 'admin' : 'customer';
        return;
      }

      const savedAdmin = helpers.safeParse(localStorage.getItem(CONFIG.autoAdminLoginKey));
      if (savedAdmin && isValidSession(savedAdmin) && getAdminById(savedAdmin.adminId)) {
        state.session = { ...savedAdmin, remember: true };
        sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(state.session));
        state.view.active = 'admin';
        return;
      }

      const savedCustomer = helpers.safeParse(localStorage.getItem(CONFIG.autoCustomerLoginKey));
      if (savedCustomer && isValidSession(savedCustomer) && getContractById(savedCustomer.customerContractId)) {
        state.session = { ...savedCustomer, remember: true };
        sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(state.session));
        state.view.active = 'customer';
        return;
      }
    }

    function persistData() {
      localStorage.setItem(CONFIG.storageKey, JSON.stringify({
        version: 3,
        contracts: state.data.contracts,
        asRequests: state.data.asRequests,
        admins: state.data.admins,
        meta: state.data.meta
      }));
    }

    function persistContractDraft() {
      localStorage.setItem(CONFIG.contractDraftKey, JSON.stringify({
        ...state.drafts.contract,
        isOpen: state.ui.contractComposerOpen,
        isDirty: state.ui.dirty.contract
      }));
    }

    function persistCustomerAsDraft() {
      localStorage.setItem(CONFIG.customerAsDraftKey, JSON.stringify({
        ...state.drafts.customerAs,
        isDirty: state.ui.dirty.customerAs
      }));
    }

    function persistAdminAsDrafts() {
      localStorage.setItem(CONFIG.adminAsDraftKey, JSON.stringify({
        ...state.drafts.adminAs,
        __dirtyMap: state.ui.dirty.adminAsById
      }));
    }

    function persistConfirmDraft() {
      localStorage.setItem(CONFIG.asConfirmDraftKey, JSON.stringify({
        ...state.drafts.confirm,
        isDirty: state.ui.dirty.confirm
      }));
    }

    function clearDraftStorage() {
      localStorage.removeItem(CONFIG.contractDraftKey);
      localStorage.removeItem(CONFIG.customerAsDraftKey);
      localStorage.removeItem(CONFIG.adminAsDraftKey);
      localStorage.removeItem(CONFIG.asConfirmDraftKey);
    }

    function mergeLegacyInstallerProfiles() {
      const legacy = helpers.safeParse(localStorage.getItem(CONFIG.installerProfileKey));
      const profiles = legacy?.profiles && typeof legacy.profiles === 'object'
        ? Object.values(legacy.profiles)
        : [];

      profiles.forEach((profile) => {
        const phone = helpers.digits(profile.phone);
        const index = state.data.admins.findIndex((admin) => {
          return helpers.digits(admin.phone) === phone || helpers.normalizeText(admin.name) === helpers.normalizeText(profile.name);
        });
        if (index >= 0) {
          state.data.admins[index] = {
            ...state.data.admins[index],
            address: profile.address || state.data.admins[index].address,
            signatureImage: profile.signatureImage || state.data.admins[index].signatureImage,
            savedAt: profile.savedAt || state.data.admins[index].savedAt,
            signatureSavedAt: profile.signatureSavedAt || state.data.admins[index].signatureSavedAt
          };
        }
      });
    }

    function persistInstallerProfile(admin) {
      localStorage.setItem(CONFIG.installerProfileKey, JSON.stringify({
        version: 2,
        profiles: {
          ['phone:' + helpers.digits(admin.phone)]: {
            ownerName: admin.name,
            ownerPhone: admin.phone,
            name: admin.name,
            phone: admin.phone,
            address: admin.address,
            signatureImage: admin.signatureImage,
            savedAt: admin.savedAt || helpers.nowIso(),
            signatureSavedAt: admin.signatureSavedAt || ''
          }
        }
      }));
    }

    function getAdminById(id) {
      return state.data.admins.find((admin) => admin.id === id) || null;
    }

    function getContractById(id) {
      return state.data.contracts.find((contract) => contract.id === id) || null;
    }

    function getAsById(id) {
      return state.data.asRequests.find((item) => item.id === id) || null;
    }

    function getCurrentAdmin() {
      return getAdminById(state.session.adminId);
    }

    function getCurrentCustomerContract() {
      return getContractById(state.session.customerContractId);
    }

    function getVisibleContracts() {
      const admin = getCurrentAdmin();
      if (!admin) return state.data.contracts.slice();
      return state.data.contracts.filter((contract) => {
        return helpers.normalizeText(contract.installerName) === helpers.normalizeText(admin.name)
          || helpers.digits(contract.installerPhone) === helpers.digits(admin.phone);
      });
    }

    function getVisibleAsRequests() {
      const contractIds = new Set(getVisibleContracts().map((item) => item.id));
      const admin = getCurrentAdmin();
      return state.data.asRequests
        .filter((item) => {
          return contractIds.has(item.contractId)
            || helpers.normalizeText(item.installerName) === helpers.normalizeText(admin?.name || '')
            || helpers.digits(item.installerPhone) === helpers.digits(admin?.phone || '');
        })
        .sort(sortByCreatedAtDesc);
    }

    function getCustomerAsRequests(contractId) {
      return state.data.asRequests
        .filter((item) => item.contractId === contractId)
        .sort(sortByCreatedAtDesc);
    }

    function getAsRequestsByContractId(contractId) {
      return state.data.asRequests
        .filter((item) => item.contractId === contractId)
        .sort(sortByCreatedAtDesc);
    }

    function getFilteredContracts() {
      const keyword = helpers.normalizeText(state.filters.contractKeyword);
      return getVisibleContracts().filter((contract) => {
        const warranty = helpers.getWarrantyMeta(contract.installDate);
        const matchWarranty = state.filters.contractWarranty === 'all' || warranty.status === state.filters.contractWarranty;
        const haystack = [
          contract.contractNo,
          contract.customerName,
          contract.phone,
          contract.address,
          contract.product
        ].map(helpers.normalizeText).join(' ');
        return matchWarranty && (!keyword || haystack.includes(keyword));
      }).sort(sortByUpdatedAtDesc);
    }

    function getFilteredAsRequests() {
      const keyword = helpers.normalizeText(state.filters.asKeyword);
      return getVisibleAsRequests().filter((item) => {
        const matchStatus = state.filters.asStatus === 'all' || item.status === state.filters.asStatus;
        const haystack = [
          item.asNo, item.contractNo, item.customerName, item.phone, item.address, item.requestType, item.requestDetail
        ].map(helpers.normalizeText).join(' ');
        return matchStatus && (!keyword || haystack.includes(keyword));
      });
    }

    function getAdminAsDraft(asId) {
      if (!state.drafts.adminAs[asId]) {
        const current = getAsById(asId) || {};
        state.drafts.adminAs[asId] = {
          status: current.status || '접수중',
          adminMemo: current.adminMemo || '',
          stagedCompletedPhotos: []
        };
      }
      return state.drafts.adminAs[asId];
    }

    function upsertAdmin(admin) {
      const index = state.data.admins.findIndex((item) => item.id === admin.id);
      if (index >= 0) state.data.admins.splice(index, 1, admin);
      else state.data.admins.unshift(admin);
    }

    function upsertContract(record) {
      const index = state.data.contracts.findIndex((item) => item.id === record.id);
      if (index >= 0) state.data.contracts.splice(index, 1, record);
      else state.data.contracts.unshift(record);
    }

    function upsertAs(record) {
      const index = state.data.asRequests.findIndex((item) => item.id === record.id);
      if (index >= 0) state.data.asRequests.splice(index, 1, record);
      else state.data.asRequests.unshift(record);
    }

    function deleteContract(id) {
      state.data.contracts = state.data.contracts.filter((item) => item.id !== id);
    }

    function deleteAs(id) {
      state.data.asRequests = state.data.asRequests.filter((item) => item.id !== id);
      delete state.drafts.adminAs[id];
      delete state.ui.dirty.adminAsById[id];
    }

    function setSession(session, persistRemember) {
      state.session = session;
      sessionStorage.setItem(CONFIG.sessionKey, JSON.stringify(state.session));
      if (session.role === 'admin') {
        if (persistRemember) localStorage.setItem(CONFIG.autoAdminLoginKey, JSON.stringify(state.session));
        else localStorage.removeItem(CONFIG.autoAdminLoginKey);
      }
      if (session.role === 'customer') {
        if (persistRemember) localStorage.setItem(CONFIG.autoCustomerLoginKey, JSON.stringify(state.session));
        else localStorage.removeItem(CONFIG.autoCustomerLoginKey);
      }
    }

    function logout(role) {
      sessionStorage.removeItem(CONFIG.sessionKey);
      if (role === 'admin') localStorage.removeItem(CONFIG.autoAdminLoginKey);
      if (role === 'customer') localStorage.removeItem(CONFIG.autoCustomerLoginKey);
      state.session = { role: 'guest', remember: false, adminId: '', customerContractId: '' };
    }

    function markDirty(scope, value, id) {
      if (scope === 'contract') state.ui.dirty.contract = value;
      if (scope === 'customerAs') state.ui.dirty.customerAs = value;
      if (scope === 'profile') state.ui.dirty.profile = value;
      if (scope === 'confirm') state.ui.dirty.confirm = value;
      if (scope === 'adminAs' && id) state.ui.dirty.adminAsById[id] = value;
    }

    function hasDirtyState() {
      return !!(
        state.ui.dirty.contract ||
        state.ui.dirty.customerAs ||
        state.ui.dirty.profile ||
        state.ui.dirty.confirm ||
        Object.values(state.ui.dirty.adminAsById || {}).some(Boolean)
      );
    }

    function isValidSession(session) {
      return !!session && (session.role === 'admin' || session.role === 'customer');
    }

    function sortByCreatedAtDesc(a, b) {
      return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
    }

    function sortByUpdatedAtDesc(a, b) {
      return new Date(b.updatedAt || 0).getTime() - new Date(a.updatedAt || 0).getTime();
    }

    return {
      state,
      hydrate,
      persistData,
      persistContractDraft,
      persistCustomerAsDraft,
      persistAdminAsDrafts,
      persistConfirmDraft,
      clearDraftStorage,
      persistInstallerProfile,
      getAdminById,
      getContractById,
      getAsById,
      getCurrentAdmin,
      getCurrentCustomerContract,
      getVisibleContracts,
      getVisibleAsRequests,
      getCustomerAsRequests,
      getAsRequestsByContractId,
      getFilteredContracts,
      getFilteredAsRequests,
      getAdminAsDraft,
      upsertAdmin,
      upsertContract,
      upsertAs,
      deleteContract,
      deleteAs,
      setSession,
      logout,
      markDirty,
      hasDirtyState
    };
  }

  App.store = createStore();
})();
