(() => {
  const App = window.IkongkongApp = window.IkongkongApp || {};

  const CONFIG = {
    appVersion: '2026.03.19-mobile-refactor',
    storageKey: 'aikongkong_contract_as_v2',
    sessionKey: 'aikongkong_entry_session_v1',
    autoAdminLoginKey: 'aikongkong_auto_admin_login_v1',
    autoCustomerLoginKey: 'aikongkong_auto_customer_login_v1',
    installerProfileKey: 'aikongkong_installer_profile_v1',
    contractDraftKey: 'aikongkong_contract_draft_v1',
    customerAsDraftKey: 'aikongkong_customer_as_draft_v1',
    adminAsDraftKey: 'aikongkong_admin_as_draft_v1',
    asConfirmDraftKey: 'aikongkong_as_confirm_draft_v1',
    statusOptions: ['접수중', '처리중', '처리완료'],
    discountOptions: ['공동구매', '지원', '베페할인', '기타'],
    colorOptions: ['샌드베이지', '샌드그레이', '화이트마블', '스킨퓨어'],
    maxRequestImages: 4,
    maxCompletionImages: 6,
    warrantyWarningDays: 30
  };

  const MAT_PRICE_BOOK = {
    premium600: { label: '프리미엄600', normal: 22000, refurbished: 20000, quantityStep: 1 },
    skinpure600: { label: '스킨퓨어600', normal: 25000, refurbished: 23000, quantityStep: 1 },
    premium1200: { label: '프리미엄1200', normal: 108000, refurbished: 98000, quantityStep: 0.5 },
    skinpure1200: { label: '스킨퓨어1200', normal: 118000, refurbished: 107000, quantityStep: 0.5 }
  };

  const STATUS_META = {
    접수중: { className: 'status-received', label: '접수중', short: '접수' },
    처리중: { className: 'status-processing', label: '처리중', short: '진행' },
    처리완료: { className: 'status-complete', label: '처리완료', short: '완료' }
  };

  const GOOGLE_SHEETS_LAYOUT = {
    contracts: {
      title: '계약관리 시트',
      visibleColumns: [
        '계약번호', '고객명', '연락처', '주소', '품명/사용수량', '색상', '결제방식',
        '할인유형', '할인금액', '최종결제금액', '시공일자', '보증만료일',
        '시공차수', '시공자명', '시공자연락처', '시공특이사항', '최근수정일'
      ],
      hiddenColumns: [
        '_id', '_contractId', '_productItemsJson', '_signatureImage', '_installerSignatureImage',
        '_storagePath', '_createdAtIso', '_updatedAtIso', '_debugState'
      ],
      computedColumns: ['보증만료일', '최근수정일'],
      dedupeStrategy: '고객 기본정보는 고객기본정보 시트로 분리하고 계약 시점 스냅샷만 유지'
    },
    asRequests: {
      title: 'AS관리 시트',
      visibleColumns: [
        'AS번호', '계약번호', '고객명', '연락처', '주소', '품명/사용수량',
        '접수유형', '접수내용', '희망연락시간', '진행상태', '처리사항',
        '기사메모', '담당시공자', '접수일', '완료일', '최근수정일'
      ],
      hiddenColumns: [
        '_id', '_contractId', '_asId', '_requestImages', '_completedImages',
        '_customerSignature', '_installerSignature', '_storagePath',
        '_createdAtIso', '_updatedAtIso', '_debugState'
      ],
      computedColumns: ['완료일', '최근수정일'],
      dedupeStrategy: '계약번호 기준으로 계약 시트와 연결하고, 현장용 스냅샷만 앞쪽 표시 컬럼에 유지'
    },
    customers: {
      title: '고객기본정보 시트',
      visibleColumns: ['고객명', '기본연락처', '기본주소', '최근계약번호', '최근수정일'],
      hiddenColumns: ['_customerId', '_normalizedPhone', '_createdAtIso', '_updatedAtIso'],
      computedColumns: ['최근수정일'],
      dedupeStrategy: '고객명 + 정규화 연락처 기준 upsert'
    },
    codes: {
      title: '코드관리 시트',
      visibleColumns: ['구분', '코드', '표시명', '사용여부', '정렬순서'],
      hiddenColumns: ['_updatedAtIso'],
      computedColumns: [],
      dedupeStrategy: '상태값 / 매트코드 / 할인유형 공통 관리'
    }
  };

  function safeParse(raw) {
    if (!raw || typeof raw !== 'string') return null;
    try {
      return JSON.parse(raw);
    } catch (_) {
      return null;
    }
  }

  function wait(ms) {
    return new Promise((resolve) => window.setTimeout(resolve, ms));
  }

  function nowIso() {
    return new Date().toISOString();
  }

  function todayString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function shiftDate(dateString, dayOffset) {
    const date = new Date(dateString + 'T09:00:00');
    date.setDate(date.getDate() + dayOffset);
    return date.toISOString().slice(0, 10);
  }

  function shiftIso(isoString, offsetMs) {
    return new Date(new Date(isoString).getTime() + offsetMs).toISOString();
  }

  function addMonths(dateString, monthOffset) {
    const date = new Date(dateString + 'T09:00:00');
    date.setMonth(date.getMonth() + monthOffset);
    return date.toISOString().slice(0, 10);
  }

  function daysDiff(startDate, endDate) {
    const start = new Date(startDate + 'T00:00:00').getTime();
    const end = new Date(endDate + 'T00:00:00').getTime();
    return Math.ceil((end - start) / 86400000);
  }

  function digits(value) {
    return String(value || '').replace(/\D+/g, '');
  }

  function normalizeText(value) {
    return String(value || '').trim().toLowerCase();
  }

  function last4(value) {
    return digits(value).slice(-4);
  }

  function formatDate(value, withTime) {
    if (!value) return '-';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return String(value);
    const formatted = date.getFullYear() + '.' + String(date.getMonth() + 1).padStart(2, '0') + '.' + String(date.getDate()).padStart(2, '0');
    if (!withTime) return formatted;
    return formatted + ' ' + String(date.getHours()).padStart(2, '0') + ':' + String(date.getMinutes()).padStart(2, '0');
  }

  function formatCurrency(value) {
    const number = Math.max(0, Number(value || 0));
    return number.toLocaleString('ko-KR') + '원';
  }

  function formatPhone(value) {
    const phone = digits(value);
    if (phone.length === 11) return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
    if (phone.length === 10) return phone.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    return value || '-';
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function uid(prefix) {
    return prefix + '_' + Date.now().toString(36) + '_' + Math.random().toString(36).slice(2, 8);
  }

  function splitList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value;
    return String(value).split(',').map((item) => item.trim()).filter(Boolean);
  }

  function normalizeImageList(value) {
    if (!value) return [];
    if (Array.isArray(value)) return value.filter(Boolean);
    if (typeof value === 'string') return value ? [value] : [];
    return [];
  }

  function getDefaultUnitPrice(baseType, refurbished) {
    const item = MAT_PRICE_BOOK[baseType] || MAT_PRICE_BOOK.premium600;
    return refurbished ? item.refurbished : item.normal;
  }

  function getDefaultQuantity(baseType) {
    const item = MAT_PRICE_BOOK[baseType] || MAT_PRICE_BOOK.premium600;
    return item.quantityStep === 0.5 ? 0.5 : 1;
  }

  function normalizeQuantity(baseType, quantity) {
    const item = MAT_PRICE_BOOK[baseType] || MAT_PRICE_BOOK.premium600;
    if (item.quantityStep === 0.5) {
      const next = Math.max(0.5, Math.round(Number(quantity || 0) * 2) / 2);
      return Number(next.toFixed(1));
    }
    return Math.max(1, Math.round(Number(quantity || 0)));
  }

  function formatQuantity(baseType, quantity) {
    const normalized = normalizeQuantity(baseType, quantity);
    return normalized % 1 === 0 ? String(normalized) : normalized.toFixed(1);
  }

  function inferBaseType(text) {
    const value = String(text || '');
    if (value.includes('스킨퓨어1200')) return 'skinpure1200';
    if (value.includes('프리미엄1200')) return 'premium1200';
    if (value.includes('스킨퓨어600')) return 'skinpure600';
    return 'premium600';
  }

  function getProductLabel(item) {
    const book = MAT_PRICE_BOOK[item.baseType] || MAT_PRICE_BOOK.premium600;
    return (item.refurbished ? '[리퍼브]' : '') + book.label;
  }

  function createProductRowDraft(baseType = 'premium600') {
    return {
      id: uid('item'),
      baseType,
      refurbished: false,
      quantity: getDefaultQuantity(baseType),
      unitPrice: getDefaultUnitPrice(baseType, false)
    };
  }

  function createEmptyContractDraft(admin) {
    return {
      id: '',
      contractNo: '',
      customerName: '',
      phone: '',
      address: '',
      color: CONFIG.colorOptions[0],
      paymentMethod: '',
      installDate: todayString(),
      installRound: '1차 완료',
      discountTypes: [],
      discountAmount: 0,
      discountEtc: '',
      installNote: '',
      customerSignName: '',
      installerSignName: admin?.name || '',
      signatureImage: '',
      installerName: admin?.name || '',
      installerSignatureImage: admin?.signatureImage || '',
      installerPhone: admin?.phone || '',
      installerAddress: admin?.address || '',
      productItems: [createProductRowDraft()]
    };
  }

  function createEmptyCustomerAsDraft(contractId = '', contractNo = '') {
    return {
      contractId,
      contractNo,
      requestType: '시공불량',
      requestDetail: '',
      contactTime: '오후',
      requestImages: []
    };
  }

  function createEmptyConfirmDraft() {
    return {
      asId: '',
      status: '접수중',
      processedDate: todayString(),
      customerSignName: '',
      installerSignName: '',
      techNote: '',
      signatureImage: '',
      installerSignatureImage: ''
    };
  }

  function createEmptyProfileDraft() {
    return { id: '', name: '', phone: '', address: '', signatureImage: '' };
  }

  function computeContractSummary(draft) {
    const subtotal = draft.productItems.reduce((sum, item) => {
      return sum + (normalizeQuantity(item.baseType, item.quantity) * Math.max(0, Number(item.unitPrice || 0)));
    }, 0);
    const discountAmount = Math.max(0, Number(draft.discountAmount || 0));
    const total = Math.max(0, subtotal - discountAmount);
    const productSummary = draft.productItems.map((item) => {
      return getProductLabel(item) + ' ' + formatQuantity(item.baseType, item.quantity) + '장';
    }).join(', ');
    const paymentMethod = (draft.paymentMethod || '미정').trim();
    return {
      subtotal,
      discountAmount,
      total,
      productSummary,
      paymentSummary: paymentMethod + ' / ' + formatCurrency(total)
    };
  }

  function toDateInputValue(value) {
    if (!value) return '';
    const text = String(value);
    if (/^\d{4}-\d{2}-\d{2}$/.test(text)) return text;
    const date = new Date(text);
    return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
  }

  function getWarrantyMeta(installDate) {
    if (!installDate) {
      return { status: 'normal', statusClass: 'status-received', label: '시공일 미입력', description: '보증기간 계산 불가', endDate: '', remainingLabel: '-' };
    }
    const endDate = addMonths(installDate, 6);
    const remainingDays = daysDiff(todayString(), endDate);
    if (remainingDays < 0) {
      return { status: 'expired', statusClass: 'status-expired', label: '보증 만료', description: Math.abs(remainingDays) + '일 경과', endDate, remainingLabel: '만료' };
    }
    if (remainingDays <= CONFIG.warrantyWarningDays) {
      return { status: 'warning', statusClass: 'status-processing', label: '보증 임박', description: remainingDays + '일 남음', endDate, remainingLabel: remainingDays + '일' };
    }
    return { status: 'normal', statusClass: 'status-complete', label: '보증 정상', description: remainingDays + '일 남음', endDate, remainingLabel: remainingDays + '일' };
  }

  function generateContractNo(existingContracts) {
    const prefix = todayString().replace(/-/g, '');
    const count = existingContracts.filter((item) => String(item.contractNo || '').includes(prefix)).length + 1;
    return 'C' + prefix + String(count).padStart(3, '0');
  }

  function generateAsNo(existingRequests) {
    const prefix = todayString().replace(/-/g, '');
    const count = existingRequests.filter((item) => String(item.asNo || '').includes(prefix)).length + 1;
    return 'AS' + prefix + String(count).padStart(3, '0');
  }

  function buildContractRecord(source, admin, existingContracts = []) {
    const summary = computeContractSummary(source);
    const installDate = source.installDate || todayString();
    const createdAt = source.createdAt || nowIso();
    const updatedAt = nowIso();
    return {
      id: source.id || uid('contract'),
      contractNo: source.contractNo || generateContractNo(existingContracts),
      customerName: String(source.customerName || '').trim(),
      phone: digits(source.phone),
      address: String(source.address || '').trim(),
      product: summary.productSummary,
      productItems: source.productItems.map((item) => ({
        id: item.id || uid('item'),
        baseType: item.baseType,
        refurbished: !!item.refurbished,
        quantity: normalizeQuantity(item.baseType, item.quantity),
        unitPrice: Math.max(0, Number(item.unitPrice || 0))
      })),
      color: source.color || CONFIG.colorOptions[0],
      totalPrice: String(summary.total),
      paymentMethod: String(source.paymentMethod || '').trim(),
      paymentSummary: summary.paymentSummary,
      installDate,
      docYear: installDate.slice(0, 4),
      docMonth: installDate.slice(5, 7),
      docDay: installDate.slice(8, 10),
      installRound: source.installRound || '1차 완료',
      discountTypes: Array.isArray(source.discountTypes) ? source.discountTypes.slice() : splitList(source.discountTypes),
      discountAmount: String(summary.discountAmount),
      discountEtc: source.discountEtc || '',
      installNote: source.installNote || '',
      customerSignName: source.customerSignName || source.customerName || '',
      installerSignName: admin?.name || source.installerSignName || source.installerName || '',
      signatureImage: source.signatureImage || '',
      installerName: admin?.name || source.installerName || '',
      installerSignatureImage: admin?.signatureImage || source.installerSignatureImage || '',
      createdAt,
      updatedAt,
      installerAddress: admin?.address || source.installerAddress || '',
      installerPhone: admin?.phone || source.installerPhone || ''
    };
  }

  function buildAsRecord(source, existingRequests = []) {
    const createdAt = source.createdAt || nowIso();
    return {
      id: source.id || uid('as'),
      asNo: source.asNo || generateAsNo(existingRequests),
      contractId: source.contractId || '',
      contractNo: source.contractNo || '',
      customerName: source.customerName || '',
      phone: digits(source.phone),
      address: source.address || '',
      product: source.product || '',
      installerName: source.installerName || '',
      installerPhone: source.installerPhone || '',
      requestType: source.requestType || '시공불량',
      requestDetail: source.requestDetail || '',
      requestImages: normalizeImageList(source.requestImages),
      contactTime: source.contactTime || '오후',
      status: source.status || '접수중',
      techNote: source.techNote || '',
      adminMemo: source.adminMemo || '',
      customerSignName: source.customerSignName || '',
      signatureImage: source.signatureImage || '',
      installerSignName: source.installerSignName || '',
      installerSignatureImage: source.installerSignatureImage || '',
      completedPhotos: normalizeImageList(source.completedPhotos),
      createdAt,
      updatedAt: source.updatedAt || createdAt,
      completedAt: source.completedAt || ''
    };
  }

  function normalizeContractDraft(raw) {
    const items = Array.isArray(raw.productItems) && raw.productItems.length
      ? raw.productItems.map((item) => ({
        id: item.id || uid('item'),
        baseType: item.baseType || inferBaseType(item.type || item.product || ''),
        refurbished: !!item.refurbished || /^\[리퍼브\]/.test(item.type || item.product || ''),
        quantity: normalizeQuantity(item.baseType || inferBaseType(item.type || item.product || ''), Number(item.quantity || 1)),
        unitPrice: Math.max(0, Number(item.unitPrice || getDefaultUnitPrice(item.baseType || inferBaseType(item.type || item.product || ''), !!item.refurbished)))
      }))
      : [createProductRowDraft()];

    return {
      id: raw.id || '',
      contractNo: raw.contractNo || '',
      customerName: raw.customerName || '',
      phone: digits(raw.phone),
      address: raw.address || '',
      color: raw.color || CONFIG.colorOptions[0],
      paymentMethod: raw.paymentMethod || '',
      installDate: toDateInputValue(raw.installDate) || todayString(),
      installRound: raw.installRound || '1차 완료',
      discountTypes: Array.isArray(raw.discountTypes) ? raw.discountTypes.slice() : splitList(raw.discountTypes),
      discountAmount: Math.max(0, Number(raw.discountAmount || 0)),
      discountEtc: raw.discountEtc || '',
      installNote: raw.installNote || '',
      customerSignName: raw.customerSignName || '',
      installerSignName: raw.installerSignName || '',
      signatureImage: raw.signatureImage || '',
      installerName: raw.installerName || '',
      installerSignatureImage: raw.installerSignatureImage || '',
      installerPhone: digits(raw.installerPhone),
      installerAddress: raw.installerAddress || '',
      productItems: items,
      createdAt: raw.createdAt || '',
      updatedAt: raw.updatedAt || ''
    };
  }

  function normalizeCustomerAsDraft(raw) {
    return {
      contractId: raw.contractId || '',
      contractNo: raw.contractNo || '',
      requestType: raw.requestType || '시공불량',
      requestDetail: raw.requestDetail || '',
      contactTime: raw.contactTime || '오후',
      requestImages: normalizeImageList(raw.requestImages)
    };
  }

  function normalizeConfirmDraft(raw) {
    return {
      asId: raw.asId || '',
      status: raw.status || '접수중',
      processedDate: raw.processedDate || todayString(),
      customerSignName: raw.customerSignName || '',
      installerSignName: raw.installerSignName || '',
      techNote: raw.techNote || '',
      signatureImage: raw.signatureImage || '',
      installerSignatureImage: raw.installerSignatureImage || ''
    };
  }

  function normalizeAdminRecord(raw) {
    return {
      id: raw.id || uid('admin'),
      name: raw.name || '',
      phone: digits(raw.phone),
      address: raw.address || '',
      signatureImage: raw.signatureImage || '',
      savedAt: raw.savedAt || raw.createdAt || nowIso(),
      signatureSavedAt: raw.signatureSavedAt || '',
      isActive: raw.isActive || 'Y',
      createdAt: raw.createdAt || nowIso(),
      updatedAt: raw.updatedAt || nowIso()
    };
  }

  function normalizeDataStore(raw) {
    return {
      version: 3,
      contracts: (raw.contracts || []).map((item) => buildContractRecord(normalizeContractDraft(item), {
        name: item.installerName || item.installerSignName || '',
        phone: item.installerPhone || '',
        address: item.installerAddress || '',
        signatureImage: item.installerSignatureImage || ''
      }, raw.contracts || [])),
      asRequests: (raw.asRequests || []).map((item) => buildAsRecord(item, raw.asRequests || [])),
      admins: (raw.admins || []).map((item) => normalizeAdminRecord(item)),
      meta: raw.meta || {}
    };
  }

  function createDefaultData() {
    const today = todayString();
    const createdAt = nowIso();
    const installRecent = shiftDate(today, -40);
    const installWarning = shiftDate(today, -150);
    const installExpired = shiftDate(today, -220);

    const admins = [
      {
        id: 'admin_default_1',
        name: '정지오',
        phone: '01085259253',
        address: '청주시 흥덕구 테스트길 11',
        signatureImage: '',
        savedAt: createdAt,
        signatureSavedAt: '',
        isActive: 'Y',
        createdAt,
        updatedAt: createdAt
      },
      {
        id: 'admin_default_2',
        name: '고요한',
        phone: '01099179294',
        address: '사천동 시공자길 2',
        signatureImage: '',
        savedAt: createdAt,
        signatureSavedAt: '',
        isActive: 'Y',
        createdAt,
        updatedAt: createdAt
      }
    ];

    const contracts = [];
    contracts.push(buildContractRecord({
      id: 'contract_demo_1',
      contractNo: 'C20260315001',
      customerName: '김춘식',
      phone: '01014141414',
      address: '청주시 서원구 예시로 31',
      color: '샌드베이지',
      paymentMethod: '계좌이체',
      installDate: installRecent,
      installRound: '1차 완료',
      productItems: [{ id: uid('item'), baseType: 'skinpure600', refurbished: true, quantity: 22, unitPrice: 23000 }],
      discountTypes: ['지원'],
      discountAmount: 0,
      installNote: '현관 앞 문틀 마감 보강',
      installerName: '정지오',
      installerPhone: '01085259253',
      installerAddress: '청주시 흥덕구 테스트길 11',
      createdAt,
      updatedAt: createdAt
    }, admins[0], contracts));

    contracts.push(buildContractRecord({
      id: 'contract_demo_2',
      contractNo: 'C20260211007',
      customerName: '박지민',
      phone: '01056781234',
      address: '청주시 상당구 생활로 102',
      color: '화이트마블',
      paymentMethod: '카드',
      installDate: installWarning,
      installRound: '1차 후 2차 예정',
      productItems: [{ id: uid('item'), baseType: 'premium1200', refurbished: false, quantity: 1.5, unitPrice: 108000 }],
      discountTypes: ['공동구매', '기타'],
      discountAmount: 10000,
      discountEtc: '오픈 행사 할인',
      installNote: '냉장고 앞 미시공 후 재방문 예정',
      installerName: '고요한',
      installerPhone: '01099179294',
      installerAddress: '사천동 시공자길 2',
      createdAt,
      updatedAt: createdAt
    }, admins[1], contracts));

    contracts.push(buildContractRecord({
      id: 'contract_demo_3',
      contractNo: 'C20260110003',
      customerName: '홍길동',
      phone: '01082828282',
      address: '청주시 흥덕구 계약로 55',
      color: '샌드그레이',
      paymentMethod: '카드',
      installDate: installExpired,
      installRound: '2차 완료',
      productItems: [
        { id: uid('item'), baseType: 'premium600', refurbished: false, quantity: 18, unitPrice: 22000 },
        { id: uid('item'), baseType: 'skinpure1200', refurbished: false, quantity: 1, unitPrice: 118000 }
      ],
      discountTypes: ['베페할인'],
      discountAmount: 5000,
      installNote: '거실 중앙 시공 후 마감 점검 완료',
      installerName: '정지오',
      installerPhone: '01085259253',
      installerAddress: '청주시 흥덕구 테스트길 11',
      createdAt,
      updatedAt: createdAt
    }, admins[0], contracts));

    const asRequests = [];
    asRequests.push(buildAsRecord({
      id: 'as_demo_1',
      asNo: 'AS20260318001',
      contractId: contracts[0].id,
      contractNo: contracts[0].contractNo,
      customerName: contracts[0].customerName,
      phone: contracts[0].phone,
      address: contracts[0].address,
      product: contracts[0].product,
      installerName: contracts[0].installerName,
      installerPhone: contracts[0].installerPhone,
      requestType: '들뜸',
      requestDetail: '문앞 연결부가 약간 떠서 발이 걸립니다.',
      contactTime: '오후',
      status: '접수중',
      createdAt: createdAt,
      updatedAt: createdAt
    }, asRequests));

    asRequests.push(buildAsRecord({
      id: 'as_demo_2',
      asNo: 'AS20260312002',
      contractId: contracts[2].id,
      contractNo: contracts[2].contractNo,
      customerName: contracts[2].customerName,
      phone: contracts[2].phone,
      address: contracts[2].address,
      product: contracts[2].product,
      installerName: contracts[2].installerName,
      installerPhone: contracts[2].installerPhone,
      requestType: '재단/마감',
      requestDetail: '창가 쪽 마감선이 조금 벌어져 있습니다.',
      contactTime: '오전',
      status: '처리중',
      adminMemo: '고객과 3/20 오전 재방문 일정 조율',
      techNote: '창가 모서리 재단 보수 예정',
      createdAt: shiftIso(createdAt, -86400000 * 2),
      updatedAt: createdAt
    }, asRequests));

    return {
      version: 3,
      contracts,
      asRequests,
      admins,
      meta: {
        lastSeededAt: createdAt,
        recentCustomers: [],
        recentAsIds: []
      }
    };
  }

  App.config = {
    CONFIG,
    MAT_PRICE_BOOK,
    STATUS_META,
    GOOGLE_SHEETS_LAYOUT
  };

  App.helpers = {
    safeParse,
    wait,
    nowIso,
    todayString,
    shiftDate,
    shiftIso,
    addMonths,
    daysDiff,
    digits,
    normalizeText,
    last4,
    formatDate,
    formatCurrency,
    formatPhone,
    escapeHtml,
    uid,
    splitList,
    normalizeImageList,
    getDefaultUnitPrice,
    getDefaultQuantity,
    normalizeQuantity,
    formatQuantity,
    inferBaseType,
    getProductLabel,
    computeContractSummary,
    toDateInputValue,
    getWarrantyMeta,
    generateContractNo,
    generateAsNo
  };

  App.factories = {
    createProductRowDraft,
    createEmptyContractDraft,
    createEmptyCustomerAsDraft,
    createEmptyConfirmDraft,
    createEmptyProfileDraft,
    buildContractRecord,
    buildAsRecord,
    normalizeContractDraft,
    normalizeCustomerAsDraft,
    normalizeConfirmDraft,
    normalizeAdminRecord,
    normalizeDataStore,
    createDefaultData
  };
})();
