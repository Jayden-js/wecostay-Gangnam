// ===== DB =====
const DB = {
  get(k) { try { return JSON.parse(localStorage.getItem('biz_' + k)) || []; } catch (e) { return []; } },
  set(k, d) { localStorage.setItem('biz_' + k, JSON.stringify(d)); },
  genId() { return Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }
};

// ===== KST DATE =====
function getTodayKST() { return new Date(Date.now() + 9 * 60 * 60 * 1000).toISOString().split('T')[0]; }

// ===== AUTO TRANSITION =====
function checkAutoTransition() {
  const todayKST = getTodayKST();
  const projects = DB.get('projects');
  let changed = false;
  projects.forEach(p => {
    if (p.status === '계획중' && p.startDate && p.startDate <= todayKST) {
      p.status = '진행중'; changed = true;
    }
  });
  if (changed) { DB.set('projects', projects); showToast('📋 시작일이 된 프로젝트들이 "진행중"으로 자동 전환되었습니다.', 'info'); }
}

// ===== SEED =====
function seedData() {
  if (localStorage.getItem('biz_seeded2')) return;
  DB.set('projects', [
    { id: DB.genId(), name: '2025 객실 리노베이션', desc: '<b>강남점</b> 객실 환경 개선 프로젝트', status: '진행중', priority: '높음', manager: '김철수', startDate: '2025-01-10', endDate: '2025-06-30', progress: 65, tasks: 12, doneTasks: 8, attachments: [] },
    { id: DB.genId(), name: 'ERP 시스템 도입', desc: '전사 ERP 구축 및 도입', status: '계획중', priority: '긴급', manager: '이영희', startDate: '2025-03-01', endDate: '2025-12-31', progress: 20, tasks: 25, doneTasks: 5, attachments: [] },
    { id: DB.genId(), name: '품질관리 매뉴얼 개정', desc: 'ISO 9001 기준 품질관리 문서 업데이트', status: '완료', priority: '중간', manager: '박민준', startDate: '2024-11-01', endDate: '2025-02-28', progress: 100, tasks: 8, doneTasks: 8, attachments: [] },
  ]);
  DB.set('inventory', [
    { id: DB.genId(), name: '프린터 토너 (흑백)', category: '소모품', unit: '개', quantity: 8, minQty: 5, location: '총무팀 창고', price: 45000, note: '' },
    { id: DB.genId(), name: 'A4 복사용지 (박스)', category: '소모품', unit: '박스', quantity: 3, minQty: 10, location: '총무팀 창고', price: 32000, note: '재고 부족 주의' },
    { id: DB.genId(), name: '노트북 (Dell XPS)', category: '비품', unit: '대', quantity: 15, minQty: 5, location: 'IT실', price: 1800000, note: '2023년 구매분' },
    { id: DB.genId(), name: '사무용 의자', category: '비품', unit: '개', quantity: 30, minQty: 5, location: '창고 B동', price: 280000, note: '에르고노믹 의자' },
    { id: DB.genId(), name: '형광펜 세트', category: '소모품', unit: '세트', quantity: 2, minQty: 10, location: '비품함', price: 4500, note: '' },
  ]);
  const today = new Date(), ms = 864e5;
  DB.set('purchases', [
    { id: DB.genId(), title: 'A4 복사용지 20박스', dept: '총무팀', requester: '이민수', amount: 640000, category: '소모품', status: '승인', requestDate: fmtDate(new Date(today - 30 * ms)), note: '긴급 요청' },
    { id: DB.genId(), title: '무선 키보드/마우스 10개', dept: 'IT팀', requester: '김지원', amount: 450000, category: '비품', status: '검토중', requestDate: fmtDate(new Date(today - 10 * ms)), note: '재택근무 지원' },
    { id: DB.genId(), title: '탕비실 커피머신 교체', dept: '총무팀', requester: '박소연', amount: 380000, category: '비품', status: '반려', requestDate: fmtDate(new Date(today - 45 * ms)), note: '기존 기기 수리 우선' },
    { id: DB.genId(), title: '청소 용품 세트', dept: '총무팀', requester: '최하나', amount: 120000, category: '소모품', status: '완료', requestDate: fmtDate(new Date(today - 60 * ms)), note: '' },
    { id: DB.genId(), title: '프로젝터 스크린', dept: '교육팀', requester: '윤대호', amount: 850000, category: '비품', status: '승인', requestDate: fmtDate(new Date(today - 20 * ms)), note: '' },
    { id: DB.genId(), title: '복합기 잉크 10세트', dept: '영업팀', requester: '강서연', amount: 230000, category: '소모품', status: '검토중', requestDate: fmtDate(new Date(today - 5 * ms)), note: '' },
    { id: DB.genId(), title: '회의실 화이트보드', dept: '총무팀', requester: '임태준', amount: 560000, category: '비품', status: '승인', requestDate: fmtDate(new Date(today - 90 * ms)), note: '' },
  ]);
  DB.set('disposals', [
    { id: DB.genId(), name: '구형 데스크탑 PC (5대)', type: '일반폐기', category: '비품', qty: 5, unit: '대', reason: '노후화 성능 저하', method: '공인 업체 폐기', dept: 'IT팀', requester: '최준혁', requestDate: fmtDate(new Date(today - 40 * ms)), completedDate: fmtDate(new Date(today - 28 * ms)), status: '완료', note: '데이터 삭제 확인', attachments: [] },
    { id: DB.genId(), name: '파손 사무용 의자 (3개)', type: '일반폐기', category: '비품', qty: 3, unit: '개', reason: '파손으로 사용 불가', method: '구청 대형 폐기물 신고', dept: '총무팀', requester: '이수정', requestDate: fmtDate(new Date(today - 15 * ms)), completedDate: '', status: '진행중', note: '', attachments: [] },
    { id: DB.genId(), name: '프린터 토너 (만료)', type: '빼기폐기', category: '소모품', qty: 4, unit: '개', reason: '유효기간 만료', method: '소각 처리', dept: '총무팀', requester: '김민아', requestDate: fmtDate(new Date(today - 8 * ms)), completedDate: '', status: '대기', note: '', attachments: [] },
  ]);
  localStorage.setItem('biz_seeded2', '1');
}

