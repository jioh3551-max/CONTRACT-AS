const PROP_SHEET_ID = 'AIKONGKONG_SPREADSHEET_ID';
const DEFAULT_SPREADSHEET_ID = '1-4yzOffi19OwcxzdUgt8bOTIsroc9zqRibVDfZC3nPI';

const CONTRACT_SHEET = '시공계약서';
const AS_SHEET = 'AS신청내역';
const ADMIN_SHEET = '관리자';

const CONTRACT_SHEET_LEGACY_NAMES = ['contracts'];
const AS_SHEET_LEGACY_NAMES = ['as_requests'];
const ADMIN_SHEET_LEGACY_NAMES = ['admins'];

const DEFAULT_ADMIN_NAME = '정지오';
const DEFAULT_ADMIN_PHONE = '01085259253';

const CONTRACT_FIELD_DEFS = [
  { key: 'id', label: '식별ID', aliases: ['ID'] },
  { key: 'contractNo', label: '계약번호', aliases: ['계약 번호'] },
  { key: 'customerName', label: '고객명', aliases: ['고객이름', '성명', '계약자명'] },
  { key: 'phone', label: '연락처', aliases: ['휴대폰', '고객연락처', '전화번호'] },
  { key: 'address', label: '주소', aliases: ['시공주소'] },
  { key: 'product', label: '제품', aliases: ['제품명'] },
  { key: 'color', label: '색상', aliases: ['제품색상'] },
  { key: 'totalPrice', label: '총금액', aliases: ['결제금액', '금액'] },
  { key: 'paymentMethod', label: '결제방식', aliases: ['결제수단', '결제 방식'] },
  { key: 'paymentSummary', label: '결제요약', aliases: ['결제내용', '결제 요약'] },
  { key: 'installDate', label: '시공일자', aliases: ['시공일', '시공 날짜'] },
  { key: 'docYear', label: '문서연도', aliases: ['문서 연도'] },
  { key: 'docMonth', label: '문서월', aliases: ['문서 월'] },
  { key: 'docDay', label: '문서일', aliases: ['문서 일'] },
  { key: 'installRound', label: '시공차수', aliases: ['시공 차수'] },
  { key: 'discountTypes', label: '할인유형', aliases: ['할인 유형'] },
  { key: 'discountEtc', label: '기타할인상세', aliases: ['기타 할인 상세'] },
  { key: 'installNote', label: '시공특이사항', aliases: ['시공 특이사항', '특이사항'] },
  { key: 'customerSignName', label: '고객서명명', aliases: ['고객 서명명'] },
  { key: 'installerSignName', label: '시공자서명명', aliases: ['시공자 서명명'] },
  { key: 'signatureImage', label: '고객서명이미지', aliases: ['고객서명', '고객 서명 이미지'] },
  { key: 'installerName', label: '시공자명', aliases: ['시공기사명', '담당시공자명'] },
  { key: 'installerSignatureImage', label: '시공자서명이미지', aliases: ['시공자서명', '시공자 서명 이미지'] },
  { key: 'createdAt', label: '생성일시', aliases: ['등록일시', 'created_at'] },
  { key: 'updatedAt', label: '수정일시', aliases: ['변경일시', 'updated_at'] },
  { key: 'installerAddress', label: '시공자주소', aliases: ['시공자 주소'] },
  { key: 'installerPhone', label: '시공자연락처', aliases: ['시공자 연락처', '담당시공자연락처'] }
];

const AS_FIELD_DEFS = [
  { key: 'id', label: '식별ID', aliases: ['ID'] },
  { key: 'asNo', label: 'AS번호', aliases: ['A/S번호'] },
  { key: 'contractId', label: '계약식별ID', aliases: ['계약ID'] },
  { key: 'contractNo', label: '계약번호', aliases: ['계약 번호'] },
  { key: 'customerName', label: '고객명', aliases: ['고객이름', '성명'] },
  { key: 'phone', label: '연락처', aliases: ['휴대폰', '고객연락처'] },
  { key: 'address', label: '주소', aliases: ['시공주소'] },
  { key: 'product', label: '제품', aliases: ['제품명'] },
  { key: 'installerName', label: '시공자명', aliases: ['시공기사명', '담당시공자명'] },
  { key: 'installerPhone', label: '시공자연락처', aliases: ['시공자 연락처'] },
  { key: 'requestType', label: 'AS유형', aliases: ['asType', 'A/S유형', '신청유형'] },
  { key: 'requestDetail', label: '접수내용', aliases: ['신청내용', '문의내용'] },
  { key: 'contactTime', label: '희망연락시간', aliases: ['희망 연락 시간'] },
  { key: 'status', label: '처리상태', aliases: ['진행상태', '상태'] },
  { key: 'techNote', label: '처리메모', aliases: ['처리 메모', '기술메모'] },
  { key: 'createdAt', label: '접수일시', aliases: ['생성일시', '등록일시'] },
  { key: 'updatedAt', label: '수정일시', aliases: ['변경일시'] },
  { key: 'completedAt', label: '완료일시', aliases: ['처리완료일시'] }
];

