const PROP_SHEET_ID = 'AIKONGKONG_SPREADSHEET_ID';
const DEFAULT_SPREADSHEET_ID = '1-4yzOffi19OwcxzdUgt8bOTIsroc9zqRibVDfZC3nPI';

const CONTRACT_SHEET = '?쒓났怨꾩빟??;
const AS_SHEET = 'AS?좎껌?댁뿭';
const ADMIN_SHEET = '愿由ъ옄';

const CONTRACT_SHEET_LEGACY_NAMES = ['contracts'];
const AS_SHEET_LEGACY_NAMES = ['as_requests'];
const ADMIN_SHEET_LEGACY_NAMES = ['admins'];

const DEFAULT_ADMIN_NAME = '?뺤???;
const DEFAULT_ADMIN_PHONE = '01085259253';

const CONTRACT_FIELD_DEFS = [
  { key: 'id', label: '?앸퀎ID', aliases: ['ID'] },
  { key: 'contractNo', label: '怨꾩빟踰덊샇', aliases: ['怨꾩빟 踰덊샇'] },
  { key: 'customerName', label: '怨좉컼紐?, aliases: ['怨좉컼?대쫫', '?깅챸', '怨꾩빟?먮챸'] },
  { key: 'phone', label: '?곕씫泥?, aliases: ['?대???, '怨좉컼?곕씫泥?, '?꾪솕踰덊샇'], numberFormat: '@' },
  { key: 'address', label: '二쇱냼', aliases: ['?쒓났二쇱냼'] },
  { key: 'product', label: '?쒗뭹', aliases: ['?쒗뭹紐?] },
  { key: 'color', label: '?됱긽', aliases: ['?쒗뭹?됱긽'] },
  { key: 'totalPrice', label: '珥앷툑??, aliases: ['寃곗젣湲덉븸', '湲덉븸'] },
  { key: 'paymentMethod', label: '寃곗젣諛⑹떇', aliases: ['寃곗젣?섎떒', '寃곗젣 諛⑹떇'] },
  { key: 'paymentSummary', label: '寃곗젣?붿빟', aliases: ['寃곗젣?댁슜', '寃곗젣 ?붿빟'] },
  { key: 'installDate', label: '?쒓났?쇱옄', aliases: ['?쒓났??, '?쒓났 ?좎쭨'] },
  { key: 'docYear', label: '臾몄꽌?곕룄', aliases: ['臾몄꽌 ?곕룄'] },
  { key: 'docMonth', label: '臾몄꽌??, aliases: ['臾몄꽌 ??] },
  { key: 'docDay', label: '臾몄꽌??, aliases: ['臾몄꽌 ??] },
  { key: 'installRound', label: '?쒓났李⑥닔', aliases: ['?쒓났 李⑥닔'] },
  { key: 'discountTypes', label: '?좎씤?좏삎', aliases: ['?좎씤 ?좏삎'] },
  { key: 'discountEtc', label: '湲고??좎씤?곸꽭', aliases: ['湲고? ?좎씤 ?곸꽭'] },
  { key: 'installNote', label: '?쒓났?뱀씠?ы빆', aliases: ['?쒓났 ?뱀씠?ы빆', '?뱀씠?ы빆'] },
  { key: 'customerSignName', label: '怨좉컼?쒕챸紐?, aliases: ['怨좉컼 ?쒕챸紐?] },
  { key: 'installerSignName', label: '?쒓났?먯꽌紐낅챸', aliases: ['?쒓났???쒕챸紐?] },
  { key: 'signatureImage', label: '怨좉컼?쒕챸?대?吏', aliases: ['怨좉컼?쒕챸', '怨좉컼 ?쒕챸 ?대?吏'] },
  { key: 'installerName', label: '?쒓났?먮챸', aliases: ['?쒓났湲곗궗紐?, '?대떦?쒓났?먮챸'] },
  { key: 'installerSignatureImage', label: '?쒓났?먯꽌紐낆씠誘몄?', aliases: ['?쒓났?먯꽌紐?, '?쒓났???쒕챸 ?대?吏'] },
  { key: 'createdAt', label: '?앹꽦?쇱떆', aliases: ['?깅줉?쇱떆', 'created_at'] },
  { key: 'updatedAt', label: '?섏젙?쇱떆', aliases: ['蹂寃쎌씪??, 'updated_at'] },
  { key: 'installerAddress', label: '?쒓났?먯＜??, aliases: ['?쒓났??二쇱냼'] },
  { key: 'installerPhone', label: '?쒓났?먯뿰?쎌쿂', aliases: ['?쒓났???곕씫泥?, '?대떦?쒓났?먯뿰?쎌쿂'], numberFormat: '@' }
];

const AS_FIELD_DEFS = [
  { key: 'id', label: '?앸퀎ID', aliases: ['ID'] },
  { key: 'asNo', label: 'AS踰덊샇', aliases: ['A/S踰덊샇'] },
  { key: 'contractId', label: '怨꾩빟?앸퀎ID', aliases: ['怨꾩빟ID'] },
  { key: 'contractNo', label: '怨꾩빟踰덊샇', aliases: ['怨꾩빟 踰덊샇'] },
  { key: 'customerName', label: '怨좉컼紐?, aliases: ['怨좉컼?대쫫', '?깅챸'] },
  { key: 'phone', label: '?곕씫泥?, aliases: ['?대???, '怨좉컼?곕씫泥?], numberFormat: '@' },
  { key: 'address', label: '二쇱냼', aliases: ['?쒓났二쇱냼'] },
  { key: 'product', label: '?쒗뭹', aliases: ['?쒗뭹紐?] },
  { key: 'installerName', label: '?쒓났?먮챸', aliases: ['?쒓났湲곗궗紐?, '?대떦?쒓났?먮챸'] },
  { key: 'installerPhone', label: '?쒓났?먯뿰?쎌쿂', aliases: ['?쒓났???곕씫泥?], numberFormat: '@' },
  { key: 'requestType', label: 'AS?좏삎', aliases: ['asType', 'A/S?좏삎', '?좎껌?좏삎'] },
  { key: 'requestDetail', label: '?묒닔?댁슜', aliases: ['?좎껌?댁슜', '臾몄쓽?댁슜'] },
  { key: 'requestImage1', label: '?붿껌?ъ쭊1', aliases: ['泥⑤??ъ쭊1', '?ъ쭊1'] },
  { key: 'requestImage2', label: '?붿껌?ъ쭊2', aliases: ['泥⑤??ъ쭊2', '?ъ쭊2'] },
  { key: 'requestImage3', label: '?붿껌?ъ쭊3', aliases: ['泥⑤??ъ쭊3', '?ъ쭊3'] },
  { key: 'requestImage4', label: '?붿껌?ъ쭊4', aliases: ['泥⑤??ъ쭊4', '?ъ쭊4'] },
  { key: 'contactTime', label: '?щ쭩?곕씫?쒓컙', aliases: ['?щ쭩 ?곕씫 ?쒓컙'] },
  { key: 'status', label: '泥섎━?곹깭', aliases: ['吏꾪뻾?곹깭', '?곹깭'] },
  { key: 'techNote', label: '泥섎━硫붾え', aliases: ['泥섎━ 硫붾え', '湲곗닠硫붾え'] },
  { key: 'customerSignName', label: '怨좉컼?쒕챸紐?, aliases: ['怨좉컼 ?쒕챸紐?] },
  { key: 'signatureImage', label: '怨좉컼?쒕챸?대?吏', aliases: ['怨좉컼?쒕챸', '怨좉컼 ?쒕챸 ?대?吏'] },
  { key: 'installerSignName', label: '?쒓났?먯꽌紐낅챸', aliases: ['?쒓났???쒕챸紐?] },
  { key: 'installerSignatureImage', label: '?쒓났?먯꽌紐낆씠誘몄?', aliases: ['?쒓났?먯꽌紐?, '?쒓났???쒕챸 ?대?吏'] },
  { key: 'createdAt', label: '?묒닔?쇱떆', aliases: ['?앹꽦?쇱떆', '?깅줉?쇱떆'] },
  { key: 'updatedAt', label: '?섏젙?쇱떆', aliases: ['蹂寃쎌씪??] },
  { key: 'completedAt', label: '?꾨즺?쇱떆', aliases: ['泥섎━?꾨즺?쇱떆'] }
];

const ADMIN_FIELD_DEFS = [
  { key: 'id', label: '?앸퀎ID', aliases: ['ID'] },
  { key: 'name', label: '?대쫫', aliases: ['愿由ъ옄紐?, '?대떦?먮챸'] },
  { key: 'phone', label: '?곕씫泥?, aliases: ['?대???, '?꾪솕踰덊샇'], numberFormat: '@' },
  { key: 'address', label: '二쇱냼', aliases: ['?쒓났?먯＜??, '?쒓났??二쇱냼', '湲곕낯二쇱냼', '湲곕낯 二쇱냼'] },
  { key: 'signatureImage', label: '?쒕챸?대?吏', aliases: ['?쒓났?먯꽌紐?, '?쒓났???쒕챸', '?쒓났?먯꽌紐낆씠誘몄?', '?쒓났???쒕챸 ?대?吏'] },
  { key: 'savedAt', label: '湲곕낯?뺣낫??μ씪??, aliases: ['湲곕낯?뺣낫 ??μ씪??, 'saved_at'] },
  { key: 'signatureSavedAt', label: '?쒕챸??μ씪??, aliases: ['?쒕챸 ??μ씪??, 'signature_saved_at'] },
  { key: 'isActive', label: '?ъ슜?щ?', aliases: ['?쒖꽦?щ?', '?ъ슜 ?щ?'] },
  { key: 'createdAt', label: '?앹꽦?쇱떆', aliases: ['?깅줉?쇱떆'] },
  { key: 'updatedAt', label: '?섏젙?쇱떆', aliases: ['蹂寃쎌씪??] }
];

function doGet(e) {
  return handleRequest_(e, null);
}

function doPost(e) {
  const body = parseJsonSafely_(e && e.postData ? e.postData.contents : '{}');
  return handleRequest_(e, body);
}

function handleRequest_(e, body) {
  try {
    const action =
      (body && body.action) ||
      (e && e.parameter && e.parameter.action) ||
      'load';

    if (action === 'health') {
      return json_({ ok: true, service: 'aikongkong-sheets-api', now: new Date().toISOString() });
    }

    if (action === 'normalizeHeadersKo' || action === 'rebuildSchemaKo') {
      const ctx = getContext_({ skipSchemaSync: true });
      const normalized = normalizeAllSheetHeaders_(ctx, { backup: true });
      ensureDefaultAdmin_(ctx.adminSheet);
      return json_({
        ok: true,
        message: '?쒗듃 ?ㅻ뜑? ???쒖꽌瑜??쒓? 湲곗??쇰줈 ?ш뎄?깊뻽?듬땲??',
        sheets: normalized
      });
    }

    if (action === 'repairPhoneTextKo' || action === 'repairPhonesKo') {
      const ctx = getContext_({ skipSchemaSync: true });
      const repaired = repairAllPhoneColumns_(ctx);
      return json_({
        ok: true,
        message: '?곕씫泥??댁쓣 ?띿뒪???뺤떇?쇰줈 留욎텛怨?湲곗〈 ?꾪솕踰덊샇瑜??ㅼ떆 ??ν뻽?듬땲??',
        result: repaired
      });
    }

    const ctx = getContext_();

    if (action === 'load') {
      return json_({
        ok: true,
        spreadsheetId: ctx.spreadsheet.getId(),
        spreadsheetUrl: ctx.spreadsheet.getUrl(),
        contracts: readSheetObjects_(ctx.contractSheet, CONTRACT_FIELD_DEFS, normalizeContractRecord_),
        asRequests: readSheetObjects_(ctx.asSheet, AS_FIELD_DEFS, normalizeAsRequestRecord_),
        admins: readSheetObjects_(ctx.adminSheet, ADMIN_FIELD_DEFS, normalizeAdminRecord_)
      });
    }

    if (action === 'loadAdmins') {
      return json_({
        ok: true,
        admins: readSheetObjects_(ctx.adminSheet, ADMIN_FIELD_DEFS, normalizeAdminRecord_),
        fetchedAt: new Date().toISOString()
      });
    }

    if (action === 'findCustomerLogin') {
      var matchedCustomer = findCustomerContractMatch_(
        readSheetObjects_(ctx.contractSheet, CONTRACT_FIELD_DEFS, normalizeContractRecord_),
        (body && body.name) || (e && e.parameter && e.parameter.name) || '',
        (body && body.phone) || (e && e.parameter && e.parameter.phone) || ''
      );
      return json_({
        ok: true,
        matched: !!matchedCustomer,
        customer: matchedCustomer ? {
          id: matchedCustomer.id,
          contractNo: matchedCustomer.contractNo,
          customerName: matchedCustomer.customerName,
          phone: matchedCustomer.phone,
          address: matchedCustomer.address,
          product: matchedCustomer.product,
          installDate: matchedCustomer.installDate
        } : null,
        fetchedAt: new Date().toISOString()
      });
    }

    if (action === 'saveContract') {
      const now = new Date().toISOString();
      const contract = normalizeContractRecord_(Object.assign({}, body && body.contract ? body.contract : {}));
      if (!contract.id) contract.id = 'contract_' + new Date().getTime();
      if (!contract.createdAt) contract.createdAt = now;
      contract.updatedAt = now;
      upsertById_(ctx.contractSheet, CONTRACT_FIELD_DEFS, contract);
      return json_({ ok: true, contract: contract });
    }

    if (action === 'saveAsRequest') {
      const now = new Date().toISOString();
      const req = normalizeAsRequestRecord_(Object.assign({}, body && body.asRequest ? body.asRequest : {}));
      if (!req.id) req.id = 'as_' + new Date().getTime();
      if (!req.createdAt) req.createdAt = now;
      if (!req.status) req.status = '?묒닔以?;
      req.updatedAt = now;
      if (req.status !== '泥섎━?꾨즺') req.completedAt = '';
      if (req.status === '泥섎━?꾨즺' && !req.completedAt) req.completedAt = now;
      upsertById_(ctx.asSheet, AS_FIELD_DEFS, req);
      return json_({ ok: true, asRequest: req });
    }

    if (action === 'saveAdmin') {
      const now = new Date().toISOString();
      const admin = normalizeAdminRecord_(Object.assign({}, body && body.admin ? body.admin : {}));
      if (!admin.id) admin.id = 'admin_' + new Date().getTime();
      if (!admin.createdAt) admin.createdAt = now;
      admin.updatedAt = now;

      if (!admin.name || !admin.phone) {
        throw new Error('愿由ъ옄 ?대쫫/?곕씫泥섎뒗 ?꾩닔?낅땲??');
      }

      upsertById_(ctx.adminSheet, ADMIN_FIELD_DEFS, admin);
      return json_({ ok: true, admin: admin });
    }

    return json_({ ok: false, error: 'UNKNOWN_ACTION: ' + action });
  } catch (err) {
    return json_({ ok: false, error: String(err && err.message ? err.message : err) });
  }
}

function getContext_(options) {
  const opts = options || {};
  const props = PropertiesService.getScriptProperties();

  const spreadsheetId = DEFAULT_SPREADSHEET_ID;
  if (props.getProperty(PROP_SHEET_ID) !== spreadsheetId) {
    props.setProperty(PROP_SHEET_ID, spreadsheetId);
  }

  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  const contractSheet = ensureSheet_(spreadsheet, CONTRACT_SHEET, CONTRACT_FIELD_DEFS, normalizeContractRecord_, {
    autoNormalize: !opts.skipSchemaSync,
    legacyNames: CONTRACT_SHEET_LEGACY_NAMES
  });
  const asSheet = ensureSheet_(spreadsheet, AS_SHEET, AS_FIELD_DEFS, normalizeAsRequestRecord_, {
    autoNormalize: !opts.skipSchemaSync,
    legacyNames: AS_SHEET_LEGACY_NAMES
  });
  const adminSheet = ensureSheet_(spreadsheet, ADMIN_SHEET, ADMIN_FIELD_DEFS, normalizeAdminRecord_, {
    autoNormalize: !opts.skipSchemaSync,
    legacyNames: ADMIN_SHEET_LEGACY_NAMES
  });
  ensureDefaultAdmin_(adminSheet);

  return {
    spreadsheet: spreadsheet,
    contractSheet: contractSheet,
    asSheet: asSheet,
    adminSheet: adminSheet
  };
}

function normalizeAllSheetHeaders_(ctx, options) {
  return {
    contracts: normalizeSheetSchema_(ctx.contractSheet, CONTRACT_FIELD_DEFS, normalizeContractRecord_, {
      backup: !!(options && options.backup),
      backupPrefix: 'contracts_backup'
    }),
    as_requests: normalizeSheetSchema_(ctx.asSheet, AS_FIELD_DEFS, normalizeAsRequestRecord_, {
      backup: !!(options && options.backup),
      backupPrefix: 'as_requests_backup'
    }),
    admins: normalizeSheetSchema_(ctx.adminSheet, ADMIN_FIELD_DEFS, normalizeAdminRecord_, {
      backup: !!(options && options.backup),
      backupPrefix: 'admins_backup'
    })
  };
}

function ensureSheet_(spreadsheet, sheetName, fieldDefs, normalizer, options) {
  const opts = options || {};
  let sheet = resolveSheetByName_(spreadsheet, sheetName, opts.legacyNames);
  if (!sheet) {
    sheet = spreadsheet.insertSheet(sheetName);
  }

  if (sheet.getLastRow() === 0) {
    writeSheetObjects_(sheet, fieldDefs, []);
    return sheet;
  }

  if (opts.autoNormalize !== false) {
    normalizeSheetSchema_(sheet, fieldDefs, normalizer, { backup: false });
  }

  applyColumnFormats_(sheet, fieldDefs);

  return sheet;
}

function resolveSheetByName_(spreadsheet, canonicalName, legacyNames) {
  const canonicalSheet = spreadsheet.getSheetByName(canonicalName);
  if (canonicalSheet) return canonicalSheet;

  const candidates = Array.isArray(legacyNames) ? legacyNames : [];
  for (let i = 0; i < candidates.length; i++) {
    const legacyName = String(candidates[i] || '').trim();
    if (!legacyName || legacyName === canonicalName) continue;
    const legacySheet = spreadsheet.getSheetByName(legacyName);
    if (!legacySheet) continue;
    legacySheet.setName(canonicalName);
    return legacySheet;
  }

  return null;
}

function normalizeSheetSchema_(sheet, fieldDefs, normalizer, options) {
  const opts = options || {};
  const headers = getHeadersFromFieldDefs_(fieldDefs);
  const result = {
    sheet: sheet.getName(),
    headerCount: headers.length,
    rowCount: Math.max(sheet.getLastRow() - 1, 0),
    migrated: false,
    backupSheet: ''
  };

  if (sheet.getLastRow() === 0) {
    writeSheetObjects_(sheet, fieldDefs, []);
    result.initialized = true;
    return result;
  }

  const schema = inspectSheetSchema_(sheet, fieldDefs);
  result.recognizedHeaderCount = schema.recognizedHeaderCount;

  if (!schema.hasDataRows) {
    writeSheetObjects_(sheet, fieldDefs, []);
    result.initialized = true;
    result.headerUpdated = !schema.labelsMatchCanonical;
    return result;
  }

  if (schema.keysMatchCanonical) {
    if (!schema.labelsMatchCanonical) {
      ensureMinColumnCount_(sheet, headers.length);
      sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
      result.headerUpdated = true;
    }
    return result;
  }

  if (schema.recognizedHeaderCount === 0) {
    throw new Error(sheet.getName() + ' ?쒗듃??1???ㅻ뜑瑜??몄떇?섏? 紐삵뻽?듬땲?? 鍮??쒗듃濡??ㅼ떆 留뚮뱾嫄곕굹 湲곗〈 ?쒖? ?ㅻ뜑瑜??ъ슜??二쇱꽭??');
  }

  const grid = sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).getValues();
  const objects = mapGridToObjects_(grid, fieldDefs, normalizer);

  if (opts.backup) {
    result.backupSheet = backupSheet_(sheet.getParent(), sheet, opts.backupPrefix || (sheet.getName() + '_backup'));
  }

  writeSheetObjects_(sheet, fieldDefs, objects);
  result.migrated = true;
  result.rowCount = objects.length;
  return result;
}

function inspectSheetSchema_(sheet, fieldDefs) {
  const headers = getCurrentHeaders_(sheet);
  const headerToKey = buildHeaderToKeyMap_(fieldDefs);
  const canonicalKeys = fieldDefs.map(function (field) { return field.key; });
  const canonicalLabels = getHeadersFromFieldDefs_(fieldDefs);
  const existingKeys = headers.map(function (header) {
    return headerToKey[normalizeHeaderName_(header)] || '';
  });

  let recognizedHeaderCount = 0;
  existingKeys.forEach(function (key) {
    if (key) recognizedHeaderCount += 1;
  });

  let keysMatchCanonical = existingKeys.length === canonicalKeys.length;
  if (keysMatchCanonical) {
    for (let i = 0; i < canonicalKeys.length; i++) {
      if (existingKeys[i] !== canonicalKeys[i]) {
        keysMatchCanonical = false;
        break;
      }
    }
  }

  let labelsMatchCanonical = headers.length === canonicalLabels.length;
  if (labelsMatchCanonical) {
    for (let j = 0; j < canonicalLabels.length; j++) {
      if (String(headers[j] || '') !== String(canonicalLabels[j] || '')) {
        labelsMatchCanonical = false;
        break;
      }
    }
  }

  return {
    headers: headers,
    existingKeys: existingKeys,
    recognizedHeaderCount: recognizedHeaderCount,
    hasDataRows: sheet.getLastRow() > 1,
    keysMatchCanonical: keysMatchCanonical,
    labelsMatchCanonical: labelsMatchCanonical
  };
}

function getCurrentHeaders_(sheet) {
  if (!sheet || sheet.getLastColumn() === 0 || sheet.getLastRow() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0].map(function (value) {
    return String(value || '').trim();
  });
}

function readSheetObjects_(sheet, fieldDefs, normalizer) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow <= 1 || lastCol === 0) return [];
  const values = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  return mapGridToObjects_(values, fieldDefs, normalizer);
}

function mapGridToObjects_(grid, fieldDefs, normalizer) {
  if (!grid || grid.length <= 1) return [];

  const headerToKey = buildHeaderToKeyMap_(fieldDefs);
  const headers = grid[0].map(function (value) { return String(value || '').trim(); });
  const rows = grid.slice(1);
  const out = [];

  rows.forEach(function (row) {
    if (row.every(function (cell) { return String(cell == null ? '' : cell).trim() === ''; })) {
      return;
    }

    const obj = {};
    headers.forEach(function (header, idx) {
      const normalizedHeader = normalizeHeaderName_(header);
      if (!normalizedHeader) return;
      const key = headerToKey[normalizedHeader];
      if (!key) return;
      obj[key] = normalizeCell_(row[idx]);
    });

    const normalizedObject = normalizer ? normalizer(obj) : obj;
    out.push(normalizedObject);
  });

  return out;
}

function writeSheetObjects_(sheet, fieldDefs, objects) {
  const headers = getHeadersFromFieldDefs_(fieldDefs);
  const rows = (objects || []).map(function (obj) {
    return fieldDefs.map(function (field) {
      const value = obj[field.key];
      if (value === undefined || value === null) return '';
      return value;
    });
  });

  ensureMinColumnCount_(sheet, headers.length);
  ensureMinRowCount_(sheet, Math.max(rows.length + 1, 2));
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
  applyColumnFormats_(sheet, fieldDefs);

  if (rows.length) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }

  trimExtraColumns_(sheet, headers.length);
}

function ensureMinColumnCount_(sheet, targetCount) {
  const maxColumns = sheet.getMaxColumns();
  if (maxColumns < targetCount) {
    sheet.insertColumnsAfter(maxColumns, targetCount - maxColumns);
  }
}

function ensureMinRowCount_(sheet, targetCount) {
  const maxRows = sheet.getMaxRows();
  if (maxRows < targetCount) {
    sheet.insertRowsAfter(maxRows, targetCount - maxRows);
  }
}

function getFormattedFieldColumnIndexes_(fieldDefs) {
  return fieldDefs.reduce(function (indexes, field, index) {
    if (field && field.numberFormat) indexes.push(index + 1);
    return indexes;
  }, []);
}

function applyColumnFormats_(sheet, fieldDefs) {
  const columnIndexes = getFormattedFieldColumnIndexes_(fieldDefs);
  if (!columnIndexes.length) return;

  ensureMinRowCount_(sheet, 2);
  const rowCount = Math.max(sheet.getMaxRows() - 1, 1);
  columnIndexes.forEach(function (columnIndex) {
    const field = fieldDefs[columnIndex - 1];
    sheet.getRange(2, columnIndex, rowCount, 1).setNumberFormat(field.numberFormat);
  });
}

function trimExtraColumns_(sheet, targetCount) {
  const maxColumns = sheet.getMaxColumns();
  if (maxColumns > targetCount) {
    sheet.deleteColumns(targetCount + 1, maxColumns - targetCount);
  }
}

function backupSheet_(spreadsheet, sheet, prefix) {
  const copiedSheet = sheet.copyTo(spreadsheet);
  const baseName = prefix + '_' + Utilities.formatDate(new Date(), Session.getScriptTimeZone(), 'yyyyMMdd_HHmmss');
  copiedSheet.setName(makeUniqueSheetName_(spreadsheet, baseName));
  copiedSheet.hideSheet();
  return copiedSheet.getName();
}

function makeUniqueSheetName_(spreadsheet, baseName) {
  const normalizedBase = String(baseName || 'backup').slice(0, 90);
  let attempt = normalizedBase;
  let suffix = 1;
  while (spreadsheet.getSheetByName(attempt)) {
    attempt = normalizedBase.slice(0, 85) + '_' + suffix;
    suffix += 1;
  }
  return attempt;
}

function normalizeContractRecord_(record) {
  const next = {};
  next.id = trimText_(record.id);
  next.contractNo = trimText_(record.contractNo);
  next.customerName = trimText_(record.customerName);
  next.phone = normalizePhoneText_(record.phone);
  next.address = trimText_(record.address);
  next.product = trimText_(record.product);
  next.color = trimText_(record.color);
  next.totalPrice = trimText_(record.totalPrice);
  next.paymentMethod = trimText_(record.paymentMethod);
  next.paymentSummary = trimText_(record.paymentSummary);
  next.installDate = trimText_(record.installDate);
  next.docYear = trimText_(record.docYear);
  next.docMonth = trimText_(record.docMonth);
  next.docDay = trimText_(record.docDay);
  next.installRound = trimText_(record.installRound);
  next.discountTypes = normalizeListText_(record.discountTypes);
  next.discountEtc = trimText_(record.discountEtc);
  next.installNote = trimText_(record.installNote);
  next.customerSignName = trimText_(record.customerSignName);
  next.installerSignName = trimText_(record.installerSignName);
  next.signatureImage = trimText_(record.signatureImage);
  next.installerName = trimText_(record.installerName);
  next.installerSignatureImage = trimText_(record.installerSignatureImage);
  next.createdAt = trimText_(record.createdAt);
  next.updatedAt = trimText_(record.updatedAt);
  next.installerAddress = trimText_(record.installerAddress);
  next.installerPhone = normalizePhoneText_(record.installerPhone);

  if (!next.paymentSummary) {
    next.paymentSummary = [next.paymentMethod, next.totalPrice].filter(Boolean).join(' / ');
  }

  return next;
}

function normalizeAsRequestRecord_(record) {
  const next = {};
  next.id = trimText_(record.id);
  next.asNo = trimText_(record.asNo);
  next.contractId = trimText_(record.contractId);
  next.contractNo = trimText_(record.contractNo);
  next.customerName = trimText_(record.customerName);
  next.phone = normalizePhoneText_(record.phone);
  next.address = trimText_(record.address);
  next.product = trimText_(record.product);
  next.installerName = trimText_(record.installerName);
  next.installerPhone = normalizePhoneText_(record.installerPhone);
  next.requestType = trimText_(record.requestType || record.asType);
  next.requestDetail = trimText_(record.requestDetail);
  applyRequestImageFields_(next, normalizeRequestImages_(record));
  next.contactTime = trimText_(record.contactTime);
  next.status = trimText_(record.status) || '?묒닔以?;
  next.techNote = trimText_(record.techNote);
  next.customerSignName = trimText_(record.customerSignName);
  next.signatureImage = trimText_(record.signatureImage);
  next.installerSignName = trimText_(record.installerSignName);
  next.installerSignatureImage = trimText_(record.installerSignatureImage);
  next.createdAt = trimText_(record.createdAt);
  next.updatedAt = trimText_(record.updatedAt);
  next.completedAt = trimText_(record.completedAt);
  return next;
}

function normalizeAdminRecord_(record) {
  const next = {};
  next.id = trimText_(record.id);
  next.name = trimText_(record.name);
  next.phone = normalizePhoneText_(record.phone);
  next.address = trimText_(record.address);
  next.signatureImage = trimText_(record.signatureImage);
  next.savedAt = trimText_(record.savedAt);
  next.signatureSavedAt = trimText_(record.signatureSavedAt);
  next.isActive = normalizeActiveFlag_(record.isActive);
  next.createdAt = trimText_(record.createdAt);
  next.updatedAt = trimText_(record.updatedAt);
  return next;
}

function trimText_(value) {
  return String(value == null ? '' : value).trim();
}

function digitsOnly_(value) {
  return String(value == null ? '' : value).replace(/[^0-9]/g, '');
}

function normalizePhoneText_(value) {
  var digits = digitsOnly_(value);
  if (!digits) return '';
  if ((digits.length === 9 || digits.length === 10) && digits.charAt(0) !== '0') {
    return '0' + digits;
  }
  return digits;
}

function normalizeNameForMatch_(value) {
  return trimText_(value).replace(/\s+/g, '');
}

function normalizeRequestImages_(record) {
  var images = [];

  if (Array.isArray(record && record.requestImages)) {
    images = images.concat(record.requestImages);
  } else if (record && typeof record.requestImages === 'string') {
    var raw = trimText_(record.requestImages);
    if (raw) {
      if (raw.charAt(0) === '[') {
        try {
          var parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) images = images.concat(parsed);
        } catch (_) {}
      } else {
        images.push(raw);
      }
    }
  }

  ['requestImage1', 'requestImage2', 'requestImage3', 'requestImage4'].forEach(function (key) {
    if (record && record[key] != null) {
      images.push(record[key]);
    }
  });

  return images
    .map(function (value) { return trimText_(value); })
    .filter(Boolean)
    .filter(function (value, index, list) { return list.indexOf(value) === index; })
    .slice(0, 4);
}

function applyRequestImageFields_(target, images) {
  var list = Array.isArray(images) ? images.slice(0, 4) : [];
  target.requestImages = list.slice();
  for (var i = 0; i < 4; i++) {
    target['requestImage' + (i + 1)] = list[i] || '';
  }
  return target;
}

function findCustomerContractMatch_(contracts, name, phone) {
  var targetName = normalizeNameForMatch_(name);
  var targetPhone = normalizePhoneText_(phone);
  if (!targetName || !targetPhone) return null;

  for (var i = 0; i < contracts.length; i++) {
    var item = normalizeContractRecord_(contracts[i] || {});
    if (!item.id) continue;
    if (normalizeNameForMatch_(item.customerName) !== targetName) continue;
    if (normalizePhoneText_(item.phone) !== targetPhone) continue;
    return item;
  }

  return null;
}

function normalizeListText_(value) {
  if (Array.isArray(value)) {
    return value
      .map(function (item) { return trimText_(item); })
      .filter(Boolean)
      .filter(function (item, index, list) { return list.indexOf(item) === index; })
      .join(', ');
  }

  return String(value == null ? '' : value)
    .split(',')
    .map(function (item) { return trimText_(item); })
    .filter(Boolean)
    .filter(function (item, index, list) { return list.indexOf(item) === index; })
    .join(', ');
}

function normalizeCell_(value) {
  if (value instanceof Date) {
    return Utilities.formatDate(value, Session.getScriptTimeZone(), "yyyy-MM-dd'T'HH:mm:ssXXX");
  }
  return value;
}

function normalizeActiveFlag_(value) {
  if (value === false) return 'N';
  const text = String(value == null ? '' : value).trim().toUpperCase();
  if (text === 'N' || text === 'FALSE' || text === '0' || text === '鍮꾪솢??) return 'N';
  return 'Y';
}

function normalizeHeaderName_(value) {
  return String(value == null ? '' : value)
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
}

function repairAllPhoneColumns_(ctx) {
  return {
    contracts: repairSheetPhoneColumns_(ctx.contractSheet, CONTRACT_FIELD_DEFS, normalizeContractRecord_, ['phone', 'installerPhone']),
    asRequests: repairSheetPhoneColumns_(ctx.asSheet, AS_FIELD_DEFS, normalizeAsRequestRecord_, ['phone', 'installerPhone']),
    admins: repairSheetPhoneColumns_(ctx.adminSheet, ADMIN_FIELD_DEFS, normalizeAdminRecord_, ['phone'])
  };
}

function repairSheetPhoneColumns_(sheet, fieldDefs, normalizer, phoneKeys) {
  const before = readSheetObjects_(sheet, fieldDefs, null);
  const after = before.map(function (item) {
    return normalizer ? normalizer(item) : item;
  });

  let changedRows = 0;
  after.forEach(function (item, index) {
    const prev = before[index] || {};
    const changed = phoneKeys.some(function (key) {
      return trimText_(prev[key]) !== trimText_(item[key]);
    });
    if (changed) changedRows += 1;
  });

  writeSheetObjects_(sheet, fieldDefs, after);

  return {
    sheet: sheet.getName(),
    rowCount: after.length,
    changedRows: changedRows
  };
}

function ensureDefaultAdmin_(adminSheet) {
  const admins = readSheetObjects_(adminSheet, ADMIN_FIELD_DEFS, normalizeAdminRecord_);
  const targetPhone = String(DEFAULT_ADMIN_PHONE).replace(/[^0-9]/g, '');
  const exists = admins.some(function (item) {
    return String(item.phone || '').replace(/[^0-9]/g, '') === targetPhone;
  });
  if (exists) return;

  const now = new Date().toISOString();
  upsertById_(adminSheet, ADMIN_FIELD_DEFS, {
    id: 'admin_default_1',
    name: DEFAULT_ADMIN_NAME,
    phone: targetPhone,
    isActive: 'Y',
    createdAt: now,
    updatedAt: now
  });
}

function upsertById_(sheet, fieldDefs, obj) {
  const headers = getHeadersFromFieldDefs_(fieldDefs);
  const idIdx = getIdColumnIndex_(fieldDefs);
  if (idIdx === -1) {
    throw new Error('id column not found');
  }

  const idValue = String(obj.id || '').trim();
  if (!idValue) {
    throw new Error('id is required');
  }

  ensureMinColumnCount_(sheet, headers.length);
  applyColumnFormats_(sheet, fieldDefs);

  const rowValues = fieldDefs.map(function (field) {
    const value = obj[field.key];
    if (value === undefined || value === null) return '';
    return value;
  });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
    ensureMinRowCount_(sheet, 2);
    sheet.getRange(2, 1, 1, headers.length).setValues([rowValues]);
    return;
  }

  const idColumn = idIdx + 1;
  const idValues = sheet.getRange(2, idColumn, lastRow - 1, 1).getValues();
  let updateRow = -1;

  for (let i = 0; i < idValues.length; i++) {
    if (String(idValues[i][0] || '').trim() === idValue) {
      updateRow = i + 2;
      break;
    }
  }

  if (updateRow === -1) {
    const appendRow = lastRow + 1;
    ensureMinRowCount_(sheet, appendRow);
    sheet.getRange(appendRow, 1, 1, headers.length).setValues([rowValues]);
  } else {
    sheet.getRange(updateRow, 1, 1, headers.length).setValues([rowValues]);
  }
}

function getHeadersFromFieldDefs_(fieldDefs) {
  return fieldDefs.map(function (field) { return field.label; });
}

function buildHeaderToKeyMap_(fieldDefs) {
  const map = {};
  fieldDefs.forEach(function (field) {
    map[normalizeHeaderName_(field.key)] = field.key;
    map[normalizeHeaderName_(field.label)] = field.key;
    if (Array.isArray(field.aliases)) {
      field.aliases.forEach(function (alias) {
        if (!alias) return;
        map[normalizeHeaderName_(alias)] = field.key;
      });
    }
  });
  return map;
}

function getIdColumnIndex_(fieldDefs) {
  for (let i = 0; i < fieldDefs.length; i++) {
    if (fieldDefs[i].key === 'id') return i;
  }
  return -1;
}

function parseJsonSafely_(raw) {
  try {
    return JSON.parse(raw || '{}');
  } catch (_) {
    return {};
  }
}

function json_(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