function fmtDate(d) { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
function today() { return fmtDate(new Date()); }
function numFmt(n) { return Number(n).toLocaleString('ko-KR'); }
// ===== DASHBOARD HELPERS =====
function getDashboardProjectsByStatus() {
  const projects = DB.get('projects') || [];
  const sorted = [...projects].sort((a, b) => {
    const ad = a.startDate || a.endDate || '';
    const bd = b.startDate || b.endDate || '';
    return bd.localeCompare(ad);
  });
  const pick = status =>
    sorted.filter(p => p.status === status).slice(0, 3);

  return {
    진행중: pick('진행중'),
    보류: pick('보류'),
    완료: pick('완료'),
  };
}

// ===== ROUTER =====
let currentSection = 'dashboard';
const sectionTitles = {
  dashboard: { title: '대시보드', sub: '전체 업무 현황' },
  projects: { title: '프로젝트 관리', sub: '프로젝트 진행 현황' },
  inventory: { title: '재고 관리', sub: '재고 현황 및 품목 관리' },
  purchases: { title: '비품 구매/관리', sub: '구매 요청 및 승인 관리' },
  disposals: { title: '폐기 관리', sub: '폐기 신청 및 처리 관리' },
  notices: { title: '공지/숙지사항', sub: '매니저 읽음 확인 포함' },
  parking: { title: '🚗 주차 등록', sub: '주차 할인 등록 관리' },
  stats: { title: '통계 분석', sub: '재고·구매·폐기 통계 차트' },
};
function navigate(s) {
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const nav = document.querySelector(`[data-section="${s}"]`);
  if (nav) nav.classList.add('active');
  document.querySelectorAll('.section').forEach(el => el.classList.remove('active'));
  const sec = document.getElementById('section-' + s);
  if (sec) sec.classList.add('active'); renderRentals
  const t = sectionTitles[s];
  if (t) document.getElementById('topbar-title').innerHTML = t.title + `<span>${t.sub}</span>`;
  currentSection = s;
  render(s);
}
function render(s) {
  if (s === 'dashboard') renderDashboard();
  else if (s === 'projects') { checkAutoTransition(); renderProjects(); }
  else if (s === 'inventory') renderInventory();
  else if (s === 'purchases') renderPurchases();
  else if (s === 'disposals') renderDisposals();
  else if (s === 'rentals') renderRentals();
  else if (s === 'stats') renderStats();
  else if (s === 'notices') renderNotices();
  else if (s === 'parking') { }
}


// ===== TOAST =====
function showToast(msg, type = 'success') {
  const icons = { success: '✅', error: '❌', warning: '⚠️', info: 'ℹ️' };
  const t = document.createElement('div');
  t.className = `toast ${type}`;
  t.innerHTML = `<span>${icons[type]}</span><span>${msg}</span>`;
  document.getElementById('toast-container').appendChild(t);
  setTimeout(() => t.remove(), 3200);
}

// ===== CONFIRM =====
let confirmCb = null;
function showConfirm(title, msg, cb) {
  confirmCb = cb;
  document.getElementById('confirm-title').textContent = title;
  document.getElementById('confirm-msg').textContent = msg;
  document.getElementById('confirm-overlay').classList.add('open');
}
function closeConfirm() { document.getElementById('confirm-overlay').classList.remove('open'); confirmCb = null; }

// ===== MODAL =====
function openModal(id) { document.getElementById(id).classList.add('open'); }
function closeModal(id) { document.getElementById(id).classList.remove('open'); }

// ===== LIGHTBOX =====
function openLightbox(src, isVideo) {
  const ol = document.getElementById('lightbox-overlay');
  const content = document.getElementById('lightbox-content');
  content.innerHTML = isVideo
    ? `<video class="lightbox-content" controls autoplay src="${src}"></video>`
    : `<img class="lightbox-content" src="${src}">`;
  ol.classList.add('open');
}
function closeLightbox() {
  document.getElementById('lightbox-overlay').classList.remove('open');
  document.getElementById('lightbox-content').innerHTML = '';
}

// ===== FILE ATTACHMENTS =====
let pendingAttachments = [];
function initFileZone(zoneId, previewId) {
  pendingAttachments = [];
  renderAttachPreviews(previewId);
  const zone = document.getElementById(zoneId);
  if (!zone) return;
  const input = zone.querySelector('input[type=file]');
  if (!input) return;
  input.value = '';
  input.onchange = () => handleFiles(input.files, previewId);
}
function handleFiles(files, previewId) {
  Array.from(files).forEach(file => {
    if (file.size > 3 * 1024 * 1024) { showToast(`${file.name}: 3MB 초과 파일은 첨부할 수 없습니다.`, 'error'); return; }
    const isImage = file.type.startsWith('image/');
    const isVideo = file.type.startsWith('video/');
    const reader = new FileReader();
    reader.onload = e => {
      if (isImage) {
        compressImage(e.target.result, 800, .75, data => {
          pendingAttachments.push({ name: file.name, type: file.type, data });
          renderAttachPreviews(previewId);
        });
      } else if (isVideo) {
        pendingAttachments.push({ name: file.name, type: file.type, data: e.target.result });
        renderAttachPreviews(previewId);
      }
    };
    reader.readAsDataURL(file);
  });
}
function compressImage(src, maxW, q, cb) {
  const img = new Image();
  img.onload = () => {
    const canvas = document.createElement('canvas');
    let w = img.width, h = img.height;
    if (w > maxW) { h = Math.round(h * maxW / w); w = maxW; }
    canvas.width = w; canvas.height = h;
    canvas.getContext('2d').drawImage(img, 0, 0, w, h);
    cb(canvas.toDataURL('image/jpeg', q));
  };
  img.src = src;
}
function renderAttachPreviews(previewId) {
  const el = document.getElementById(previewId);
  if (!el) return;
  el.innerHTML = pendingAttachments.map((a, i) => {
    const isVideo = a.type.startsWith('video/');
    return `<div class="attach-preview-item" onclick="openLightbox('${a.data}',${isVideo})">
      ${isVideo ? `<div class="vid-icon">▶️</div>` : `<img src="${a.data}" alt="${a.name}">`}
      <button class="remove-btn" onclick="event.stopPropagation();removeAttach(${i},'${previewId}')">✕</button>
    </div>`;
  }).join('');
}
function removeAttach(i, previewId) {
  pendingAttachments.splice(i, 1);
  renderAttachPreviews(previewId);
}
function loadAttachmentsIntoZone(attachments, previewId) {
  pendingAttachments = [...attachments];
  renderAttachPreviews(previewId);
}
function renderAttachmentsStatic(attachments) {
  if (!attachments || !attachments.length) return '';
  return `<div class="attachments-row">${attachments.map(a => {
    const isV = a.type.startsWith('video/');
    return `<div class="attach-thumb" onclick="openLightbox('${a.data}',${isV})">
      ${isV ? `<div class="vid-icon">▶️</div>` : `<img src="${a.data}" alt="${a.name}">`}
    </div>`;
  }).join('')}</div>`;
}

// ===== RTE =====
let savedSelection = null;

const RTE_COLORS = [
  // 기본색
  '#ffffff', '#e8eaf6', '#b0b8d1', '#8b90a7', '#555870', '#2a2d3e', '#1a1d27', '#000000',
  // 레드/핑크
  '#f87171', '#ef4444', '#dc2626', '#fca5a5', '#fbcfe8', '#ec4899', '#db2777',
  // 오렌지/옐로우
  '#fb923c', '#f59e0b', '#fbbf24', '#fde68a', '#fef3c7', '#f97316', '#ea580c',
  // 그린
  '#34d399', '#10b981', '#059669', '#6ee7b7', '#a7f3d0', '#4ade80', '#16a34a',
  // 블루/시안
  '#4f8ef7', '#3b82f6', '#2563eb', '#60a5fa', '#93c5fd', '#22d3ee', '#06b6d4',
  // 퍼플
  '#a78bfa', '#8b5cf6', '#7c3aed', '#c4b5fd', '#ddd6fe', '#e879f9', '#c026d3',
];

function saveSelection() {
  const sel = window.getSelection();
  if (sel && sel.rangeCount > 0) savedSelection = sel.getRangeAt(0).cloneRange();
}

function restoreSelection() {
  if (!savedSelection) return;
  const sel = window.getSelection();
  sel.removeAllRanges();
  sel.addRange(savedSelection);
}

function toggleColorPalette(btn, cmd) {
  saveSelection();
  // 기존 팔레트 닫기
  document.querySelectorAll('.rte-palette').forEach(p => {
    if (p !== btn._palette) p.remove();
  });
  if (btn._palette && document.body.contains(btn._palette)) {
    btn._palette.remove(); btn._palette = null; return;
  }

  const palette = document.createElement('div');
  palette.className = 'rte-palette';
  palette.innerHTML = `
    <div style="font-size:11px;color:#8b90a7;margin-bottom:6px;font-weight:600">
      ${cmd === 'foreColor' ? '글씨 색상' : '배경 색상'}
    </div>
    <div class="rte-palette-grid">
      ${RTE_COLORS.map(c => `
        <div class="rte-palette-color" style="background:${c}" title="${c}"
          onmousedown="applyRTEColor(event,'${cmd}','${c}',this)"></div>
      `).join('')}
    </div>
    ${cmd === 'backColor' ? `<div class="rte-palette-none" onmousedown="applyRTEColor(event,'${cmd}','transparent',this)">🚫 배경 없음</div>` : ''}
  `;

  // 위치 계산
  const rect = btn.getBoundingClientRect();
  palette.style.cssText = `position:fixed;top:${rect.bottom + 4}px;left:${rect.left}px;z-index:9999`;
  document.body.appendChild(palette);
  btn._palette = palette;

  // 외부 클릭 시 닫기
  setTimeout(() => {
    document.addEventListener('mousedown', function closePalette(e) {
      if (!palette.contains(e.target) && e.target !== btn) {
        palette.remove(); btn._palette = null;
        document.removeEventListener('mousedown', closePalette);
      }
    });
  }, 100);
}

function applyRTEColor(e, cmd, color, swatch) {
  e.preventDefault();
  restoreSelection();
  if (color === 'transparent') {
    document.execCommand('removeFormat', false, null);
  } else {
    document.execCommand(cmd, false, color);
  }
  // 버튼 색상 미리보기 업데이트
  const btn = document.querySelector(`.rte-color-btn[data-cmd="${cmd}"]`);
  if (btn) {
    const span = btn.querySelector('span');
    if (span) {
      if (cmd === 'foreColor') span.style.borderBottomColor = color;
      else { span.style.background = color; span.style.color = color === '#ffffff' ? '#111' : '#fff'; }
    }
  }
  // 팔레트 닫기
  document.querySelectorAll('.rte-palette').forEach(p => p.remove());
}

function initRTE(containerSelector) {
  const container = document.querySelector(containerSelector);
  if (!container) return;
  container.querySelectorAll('.rte-editor').forEach(editor => {
    editor.addEventListener('mouseup', saveSelection);
    editor.addEventListener('keyup', saveSelection);
    editor.addEventListener('blur', saveSelection);
  });
  container.querySelectorAll('.rte-btn[data-cmd]').forEach(btn => {
    if (btn.classList.contains('rte-color-btn')) return;
    btn.addEventListener('mousedown', e => {
      e.preventDefault();
      document.execCommand(btn.dataset.cmd, false, null);
    });
  });
}

function getRTE(id) { const e = document.getElementById(id); return e ? e.innerHTML : ''; }
function setRTE(id, html) { const e = document.getElementById(id); if (e) e.innerHTML = html || ''; }


// ===== INLINE EDIT (TABLE ROWS) =====
function activateInlineEdit(tr, rowData, dbKey, fields, rerenderFn) {
  if (tr.classList.contains('row-editing')) return;
  tr.classList.add('row-editing');
  fields.forEach(f => {
    const td = tr.querySelector(`[data-field="${f.key}"]`);
    if (!td) return;
    let html = '';
    if (f.type === 'select') {
      html = `<select class="form-control" style="min-width:90px" data-editval="${f.key}">${f.options.map(o => `<option ${o === rowData[f.key] ? 'selected' : ''}>${o}</option>`).join('')}</select>`;
    } else if (f.type === 'number') {
      html = `<input type="number" class="form-control" style="width:80px" value="${rowData[f.key] || 0}" data-editval="${f.key}">`;
    } else {
      html = `<input type="text" class="form-control" style="min-width:90px;max-width:140px" value="${rowData[f.key] || ''}" data-editval="${f.key}">`;
    }
    td.innerHTML = html;
  });
  const actionTd = tr.querySelector('.action-cell');
  if (actionTd) {
    const orig = actionTd.innerHTML;
    actionTd.innerHTML = `<div style="display:flex;gap:5px"><button class="btn btn-success btn-sm" id="isave">💾</button><button class="btn btn-secondary btn-sm" id="icancel">✕</button></div>`;
    actionTd.querySelector('#isave').onclick = () => {
      const all = DB.get(dbKey);
      const idx = all.findIndex(x => x.id === rowData.id);
      if (idx > -1) {
        tr.querySelectorAll('[data-editval]').forEach(i => { all[idx][i.dataset.editval] = i.value; });
        DB.set(dbKey, all); showToast('저장되었습니다.');
      }
      rerenderFn();
    };
    actionTd.querySelector('#icancel').onclick = () => rerenderFn();
  }
}

// ===== DASHBOARD HELPERS =====
function getDashboardProjectsByStatus() {
  const projects = DB.get('projects') || [];
  const sorted = [...projects].sort((a, b) => {
    const ad = a.startDate || a.endDate || '';
    const bd = b.startDate || b.endDate || '';
    return bd.localeCompare(ad);
  });
  const pick = status => sorted.filter(p => p.status === status).slice(0, 3);
  return { 진행중: pick('진행중'), 보류: pick('보류'), 완료: pick('완료') };
}

function getDashboardPurchasesByStatus() {
  const list = DB.get('purchases') || [];
  const sorted = [...list].sort((a, b) =>
    (b.requestDate || '').localeCompare(a.requestDate || '')
  );
  const pick = status => sorted.filter(p => p.status === status).slice(0, 3);
  return { 검토중: pick('검토중'), 승인: pick('승인'), 완료: pick('완료'), 반려: pick('반려') };
}

// ===== DASHBOARD =====
function renderDashboard() {
  const proj = DB.get('projects'), inv = DB.get('inventory'), pur = DB.get('purchases'), dis = DB.get('disposals');
  document.getElementById('stat-projects').textContent = proj.filter(p => p.status === '진행중').length;
  document.getElementById('stat-inventory').textContent = inv.length;
  document.getElementById('stat-purchases').textContent = pur.filter(p => p.status === '검토중').length;
  document.getElementById('stat-disposals').textContent = dis.filter(d => d.status === '진행중').length;
  document.getElementById('stat-lowstock').textContent = inv.filter(i => i.quantity <= i.minQty).length;

  // === 최근 프로젝트(3열) ===
  const projWrap = document.getElementById('dash-recent-projects');
  if (projWrap) {
    const groups = getDashboardProjectsByStatus();
    const cols = [
      { key: '진행중', label: '진행중' },
      { key: '보류', label: '보류' },
      { key: '완료', label: '완료' },
    ];
    projWrap.innerHTML = `
      <div class="dash-cols dash-cols-3">
        ${cols.map(c => `
          <div class="dash-col">
            <div class="dash-col-header">${c.label}</div>
            <div class="dash-col-body">
              ${groups[c.key].length === 0
        ? `<div class="dash-empty">해당 상태의 프로젝트가 없습니다.</div>`
        : groups[c.key].map(p => `
                  <div class="dash-card dash-card-project status-${c.key}">
                    <div class="dash-card-title">${p.name}</div>
                    <div class="dash-card-meta">
                      <span>${p.manager || '담당자 미지정'}</span>
                      <span>${p.startDate || '-'} ~ ${p.endDate || '-'}</span>
                      <span>${p.progress ?? 0}%</span>
                    </div>
                  </div>`).join('')
      }
            </div>
          </div>`).join('')}
      </div>`;
  }

  // === 최근 구매요청(4열) ===
  const purWrap = document.getElementById('dash-recent-purchases');
  if (purWrap) {
    const groups = getDashboardPurchasesByStatus();
    const cols = [
      { key: '검토중', label: '검토' },
      { key: '승인', label: '승인' },
      { key: '완료', label: '완료' },
      { key: '반려', label: '반려' },
    ];
    purWrap.innerHTML = `
      <div class="dash-cols dash-cols-4">
        ${cols.map(c => `
          <div class="dash-col">
            <div class="dash-col-header">${c.label}</div>
            <div class="dash-col-body">
              ${groups[c.key].length === 0
        ? `<div class="dash-empty">해당 상태의 요청이 없습니다.</div>`
        : groups[c.key].map(p => `
                  <div class="dash-card dash-card-purchase status-${c.key}">
                    <div class="dash-card-title">${p.title}</div>
                    <div class="dash-card-meta">
                      <span>${p.dept || '-'}</span>
                      <span>${p.requester || '-'}</span>
                      <span>${p.requestDate || '-'}</span>
                      <span>${numFmt(p.amount || 0)}원</span>
                    </div>
                  </div>`).join('')
      }
            </div>
          </div>`).join('')}
      </div>`;
  }
}

function sColor(s) { return { 진행중: '#4f8ef7', 계획중: '#f59e0b', 완료: '#34d399', 보류: '#8b90a7', 긴급: '#f87171' }[s] || '#8b90a7'; }
function purColor(s) { return { 승인: '#34d399', 검토중: '#f59e0b', 반려: '#f87171', 완료: '#22d3ee' }[s] || '#8b90a7'; }
function badgeHtml(s) { const m = { 진행중: 'badge-blue', 계획중: 'badge-orange', 완료: 'badge-green', 보류: 'badge-gray', 긴급: 'badge-red' }; return `<span class="badge ${m[s] || 'badge-gray'}">${s}</span>`; }
function purBadge(s) { return `<span class="badge ${{ 승인: 'badge-green', 검토중: 'badge-orange', 반려: 'badge-red', 완료: 'badge-cyan' }[s] || 'badge-gray'}">${s}</span>`; }
function disBadge(s) { return `<span class="badge ${{ 완료: 'badge-green', 진행중: 'badge-blue', 대기: 'badge-orange', 취소: 'badge-gray' }[s] || 'badge-gray'}">${s}</span>`; }


// ===== PROJECTS =====
let projFilter = '전체', projSort = 'none', projViewMode = 'all', projWeekOffset = 0, projSelectedMonth = '';

function toggleProjSort() {
  const cycle = ['none', 'asc', 'desc'];
  const i = cycle.indexOf(projSort);
  projSort = cycle[(i + 1) % 3];
  const btn = document.getElementById('sort-btn');
  if (btn) {
    btn.className = 'sort-btn' + (projSort !== 'none' ? ' active' : '');
    btn.textContent = projSort === 'asc' ? '📅 시작일 빠른순' : projSort === 'desc' ? '📅 시작일 느린순' : '📅 날짜 정렬';
  }
  renderProjects();
}

function renderProjects() {
  let data = DB.get('projects');
  const today = getTodayKST();

  // 오늘 필터 (전체 제외한 상태 탭에서만)
  if (projFilter !== '전체' && projViewMode === 'today') {
    data = data.filter(p => p.status === projFilter && p.startDate <= today && (!p.endDate || p.endDate >= today));
  } else if (projFilter !== '전체') {
    data = data.filter(p => p.status === projFilter);
  }

  // 전체 탭 주별/월별 필터
  if (projFilter === '전체') {
    if (projViewMode === 'week') {
      const weekStart = getWeekStart(projWeekOffset);
      const weekEnd = getWeekEnd(projWeekOffset);
      data = data.filter(p => p.startDate && p.startDate >= weekStart && p.startDate <= weekEnd);
    } else if (projViewMode === 'month' && projSelectedMonth) {
      const m = projSelectedMonth;
      data = data.filter(p => p.startDate && p.startDate.startsWith(m));
    }
  }

  if (projSort === 'asc') data = [...data].sort((a, b) => (a.startDate || '').localeCompare(b.startDate || ''));
  else if (projSort === 'desc') data = [...data].sort((a, b) => (b.startDate || '').localeCompare(a.startDate || ''));

  document.getElementById('project-count').textContent = `총 ${data.length}개`;
  document.getElementById('project-grid').innerHTML = data.length ? data.map(p => `
    <div class="project-card">
      <div class="project-card-header">
        <div>${badgeHtml(p.status)}${p.priority === '긴급' ? '<span class="badge badge-red" style="margin-left:5px">🔥</span>' : ''}</div>
        <div class="project-actions">
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openProjModal('${p.id}')" title="수정" data-tooltip="수정">✏️</button>
          <button class="btn btn-secondary btn-sm btn-icon" onclick="openProjDetail('${p.id}')" title="상세보기" data-tooltip="상세보기">📄</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="delProject('${p.id}')" title="삭제" data-tooltip="삭제">🗑️</button>
        </div>
      </div>
      <div class="project-name">${p.name}</div>
      <div class="project-desc">${p.desc || '설명 없음'}</div>
      <div class="project-meta"><span>👤 ${p.manager}</span><span>📅 ${p.startDate}~${p.endDate}</span><span>📌 ${p.tasks}개(${p.doneTasks}완)</span></div>
      <div class="project-progress-label"><span>진행률</span><span>${p.progress}%</span></div>
      <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
      ${renderAttachmentsStatic(p.attachments || [])}
      <div class="project-footer"><span style="font-size:12px;color:var(--text-muted)">우선순위: <strong style="color:var(--text-primary)">${p.priority}</strong></span>
        <button class="btn btn-primary btn-sm" onclick="quickProgress('${p.id}')">진행률 수정</button>
      </div>
    </div>`).join('') : '<div style="text-align:center;padding:60px;color:var(--text-muted)">📋 프로젝트가 없습니다.</div>';

  // 필터 버튼 행 업데이트 (주별/월별 카운트)
  updateProjFilterBar();
}

// 주별/월별 날짜 헬퍼
function getWeekStart(offset) {
  const d = new Date(Date.now() + 9 * 60 * 60 * 1000);
  const day = d.getUTCDay(); // 0=일
  const mon = new Date(d);
  mon.setUTCDate(d.getUTCDate() - (day === 0 ? 6 : day - 1) + offset * 7);
  return mon.toISOString().split('T')[0];
}
function getWeekEnd(offset) {
  const start = getWeekStart(offset);
  const d = new Date(start);
  d.setUTCDate(d.getUTCDate() + 6);
  return d.toISOString().split('T')[0];
}

function updateProjFilterBar() {
  const bar = document.getElementById('proj-extra-btns');
  if (!bar) return;
  const projects = DB.get('projects');

  if (projFilter === '전체') {
    // 주별 카운트
    const ws = getWeekStart(projWeekOffset), we = getWeekEnd(projWeekOffset);
    const weekCount = projects.filter(p => p.startDate && p.startDate >= ws && p.startDate <= we).length;
    // 월별 카운트
    const monthCount = projSelectedMonth
      ? projects.filter(p => p.startDate && p.startDate.startsWith(projSelectedMonth)).length
      : 0;

    bar.innerHTML = `
      <button class="filter-tab ${projViewMode === 'week' ? 'active' : ''}" onclick="setProjViewMode('week')">
        주별 <span class="badge badge-blue">${weekCount}</span>
      </button>
      <button class="filter-tab ${projViewMode === 'month' ? 'active' : ''}" onclick="setProjViewMode('month')">
        월별 <span class="badge badge-blue">${monthCount}</span>
      </button>
      ${projViewMode === 'week' ? `
        <button class="btn btn-secondary btn-sm" onclick="projWeekOffset--;renderProjects()">◀</button>
        <span style="font-size:12px;color:var(--text-muted);padding:0 6px">${ws} ~ ${we}</span>
        <button class="btn btn-secondary btn-sm" onclick="projWeekOffset++;renderProjects()">▶</button>
      ` : ''}
      ${projViewMode === 'month' ? `
        <input type="month" class="form-control" style="width:140px;padding:4px 8px;font-size:12px"
          value="${projSelectedMonth}"
          onchange="projSelectedMonth=this.value;renderProjects()">
      ` : ''}
    `;
  } else {
    bar.innerHTML = `
      <button class="filter-tab ${projViewMode === 'today' ? 'active' : ''}" onclick="setProjViewMode('today')">
        오늘
      </button>
    `;
  }
}

function setProjViewMode(mode) {
  projViewMode = projViewMode === mode ? 'all' : mode;
  if (mode === 'month' && !projSelectedMonth) {
    projSelectedMonth = getTodayKST().slice(0, 7);
  }
  renderProjects();
}

function setProjFilter(f) {
  projFilter = f;
  projViewMode = 'all';
  projWeekOffset = 0;
  document.querySelectorAll('#project-filters .filter-tab').forEach(el => el.classList.toggle('active', el.dataset.filter === f));
  renderProjects();
}

function openProjDetail(id) {
  const p = DB.get('projects').find(x => x.id === id);
  if (!p) return;
  alert(`[${p.name}]\n상태: ${p.status}\n담당자: ${p.manager}\n기간: ${p.startDate} ~ ${p.endDate}\n진행률: ${p.progress}%\n우선순위: ${p.priority}`);
}

function openProjModal(editId = null) {
  document.getElementById('proj-form').reset();
  document.getElementById('proj-edit-id').value = '';
  document.getElementById('proj-modal-title').textContent = editId ? '프로젝트 수정' : '새 프로젝트 추가';
  setRTE('rte-proj-desc', '');
  initFileZone('proj-file-zone', 'proj-previews');
  if (editId) {
    const p = DB.get('projects').find(x => x.id === editId); if (!p) return;
    document.getElementById('proj-edit-id').value = p.id;
    document.getElementById('proj-name').value = p.name;
    setRTE('rte-proj-desc', p.desc || '');
    document.getElementById('proj-status').value = p.status;
    document.getElementById('proj-priority').value = p.priority;
    document.getElementById('proj-manager').value = p.manager;
    document.getElementById('proj-start').value = p.startDate;
    document.getElementById('proj-end').value = p.endDate;
    document.getElementById('proj-tasks').value = p.tasks;
    document.getElementById('proj-done-tasks').value = p.doneTasks;
    document.getElementById('proj-progress').value = p.progress;
    loadAttachmentsIntoZone(p.attachments || [], 'proj-previews');
  }
  openModal('project-modal');
}

function saveProject() {
  const name = document.getElementById('proj-name').value.trim();
  if (!name) { showToast('프로젝트명을 입력하세요.', 'error'); return; }
  const editId = document.getElementById('proj-edit-id').value;
  const projects = DB.get('projects');
  const data = { name, desc: getRTE('rte-proj-desc'), status: document.getElementById('proj-status').value, priority: document.getElementById('proj-priority').value, manager: document.getElementById('proj-manager').value.trim() || '미지정', startDate: document.getElementById('proj-start').value, endDate: document.getElementById('proj-end').value, tasks: +document.getElementById('proj-tasks').value || 0, doneTasks: +document.getElementById('proj-done-tasks').value || 0, progress: +document.getElementById('proj-progress').value || 0, attachments: [...pendingAttachments] };
  if (editId) { const idx = projects.findIndex(p => p.id === editId); if (idx > -1) projects[idx] = { ...projects[idx], ...data }; showToast('수정되었습니다.'); }
  else { projects.push({ id: DB.genId(), ...data }); showToast('추가되었습니다.'); }
  DB.set('projects', projects); closeModal('project-modal'); renderProjects();
}

function delProject(id) {
  showConfirm('삭제', '이 프로젝트를 삭제하시겠습니까?', () => {
    DB.set('projects', DB.get('projects').filter(p => p.id !== id));
    showToast('삭제되었습니다.', 'warning');
    renderProjects();
  });
}

function quickProgress(id) {
  const p = DB.get('projects').find(x => x.id === id); if (!p) return;
  const v = prompt(`현재 진행률:${p.progress}%\n새 진행률(0-100):`, p.progress); if (v === null) return;
  const n = Math.min(100, Math.max(0, parseInt(v) || 0));
  const all = DB.get('projects'); const i = all.findIndex(x => x.id === id);
  all[i].progress = n; if (n === 100) all[i].status = '완료';
  DB.set('projects', all); showToast(`진행률 ${n}%로 업데이트`); renderProjects();
}

// ===== INVENTORY =====
let invSearch = '', invCat = '전체';
function renderInventory() {
  let data = DB.get('inventory');
  if (invCat !== '전체') data = data.filter(i => i.category === invCat);
  if (invSearch) { const s = invSearch.toLowerCase(); data = data.filter(i => i.name.toLowerCase().includes(s) || i.location.toLowerCase().includes(s)); }
  document.getElementById('inventory-count').textContent = `총 ${data.length}건`;
  const tbody = document.getElementById('inventory-tbody');
  tbody.innerHTML = data.length ? data.map(i => {
    const lv = i.quantity <= i.minQty ? 'low' : i.quantity <= i.minQty * 2 ? 'mid' : 'high';
    const lbl = { low: '부족', mid: '주의', high: '충분' }[lv];
    return `<tr data-id="${i.id}">
      <td data-field="name"><strong>${i.name}</strong></td>
      <td data-field="category"><span class="badge badge-purple">${i.category}</span></td>
      <td><div class="stock-indicator"><div class="stock-dot ${lv}"></div><strong data-field="quantity" >${i.quantity}</strong> ${i.unit}</div></td>
      <td data-field="minQty" style="color:var(--text-muted)">${i.minQty}</td>
      <td><span class="badge ${lv === 'low' ? 'badge-red' : lv === 'mid' ? 'badge-orange' : 'badge-green'}">${lbl}</span></td>
      <td data-field="location">${i.location}</td>
      <td>${numFmt(i.price)}원</td>
      <td class="action-cell">
        <div style="display:flex;gap:5px">
          <button class="btn btn-secondary btn-sm" onclick="inlineEditInv('${i.id}')">✏️</button>
          <button class="btn btn-warning btn-sm" onclick="openInvModal('${i.id}')">📝</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="delInv('${i.id}')">🗑️</button>
        </div>
      </td>
    </tr>`;
  }).join('') : `<tr class="empty-row"><td colspan="8">📦 재고 품목이 없습니다.</td></tr>`;
}
function inlineEditInv(id) {
  const item = DB.get('inventory').find(x => x.id === id); if (!item) return;
  const tr = document.querySelector(`#inventory-tbody tr[data-id="${id}"]`); if (!tr) return;
  activateInlineEdit(tr, item, 'inventory', [
    { key: 'name', type: 'text' }, { key: 'category', type: 'select', options: ['소모품', '비품'] },
    { key: 'quantity', type: 'number' }, { key: 'minQty', type: 'number' }, { key: 'location', type: 'text' }
  ], renderInventory);
}
function openInvModal(editId = null) {
  document.getElementById('inv-form').reset();
  document.getElementById('inv-edit-id').value = '';
  document.getElementById('inv-modal-title').textContent = editId ? '재고 품목 수정' : '재고 품목 추가';
  if (editId) {
    const i = DB.get('inventory').find(x => x.id === editId); if (!i) return;
    document.getElementById('inv-edit-id').value = i.id;
    document.getElementById('inv-name').value = i.name;
    document.getElementById('inv-category').value = i.category;
    document.getElementById('inv-unit').value = i.unit;
    document.getElementById('inv-qty').value = i.quantity;
    document.getElementById('inv-min-qty').value = i.minQty;
    document.getElementById('inv-location').value = i.location;
    document.getElementById('inv-price').value = i.price;
    document.getElementById('inv-note').value = i.note;
  }
  openModal('inventory-modal');
}
function saveInventory() {
  const name = document.getElementById('inv-name').value.trim();
  if (!name) { showToast('품목명을 입력하세요.', 'error'); return; }
  const editId = document.getElementById('inv-edit-id').value;
  const data = DB.get('inventory');
  const item = { name, category: document.getElementById('inv-category').value, unit: document.getElementById('inv-unit').value.trim() || '개', quantity: +document.getElementById('inv-qty').value || 0, minQty: +document.getElementById('inv-min-qty').value || 0, location: document.getElementById('inv-location').value.trim() || '-', price: +document.getElementById('inv-price').value || 0, note: document.getElementById('inv-note').value.trim() };
  if (editId) { const idx = data.findIndex(x => x.id === editId); if (idx > -1) data[idx] = { ...data[idx], ...item }; showToast('수정되었습니다.'); }
  else { data.push({ id: DB.genId(), ...item }); showToast('추가되었습니다.'); }
  DB.set('inventory', data); closeModal('inventory-modal'); renderInventory();
}
function delInv(id) { showConfirm('삭제', '이 품목을 삭제하시겠습니까?', () => { DB.set('inventory', DB.get('inventory').filter(x => x.id !== id)); showToast('삭제되었습니다.', 'warning'); renderInventory(); }); }

// ===== PURCHASES =====
let purFilter = '전체';
function renderPurchases() {
  let data = DB.get('purchases');
  if (purFilter !== '전체') data = data.filter(p => p.status === purFilter);
  document.getElementById('purchase-count').textContent = `총 ${data.length}건`;
  const tbody = document.getElementById('purchase-tbody');
  tbody.innerHTML = data.length ? data.map(p => `
    <tr data-id="${p.id}">
      <td data-field="title" class="wrap-cell"><strong>${p.title}</strong><br><span style="font-size:11px;color:var(--text-muted)">${p.dept}</span></td>
      <td data-field="requester">${p.requester}</td>
      <td><span class="badge badge-purple">${p.category}</span></td>
      <td><strong>${numFmt(p.amount)}원</strong></td>
      <td>${purBadge(p.status)}</td>
      <td>${p.requestDate}</td>
      <td class="action-cell">
        <div style="display:flex;gap:5px;flex-wrap:wrap">
          ${p.status === '검토중' ? `<button class="btn btn-success btn-sm" onclick="setPurStatus('${p.id}','승인')">✅</button><button class="btn btn-danger btn-sm" onclick="setPurStatus('${p.id}','반려')">❌</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="inlineEditPur('${p.id}')">✏️</button>
          <button class="btn btn-warning btn-sm" onclick="openPurModal('${p.id}')">📝</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="delPur('${p.id}')">🗑️</button>
        </div>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="7">🛒 구매 요청이 없습니다.</td></tr>`;
}
function inlineEditPur(id) {
  const item = DB.get('purchases').find(x => x.id === id); if (!item) return;
  const tr = document.querySelector(`#purchase-tbody tr[data-id="${id}"]`); if (!tr) return;
  activateInlineEdit(tr, item, 'purchases', [
    { key: 'title', type: 'text' }, { key: 'requester', type: 'text' },
    { key: 'amount', type: 'number' }, { key: 'status', type: 'select', options: ['검토중', '승인', '반려', '완료'] }
  ], renderPurchases);
}
function setPurStatus(id, status) {
  const data = DB.get('purchases'); const i = data.findIndex(x => x.id === id);
  if (i > -1) { data[i].status = status; data[i].approvedDate = today(); }
  DB.set('purchases', data); showToast(`[${status}] 처리되었습니다.`, status === '승인' ? 'success' : 'warning'); renderPurchases();
}
function openPurModal(editId = null) {
  document.getElementById('pur-form').reset();
  document.getElementById('pur-edit-id').value = '';
  document.getElementById('pur-modal-title').textContent = editId ? '구매요청 수정' : '새 구매 요청';
  if (editId) {
    const p = DB.get('purchases').find(x => x.id === editId); if (!p) return;
    document.getElementById('pur-edit-id').value = p.id;
    document.getElementById('pur-title').value = p.title;
    document.getElementById('pur-dept').value = p.dept;
    document.getElementById('pur-requester').value = p.requester;
    document.getElementById('pur-amount').value = p.amount;
    document.getElementById('pur-category').value = p.category;
    document.getElementById('pur-status').value = p.status;
    document.getElementById('pur-date').value = p.requestDate;
    document.getElementById('pur-note').value = p.note;
  } else { document.getElementById('pur-date').value = today(); }
  openModal('purchase-modal');
}
function savePurchase() {
  const title = document.getElementById('pur-title').value.trim();
  if (!title) { showToast('요청 내용을 입력하세요.', 'error'); return; }
  const editId = document.getElementById('pur-edit-id').value;
  const data = DB.get('purchases');
  const item = { title, dept: document.getElementById('pur-dept').value.trim() || '-', requester: document.getElementById('pur-requester').value.trim() || '-', amount: +document.getElementById('pur-amount').value || 0, category: document.getElementById('pur-category').value, status: document.getElementById('pur-status').value, requestDate: document.getElementById('pur-date').value || today(), approvedDate: '', note: document.getElementById('pur-note').value.trim() };
  if (editId) { const i = data.findIndex(x => x.id === editId); if (i > -1) data[i] = { ...data[i], ...item }; showToast('수정되었습니다.'); }
  else { data.push({ id: DB.genId(), ...item }); showToast('등록되었습니다.'); }
  DB.set('purchases', data); closeModal('purchase-modal'); renderPurchases();
}
function delPur(id) { showConfirm('삭제', '이 구매요청을 삭제하시겠습니까?', () => { DB.set('purchases', DB.get('purchases').filter(x => x.id !== id)); showToast('삭제됨', 'warning'); renderPurchases(); }); }
function setPurFilter(f) {
  purFilter = f;
  document.querySelectorAll('#purchase-filters .filter-tab').forEach(el => el.classList.toggle('active', el.dataset.filter === f));
  renderPurchases();
}

// ===== DISPOSALS =====
let disFilter = '전체', disType = '일반폐기';

function disBadge(s) {
  const map = { '대기': 'badge-gray', '진행중': 'badge-blue', '완료': 'badge-green', '취소': 'badge-red' };
  return `<span class="badge ${map[s] || 'badge-gray'}">${s}</span>`;
}

function renderDisposals() {
  let data = DB.get('disposals');
  if (disFilter !== '전체') data = data.filter(d => d.status === disFilter);
  document.getElementById('disposal-count').textContent = `총 ${data.length}건`;
  const tbody = document.getElementById('disposal-tbody');
  tbody.innerHTML = data.length ? data.map(d => `
    <tr data-id="${d.id}">
      <td class="wrap-cell"><strong>${d.name}</strong></td>
      <td><span class="badge ${d.type === '빼기폐기' ? 'badge-orange' : 'badge-blue'}">${d.type}</span></td>
      <td><span class="badge badge-purple">${d.category}</span></td>
      <td>${d.qty} ${d.unit}</td>
      <td class="wrap-cell" style="max-width:120px">${d.reason}</td>
      <td>${d.requester}</td>
      <td>${disBadge(d.status)}</td>
      <td>${d.requestDate}</td>
      <td class="action-cell">
        <div style="display:flex;gap:5px">
          ${d.status === '진행중' ? `<button class="btn btn-success btn-sm" onclick="completeDis('${d.id}')" title="완료처리">✅</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="inlineEditDis('${d.id}')" title="인라인 수정" data-tooltip="빠른수정">✏️</button>
          <button class="btn btn-warning btn-sm" onclick="openDisModal('${d.id}')" title="상세수정" data-tooltip="상세수정">📝</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="delDis('${d.id}')" title="삭제" data-tooltip="삭제">🗑️</button>
        </div>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="8">🗑️ 폐기 이력이 없습니다.</td></tr>`;
}

function inlineEditDis(id) {
  const item = DB.get('disposals').find(x => x.id === id); if (!item) return;
  const tr = document.querySelector(`#disposal-tbody tr[data-id="${id}"]`); if (!tr) return;

  // 이미 인라인 편집 중이면 취소
  if (tr.classList.contains('inline-editing')) { renderDisposals(); return; }
  tr.classList.add('inline-editing');

  tr.innerHTML = `
    <td><input class="form-control" style="min-width:100px" id="ie-name" value="${item.name}"></td>
    <td>
      <select class="form-control" id="ie-type">
        <option value="일반폐기" ${item.type === '일반폐기' ? 'selected' : ''}>일반폐기</option>
        <option value="빼기폐기" ${item.type === '빼기폐기' ? 'selected' : ''}>빼기폐기</option>
      </select>
    </td>
    <td><input class="form-control" style="min-width:70px" id="ie-category" value="${item.category}"></td>
    <td><input class="form-control" type="number" style="width:60px;display:inline-block" id="ie-qty" value="${item.qty}"> <input class="form-control" style="width:40px;display:inline-block" id="ie-unit" value="${item.unit}"></td>
    <td><input class="form-control" style="min-width:100px" id="ie-reason" value="${item.reason}"></td>
    <td><input class="form-control" style="min-width:70px" id="ie-requester" value="${item.requester}"></td>
    <td>
      <select class="form-control" id="ie-status">
        <option value="대기" ${item.status === '대기' ? 'selected' : ''}>대기</option>
        <option value="진행중" ${item.status === '진행중' ? 'selected' : ''}>진행중</option>
        <option value="완료" ${item.status === '완료' ? 'selected' : ''}>완료</option>
        <option value="취소" ${item.status === '취소' ? 'selected' : ''}>취소</option>
      </select>
    </td>
    <td><input class="form-control" type="date" id="ie-date" value="${item.requestDate}"></td>
    <td class="action-cell">
      <div style="display:flex;gap:5px">
        <button class="btn btn-primary btn-sm" onclick="saveInlineEditDis('${id}')">💾 저장</button>
        <button class="btn btn-secondary btn-sm" onclick="renderDisposals()">✖ 취소</button>
      </div>
    </td>
  `;
}

function saveInlineEditDis(id) {
  const data = DB.get('disposals');
  const i = data.findIndex(x => x.id === id); if (i < 0) return;
  data[i].name = document.getElementById('ie-name').value.trim() || data[i].name;
  data[i].type = document.getElementById('ie-type').value;
  data[i].category = document.getElementById('ie-category').value.trim();
  data[i].qty = +document.getElementById('ie-qty').value || data[i].qty;
  data[i].unit = document.getElementById('ie-unit').value.trim() || data[i].unit;
  data[i].reason = document.getElementById('ie-reason').value.trim();
  data[i].requester = document.getElementById('ie-requester').value.trim() || data[i].requester;
  data[i].status = document.getElementById('ie-status').value;
  data[i].requestDate = document.getElementById('ie-date').value || data[i].requestDate;
  if (data[i].status === '완료' && !data[i].completedDate) data[i].completedDate = today();
  DB.set('disposals', data);
  showToast('수정되었습니다.');
  renderDisposals();
}

function setDisFilter(f) {
  disFilter = f;
  document.querySelectorAll('#disposal-filters .filter-tab').forEach(el => el.classList.toggle('active', el.dataset.filter === f));
  renderDisposals();
}

function setDisModalType(t) {
  disType = t;
  document.querySelectorAll('.disposal-type-tab').forEach(el => el.classList.toggle('active', el.dataset.type === t));
  document.getElementById('dis-type').value = t;
}

function openDisModal(editId = null) {
  document.getElementById('dis-form').reset();
  document.getElementById('dis-edit-id').value = '';
  document.getElementById('dis-modal-title').textContent = editId ? '폐기신청 수정' : '폐기 신청';
  initFileZone('dis-file-zone', 'dis-previews');
  setDisModalType('일반폐기');
  if (editId) {
    const d = DB.get('disposals').find(x => x.id === editId); if (!d) return;
    document.getElementById('dis-edit-id').value = d.id;
    setDisModalType(d.type || '일반폐기');
    document.getElementById('dis-name').value = d.name;
    document.getElementById('dis-category').value = d.category;
    document.getElementById('dis-qty').value = d.qty;
    document.getElementById('dis-unit').value = d.unit;
    document.getElementById('dis-reason').value = d.reason;
    document.getElementById('dis-method').value = d.method;
    document.getElementById('dis-dept').value = d.dept;
    document.getElementById('dis-requester').value = d.requester;
    document.getElementById('dis-status').value = d.status;
    document.getElementById('dis-date').value = d.requestDate;
    document.getElementById('dis-note').value = d.note;
    loadAttachmentsIntoZone(d.attachments || [], 'dis-previews');
  } else {
    document.getElementById('dis-date').value = today();
  }
  openModal('disposal-modal');
}

function saveDisposal() {
  const name = document.getElementById('dis-name').value.trim();
  if (!name) { showToast('폐기 품목명을 입력하세요.', 'error'); return; }
  const editId = document.getElementById('dis-edit-id').value;
  const data = DB.get('disposals');
  const item = {
    name,
    type: document.getElementById('dis-type').value || disType,
    category: document.getElementById('dis-category').value,
    qty: +document.getElementById('dis-qty').value || 1,
    unit: document.getElementById('dis-unit').value.trim() || '개',
    reason: document.getElementById('dis-reason').value.trim(),
    method: document.getElementById('dis-method').value.trim(),
    dept: document.getElementById('dis-dept').value.trim() || '-',
    requester: document.getElementById('dis-requester').value.trim() || '-',
    status: document.getElementById('dis-status').value,
    requestDate: document.getElementById('dis-date').value || today(),
    completedDate: '',
    note: document.getElementById('dis-note').value.trim(),
    attachments: [...pendingAttachments]
  };
  if (editId) {
    const i = data.findIndex(x => x.id === editId);
    if (i > -1) data[i] = { ...data[i], ...item };
    showToast('수정되었습니다.');
  } else {
    data.push({ id: DB.genId(), ...item });
    showToast('등록되었습니다.');
  }
  DB.set('disposals', data); closeModal('disposal-modal'); renderDisposals();
}

function completeDis(id) {
  showConfirm('완료처리', '폐기 완료 처리하시겠습니까?', () => {
    const data = DB.get('disposals'); const i = data.findIndex(x => x.id === id);
    if (i > -1) { data[i].status = '완료'; data[i].completedDate = today(); }
    DB.set('disposals', data); showToast('완료 처리되었습니다.'); renderDisposals();
  });
}

function delDis(id) {
  showConfirm('삭제', '이 폐기신청을 삭제하시겠습니까?', () => {
    DB.set('disposals', DB.get('disposals').filter(x => x.id !== id));
    showToast('삭제됨', 'warning'); renderDisposals();
  });
}


// ===== STATISTICS =====
let statsMod = 'inventory', statsPeriod = 'monthly';
let chartRefs = {};

function getWeek(d) {
  const s = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d - s) / (1000 * 60 * 60 * 24 * 7));
}
function getPeriodKey(dateStr, period) {
  const d = new Date(dateStr);
  if (!dateStr || isNaN(d)) return 'unknown';
  if (period === 'weekly') return `${d.getFullYear()}-W${String(getWeek(d)).padStart(2, '0')}`;
  if (period === 'monthly') return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
  if (period === 'quarterly') return `${d.getFullYear()}-Q${Math.ceil((d.getMonth() + 1) / 3)}`;
  return `${d.getFullYear()}`;
}
function destroyChart(id) { if (chartRefs[id]) { chartRefs[id].destroy(); delete chartRefs[id]; } }
function makeChart(id, config) {
  destroyChart(id);
  const canvas = document.getElementById(id);
  if (!canvas) return;
  chartRefs[id] = new Chart(canvas, config);
}
function renderStats() {
  if (statsMod === 'inventory') renderStatsInventory();
  else if (statsMod === 'purchases') renderStatsPurchases();
  else renderStatsDisposals();
}

function renderStatsInventory() {
  const inv = DB.get('inventory');
  const sumCard = document.getElementById('stats-sum-row');
  const total = inv.reduce((a, i) => a + i.quantity, 0);
  const lowStock = inv.filter(i => i.quantity <= i.minQty).length;
  const totalVal = inv.reduce((a, i) => a + i.quantity * i.price, 0);
  sumCard.innerHTML = `
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-blue)">${inv.length}</div><div class="stats-sum-lbl">총 품목 수</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-green)">${total}</div><div class="stats-sum-lbl">총 재고 수량</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-red)">${lowStock}</div><div class="stats-sum-lbl">재고 부족 품목</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-orange);font-size:18px">${numFmt(totalVal)}원</div><div class="stats-sum-lbl">재고 총 가치</div></div>`;
  const cats = { 소모품: 0, 비품: 0 };
  inv.forEach(i => { cats[i.category] = (cats[i.category] || 0) + 1; });
  makeChart('chart-main', { type: 'bar', data: { labels: inv.map(i => i.name), datasets: [{ label: '현재 수량', data: inv.map(i => i.quantity), backgroundColor: 'rgba(79,142,247,.7)', borderColor: '#4f8ef7', borderWidth: 1 }, { label: '최소 수량', data: inv.map(i => i.minQty), backgroundColor: 'rgba(248,113,113,.4)', borderColor: '#f87171', borderWidth: 1 }] }, options: chartOptions('재고 수량 현황') });
  makeChart('chart-sub', { type: 'doughnut', data: { labels: ['소모품', '비품'], datasets: [{ data: [cats['소모품'] || 0, cats['비품'] || 0], backgroundColor: ['rgba(79,142,247,.8)', 'rgba(124,92,191,.8)'], borderColor: ['#4f8ef7', '#7c5cbf'], borderWidth: 2 }] }, options: pieOptions('분류별 품목') });
  const analysisBox = document.getElementById('stats-analysis-box');
  if (analysisBox) {
    const topItem = inv.length ? inv.reduce((a, b) => b.quantity > a.quantity ? b : a, inv[0]) : null;
    const bottomItem = inv.length ? inv.reduce((a, b) => b.quantity < a.quantity ? b : a, inv[0]) : null;
    analysisBox.innerHTML = inv.length ? `
      <div class="analysis-item">📊 <strong>총 ${inv.length}개</strong> 품목이 등록되어 있으며, 총 재고 수량은 <strong>${total}개</strong>입니다.</div>
      <div class="analysis-item">⚠️ 재고 부족 품목은 <strong>${lowStock}개</strong>로, 즉시 발주 검토가 필요합니다.</div>
      <div class="analysis-item">📦 재고가 가장 많은 품목은 <strong>${topItem.name}(${topItem.quantity}개)</strong>, 가장 적은 품목은 <strong>${bottomItem.name}(${bottomItem.quantity}개)</strong>입니다.</div>
      <div class="analysis-item">💰 전체 재고 자산 가치는 <strong>${numFmt(totalVal)}원</strong>입니다.</div>
    ` : '<div class="analysis-item">📋 등록된 재고 데이터가 없습니다.</div>';
  }
}

function renderStatsPurchases() {
  const pur = DB.get('purchases');
  const sumCard = document.getElementById('stats-sum-row');
  const total = pur.reduce((a, p) => a + p.amount, 0);
  const approved = pur.filter(p => p.status === '승인' || p.status === '완료').length;
  const pending = pur.filter(p => p.status === '검토중').length;
  sumCard.innerHTML = `
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-blue)">${pur.length}</div><div class="stats-sum-lbl">총 요청 건수</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-green)">${approved}</div><div class="stats-sum-lbl">승인 건수</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-orange)">${pending}</div><div class="stats-sum-lbl">검토 중</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-cyan);font-size:18px">${numFmt(total)}원</div><div class="stats-sum-lbl">총 구매 금액</div></div>`;
  const grouped = {};
  pur.forEach(p => { const k = getPeriodKey(p.requestDate, statsPeriod); grouped[k] = (grouped[k] || 0) + p.amount; });
  const keys = Object.keys(grouped).sort();
  makeChart('chart-main', { type: 'bar', data: { labels: keys, datasets: [{ label: '구매 금액(원)', data: keys.map(k => grouped[k]), backgroundColor: 'rgba(52,211,153,.65)', borderColor: '#34d399', borderWidth: 1 }] }, options: chartOptions('기간별 구매 금액') });
  const statusMap = { 검토중: 0, 승인: 0, 반려: 0, 완료: 0 };
  pur.forEach(p => { statusMap[p.status] = (statusMap[p.status] || 0) + 1; });
  makeChart('chart-sub', { type: 'doughnut', data: { labels: Object.keys(statusMap), datasets: [{ data: Object.values(statusMap), backgroundColor: ['rgba(245,158,11,.8)', 'rgba(52,211,153,.8)', 'rgba(248,113,113,.8)', 'rgba(34,211,238,.8)'], borderWidth: 2 }] }, options: pieOptions('처리상태 분포') });
  const analysisBox = document.getElementById('stats-analysis-box');
  if (analysisBox) {
    const rejected = pur.filter(p => p.status === '반려').length;
    const approvalRate = pur.length ? Math.round((approved / pur.length) * 100) : 0;
    const avgAmount = pur.length ? Math.round(total / pur.length) : 0;
    analysisBox.innerHTML = pur.length ? `
      <div class="analysis-item">📊 총 <strong>${pur.length}건</strong>의 구매 요청 중 <strong>${approved}건 승인</strong>, <strong>${rejected}건 반려</strong>되었습니다.</div>
      <div class="analysis-item">✅ 승인율은 <strong>${approvalRate}%</strong>이며, 건당 평균 구매 금액은 <strong>${numFmt(avgAmount)}원</strong>입니다.</div>
      <div class="analysis-item">⏳ 현재 검토 중인 요청은 <strong>${pending}건</strong>으로 처리가 필요합니다.</div>
      <div class="analysis-item">💰 총 구매 금액은 <strong>${numFmt(total)}원</strong>입니다.</div>
    ` : '<div class="analysis-item">📋 등록된 구매 데이터가 없습니다.</div>';
  }
}

function renderStatsDisposals() {
  const dis = DB.get('disposals');
  const sumCard = document.getElementById('stats-sum-row');
  const done = dis.filter(d => d.status === '완료').length;
  const inProg = dis.filter(d => d.status === '진행중').length;
  const gen = dis.filter(d => d.type === '일반폐기').length;
  const minus = dis.filter(d => d.type === '빼기폐기').length;
  sumCard.innerHTML = `
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-blue)">${dis.length}</div><div class="stats-sum-lbl">총 폐기 건수</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-green)">${done}</div><div class="stats-sum-lbl">완료</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-orange)">${inProg}</div><div class="stats-sum-lbl">진행 중</div></div>
    <div class="stats-sum-card"><div class="stats-sum-val" style="color:var(--accent-purple)">${gen} / ${minus}</div><div class="stats-sum-lbl">일반 / 빼기 폐기</div></div>`;
  const grouped = { 일반폐기: {}, 빼기폐기: {} };
  dis.forEach(d => { const k = getPeriodKey(d.requestDate, statsPeriod); const t = d.type || '일반폐기'; grouped[t][k] = (grouped[t][k] || 0) + 1; });
  const allKeys = [...new Set([...Object.keys(grouped['일반폐기']), ...Object.keys(grouped['빼기폐기'])].sort())];
  makeChart('chart-main', { type: 'bar', data: { labels: allKeys, datasets: [{ label: '일반폐기', data: allKeys.map(k => grouped['일반폐기'][k] || 0), backgroundColor: 'rgba(79,142,247,.7)', borderColor: '#4f8ef7', borderWidth: 1 }, { label: '빼기폐기', data: allKeys.map(k => grouped['빼기폐기'][k] || 0), backgroundColor: 'rgba(245,158,11,.7)', borderColor: '#f59e0b', borderWidth: 1 }] }, options: chartOptions('기간별 폐기 현황') });
  makeChart('chart-sub', { type: 'doughnut', data: { labels: ['일반폐기', '빼기폐기'], datasets: [{ data: [gen, minus], backgroundColor: ['rgba(79,142,247,.8)', 'rgba(245,158,11,.8)'], borderWidth: 2 }] }, options: pieOptions('폐기 유형 분포') });
  const analysisBox = document.getElementById('stats-analysis-box');
  if (analysisBox) {
    const waiting = dis.filter(d => d.status === '대기').length;
    const doneRate = dis.length ? Math.round((done / dis.length) * 100) : 0;
    analysisBox.innerHTML = dis.length ? `
      <div class="analysis-item">📊 총 <strong>${dis.length}건</strong>의 폐기 신청 중 <strong>${done}건 완료</strong>, <strong>${inProg}건 진행 중</strong>입니다.</div>
      <div class="analysis-item">✅ 폐기 완료율은 <strong>${doneRate}%</strong>이며, 대기 중인 건수는 <strong>${waiting}건</strong>입니다.</div>
      <div class="analysis-item">🗑️ 일반폐기 <strong>${gen}건</strong>, 빼기폐기 <strong>${minus}건</strong>으로 구성되어 있습니다.</div>
    ` : '<div class="analysis-item">📋 등록된 폐기 데이터가 없습니다.</div>';
  }
}

function chartOptions(title) {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { labels: { color: '#8b90a7', font: { family: 'Inter', size: 11 } } }, title: { display: !!title, text: title, color: '#e8eaf6', font: { size: 12, weight: 700 } } }, scales: { x: { ticks: { color: '#555870', maxRotation: 45, font: { size: 10 } }, grid: { color: 'rgba(42,45,62,.5)' } }, y: { ticks: { color: '#555870', font: { size: 10 } }, grid: { color: 'rgba(42,45,62,.5)' } } } };
}
function pieOptions(title) {
  return { responsive: true, maintainAspectRatio: false, plugins: { legend: { position: 'bottom', labels: { color: '#8b90a7', font: { family: 'Inter', size: 11 }, padding: 10 } }, title: { display: !!title, text: title, color: '#e8eaf6', font: { size: 12, weight: 700 } } } };
}
function setStatsMod(m) {
  statsMod = m;
  document.querySelectorAll('.stats-mod-tab').forEach(el => el.classList.toggle('active', el.dataset.mod === m));
  renderStats();
}
function setStatsPeriod(p) {
  statsPeriod = p;
  document.querySelectorAll('.time-tab').forEach(el => el.classList.toggle('active', el.dataset.period === p));
  renderStats();
}