const ADMIN_FIELD_DEFS = [
  { key: 'id', label: '식별ID', aliases: ['ID'] },
  { key: 'name', label: '이름', aliases: ['관리자명', '담당자명'] },
  { key: 'phone', label: '연락처', aliases: ['휴대폰', '전화번호'] },
  { key: 'isActive', label: '사용여부', aliases: ['활성여부', '사용 여부'] },
  { key: 'createdAt', label: '생성일시', aliases: ['등록일시'] },
  { key: 'updatedAt', label: '수정일시', aliases: ['변경일시'] }
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
        message: '시트 헤더와 열 순서를 한글 기준으로 재구성했습니다.',
        sheets: normalized
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
      if (!req.status) req.status = '접수중';
      req.updatedAt = now;
      if (req.status !== '처리완료') req.completedAt = '';
      if (req.status === '처리완료' && !req.completedAt) req.completedAt = now;
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
        throw new Error('관리자 이름/연락처는 필수입니다.');
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
    throw new Error(sheet.getName() + ' 시트의 1행 헤더를 인식하지 못했습니다. 빈 시트로 다시 만들거나 기존 표준 헤더를 사용해 주세요.');
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
  sheet.clearContents();
  sheet.getRange(1, 1, 1, headers.length).setValues([headers]);

  if (rows.length) {
    sheet.getRange(2, 1, rows.length, headers.length).setValues(rows);
  }
}

function ensureMinColumnCount_(sheet, targetCount) {
  const maxColumns = sheet.getMaxColumns();
  if (maxColumns < targetCount) {
    sheet.insertColumnsAfter(maxColumns, targetCount - maxColumns);
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
  next.phone = digitsOnly_(record.phone);
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
  next.installerPhone = digitsOnly_(record.installerPhone);

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
  next.phone = digitsOnly_(record.phone);
  next.address = trimText_(record.address);
  next.product = trimText_(record.product);
  next.installerName = trimText_(record.installerName);
  next.installerPhone = digitsOnly_(record.installerPhone);
  next.requestType = trimText_(record.requestType || record.asType);
  next.requestDetail = trimText_(record.requestDetail);
  next.contactTime = trimText_(record.contactTime);
  next.status = trimText_(record.status) || '접수중';
  next.techNote = trimText_(record.techNote);
  next.createdAt = trimText_(record.createdAt);
  next.updatedAt = trimText_(record.updatedAt);
  next.completedAt = trimText_(record.completedAt);
  return next;
}

function normalizeAdminRecord_(record) {
  const next = {};
  next.id = trimText_(record.id);
  next.name = trimText_(record.name);
  next.phone = normalizeAdminPhone_(record.phone);
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

function normalizeAdminPhone_(value) {
  var digits = digitsOnly_(value);
  if (!digits) return '';
  if (digits.length === 10 && digits.charAt(0) !== '0') {
    return '0' + digits;
  }
  return digits;
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
  if (text === 'N' || text === 'FALSE' || text === '0' || text === '비활성') return 'N';
  return 'Y';
}

function normalizeHeaderName_(value) {
  return String(value == null ? '' : value)
    .replace(/\s+/g, '')
    .trim()
    .toLowerCase();
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

  const rowValues = fieldDefs.map(function (field) {
    const value = obj[field.key];
    if (value === undefined || value === null) return '';
    return value;
  });

  const lastRow = sheet.getLastRow();
  if (lastRow <= 1) {
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
    sheet.appendRow(rowValues);
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