// ===== MANAGERS =====
let currentMgrId = localStorage.getItem('biz_cur_mgr') || null;
function getManagers() { return DB.get('managers'); }
function getCurrentMgr() { if (!currentMgrId) return null; return getManagers().find(m => m.id === currentMgrId) || null; }
function setCurrentMgr(id) {
  currentMgrId = id;
  if (id) localStorage.setItem('biz_cur_mgr', id);
  else localStorage.removeItem('biz_cur_mgr');
  updateSidebarMgr();
  document.getElementById('mgr-select-overlay').classList.remove('open');
  if (currentSection === 'notices') renderNotices();
  showToast('매니저가 변경되었습니다.');
}
function clearCurrentMgr() {
  showConfirm('매니저 해제', '현재 매니저 지정을 해제하시겠습니까?', () => {
    currentMgrId = null;
    localStorage.removeItem('biz_cur_mgr');
    updateSidebarMgr();
    showToast('매니저가 해제되었습니다.', 'warning');
    renderNotices();
  });
}
function updateSidebarMgr() {
  const mgr = getCurrentMgr();
  const el = document.getElementById('sidebar-mgr-name');
  if (!el) return;
  el.textContent = mgr ? mgr.name : '매니저 선택';
  const av = document.getElementById('sidebar-mgr-av');
  if (av) av.textContent = mgr ? mgr.name[0] : '?';
}
function openMgrSelectOverlay() {
  const mgrs = getManagers();
  const cur = currentMgrId;
  const list = document.getElementById('mgr-select-list');
  if (!list) return;
  list.innerHTML = mgrs.length ? mgrs.map(m => `
    <div class="mgr-select-item${m.id === cur ? ' selected' : ''}" onclick="setCurrentMgr('${m.id}')">
      <div class="mgr-item-avatar">${m.name[0]}</div>
      <div class="mgr-item-info" style="flex:1">
        <div class="mgr-item-name">${m.name}</div>
        ${m.role === 'leader' ? '<span class="badge badge-purple" style="font-size:10px">👑 리더</span>' : '<span class="badge badge-gray" style="font-size:10px">👤 멤버</span>'}
      </div>
      ${m.id === cur ? '<span style="color:var(--accent-green);font-size:12px">✅ 현재</span>' : ''}
    </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted)">등록된 매니저가 없습니다.<br>공지사항 > 매니저 관리에서 추가하세요.</div>';
  document.getElementById('mgr-select-overlay').classList.add('open');
}
function closeMgrSelectOverlay() { document.getElementById('mgr-select-overlay').classList.remove('open'); }

function openMgrModal() { renderMgrList(); openModal('manager-modal'); }
function renderMgrList() {
  const mgrs = getManagers();
  const el = document.getElementById('mgr-modal-list');
  if (!el) return;
  el.innerHTML = mgrs.length ? mgrs.map(m => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <div class="mgr-item-avatar">${m.name[0]}</div>
      <div style="flex:1">
        <div style="font-weight:600">${m.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">${m.role === 'leader' ? '👑 리더' : '👤 멤버'}</div>
      </div>
      <button class="btn btn-sm ${m.role === 'leader' ? 'btn-warning' : 'btn-secondary'}"
        onclick="toggleMgrRole('${m.id}')" style="font-size:11px;padding:3px 10px">
        ${m.role === 'leader' ? '리더 해제' : '리더 지정'}
      </button>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteMgr('${m.id}')">🗑️</button>
    </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted)">등록된 매니저가 없습니다.</div>';
}
function toggleMgrRole(id) {
  const mgrs = getManagers();
  const i = mgrs.findIndex(m => m.id === id); if (i < 0) return;
  const cycle = ['member', 'leader', 'subleader'];
  const cur = cycle.indexOf(mgrs[i].role || 'member');
  mgrs[i].role = cycle[(cur + 1) % 3];
  DB.set('managers', mgrs);
  const roleLabel = { leader: '👑 리더', subleader: '🥈 서브리더', member: '👤 멤버' };
  showToast(`${mgrs[i].name}님 → ${roleLabel[mgrs[i].role]}로 변경되었습니다.`);
  renderMgrList();
  if (currentSection === 'notices') renderNotices();
}

function addMgr() {
  const input = document.getElementById('new-mgr-name'); if (!input) return;
  const name = input.value.trim();
  if (!name) { showToast('이름을 입력하세요.', 'error'); return; }
  const mgrs = getManagers();
  if (mgrs.find(m => m.name === name)) { showToast('이미 존재하는 이름입니다.', 'error'); return; }
  mgrs.push({ id: DB.genId(), name, role: 'member' });
  DB.set('managers', mgrs);
  input.value = '';
  showToast(`${name} 매니저가 추가되었습니다.`);
  renderMgrList();
}
function deleteMgr(id) {
  showConfirm('삭제', '이 매니저를 삭제하시겠습니까?', () => {
    const mgrs = getManagers().filter(m => m.id !== id);
    DB.set('managers', mgrs);
    if (currentMgrId === id) { currentMgrId = null; localStorage.removeItem('biz_cur_mgr'); updateSidebarMgr(); }
    showToast('삭제되었습니다.', 'warning');
    renderMgrList();
    if (currentSection === 'notices') renderNotices();
  });
}

// ===== NOTICE FILTERS =====
let noticeFilter = '전체', noticeMonthFilter = '';

function setNoticeFilter(f) {
  noticeFilter = f;
  noticeMonthFilter = '';
  document.querySelectorAll('#notice-filters .filter-tab').forEach(el => el.classList.toggle('active', el.dataset.filter === f));
  renderNotices();
}

function setNoticeMonthFilter(m) {
  noticeMonthFilter = noticeMonthFilter === m ? '' : m;
  renderNotices();
}

// ===== NOTICES RENDER =====
function renderNotices() {
  updateSidebarMgr();
  const mgr = getCurrentMgr();
  const mgrs = getManagers();
  const isLeader = mgr && mgr.role === 'leader';
  const isPrivileged = mgr && ['leader', 'subleader'].includes(mgr.role);
  const allNotices = DB.get('notices');

  // 매니저 바
  const bar = document.getElementById('cur-mgr-bar');
  if (bar) {
    if (mgr) {
      bar.innerHTML = `
        <div class="cur-mgr-avatar">${mgr.name[0]}</div>
        <div class="cur-mgr-info">
          <div class="cur-mgr-name">${mgr.name} ${mgr.role === 'leader' ? '<span class="badge badge-purple" style="font-size:10px">👑 리더</span>' : ''}
${mgr.role === 'subleader' ? '<span class="badge badge-blue" style="font-size:10px">🥈 서브리더</span>' : ''}</div>
          <div class="cur-mgr-label">현재 사용자</div>
        </div>
        <button class="btn btn-secondary btn-sm" onclick="openMgrSelectOverlay()">변경</button>
        <button class="btn btn-warning btn-sm" onclick="clearCurrentMgr()">🚪 해제</button>
        <button class="btn btn-secondary btn-sm" onclick="openMgrModal()">⚙ 매니저 관리</button>`;
    } else {
      bar.innerHTML = `
        <div class="cur-mgr-none">👤 매니저를 선택해야 읽음 표시가 가능합니다.</div>
        <button class="btn btn-primary btn-sm" onclick="openMgrSelectOverlay()">매니저 선택</button>
        <button class="btn btn-secondary btn-sm" onclick="openMgrModal()">⚙ 매니저 관리</button>`;
    }
  }

  // 새 공지 버튼 권한 제어
  const addBtn = document.getElementById('notice-add-btn');
  if (addBtn) addBtn.style.display = isLeader ? '' : 'none';

  // 공지사항만 월별 폴더 표시 (항상, 로그인 무관)
  const noticeOnly = allNotices.filter(n => n.category === '공지사항');
  const months = [...new Set(noticeOnly.filter(n => n.completedAt).map(n => n.completedAt.slice(0, 7)))].sort().reverse();
  const monthBar = document.getElementById('notice-month-bar');
  if (monthBar) {
    monthBar.innerHTML = months.length ? `
    <span style="font-size:12px;color:var(--text-muted)">📁</span>
    ${months.map(m => `
      <button class="filter-tab ${noticeMonthFilter === m ? 'active' : ''}"
        style="font-size:11px;padding:3px 10px"
        onclick="setNoticeMonthFilter('${m}')">${m.slice(5)}월</button>
    `).join('')}` : '';
  }



  // 데이터 필터링
  let data = [...allNotices];
  if (noticeFilter !== '전체') data = data.filter(n => n.category === noticeFilter);
  if (noticeMonthFilter) {
    data = data.filter(n => n.category === '공지사항' && n.completedAt && n.completedAt.slice(0, 7) === noticeMonthFilter);
  }

  data = [...data].sort((a, b) => {
    const po = { 긴급: 0, 중요: 1, 일반: 2 };
    const pd = (po[a.priority] || 2) - (po[b.priority] || 2);
    return pd !== 0 ? pd : b.createdAt.localeCompare(a.createdAt);
  });

  document.getElementById('notice-count').textContent = `총 ${data.length}건`;

  const container = document.getElementById('notice-cards');
  if (!container) return;
  container.innerHTML = data.length ? data.map(n => {
    const total = mgrs.length;
    const readCount = ((n.readers || []).filter(r => mgrs.find(m => m.id === r))).length;
    const isRead = mgr && (n.readers || []).includes(mgr.id);
    const badgeCls = readCount === 0 ? 'none' : readCount === total ? '' : 'partial';
    const readerNames = (n.readers || []).map(rid => mgrs.find(m => m.id === rid)?.name).filter(Boolean).join(', ');
    const isCompleted = !!n.completedAt;

    return `<div class="notice-card${isCompleted ? ' notice-completed' : ''}">
      <div class="notice-priority-bar ${n.priority || '일반'}"></div>
      <div class="notice-card-body">
        <div class="notice-card-header">
          <div class="notice-title">
            ${isCompleted ? '<span class="badge badge-green" style="font-size:10px;margin-right:6px">✅ 완료</span>' : ''}
            ${n.title}
          </div>
          <div class="notice-actions">
            ${isLeader ? `
              <button class="btn btn-secondary btn-sm" onclick="openNoticeModal('${n.id}')" data-tooltip="수정">✏️</button>
              <button class="btn btn-danger btn-sm btn-icon" onclick="delNotice('${n.id}')" data-tooltip="삭제">🗑️</button>` : ''}
          </div>
        </div>
        <div class="notice-meta">
          <span>${n.category === '공지사항' ? '📢' : '📌'} ${n.category}</span>
          <span>우선순위: <strong>${n.priority || '일반'}</strong></span>
          <span>작성: ${n.createdBy || '관리자'}</span>
          <span>${n.createdAt}</span>
          ${isCompleted ? `<span style="color:var(--accent-green);font-size:11px">📁 ${n.completedAt.slice(0, 7)} 완료</span>` : ''}
        </div>
        <div class="notice-content">${n.content || '내용 없음'}</div>
        <div class="notice-footer">
          <div class="read-status-wrap">
            <span class="read-count-badge ${badgeCls}">👁 읽음 ${readCount}/${total}명</span>
            ${readerNames ? `<span class="read-names">${readerNames}</span>` : ''}
          </div>
          <div style="display:flex;gap:6px;align-items:center">
  ${n.category === '공지사항' && isPrivileged
        ? isCompleted
          ? `<button class="btn btn-warning btn-sm" onclick="uncompleteNotice('${n.id}')">↩️ 완료 해제</button>`
          : `<button class="btn btn-success btn-sm" onclick="completeNotice('${n.id}')">✅ 완료</button>`
        : ''}
  ${mgr ? `<button class="btn-read${isRead ? ' read-done' : ''}" onclick="toggleRead('${n.id}')">${isRead ? '✅ 읽음' : '📖 읽음 표시'}</button>` : ''}
</div>

        </div>
      </div>
    </div>`;
  }).join('') : '<div style="text-align:center;padding:60px;color:var(--text-muted)">📢 등록된 공지사항이 없습니다.<br>새 공지를 작성해 보세요.</div>';
}

function completeNotice(id) {
  showConfirm('완료 처리', '이 공지사항을 완료 처리하시겠습니까?', () => {
    const notices = DB.get('notices');
    const i = notices.findIndex(n => n.id === id); if (i < 0) return;
    notices[i].completedAt = getTodayKST();
    DB.set('notices', notices);
    showToast(`📁 ${notices[i].completedAt.slice(0, 7)} 폴더에 저장되었습니다.`, 'success');
    renderNotices();
  });
}

function uncompleteNotice(id) {
  showConfirm('완료 해제', '완료 처리를 해제하시겠습니까?', () => {
    const notices = DB.get('notices');
    const i = notices.findIndex(n => n.id === id); if (i < 0) return;
    delete notices[i].completedAt;
    DB.set('notices', notices);
    showToast('완료가 해제되었습니다.', 'warning');
    renderNotices();
  });
}


function toggleRead(noticeId) {
  const mgr = getCurrentMgr();
  if (!mgr) { showToast('먼저 매니저를 선택하세요.', 'error'); openMgrSelectOverlay(); return; }
  const notices = DB.get('notices');
  const idx = notices.findIndex(n => n.id === noticeId); if (idx < 0) return;
  const readers = notices[idx].readers || [];
  if (readers.includes(mgr.id)) {
    notices[idx].readers = readers.filter(r => r !== mgr.id);
    showToast('읽음 취소되었습니다.', 'warning');
  } else {
    notices[idx].readers = [...readers, mgr.id];
    showToast('읽음 표시되었습니다.', 'success');
  }
  DB.set('notices', notices);
  renderNotices();
}

function openNoticeModal(editId = null) {
  const mgr = getCurrentMgr();
  if (!mgr || mgr.role !== 'leader') { showToast('리더만 공지를 등록/수정할 수 있습니다.', 'error'); return; }
  document.getElementById('notice-form').reset();
  document.getElementById('notice-edit-id').value = '';
  document.getElementById('notice-modal-title').textContent = editId ? '공지사항 수정' : '새 공지사항 작성';
  setRTE('rte-notice-content', '');
  if (editId) {
    const n = DB.get('notices').find(x => x.id === editId); if (!n) return;
    document.getElementById('notice-edit-id').value = n.id;
    document.getElementById('notice-title-input').value = n.title;
    document.getElementById('notice-category').value = n.category || '공지사항';
    document.getElementById('notice-priority').value = n.priority || '일반';
    setRTE('rte-notice-content', n.content || '');
  }
  openModal('notice-modal');
}

function saveNotice() {
  const mgr = getCurrentMgr();
  if (!mgr || mgr.role !== 'leader') { showToast('리더만 공지를 등록할 수 있습니다.', 'error'); return; }
  const title = document.getElementById('notice-title-input').value.trim();
  if (!title) { showToast('제목을 입력하세요.', 'error'); return; }
  const editId = document.getElementById('notice-edit-id').value;
  const data = DB.get('notices');
  const now = getTodayKST();
  const item = {
    title,
    category: document.getElementById('notice-category').value,
    priority: document.getElementById('notice-priority').value,
    content: getRTE('rte-notice-content'),
    createdBy: mgr.name,
    createdAt: now,
    readers: []
  };
  if (editId) {
    const i = data.findIndex(x => x.id === editId);
    if (i > -1) { item.readers = data[i].readers || []; item.completedAt = data[i].completedAt || ''; data[i] = { ...data[i], ...item }; }
    showToast('수정되었습니다.');
  } else {
    data.push({ id: DB.genId(), ...item });
    showToast('공지사항이 등록되었습니다.');
  }
  DB.set('notices', data); closeModal('notice-modal'); renderNotices();
}

function delNotice(id) {
  showConfirm('삭제', '이 공지사항을 삭제하시겠습니까?', () => {
    DB.set('notices', DB.get('notices').filter(x => x.id !== id));
    showToast('삭제됨', 'warning'); renderNotices();
  });
}



// ===== MANAGER MODAL =====
function openMgrModal() {
  renderMgrList();
  openModal('manager-modal');
}
function renderMgrList() {
  const mgrs = getManagers();
  const el = document.getElementById('mgr-modal-list');
  if (!el) return;
  const roleLabel = { leader: '👑 리더', subleader: '🥈 서브리더', member: '👤 멤버' };
  el.innerHTML = mgrs.length ? mgrs.map(m => `
    <div style="display:flex;align-items:center;gap:10px;padding:8px 0;border-bottom:1px solid var(--border)">
      <div class="mgr-item-avatar">${m.name[0]}</div>
      <div style="flex:1">
        <div style="font-weight:600">${m.name}</div>
        <div style="font-size:11px;color:var(--text-muted)">${roleLabel[m.role || 'member']}</div>
      </div>
      <select class="form-control" style="width:120px;font-size:12px;padding:4px 8px"
        onchange="setMgrRole('${m.id}', this.value)">
        <option value="member" ${(m.role || 'member') === 'member' ? 'selected' : ''}>👤 멤버</option>
        <option value="subleader" ${m.role === 'subleader' ? 'selected' : ''}>🥈 서브리더</option>
        <option value="leader" ${m.role === 'leader' ? 'selected' : ''}>👑 리더</option>
      </select>
      <button class="btn btn-danger btn-sm btn-icon" onclick="deleteMgr('${m.id}')">🗑️</button>
    </div>`).join('') : '<div style="text-align:center;padding:20px;color:var(--text-muted)">등록된 매니저가 없습니다.</div>';
}

function setMgrRole(id, role) {
  const mgrs = getManagers();
  const i = mgrs.findIndex(m => m.id === id); if (i < 0) return;
  mgrs[i].role = role;
  DB.set('managers', mgrs);
  const roleLabel = { leader: '👑 리더', subleader: '🥈 서브리더', member: '👤 멤버' };
  showToast(`${mgrs[i].name}님 → ${roleLabel[role]}로 변경되었습니다.`);
  renderMgrList();
  if (currentSection === 'notices') renderNotices();
}


function addMgr() {
  const name = document.getElementById('new-mgr-name').value.trim();
  if (!name) { showToast('이름을 입력하세요.', 'error'); return; }
  const mgrs = getManagers();
  if (mgrs.find(m => m.name === name)) { showToast('이미 등록된 이름입니다.', 'error'); return; }
  mgrs.push({ id: DB.genId(), name, role: '매니저' });
  DB.set('managers', mgrs);
  document.getElementById('new-mgr-name').value = '';
  renderMgrList(); showToast(`${name} 매니저가 추가되었습니다.`);
}
function delMgr(id) {
  showConfirm('삭제', '이 매니저를 삭제하시겠습니까?', () => {
    DB.set('managers', getManagers().filter(m => m.id !== id));
    if (currentMgrId === id) { currentMgrId = null; localStorage.removeItem('biz_cur_mgr'); }
    renderMgrList(); showToast('삭제됨', 'warning');
  });
}

// ===== INIT =====
document.addEventListener('DOMContentLoaded', () => {
  seedData();
  // seed initial managers if none
  if (!DB.get('managers').length) {
    DB.set('managers', [
      { id: DB.genId(), name: '김철수', role: '팀장' },
      { id: DB.genId(), name: '이영희', role: '매니저' },
      { id: DB.genId(), name: '박민준', role: '매니저' },
    ]);
  }
  // seed notices if none
  if (!DB.get('notices').length) {
    DB.set('notices', [
      { id: DB.genId(), title: '2025년 안전 수칙 숙지 요청', category: '숙지사항', priority: '긴급', content: '<b>전 직원 필독.</b> 화재 대피 경로 및 소화기 위치를 반드시 숙지하세요.', createdBy: '관리자', createdAt: getTodayKST(), readers: [] },
      { id: DB.genId(), title: '3월 정기 회의 안내', category: '공지사항', priority: '중요', content: '3월 25일(화) 오전 10시 대회의실에서 분기 정기 회의가 진행됩니다. 전 팀장 필참.', createdBy: '관리자', createdAt: getTodayKST(), readers: [] },
    ]);
  }
  document.querySelectorAll('.nav-item').forEach(el => el.addEventListener('click', () => navigate(el.dataset.section)));
  document.getElementById('confirm-ok').addEventListener('click', () => { if (confirmCb) confirmCb(); closeConfirm(); });
  document.getElementById('confirm-cancel').addEventListener('click', closeConfirm);
  document.getElementById('inv-search').addEventListener('input', e => { invSearch = e.target.value; renderInventory(); });
  document.querySelectorAll('#inv-cat-filters .filter-tab').forEach(el => el.addEventListener('click', () => {
    invCat = el.dataset.cat;
    document.querySelectorAll('#inv-cat-filters .filter-tab').forEach(t => t.classList.remove('active'));
    el.classList.add('active'); renderInventory();
  }));
  document.getElementById('lightbox-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeLightbox(); });
  document.getElementById('mgr-select-overlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeMgrSelectOverlay(); });
  document.getElementById('topbar-date').textContent = new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
  initRTE('#project-modal');
  initRTE('#notice-modal');
  // Sort button initial text
  const sb = document.getElementById('sort-btn');
  if (sb) sb.textContent = '📅 날짜 정렬';
  checkAutoTransition();
  updateSidebarMgr();
  navigate('dashboard');
});
// ===== RENTALS =====
const RENTAL_ITEMS = ['청소기', '스티머', '어댑터', '물걸레밀대', '선풍기', '이불', '베개', '직접입력'];
let rentalFilter = '전체';

function saveStock(item, val) {
  const stocks = JSON.parse(localStorage.getItem('rental_stocks') || '{}');
  stocks[item] = parseInt(val) || 0;
  localStorage.setItem('rental_stocks', JSON.stringify(stocks));
}

function loadStocks() {
  const stocks = JSON.parse(localStorage.getItem('rental_stocks') || '{}');
  ['청소기', '물걸레밀대', '스티머'].forEach(item => {
    const el = document.getElementById('stock-' + item);
    if (el && stocks[item] !== undefined) el.value = stocks[item];
  });
}

function rentalBadge(status, checkoutDate) {
  const today = getTodayKST();
  if (status === '대여중' && checkoutDate && checkoutDate < today) status = '연체';
  const map = { '대기': 'badge-yellow', '대여중': 'badge-blue', '반납완료': 'badge-green', '연체': 'badge-red', '취소': 'badge-gray' };
  return `<span class="badge ${map[status] || 'badge-gray'}">${status}</span>`;
}

function autoCheckRentalOverdue() {
  const today = getTodayKST();
  const data = DB.get('rentals');
  let changed = false;
  data.forEach(r => {
    if (r.status === '대여중' && r.checkoutDate && r.checkoutDate < today) {
      r.status = '연체'; changed = true;
    }
  });
  if (changed) DB.set('rentals', data);
}

function renderRentals() {
  autoCheckRentalOverdue();
  loadStocks();
  let data = DB.get('rentals');
  if (rentalFilter !== '전체') data = data.filter(r => r.status === rentalFilter);
  data = [...data].sort((a, b) => (b.rentalDate || '').localeCompare(a.rentalDate || ''));
  document.getElementById('rental-count').textContent = `총 ${data.length}건`;


  // 상태별 카운트
  const all = DB.get('rentals');
  const counts = { 대기: 0, 대여중: 0, 반납완료: 0, 연체: 0, 취소: 0 };
  all.forEach(r => { if (counts[r.status] !== undefined) counts[r.status]++; });
  document.getElementById('rental-stat-bar').innerHTML = `
    <span class="rental-stat-item">🟡 대기 <strong>${counts['대기']}</strong></span>
    <span class="rental-stat-item">🔵 대여중 <strong>${counts['대여중']}</strong></span>
    <span class="rental-stat-item">✅ 반납완료 <strong>${counts['반납완료']}</strong></span>
    <span class="rental-stat-item" style="color:var(--accent-red)">🔴 연체 <strong>${counts['연체']}</strong></span>
    <span class="rental-stat-item">❌ 취소 <strong>${counts['취소']}</strong></span>
  `;

  const tbody = document.getElementById('rental-tbody');
  tbody.innerHTML = data.length ? data.map(r => `
    <tr data-id="${r.id}">
      <td>${rentalBadge(r.status, r.checkoutDate)}</td>
      <td>${r.itemNo || '-'}</td>
      <td>${r.renter}</td>
      <td><strong>${r.itemName}</strong>${r.customItem ? `<br><span style="font-size:11px;color:var(--text-muted)">${r.customItem}</span>` : ''}</td>
      <td>${r.rentalDate}</td>
      <td>${r.checkoutDate || '-'}</td>
      <td>${r.returnDate || '-'}</td>
      <td>${r.note || '-'}</td>
      <td class="action-cell">
        <div style="display:flex;gap:5px">
          ${r.status === '대기' ? `<button class="btn btn-primary btn-sm" onclick="approveRental('${r.id}')" data-tooltip="대여승인">✅</button>` : ''}
          ${r.status === '대여중' || r.status === '연체' ? `<button class="btn btn-success btn-sm" onclick="returnRental('${r.id}')" data-tooltip="반납처리">↩️</button>` : ''}
          ${r.status === '대여중' ? `<button class="btn btn-warning btn-sm" onclick="extendRental('${r.id}')" data-tooltip="연장">📅</button>` : ''}
          <button class="btn btn-secondary btn-sm" onclick="openRentalModal('${r.id}')" data-tooltip="수정">✏️</button>
          <button class="btn btn-danger btn-sm btn-icon" onclick="delRental('${r.id}')" data-tooltip="삭제">🗑️</button>
        </div>
      </td>
    </tr>`).join('') : `<tr class="empty-row"><td colspan="9">📦 대여 이력이 없습니다.</td></tr>`;
}


function setRentalFilter(f) {
  rentalFilter = f;
  document.querySelectorAll('#rental-filters .filter-tab').forEach(el => el.classList.toggle('active', el.dataset.filter === f));
  renderRentals();
}

function toggleCustomItem() {
  const sel = document.getElementById('rental-item-select').value;
  const wrap = document.getElementById('rental-custom-wrap');
  if (wrap) wrap.style.display = sel === '직접입력' ? '' : 'none';
}

function openRentalModal(editId = null) {
  document.getElementById('rental-form').reset();
  document.getElementById('rental-edit-id').value = '';
  document.getElementById('rental-modal-title').textContent = editId ? '대여 수정' : '대여 신청';
  toggleCustomItem();
  if (editId) {
    const r = DB.get('rentals').find(x => x.id === editId); if (!r) return;
    document.getElementById('rental-edit-id').value = r.id;
    document.getElementById('rental-item-select').value = r.itemName;
    if (r.itemName === '직접입력') {
      document.getElementById('rental-custom-item').value = r.customItem || '';
    }
    document.getElementById('rental-item-no').value = r.itemNo || '';
    document.getElementById('rental-qty').value = r.qty || 1;
    document.getElementById('rental-renter').value = r.renter || '';
    document.getElementById('rental-date').value = r.rentalDate || '';
    document.getElementById('rental-checkout').value = r.checkoutDate || '';
    document.getElementById('rental-status').value = r.status || '대기';
    document.getElementById('rental-note').value = r.note || '';
    toggleCustomItem();
  } else {
    document.getElementById('rental-date').value = getTodayKST();
    document.getElementById('rental-status').value = '대기';
  }
  openModal('rental-modal');
}

function saveRental() {
  const itemSelect = document.getElementById('rental-item-select').value;
  const customItem = document.getElementById('rental-custom-item')?.value.trim();
  if (!itemSelect) { showToast('대여 물품을 선택하세요.', 'error'); return; }
  if (itemSelect === '직접입력' && !customItem) { showToast('물품명을 직접 입력하세요.', 'error'); return; }
  const renter = document.getElementById('rental-renter').value.trim();
  if (!renter) { showToast('대여자를 입력하세요.', 'error'); return; }
  const editId = document.getElementById('rental-edit-id').value;
  const data = DB.get('rentals');
  const item = {
    itemName: itemSelect,
    customItem: itemSelect === '직접입력' ? customItem : '',
    itemNo: document.getElementById('rental-item-no').value.trim(),
    qty: +document.getElementById('rental-qty').value || 1,
    renter,
    rentalDate: document.getElementById('rental-date').value || getTodayKST(),
    checkoutDate: document.getElementById('rental-checkout').value || '',
    status: document.getElementById('rental-status').value || '대기',
    note: document.getElementById('rental-note').value.trim()
  };
  if (editId) {
    const i = data.findIndex(x => x.id === editId);
    if (i > -1) data[i] = { ...data[i], ...item };
    showToast('수정되었습니다.');
  } else {
    data.push({ id: DB.genId(), ...item });
    showToast('대여 신청이 등록되었습니다.');
  }
  DB.set('rentals', data); closeModal('rental-modal'); renderRentals();
}

function approveRental(id) {
  showConfirm('대여 승인', '대여를 승인하시겠습니까?', () => {
    const data = DB.get('rentals'); const i = data.findIndex(x => x.id === id);
    if (i > -1) data[i].status = '대여중';
    DB.set('rentals', data); showToast('대여 승인되었습니다.', 'success'); renderRentals();
  });
}

function returnRental(id) {
  showConfirm('반납 처리', '반납 처리하시겠습니까?', () => {
    const data = DB.get('rentals'); const i = data.findIndex(x => x.id === id);
    if (i > -1) { data[i].status = '반납완료'; data[i].returnedDate = getTodayKST(); }
    DB.set('rentals', data); showToast('반납 처리되었습니다.', 'success'); renderRentals();
  });
}

function extendRental(id) {
  const r = DB.get('rentals').find(x => x.id === id); if (!r) return;
  const v = prompt(`현재 체크아웃 날짜: ${r.checkoutDate}\n새 체크아웃 날짜 입력 (YYYY-MM-DD):`, r.checkoutDate);
  if (!v) return;
  const data = DB.get('rentals'); const i = data.findIndex(x => x.id === id);
  if (i > -1) data[i].checkoutDate = v;
  DB.set('rentals', data); showToast(`체크아웃 날짜가 ${v}로 연장되었습니다.`); renderRentals();
}

function delRental(id) {
  showConfirm('삭제', '이 대여 신청을 삭제하시겠습니까?', () => {
    DB.set('rentals', DB.get('rentals').filter(x => x.id !== id));
    showToast('삭제되었습니다.', 'warning'); renderRentals();
  });
}

