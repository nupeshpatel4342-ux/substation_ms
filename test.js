
// ===================================================================
//  CONSTANTS — Checklists
// ===================================================================
const MNT_CHECKLISTS = {
    'Transformer': [
        'Oil Level Checked (Main Tank & OLTC)',
        'Silica Gel Condition Checked',
        'Oil Leakages Checked',
        'Bushing Condition Checked',
        'Cooling Fans Tested',
        'Buchholz Relay Checked',
        'OTI/WTI Temperatures Recorded',
        'PRV Checked'
    ],
    '11 KV Feeder': [
        'VCB Operations (Open/Close) Checked',
        'Vacuum Interrupter Cleaned',
        'Relay Testing & Calibration',
        'Control Wiring Tightened',
        'Mechanism Lubricated',
        'Spring Charge Motor Checked',
        'Cable Terminations Inspected'
    ],
    '66 KV Line': [
        'Insulator Strings Inspected',
        'Conductor Jumpers Checked',
        'Tower Foundation Inspected',
        'Right of Way Cleared',
        'Earthing Resistance Measured',
        'Vibration Dampers Checked'
    ],
    'Circuit Breaker': [
        'SF6 Gas Pressure Checked',
        'Mechanism Lubrication',
        'Control Circuit Connections Checked',
        'Timing Test Completed',
        'Contact Resistance Measured',
        'Pole Discrepancy Relay Checked'
    ]
};

// ===================================================================
//  CONSTANTS — Feeder Roles
// ===================================================================
const ROLES = {
    '66kv_incoming':  { label: '66 KV Incoming Line',       color: '#1565c0' },
    '66kv_outgoing':  { label: '66 KV Outgoing Line',       color: '#0d47a1' },
    'tr_hv':          { label: 'Transformer HV Side',       color: '#6a1b9a' },
    'tr_lv':          { label: 'Transformer LV Side',       color: '#7b1fa2' },
    '11kv_feeder':    { label: '11 KV Feeder',              color: '#2e7d32' },
    'solar_import':   { label: 'Solar Import',              color: '#f57f17' },
    'solar_export':   { label: 'Solar Export',              color: '#ff8f00' },
    'station_aux':    { label: 'Station Auxiliary',          color: '#00897b' },
    'info_only':      { label: 'Info Only (No Calculation)', color: '#78909c' }
};

// Which roles contribute to which totals
const FEEDER_TOTAL_ROLES = ['11kv_feeder', 'solar_export', 'station_aux'];
const RECEIVED_ROLES     = ['66kv_incoming', 'solar_import'];
const SENT_ROLES         = ['66kv_outgoing']; // + feederTotal

// ===================================================================
//  HALVAD-3 SAMPLE DATA
// ===================================================================
const HALVAD3_SAMPLE = {
    id: 'halvad3',
    name: '66 K.V. HALVAD-3 S/S',
    isSample: true,
    feeders: [
        { id:'f1',  name:'66 K.V. MANSAR-HALVAD-3 LINE (I)',         mf:2,   role:'66kv_incoming' },
        { id:'f2',  name:'66 K.V. MANSAR-HALVAD-3 LINE (E)',         mf:2,   role:'66kv_outgoing' },
        { id:'f3',  name:'66K.V. HALVAD-3-GHANSHYAMGADH LINE(E)',    mf:2,   role:'66kv_outgoing' },
        { id:'f4',  name:'66K.V. HALVAD-3-GHANSHYAMGADH LINE(I)',    mf:2,   role:'66kv_incoming' },
        { id:'f5',  name:'66 K.V. TR-1 H.V-1',                      mf:3,   role:'tr_hv' },
        { id:'f6',  name:'66 K.V. TR-1 H.V-2',                      mf:1.5, role:'tr_hv' },
        { id:'f7',  name:'11 K.V. MAIN-1 L.V.-1',                   mf:2,   role:'tr_lv' },
        { id:'f8',  name:'11 K.V. MAIN-2 L.V.-2',                   mf:2,   role:'tr_lv' },
        { id:'f9',  name:'11 K.V. DERIYARI (AG)',                    mf:2,   role:'11kv_feeder' },
        { id:'f10', name:'11 K.V. SANDIPANI (URB)',                  mf:2,   role:'11kv_feeder' },
        { id:'f11', name:'11 K.V. SHINE (IND)',                      mf:2,   role:'11kv_feeder' },
        { id:'f12', name:'11 K.V. ASTHA (IND)',                      mf:2,   role:'11kv_feeder' },
        { id:'f13', name:'11 K.V. RANJITGADH (AG)',                  mf:2,   role:'11kv_feeder' },
        { id:'f14', name:'11 K.V. VANVAGDO (IND)',                   mf:2,   role:'11kv_feeder' },
        { id:'f15', name:'11 K.V. CHETAN (JGY)',                     mf:2,   role:'11kv_feeder' },
        { id:'f16', name:'11 K.V. SHINE SOLAR INPORT',               mf:6,   role:'solar_import' },
        { id:'f17', name:'11 K.V. SHINE SOLAR EXPORT',               mf:6,   role:'solar_export' },
        { id:'f18', name:'11 K.V. STATION',                          mf:1,   role:'station_aux' },
        { id:'f19', name:'11 K.V. LT PANEL 1',                       mf:1,   role:'info_only' },
        { id:'f20', name:'11 K.V. LT PANEL 2',                       mf:1,   role:'info_only' }
    ],
    transformers: [
        { id:'tr1', name:'TR-1', hvFeederId:'f5', lvFeederId:'f7' },
        { id:'tr2', name:'TR-2', hvFeederId:'f6', lvFeederId:'f8' }
    ],
    oppositeSSEntries: [
        { id:'o1', name:'MANSAR SS END (E)',         linkedFeederId:'f1' },
        { id:'o2', name:'MANSAR SS END (I)',         linkedFeederId:'f2' },
        { id:'o3', name:'GHANSHYAMGADH SS END (E)',  linkedFeederId:'f4' },
        { id:'o4', name:'GHANSHYAMGADH SS END (I)',  linkedFeederId:'f3' }
    ],
    reports: {}
};

// ===================================================================
//  DATA MANAGEMENT — LocalStorage
// ===================================================================
const STORAGE_KEY = '66kv_substations';

function loadSubstations() {
    let data = localStorage.getItem(STORAGE_KEY);
    if (!data) {
        // First load: seed with Halvad-3 sample
        let initial = [JSON.parse(JSON.stringify(HALVAD3_SAMPLE))];
        saveSubstations(initial);
        return initial;
    }
    return JSON.parse(data);
}

function saveSubstations(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function getSubstation(id) {
    return loadSubstations().find(s => s.id === id);
}

function generateId() {
    return 'ss_' + Date.now() + '_' + Math.random().toString(36).substr(2,5);
}

// ===================================================================
//  STATE
// ===================================================================
let currentView = 'dashboard';
let editingSSId = null;      // null = creating new
let reportSSId = null;       // which SS is open in report view
let currentDashboardSSId = null; // which SS is open in SS dashboard

// ===================================================================
//  NAVIGATION
// ===================================================================
function navigateTo(view, ssId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    currentView = view;

    const headerBack = document.getElementById('headerBack');

    if (view === 'dashboard') {
        document.getElementById('dashboardView').classList.add('active');
        headerBack.style.display = 'none';
        document.getElementById('headerTitle').textContent = '⚡ 66 KV SUBSTATION REPORT';
        document.getElementById('headerSubtitle').textContent = 'Monthly Report App';
        renderDashboard();
    } else if (view === 'setup') {
        document.getElementById('setupView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('dashboard');
        editingSSId = ssId || null;
        if (editingSSId) {
            let ss = getSubstation(editingSSId);
            document.getElementById('headerTitle').textContent = '✏️ Edit Substation';
            document.getElementById('headerSubtitle').textContent = ss.name;
        } else {
            document.getElementById('headerTitle').textContent = '➕ New Substation';
            document.getElementById('headerSubtitle').textContent = 'Create a new substation';
        }
        renderSetupForm();
    } else if (view === 'ssDashboard') {
        document.getElementById('ssDashboardView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('dashboard');
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🏠 ' + ss.name;
        document.getElementById('headerSubtitle').textContent = 'Substation Dashboard';
    } else if (view === 'eventTimeline') {
        document.getElementById('eventTimelineView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        document.getElementById('headerTitle').textContent = '🕒 Event Timeline';
        let now = new Date();
        document.getElementById('timelineMonthFilter').value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
        renderEventTimeline();
    } else if (view === 'report') {
        document.getElementById('reportView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        reportSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📊 ' + ss.name;
        document.getElementById('headerSubtitle').textContent = 'Monthly Report';
        renderReportPage();
    } else if (view === 'photoReport') {
        document.getElementById('photoReportView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📷 Photo Report';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderPhotoReport();
    } else if (view === 'faultRegister') {
        document.getElementById('faultRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🚨 Fault Register';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderFaultRegister();
    } else if (view === 'trippingRegister') {
        document.getElementById('trippingRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '⚡ Tripping Calculations';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('tripMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderTrippingRegister();
    } else if (view === 'breakdownRegister') {
        document.getElementById('breakdownRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🛠️ Breakdown Reports';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('bdMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderBreakdownRegister();
    } else if (view === 'maintenanceRegister') {
        document.getElementById('maintenanceRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🛠️ Maintenance Register';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('mntMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderMaintenanceRegister();
    }

    window.scrollTo(0, 0);
}

// ===================================================================
//  DASHBOARD RENDERING
// ===================================================================
function renderDashboard() {
    const grid = document.getElementById('ssCardGrid');
    const subs = loadSubstations();

    let html = '';
    subs.forEach(ss => {
        const feeders = ss.feeders || [];
        const trCount = ss.transformers ? ss.transformers.length : 0;
        const reportCount = ss.reports ? Object.keys(ss.reports).length : 0;
        const sampleBadge = ss.isSample ? '<span class="badge-sample">SAMPLE</span>' : '';

        // Helper to count unique physical lines (combining Import/Export pairs)
        function getUniqueCount(list, rolesFilter) {
            const active = list.filter(f => {
                if (f.role === 'info_only') return false;
                if (rolesFilter) return rolesFilter.includes(f.role);
                return true;
            });
            const uniqueNames = new Set(active.map(f => {
                return f.name
                    .replace(/\(I\)/i, '')
                    .replace(/\(E\)/i, '')
                    .replace(/IMPORT/i, '')
                    .replace(/EXPORT/i, '')
                    .replace(/INPORT/i, '')
                    .replace(/\s+/g, ' ')
                    .trim();
            }));
            return uniqueNames.size;
        }

        // Category-wise counts of unique physical lines
        const cnt66kv = getUniqueCount(feeders, ['66kv_incoming', '66kv_outgoing']);
        const cntTR   = (ss.transformers ? ss.transformers.length : 0);
        const cntTrLV = getUniqueCount(feeders, ['tr_lv']);
        const cnt11kv = getUniqueCount(feeders, ['11kv_feeder', 'solar_import', 'solar_export', 'station_aux']);
        const feederTotal = getUniqueCount(feeders);

        html += `
        <div class="ss-card">
            <div class="card-name">${ss.name} ${sampleBadge}</div>
            <div class="card-meta" style="flex-direction:column; gap:6px;">
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <span style="color:#0d47a1;">🔌 ${cnt66kv} 66KV Line</span>
                    <span style="color:#7b1fa2;">⚡ ${cntTR} TR</span>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <span style="color:#e65100;">🔋 ${cntTrLV} 11KV Incoming</span>
                    <span style="color:#2e7d32;">📡 ${cnt11kv} 11KV Feeder</span>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap; padding-top:6px; border-top:1px solid #e0e0e0; margin-top:2px;">
                    <span style="font-weight:700; color:#1a1a2e;">⏲️ Total Meter: ${feederTotal}</span>
                    <span>📊 ${reportCount} Reports</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-report" onclick="event.stopPropagation(); navigateTo('report','${ss.id}')">📊 Report</button>
                <button class="btn-edit" onclick="event.stopPropagation(); navigateTo('setup','${ss.id}')">✏️ Edit</button>
                <button class="btn-delete-card" onclick="event.stopPropagation(); deleteSSFromDashboard('${ss.id}')">🗑️</button>
            </div>
            <button class="btn-manage-ss" onclick="event.stopPropagation(); navigateTo('ssDashboard','${ss.id}')">
                <span class="material-icons-round">dashboard</span>
                Manage Substation
            </button>
        </div>`;
    });

    html += `
    <div class="new-ss-card" onclick="navigateTo('setup')">
        <div class="plus-icon">+</div>
        <div class="plus-text">New Substation</div>
    </div>`;

    grid.innerHTML = html;
}

function deleteSSFromDashboard(id) {
    let ss = getSubstation(id);
    if (!confirm(`Delete "${ss.name}"? This cannot be undone.`)) return;
    let subs = loadSubstations().filter(s => s.id !== id);
    saveSubstations(subs);
    renderDashboard();
    showToast('Substation deleted');
}

// ===================================================================
//  SETUP FORM RENDERING
// ===================================================================
let setupFeeders = [];
let setupTransformers = [];
let setupOpposites = [];

function renderSetupForm() {
    if (editingSSId) {
        let ss = getSubstation(editingSSId);
        document.getElementById('setupName').value = ss.name;
        setupFeeders = JSON.parse(JSON.stringify(ss.feeders || []));
        setupTransformers = JSON.parse(JSON.stringify(ss.transformers || []));
        setupOpposites = JSON.parse(JSON.stringify(ss.oppositeSSEntries || []));
        document.getElementById('btnDeleteSS').style.display = 'block';
    } else {
        document.getElementById('setupName').value = '';
        setupFeeders = [];
        setupTransformers = [];
        setupOpposites = [];
        document.getElementById('btnDeleteSS').style.display = 'none';
    }
    renderFeederList();
    renderTransformerList();
    renderOppositeList();
}

// ---- Feeders ----
const SETUP_CATEGORIES = [
    { key: 'cat_66kv', label: '66 KV Incoming / Outgoing Line', icon: '🔌', cssClass: 'cat-66kv', roles: ['66kv_incoming', '66kv_outgoing'], defaultRole: '66kv_incoming' },
    { key: 'cat_trhv', label: '66 KV Transformer HV Side',      icon: '⚡', cssClass: 'cat-trhv', roles: ['tr_hv'], defaultRole: 'tr_hv' },
    { key: 'cat_trlv', label: '11 KV Incoming Line LV Side',    icon: '🔋', cssClass: 'cat-trlv', roles: ['tr_lv'], defaultRole: 'tr_lv' },
    { key: 'cat_11kv', label: '11 KV Feeder',                   icon: '📡', cssClass: 'cat-11kv', roles: ['11kv_feeder', 'solar_import', 'solar_export', 'station_aux', 'info_only'], defaultRole: '11kv_feeder' }
];

function renderFeederList() {
    const container = document.getElementById('feederCategorySetup');
    let allHtml = '';

    SETUP_CATEGORIES.forEach(cat => {
        let catFeeders = [];
        setupFeeders.forEach((f, i) => {
            if (cat.roles.includes(f.role)) catFeeders.push({ feeder: f, index: i });
        });

        // Build the allowed role options for this category
        let roleOpts = cat.roles.map(r => ROLES[r]).length;

        let itemsHtml = '';
        catFeeders.forEach(({ feeder: f, index: i }) => {
            let opts = cat.roles.map(r =>
                `<option value="${r}" ${f.role===r?'selected':''}>${ROLES[r].label}</option>`
            ).join('');
            itemsHtml += `
            <div class="list-item list-item-4col">
                <div>
                    <label class="form-label">Feeder Name</label>
                    <input type="text" class="form-input" value="${f.name}" onchange="setupFeeders[${i}].name=this.value" placeholder="Feeder name">
                </div>
                <div>
                    <label class="form-label">M.F.</label>
                    <input type="number" class="form-input" value="${f.mf}" step="0.1" onchange="setupFeeders[${i}].mf=parseFloat(this.value)||1" placeholder="M.F.">
                </div>
                <div>
                    <label class="form-label">Role</label>
                    <select class="form-select" onchange="setupFeeders[${i}].role=this.value; renderFeederList();">${opts}</select>
                </div>
                <button class="btn-remove" onclick="setupFeeders.splice(${i},1); renderFeederList(); renderTransformerList(); renderOppositeList();">✕</button>
            </div>`;
        });

        allHtml += `
        <div class="report-card" style="margin-bottom:16px;">
            <div class="report-card-header ${cat.cssClass}">${cat.icon} ${cat.label} <span style="margin-left:auto; font-size:12px; opacity:0.8;">(${catFeeders.length})</span></div>
            <div style="padding:12px;">
                ${catFeeders.length === 0 ? '<div style="text-align:center; padding:16px; color:#999; font-size:13px;">No feeders in this category</div>' : itemsHtml}
                <button class="btn btn-add" style="margin-top:8px;" onclick="addFeederRow('${cat.defaultRole}')">+ Add ${cat.label}</button>
            </div>
        </div>`;
    });

    container.innerHTML = allHtml;
}

function addFeederRow(defaultRole) {
    let role = defaultRole || '11kv_feeder';
    let newId = 'f' + Date.now() + Math.random().toString(36).substr(2,3);
    setupFeeders.push({ id: newId, name: '', mf: 2, role: role });
    renderFeederList();
    renderTransformerList();
    renderOppositeList();
}

// ---- Transformers ----
function renderTransformerList() {
    const container = document.getElementById('transformerList');
    if (setupTransformers.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">🔌</div><p>No transformers yet.</p></div>';
        return;
    }
    // Build feeder options for HV/LV selects (only show tr_hv for HV, tr_lv for LV)
    let hvFeeders = setupFeeders.filter(f => f.role === 'tr_hv');
    let lvFeeders = setupFeeders.filter(f => f.role === 'tr_lv');

    let html = '';
    setupTransformers.forEach((tr, i) => {
        let hvOpts = '<option value="">-- Select HV --</option>' +
            hvFeeders.map(f => `<option value="${f.id}" ${tr.hvFeederId===f.id?'selected':''}>${f.name || '(unnamed)'}</option>`).join('');
        let lvOpts = '<option value="">-- Select LV --</option>' +
            lvFeeders.map(f => `<option value="${f.id}" ${tr.lvFeederId===f.id?'selected':''}>${f.name || '(unnamed)'}</option>`).join('');

        html += `
        <div class="list-item list-item-tr">
            <div>
                <label class="form-label">Name</label>
                <input type="text" class="form-input" value="${tr.name}" onchange="setupTransformers[${i}].name=this.value" placeholder="e.g. TR-1">
            </div>
            <div>
                <label class="form-label">HV Feeder</label>
                <select class="form-select" onchange="setupTransformers[${i}].hvFeederId=this.value">${hvOpts}</select>
            </div>
            <div>
                <label class="form-label">LV Feeder</label>
                <select class="form-select" onchange="setupTransformers[${i}].lvFeederId=this.value">${lvOpts}</select>
            </div>
            <button class="btn-remove" onclick="setupTransformers.splice(${i},1); renderTransformerList();">✕</button>
        </div>`;
    });
    container.innerHTML = html;
}

function addTransformerRow() {
    let newId = 'tr' + Date.now();
    setupTransformers.push({ id: newId, name: '', hvFeederId: '', lvFeederId: '' });
    renderTransformerList();
}

// ---- Opposite SS ----
function renderOppositeList() {
    const container = document.getElementById('oppositeList');
    if (setupOpposites.length === 0) {
        container.innerHTML = '<div class="empty-state"><div class="empty-icon">📡</div><p>No opposite SS entries yet.</p></div>';
        return;
    }
    let lineFeeders = setupFeeders.filter(f => f.role === '66kv_incoming' || f.role === '66kv_outgoing');

    let html = '';
    setupOpposites.forEach((o, i) => {
        let fOpts = '<option value="">-- Select Linked Feeder --</option>' +
            lineFeeders.map(f => `<option value="${f.id}" ${o.linkedFeederId===f.id?'selected':''}>${f.name || '(unnamed)'}</option>`).join('');

        html += `
        <div class="list-item list-item-opp">
            <div>
                <label class="form-label">SS Name</label>
                <input type="text" class="form-input" value="${o.name}" onchange="setupOpposites[${i}].name=this.value" placeholder="e.g. MANSAR SS END (E)">
            </div>
            <div>
                <label class="form-label">Linked Feeder</label>
                <select class="form-select" onchange="setupOpposites[${i}].linkedFeederId=this.value">${fOpts}</select>
            </div>
            <button class="btn-remove" onclick="setupOpposites.splice(${i},1); renderOppositeList();">✕</button>
        </div>`;
    });
    container.innerHTML = html;
}

function addOppositeRow() {
    let newId = 'o' + Date.now();
    setupOpposites.push({ id: newId, name: '', linkedFeederId: '' });
    renderOppositeList();
}

// ---- Save / Delete Substation ----
function saveSubstation() {
    let name = document.getElementById('setupName').value.trim();
    if (!name) { showToast('⚠️ Please enter substation name'); return; }
    if (setupFeeders.length === 0) { showToast('⚠️ Add at least one feeder'); return; }

    let subs = loadSubstations();

    if (editingSSId) {
        let idx = subs.findIndex(s => s.id === editingSSId);
        if (idx >= 0) {
            subs[idx].name = name;
            subs[idx].feeders = setupFeeders;
            subs[idx].transformers = setupTransformers;
            subs[idx].oppositeSSEntries = setupOpposites;
        }
    } else {
        subs.push({
            id: generateId(),
            name: name,
            isSample: false,
            feeders: setupFeeders,
            transformers: setupTransformers,
            oppositeSSEntries: setupOpposites,
            reports: {}
        });
    }

    saveSubstations(subs);
    showToast('✅ Substation saved!');
    navigateTo('dashboard');
}

function deleteSubstation() {
    if (!editingSSId) return;
    let ss = getSubstation(editingSSId);
    if (!confirm(`Delete "${ss.name}"? This cannot be undone.`)) return;
    let subs = loadSubstations().filter(s => s.id !== editingSSId);
    saveSubstations(subs);
    showToast('Substation deleted');
    navigateTo('dashboard');
}

// ===================================================================
//  REPORT PAGE RENDERING
// ===================================================================
function renderReportPage() {
    let ss = getSubstation(reportSSId);
    if (!ss) { navigateTo('dashboard'); return; }

    // Set default month
    const now = new Date();
    const months = ['JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC'];
    document.getElementById('reportMonth').value = months[now.getMonth()] + '-' + now.getFullYear();

    // ===== CATEGORY-WISE FEEDER TABLES =====
    const CATEGORIES = [
        { key: 'cat_66kv',  label: '66 KV Incoming / Outgoing Line',  icon: '🔌', cssClass: 'cat-66kv',  roles: ['66kv_incoming', '66kv_outgoing'] },
        { key: 'cat_trhv',  label: '66 KV Transformer HV Side',       icon: '⚡', cssClass: 'cat-trhv',  roles: ['tr_hv'] },
        { key: 'cat_trlv',  label: '11 KV Incoming Line LV Side',     icon: '🔋', cssClass: 'cat-trlv',  roles: ['tr_lv'] },
        { key: 'cat_11kv',  label: '11 KV Feeder',                    icon: '📡', cssClass: 'cat-11kv',  roles: ['11kv_feeder', 'solar_import', 'solar_export', 'station_aux', 'info_only'] }
    ];

    const container = document.getElementById('feederCategoryContainer');
    let allHtml = '';

    CATEGORIES.forEach(cat => {
        let catFeeders = ss.feeders.filter(f => cat.roles.includes(f.role));
        if (catFeeders.length === 0) return;

        let rowsHtml = '';
        catFeeders.forEach(f => {
            rowsHtml += `
            <tr>
                <td class="td-name" data-label="FEEDER"><strong>${f.name}</strong></td>
                <td data-label="Reading 24:00"><input type="number" id="r24_${f.id}" oninput="liveCalc()"></td>
                <td data-label="Reading 00:00"><input type="number" id="r00_${f.id}" oninput="liveCalc()"></td>
                <td data-label="Difference" class="td-calc" id="diff_${f.id}">0</td>
                <td data-label="M.F." class="td-mf">${f.mf}</td>
                <td data-label="Total Units" class="td-calc" id="units_${f.id}">0</td>
            </tr>`;
        });

        allHtml += `
        <div class="report-card">
            <div class="report-card-header ${cat.cssClass}">${cat.icon} ${cat.label}</div>
            <table class="mobile-stack">
                <thead>
                    <tr>
                        <th>Name of Feeder</th>
                        <th>Reading 24:00</th>
                        <th>Reading 00:00</th>
                        <th>Difference</th>
                        <th>M.F.</th>
                        <th>Total Units</th>
                    </tr>
                </thead>
                <tbody>${rowsHtml}</tbody>
            </table>
        </div>`;
    });

    container.innerHTML = allHtml;

    // Build opposite SS inputs
    let oppCard = document.getElementById('oppositeCard');
    let oppDiv = document.getElementById('oppositeInputs');
    if (ss.oppositeSSEntries && ss.oppositeSSEntries.length > 0) {
        oppCard.style.display = 'block';
        let oppHtml = '';
        ss.oppositeSSEntries.forEach(o => {
            oppHtml += `
            <div class="summary-row">
                <span class="summary-label">${o.name}</span>
                <input type="number" class="green-input" id="opp_${o.id}" style="width:140px; padding:10px; border:2px solid #a5d6a7; border-radius:8px; font-size:15px; font-weight:700; font-family:'Inter',sans-serif;" oninput="liveCalc()">
            </div>`;
        });
        oppDiv.innerHTML = oppHtml;
    } else {
        oppCard.style.display = 'none';
    }

    // Hide results initially
    document.getElementById('totalsCard').style.display = 'none';
    document.getElementById('lossCard').style.display = 'none';
    document.getElementById('pdfBtnGroup').style.display = 'none';

    // Load saved report data if exists
    let month = document.getElementById('reportMonth').value;
    if (ss.reports && ss.reports[month]) {
        loadReportData(ss.reports[month]);
    } else {
        if(typeof renderReportStatus === 'function') renderReportStatus('Draft');
    }
}

function loadReportData(report) {
    if (!report || !report.readings) {
        if(typeof renderReportStatus === 'function') renderReportStatus('Draft');
        return;
    }
    Object.entries(report.readings).forEach(([key, val]) => {
        let el = document.getElementById(key);
        if (el) el.value = val;
    });
    if (report.oppositeReadings) {
        Object.entries(report.oppositeReadings).forEach(([key, val]) => {
            let el = document.getElementById(key);
            if (el) el.value = val;
        });
    }
    if(typeof renderReportStatus === 'function') renderReportStatus(report.status);
    liveCalc();
}

// ===================================================================
//  CALCULATION ENGINE (Generalized from Halvad-3)
// ===================================================================
function getVal(id) {
    let el = document.getElementById(id);
    if (!el) return 0;
    let val = parseFloat(el.value);
    return isNaN(val) ? 0 : val;
}

function fmt(val) {
    if (isNaN(val) || !isFinite(val)) return '-';
    return parseFloat(val.toFixed(2));
}

function fmtPercent(val) {
    if (isNaN(val) || !isFinite(val)) return '- %';
    return val.toFixed(2) + ' %';
}

function liveCalc() {
    let ss = getSubstation(reportSSId);
    if (!ss) return;

    let fData = {};
    ss.feeders.forEach(f => {
        let r24 = getVal('r24_' + f.id);
        let r00 = getVal('r00_' + f.id);
        let diff = (r24 > 0 || r00 > 0) ? (r24 - r00) : 0;
        let units = diff * f.mf;

        let diffEl = document.getElementById('diff_' + f.id);
        let unitsEl = document.getElementById('units_' + f.id);
        if (diffEl) diffEl.textContent = fmt(diff);
        if (unitsEl) unitsEl.textContent = fmt(units);

        fData[f.id] = units;
    });
}

function calculateReport() {
    let ss = getSubstation(reportSSId);
    if (!ss) return;

    // 1) Calculate all feeder units
    let fData = {};
    ss.feeders.forEach(f => {
        let r24 = getVal('r24_' + f.id);
        let r00 = getVal('r00_' + f.id);
        let diff = (r24 > 0 || r00 > 0) ? (r24 - r00) : 0;
        let units = diff * f.mf;

        let diffEl = document.getElementById('diff_' + f.id);
        let unitsEl = document.getElementById('units_' + f.id);
        if (diffEl) diffEl.textContent = fmt(diff);
        if (unitsEl) unitsEl.textContent = fmt(units);

        fData[f.id] = units;
    });

    // 2) Feeder Total
    let feederTotal = 0;
    ss.feeders.forEach(f => {
        if (FEEDER_TOTAL_ROLES.includes(f.role)) feederTotal += (fData[f.id] || 0);
    });

    // 3) Total Received
    let totalReceived = 0;
    ss.feeders.forEach(f => {
        if (RECEIVED_ROLES.includes(f.role)) totalReceived += (fData[f.id] || 0);
    });

    // 4) Total Sent
    let totalSent = feederTotal;
    ss.feeders.forEach(f => {
        if (SENT_ROLES.includes(f.role)) totalSent += (fData[f.id] || 0);
    });

    // 5) S/S Loss
    let ssLoss = totalReceived !== 0 ? ((totalReceived - totalSent) / totalReceived) * 100 : 0;

    // 6) Transformer Losses
    let trLosses = [];
    if (ss.transformers) {
        ss.transformers.forEach(tr => {
            let hvUnits = fData[tr.hvFeederId] || 0;
            let lvUnits = fData[tr.lvFeederId] || 0;
            let loss = hvUnits !== 0 ? ((hvUnits - lvUnits) / hvUnits) * 100 : 0;
            trLosses.push({ name: tr.name + ' LOSS', value: loss });
        });
    }

    // 7) Line Loss (from Opposite SS entries)
    let lineLosses = [];
    if (ss.oppositeSSEntries) {
        ss.oppositeSSEntries.forEach(o => {
            let oppVal = getVal('opp_' + o.id);
            let feeder = ss.feeders.find(f => f.id === o.linkedFeederId);
            if (!feeder) return;
            let feederUnits = fData[feeder.id] || 0;

            let loss = 0;
            if (feeder.role === '66kv_incoming') {
                // Power comes FROM opposite SS TO this SS
                loss = oppVal > 0 ? ((oppVal - feederUnits) / oppVal) * 100 : 0;
            } else if (feeder.role === '66kv_outgoing') {
                // Power goes FROM this SS TO opposite SS
                loss = feederUnits > 0 ? ((feederUnits - oppVal) / feederUnits) * 100 : 0;
            }
            lineLosses.push(loss);
        });
    }
    let avgLineLoss = lineLosses.length > 0 ? lineLosses.reduce((a,b) => a+b, 0) / lineLosses.length : 0;

    // 8) 66 KV Bus Loss
    let kv66_in = 0;
    let kv66_out = 0;
    ss.feeders.forEach(f => {
        if (f.role === '66kv_incoming') kv66_in += (fData[f.id] || 0);
        if (f.role === '66kv_outgoing') kv66_out += (fData[f.id] || 0);
        if (f.role === 'tr_hv') kv66_out += (fData[f.id] || 0);
    });
    let bus66Loss = kv66_in !== 0 ? ((kv66_in - kv66_out) / kv66_in) * 100 : 0;

    // 9) 11 KV Bus Loss
    let kv11_in = 0;
    ss.feeders.forEach(f => {
        if (f.role === 'tr_lv') kv11_in += (fData[f.id] || 0);
        if (f.role === 'solar_import') kv11_in += (fData[f.id] || 0);
    });
    let bus11Loss = kv11_in !== 0 ? ((kv11_in - feederTotal) / kv11_in) * 100 : 0;

    // ===== RENDER TOTALS =====
    let totalsCard = document.getElementById('totalsCard');
    totalsCard.style.display = 'block';
    document.getElementById('totalsBody').innerHTML = `
        <div class="summary-row"><span class="summary-label">FEEDER TOTAL</span><span class="summary-value">${fmt(feederTotal)}</span></div>
        <div class="summary-row"><span class="summary-label">TOTAL RECEIVED</span><span class="summary-value">${fmt(totalReceived)}</span></div>
        <div class="summary-row"><span class="summary-label">TOTAL SENT</span><span class="summary-value">${fmt(totalSent)}</span></div>
    `;

    // ===== RENDER LOSSES =====
    let lossCard = document.getElementById('lossCard');
    lossCard.style.display = 'block';
    let lossHtml = `
        <div class="summary-row"><span class="summary-label">S/S LOSS</span><span class="summary-value loss ${ssLoss < 3 ? 'good' : ''}">${fmtPercent(ssLoss)}</span></div>
    `;
    trLosses.forEach(tl => {
        lossHtml += `<div class="summary-row"><span class="summary-label">${tl.name}</span><span class="summary-value loss ${tl.value < 3 ? 'good' : ''}">${fmtPercent(tl.value)}</span></div>`;
    });
    lossHtml += `
        <div class="summary-row"><span class="summary-label">LINE LOSS</span><span class="summary-value loss ${avgLineLoss < 3 ? 'good' : ''}">${fmtPercent(avgLineLoss)}</span></div>
        <div class="summary-row"><span class="summary-label">66 K.V. BUS LOSS</span><span class="summary-value loss ${bus66Loss < 3 ? 'good' : ''}">${fmtPercent(bus66Loss)}</span></div>
        <div class="summary-row"><span class="summary-label">11 K.V. BUS LOSS</span><span class="summary-value loss ${bus11Loss < 3 ? 'good' : ''}">${fmtPercent(bus11Loss)}</span></div>
    `;
    document.getElementById('lossBody').innerHTML = lossHtml;

    // Show PDF button
    document.getElementById('pdfBtnGroup').style.display = 'flex';

    // Save report data
    saveData(true);

    showToast('✅ Report Generated!');

    // Scroll to results
    totalsCard.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function saveData(isExplicit = false) {
    let ss = getSubstation(reportSSId);
    if (!ss) return;

    let month = document.getElementById('reportMonth').value;
    let readings = {};
    let oppositeReadings = {};

    ss.feeders.forEach(f => {
        let r24 = document.getElementById('r24_' + f.id);
        let r00 = document.getElementById('r00_' + f.id);
        if (r24 && r24.value) readings['r24_' + f.id] = r24.value;
        if (r00 && r00.value) readings['r00_' + f.id] = r00.value;
    });

    if (ss.oppositeSSEntries) {
        ss.oppositeSSEntries.forEach(o => {
            let el = document.getElementById('opp_' + o.id);
            if (el && el.value) oppositeReadings['opp_' + o.id] = el.value;
        });
    }

    let subs = loadSubstations();
    let idx = subs.findIndex(s => s.id === reportSSId);
    if (idx >= 0) {
        if (!subs[idx].reports) subs[idx].reports = {};
        let existingStatus = subs[idx].reports[month] ? subs[idx].reports[month].status : 'Draft';
        subs[idx].reports[month] = {
            month: month,
            readings: readings,
            oppositeReadings: oppositeReadings,
            status: existingStatus,
            generatedAt: new Date().toISOString()
        };
        saveSubstations(subs);
        
        let updatedSS = subs[idx];
        if (isExplicit) {
            EventEngine.dispatch(reportSSId, 'Monthly Report', 'Saved', `Saved report for ${month}`);
        }
    }
}

function submitReport() { updateReportStatus('Submitted'); }
function approveReport() { updateReportStatus('Approved'); }
function rejectReport() { updateReportStatus('Rejected'); }
function toggleLockReport() { 
    let ss = getSubstation(reportSSId);
    let month = document.getElementById('reportMonth').value;
    let r = (ss.reports && ss.reports[month]) || {};
    let current = r.status || 'Draft';
    if(current === 'Locked') {
        updateReportStatus('Draft', 'Report Unlocked');
    } else {
        updateReportStatus('Locked', 'Report Locked');
    }
}

function updateReportStatus(newStatus, actionName = null) {
    let ss = getSubstation(reportSSId);
    if (!ss) return;
    let month = document.getElementById('reportMonth').value;
    if (!ss.reports) ss.reports = {};
    if (!ss.reports[month]) ss.reports[month] = { month: month, readings: {}, oppositeReadings: {}, status: 'Draft', generatedAt: new Date().toISOString() };
    
    ss.reports[month].status = newStatus;
    saveSS(ss);
    
    let act = actionName || `Status Updated`;
    EventEngine.dispatch(reportSSId, 'Monthly Report', act, `Status set to ${newStatus} for ${month}`);
    
    saveData(false);
    renderReportStatus(newStatus);
    showToast(`Report status updated to ${newStatus}`);
}

function renderReportStatus(status) {
    let badge = document.getElementById('reportStatusBadge');
    if(!badge) return;
    badge.textContent = status || 'Draft';
    badge.className = 'status-badge';
    if (status === 'Submitted') badge.classList.add('stat-progress');
    else if (status === 'Approved') badge.classList.add('stat-resolved');
    else if (status === 'Rejected') badge.classList.add('sev-critical');
    else if (status === 'Locked') badge.classList.add('stat-closed');
    else badge.classList.add('stat-pending'); // Draft
}

function exportData() {
    let ss = getSubstation(reportSSId);
    if(ss) {
        let month = document.getElementById('reportMonth').value;
        EventEngine.dispatch(reportSSId, 'Monthly Report', 'Exported', `Exported data for ${month}`);
        showToast('Exported to Excel (Simulated)');
    }
}

function renderEventTimeline() {
    let ss = getSubstation(currentDashboardSSId);
    if(!ss) return;
    let events = ss.timelineEvents || [];
    
    let monthFilter = document.getElementById('timelineMonthFilter').value;
    let actionFilter = document.getElementById('timelineActionFilter').value;
    
    let filterMY = '';
    if (monthFilter) {
        let parts = monthFilter.split('-');
        filterMY = parts[1] + '-' + parts[0];
    }
    
    let filtered = events.filter(e => {
        let matchM = filterMY ? e.month === filterMY : true;
        let matchA = actionFilter ? e.module === actionFilter : true;
        return matchM && matchA;
    });
    
    filtered.sort((a,b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    
    let tbody = document.getElementById('timelineTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        document.getElementById('timelineEmptyState').style.display = 'block';
        document.querySelector('#eventTimelineView .fault-table-container').style.display = 'none';
    } else {
        document.getElementById('timelineEmptyState').style.display = 'none';
        document.querySelector('#eventTimelineView .fault-table-container').style.display = 'block';
        
        filtered.forEach(e => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div style="font-weight:600; color:var(--text);">${e.date}</div>
                    <div style="font-size:11px; color:var(--text-secondary);">${e.time}</div>
                </td>
                <td><span style="font-weight:600;">${e.operator}</span></td>
                <td><span class="status-badge" style="background:#f1f5f9; color:#475569;">${e.role}</span></td>
                <td><span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark);">${e.module || 'System'}</span></td>
                <td><span style="font-weight:600; color:var(--primary);">${e.action}</span></td>
                <td><span style="font-size:12px;">${e.remarks || '-'}</span></td>
            `;
            tbody.appendChild(tr);
        });
    }
}

function resetReport() {
    if (!confirm('Clear all data for this report?')) return;
    let ss = getSubstation(reportSSId);
    if (!ss) return;

    ss.feeders.forEach(f => {
        let r24 = document.getElementById('r24_' + f.id);
        let r00 = document.getElementById('r00_' + f.id);
        if (r24) r24.value = '';
        if (r00) r00.value = '';
        let diff = document.getElementById('diff_' + f.id);
        let units = document.getElementById('units_' + f.id);
        if (diff) diff.textContent = '0';
        if (units) units.textContent = '0';
    });

    if (ss.oppositeSSEntries) {
        ss.oppositeSSEntries.forEach(o => {
            let el = document.getElementById('opp_' + o.id);
            if (el) el.value = '';
        });
    }

    document.getElementById('totalsCard').style.display = 'none';
    document.getElementById('lossCard').style.display = 'none';
    document.getElementById('pdfBtnGroup').style.display = 'none';

    showToast('Data cleared');
}

// ===================================================================
//  PDF EXPORT
// ===================================================================
function exportPDF() {
    let ss = getSubstation(reportSSId);
    let month = document.getElementById('reportMonth').value;

    // Create a temporary visible container for PDF generation
    let pdfContainer = document.createElement('div');
    pdfContainer.id = 'pdfTempContainer';
    pdfContainer.style.background = '#ffffff';
    pdfContainer.style.color = '#333333';
    pdfContainer.style.padding = '20px';
    pdfContainer.style.width = '100%';
    pdfContainer.style.boxSizing = 'border-box';
    
    // Inject original report styles
    let styles = `
        <style>
            #pdfTempContainer {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                padding: 20px;
                background-color: #ffffff;
            }
            #pdfTempContainer h2 {
                text-align: center;
                color: #1a73e8;
                margin-top: 0;
                margin-bottom: 5px;
                font-size: 22px;
                font-weight: 700;
            }
            #pdfTempContainer .month-label {
                text-align: center;
                color: #d93025;
                font-weight: bold;
                font-size: 16px;
                margin-bottom: 20px;
                text-transform: uppercase;
            }
            #pdfTempContainer table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
                font-size: 13px;
                background-color: #ffffff;
                page-break-inside: auto;
            }
            #pdfTempContainer tr {
                page-break-inside: avoid;
                page-break-after: auto;
            }
            #pdfTempContainer thead {
                display: table-header-group;
            }
            #pdfTempContainer th, #pdfTempContainer td {
                border: 1px solid #dcdcdc;
                padding: 6px;
                text-align: left;
                vertical-align: middle;
            }
            #pdfTempContainer th {
                background-color: #1a73e8;
                color: white;
                font-weight: bold;
                text-transform: uppercase;
            }
            #pdfTempContainer input[type="number"] {
                width: 100%;
                padding: 6px;
                box-sizing: border-box;
                border: 1px solid #babbbd;
                border-radius: 4px;
                font-size: 13px;
                font-weight: bold;
                color: #333;
                text-align: center;
                background-color: #ffffff;
            }
            #pdfTempContainer .readonly {
                font-weight: bold;
                color: #333;
                text-align: center;
            }
            #pdfTempContainer .green-input {
                background-color: #92D050 !important;
                font-weight: bold;
                border: 1px solid #75a840 !important;
                color: #000;
                border-radius: 4px;
                text-align: center;
                padding: 6px;
                width: 100%;
                box-sizing: border-box;
            }
            #pdfTempContainer .section-title {
                margin-top: 25px;
                background-color: #34a853;
                color: white;
                padding: 8px 12px;
                border-radius: 6px;
                font-size: 15px;
                font-weight: bold;
                text-transform: uppercase;
                page-break-inside: avoid;
                break-inside: avoid;
                page-break-after: avoid;
                break-after: avoid;
            }
            #pdfTempContainer .highlight-table th {
                background-color: #5f6368;
                color: white;
            }
            #pdfTempContainer .total-row {
                background-color: #fff3cd;
                font-weight: bold;
            }
        </style>
    `;

    // 1) Build Feeder rows
    let feederRows = '';
    ss.feeders.forEach(f => {
        let r24_val = document.getElementById('r24_' + f.id).value || '';
        let r00_val = document.getElementById('r00_' + f.id).value || '';
        let diff_val = document.getElementById('diff_' + f.id).innerText || '0';
        let units_val = document.getElementById('units_' + f.id).innerText || '0';

        feederRows += `
            <tr>
                <td><strong>${f.name}</strong></td>
                <td><input type="number" value="${r24_val}" disabled style="-webkit-print-color-adjust: exact;"></td>
                <td><input type="number" value="${r00_val}" disabled style="-webkit-print-color-adjust: exact;"></td>
                <td class="readonly">${diff_val}</td>
                <td class="readonly" style="text-align:center;">${f.mf}</td>
                <td class="readonly">${units_val}</td>
            </tr>
        `;
    });

    // 2) Fetch Totals values
    let totalsBody = document.getElementById('totalsBody');
    let totalsRows = '';
    if (totalsBody) {
        let items = totalsBody.querySelectorAll('.summary-row');
        items.forEach(item => {
            let label = item.querySelector('.summary-label').innerText;
            let val = item.querySelector('.summary-value').innerText;
            totalsRows += `
                <tr class="total-row" style="-webkit-print-color-adjust: exact; background-color: #fff3cd;">
                    <td width="60%">${label}</td>
                    <td class="readonly">${val}</td>
                </tr>
            `;
        });
    }

    // 3) Fetch Opposite SS values
    let oppositeRows = '';
    if (ss.oppositeSSEntries) {
        ss.oppositeSSEntries.forEach(o => {
            let val = document.getElementById('opp_' + o.id).value || '';
            oppositeRows += `
                <tr>
                    <td width="60%"><strong>${o.name}</strong></td>
                    <td><input type="number" class="green-input" value="${val}" disabled style="-webkit-print-color-adjust: exact;"></td>
                </tr>
            `;
        });
    }

    // 4) Fetch Loss Calculations
    let lossRows = '';
    let lossBody = document.getElementById('lossBody');
    if (lossBody) {
        let items = lossBody.querySelectorAll('.summary-row');
        items.forEach(item => {
            let label = item.querySelector('.summary-label').innerText;
            let val = item.querySelector('.summary-value').innerText;
            lossRows += `
                <tr>
                    <td><strong>${label}</strong></td>
                    <td class="readonly">${val}</td>
                </tr>
            `;
        });
    }

    // Combine everything
    pdfContainer.innerHTML = `
        ${styles}
        <h2>${ss.name} - MONTHLY REPORT</h2>
        <div class="month-label">MONTH : ${month}</div>
        
        <table>
            <thead>
                <tr>
                    <th>NAME OF FEEDER</th>
                    <th>METER READING 24:00</th>
                    <th>METER READING 00:00</th>
                    <th>DIFFERENCE</th>
                    <th>M.F.</th>
                    <th>TOTAL UNITS</th>
                </tr>
            </thead>
            <tbody>
                ${feederRows}
            </tbody>
        </table>
        
        <div class="section-title" style="-webkit-print-color-adjust: exact; background-color: #34a853;">TOTALS</div>
        <table>
            <tbody>
                ${totalsRows}
            </tbody>
        </table>
        
        ${oppositeRows ? `
            <div class="section-title" style="-webkit-print-color-adjust: exact; background-color: #34a853;">OPPOSITE SS END UNITS (For Line Loss)</div>
            <table>
                <tbody>
                    ${oppositeRows}
                </tbody>
            </table>
        ` : ''}
        
        <div class="section-title" style="-webkit-print-color-adjust: exact; background-color: #34a853;">LOSS CALCULATION</div>
        <table class="highlight-table">
            <thead>
                <tr style="-webkit-print-color-adjust: exact; background-color: #5f6368;">
                    <th>LOSS TYPE</th>
                    <th>PERCENTAGE (%)</th>
                </tr>
            </thead>
            <tbody>
                ${lossRows}
            </tbody>
        </table>
    `;

    // Hide main app views temporarily
    let appHeader = document.getElementById('appHeader');
    let content = document.querySelector('.content');
    
    appHeader.style.display = 'none';
    content.style.display = 'none';

    document.body.appendChild(pdfContainer);

    // Optimized margins (top: 10mm, left/right: 13mm, bottom: 15mm) to maximize space utilization
    let opt = {
        margin: [0.4, 0.5, 0.6, 0.5],
        filename: ss.name.replace(/\s+/g, '_') + '_' + month + '.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 3, useCORS: true, scrollY: 0, logging: false },
        jsPDF: { unit: 'in', format: 'a4', orientation: 'portrait' },
        pagebreak: { mode: ['css'] }
    };

    showToast('⏳ Generating PDF...');

    // Small delay to ensure browser layout engine settles on the newly appended container
    setTimeout(() => {
        html2pdf().set(opt).from(pdfContainer).toPdf().get('pdf').then(function (pdf) {
            var totalPages = pdf.internal.getNumberOfPages();
            for (var i = 1; i <= totalPages; i++) {
                pdf.setPage(i);
                pdf.setFontSize(8);
                pdf.setTextColor(120);
                
                var pageWidth = pdf.internal.pageSize.getWidth();
                var pageHeight = pdf.internal.pageSize.getHeight();
                
                // Draw a light grey separator line for the footer just above the bottom margin
                pdf.setLineWidth(0.005);
                pdf.setDrawColor(220);
                pdf.line(0.5, pageHeight - 0.45, pageWidth - 0.5, pageHeight - 0.45);
                
                // Footer details
                var footerTextLeft = ss.name + " - MONTHLY REPORT (" + month + ")";
                var footerTextRight = "Page " + i + " of " + totalPages;
                
                pdf.text(footerTextLeft, 0.5, pageHeight - 0.3);
                pdf.text(footerTextRight, pageWidth - 0.5, pageHeight - 0.3, { align: 'right' });
            }
        }).save().then(() => {
            // Restore main view
            document.body.removeChild(pdfContainer);
            appHeader.style.display = '';
            content.style.display = '';
            showToast('📄 PDF downloaded!');
        }).catch(err => {
            console.error(err);
            document.body.removeChild(pdfContainer);
            appHeader.style.display = '';
            content.style.display = '';
            showToast('❌ PDF Generation Failed');
        });
    }, 150);
}

// ===================================================================
//  TOAST NOTIFICATION
// ===================================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===================================================================
//  INIT
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    renderDashboard();
});

// ===== NAVBAR - Page Navigation =====
function setActiveMenu(page) {
    // Update nav menu active states
    document.querySelectorAll('.nav-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.drawer-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    // Show/hide page sections
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const pageMap = {
        'dashboard': 'pageDashboard',
        'substations': 'pageSubstations',
        'reports': 'pageReports',
        'notifications': 'pageNotifications',
        'settings': 'pageSettings'
    };
    const targetId = pageMap[page];
    if (targetId) {
        document.getElementById(targetId).classList.add('active');
        document.getElementById(targetId).style.display = 'block';
    }
    // Hide other sections
    Object.values(pageMap).forEach(id => {
        if (id !== targetId) {
            document.getElementById(id).style.display = 'none';
        }
    });
    // If switching to substations, refresh the dashboard
    if (page === 'substations') {
        navigateTo('dashboard');
    }
    window.scrollTo(0, 0);
}

function setActiveDrawer(page) {
    setActiveMenu(page);
    closeDrawer();
}

// ===== Hamburger / Drawer =====
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');
const drawerCloseBtn = document.getElementById('drawerClose');

function openDrawer() {
    drawer.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    drawer.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openDrawer);
drawerCloseBtn.addEventListener('click', closeDrawer);
navOverlay.addEventListener('click', closeDrawer);

// ===== Profile Dropdown =====
const profileBtn = document.getElementById('navProfile');
const profileDropdown = document.getElementById('profileDropdown');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileBtn.classList.toggle('open');
    profileDropdown.classList.toggle('show');
    notifPanel.classList.remove('show');
});

// ===== Notification Panel =====
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const notifBadge = document.getElementById('notifBadge');

notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPanel.classList.toggle('show');
    profileDropdown.classList.remove('show');
    profileBtn.classList.remove('open');
});

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelectorAll('.notif-dot').forEach(dot => {
        dot.style.display = 'none';
    });
    notifBadge.style.display = 'none';
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target)) {
        profileDropdown.classList.remove('show');
        profileBtn.classList.remove('open');
    }
    if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
        notifPanel.classList.remove('show');
    }
});

// Sticky nav shadow on scroll
const topNav = document.getElementById('topNav');
window.addEventListener('scroll', () => {
    topNav.classList.toggle('scrolled', window.scrollY > 4);
});

// ===================================================================
//  FAULT REGISTER LOGIC
// ===================================================================
function saveSS(ss) {
    let subs = loadSubstations();
    let idx = subs.findIndex(s => s.id === ss.id);
    if (idx > -1) {
        subs[idx] = ss;
        saveSubstations(subs);
    }
}

const EventEngine = {
    dispatch: function(ssId, moduleName, actionName, remarks = '') {
        let subs = loadSubstations();
        let ss = subs.find(s => s.id === ssId);
        if (!ss) return;
        if (!ss.timelineEvents) ss.timelineEvents = [];
        
        let now = new Date();
        let monthYear = `${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
        
        let userOperator = (typeof currentUser !== 'undefined' && currentUser && currentUser.name) ? currentUser.name : 'System Operator';
        let userRole = (typeof currentUser !== 'undefined' && currentUser && currentUser.role) ? currentUser.role : 'Admin';

        ss.timelineEvents.push({
            id: 'EVT-' + Date.now() + '-' + Math.floor(Math.random()*1000),
            date: now.toISOString().split('T')[0],
            time: now.toTimeString().split(' ')[0].substring(0, 5),
            month: monthYear,
            year: now.getFullYear().toString(),
            operator: userOperator,
            role: userRole,
            module: moduleName,
            action: actionName,
            remarks: remarks
        });
        saveSS(ss);
    }
};

function renderFaultRegister() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.faults) { ss.faults = []; }
    
    let search = document.getElementById('faultSearch').value.toLowerCase();
    let filter = document.getElementById('faultFilterStatus').value;
    
    let faults = ss.faults.filter(f => {
        let matchesSearch = (f.id && f.id.toLowerCase().includes(search)) || 
                            (f.equipment_name && f.equipment_name.toLowerCase().includes(search)) ||
                            (f.description && f.description.toLowerCase().includes(search));
        let matchesFilter = filter ? (f.status === filter) : true;
        return matchesSearch && matchesFilter;
    });

    faults.sort((a, b) => new Date(b.date) - new Date(a.date));

    let total = ss.faults.length;
    let pending = ss.faults.filter(f => ['Pending', 'Under Investigation', 'In Progress'].includes(f.status)).length;
    let resolved = ss.faults.filter(f => ['Resolved', 'Closed'].includes(f.status)).length;
    let critical = ss.faults.filter(f => f.severity === 'Critical').length;
    
    let thisMonthCount = ss.faults.filter(f => {
        let d = new Date(f.date);
        let now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length;

    document.getElementById('faultSummaryGrid').innerHTML = `
        <div class="fault-summary-card">
            <div class="title">Total Faults</div>
            <div class="value">${total}</div>
        </div>
        <div class="fault-summary-card pending">
            <div class="title">Open / Pending</div>
            <div class="value">${pending}</div>
        </div>
        <div class="fault-summary-card resolved">
            <div class="title">Resolved</div>
            <div class="value">${resolved}</div>
        </div>
        <div class="fault-summary-card critical">
            <div class="title">Critical</div>
            <div class="value">${critical}</div>
        </div>
        <div class="fault-summary-card">
            <div class="title">This Month</div>
            <div class="value">${thisMonthCount}</div>
        </div>
    `;

    let sevCounts = { Low: 0, Medium: 0, High: 0, Critical: 0 };
    ss.faults.forEach(f => { if(sevCounts[f.severity] !== undefined) sevCounts[f.severity]++; });
    let maxSev = Math.max(1, ...Object.values(sevCounts));
    
    let eqCounts = {};
    ss.faults.forEach(f => { eqCounts[f.category] = (eqCounts[f.category] || 0) + 1; });
    let sortedEq = Object.entries(eqCounts).sort((a,b)=>b[1]-a[1]).slice(0,4);
    let maxEq = Math.max(1, ...(sortedEq.map(e=>e[1])));

    document.getElementById('faultAnalyticsGrid').innerHTML = `
        <div class="analytics-card">
            <h3>Severity Breakdown</h3>
            ${Object.keys(sevCounts).map(sev => `
                <div class="bar-chart-row">
                    <div class="bar-chart-label">${sev}</div>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill" style="width: ${(sevCounts[sev]/maxSev)*100}%; background: ${sev==='Critical'?'#c62828':sev==='High'?'#c2185b':sev==='Medium'?'#e65100':'#1565c0'};"></div>
                    </div>
                    <div class="bar-chart-val">${sevCounts[sev]}</div>
                </div>
            `).join('')}
        </div>
        <div class="analytics-card">
            <h3>Top Faulty Equipment</h3>
            ${sortedEq.length === 0 ? '<p style="color:var(--text-secondary);font-size:12px;">No data</p>' : sortedEq.map(([cat, count]) => `
                <div class="bar-chart-row">
                    <div class="bar-chart-label">${cat}</div>
                    <div class="bar-chart-track">
                        <div class="bar-chart-fill" style="width: ${(count/maxEq)*100}%;"></div>
                    </div>
                    <div class="bar-chart-val">${count}</div>
                </div>
            `).join('')}
        </div>
    `;

    let tbody = document.getElementById('faultTableBody');
    tbody.innerHTML = '';
    
    if (faults.length === 0) {
        tbody.innerHTML = `<tr><td colspan="6" style="text-align:center; padding: 24px; color:var(--text-secondary);">No faults found.</td></tr>`;
        return;
    }

    faults.forEach(f => {
        let tr = document.createElement('tr');
        tr.onclick = () => openFaultForm(f.id);
        
        let sevBadge = 'sev-' + f.severity.toLowerCase();
        
        let statClass = 'stat-pending';
        if (f.status === 'Under Investigation') statClass = 'stat-investigating';
        else if (f.status === 'In Progress') statClass = 'stat-progress';
        else if (f.status === 'Resolved') statClass = 'stat-resolved';
        else if (f.status === 'Closed') statClass = 'stat-closed';

        tr.innerHTML = `
            <td>
                <div style="font-weight:700; color:var(--primary); font-size:12px;">${f.id}</div>
                <div style="font-size:11px; color:var(--text-secondary);">${f.date} ${f.time||''}</div>
            </td>
            <td>
                <div style="font-weight:600; font-size:13px;">${f.equipment_name || 'N/A'}</div>
                <div style="font-size:11px; color:var(--text-secondary);">${f.category} (${f.voltage})</div>
            </td>
            <td>
                <div style="font-size:13px; font-weight:500;">${f.type}</div>
                <div style="font-size:11px; color:var(--text-secondary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${f.description||''}</div>
            </td>
            <td><span class="status-badge ${sevBadge}">${f.severity}</span></td>
            <td><span class="status-badge ${statClass}">${f.status}</span></td>
            <td style="font-weight:600;">${f.downtime ? f.downtime + ' hrs' : '-'}</td>
        `;
        tbody.appendChild(tr);
    });
}

function openFaultForm(faultId = null) {
    document.getElementById('faultDashboardSection').style.display = 'none';
    document.getElementById('faultFormSection').style.display = 'block';
    
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.faults) ss.faults = [];
    
    if (faultId) {
        let f = ss.faults.find(x => x.id === faultId);
        document.getElementById('f_id').value = f.id;
        document.getElementById('f_date').value = f.date || '';
        document.getElementById('f_time').value = f.time || '';
        document.getElementById('f_voltage').value = f.voltage || '66KV';
        document.getElementById('f_category').value = f.category || 'Transformer';
        document.getElementById('f_equipment_name').value = f.equipment_name || '';
        
        document.getElementById('f_type').value = f.type || 'Transient';
        document.getElementById('f_severity').value = f.severity || 'Low';
        document.getElementById('f_description').value = f.description || '';
        document.getElementById('f_root_cause').value = f.root_cause || '';
        document.getElementById('f_reported_by').value = f.reported_by || '';
        document.getElementById('f_assigned_to').value = f.assigned_to || '';
        
        document.getElementById('f_bay').value = f.bay || '';
        document.getElementById('f_feeder').value = f.feeder || '';
        
        document.getElementById('f_status').value = f.status || 'Pending';
        document.getElementById('f_downtime').value = f.downtime || '';
        document.getElementById('f_corrective').value = f.corrective || '';
        document.getElementById('f_preventive').value = f.preventive || '';
        document.getElementById('f_resolution_date').value = f.resolution_date || '';
        document.getElementById('f_resolution_notes').value = f.resolution_notes || '';
        
        document.getElementById('f_id').readOnly = true;
        document.getElementById('btnDeleteFault').style.display = 'inline-flex';
        document.getElementById('btnViewAttachedPhotosFault').style.display = 'inline-flex';
        document.getElementById('btnViewAttachedDocsFault').style.display = 'inline-flex';
    } else {
        document.getElementById('f_id').value = '';
        document.getElementById('f_date').value = new Date().toISOString().split('T')[0];
        document.getElementById('f_time').value = new Date().toTimeString().slice(0,5);
        document.getElementById('f_voltage').value = '66KV';
        document.getElementById('f_category').value = 'Transformer';
        document.getElementById('f_equipment_name').value = '';
        
        document.getElementById('f_type').value = 'Transient';
        document.getElementById('f_severity').value = 'Low';
        document.getElementById('f_description').value = '';
        document.getElementById('f_root_cause').value = '';
        document.getElementById('f_reported_by').value = '';
        document.getElementById('f_assigned_to').value = '';
        
        document.getElementById('f_bay').value = '';
        document.getElementById('f_feeder').value = '';
        
        document.getElementById('f_status').value = 'Pending';
        document.getElementById('f_downtime').value = '';
        document.getElementById('f_corrective').value = '';
        document.getElementById('f_preventive').value = '';
        document.getElementById('f_resolution_date').value = '';
        document.getElementById('f_resolution_notes').value = '';
        
        document.getElementById('f_id').readOnly = false;
        document.getElementById('btnDeleteFault').style.display = 'none';
        document.getElementById('btnViewAttachedPhotosFault').style.display = 'none';
        document.getElementById('btnViewAttachedDocsFault').style.display = 'none';
    }
}

function closeFaultForm() {
    document.getElementById('faultFormSection').style.display = 'none';
    document.getElementById('faultDashboardSection').style.display = 'block';
}

function saveFault() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.faults) ss.faults = [];
    
    let id = document.getElementById('f_id').value;
    let isNew = !id;
    if (isNew) {
        id = 'FLT-' + Date.now().toString().slice(-6);
    }
    
    let fault = {
        id: id,
        date: document.getElementById('f_date').value,
        time: document.getElementById('f_time').value,
        voltage: document.getElementById('f_voltage').value,
        category: document.getElementById('f_category').value,
        equipment_name: document.getElementById('f_equipment_name').value,
        type: document.getElementById('f_type').value,
        severity: document.getElementById('f_severity').value,
        description: document.getElementById('f_description').value,
        root_cause: document.getElementById('f_root_cause').value,
        reported_by: document.getElementById('f_reported_by').value,
        assigned_to: document.getElementById('f_assigned_to').value,
        bay: document.getElementById('f_bay').value,
        feeder: document.getElementById('f_feeder').value,
        status: document.getElementById('f_status').value,
        downtime: document.getElementById('f_downtime').value,
        corrective: document.getElementById('f_corrective').value,
        preventive: document.getElementById('f_preventive').value,
        resolution_date: document.getElementById('f_resolution_date').value,
        resolution_notes: document.getElementById('f_resolution_notes').value
    };
    
    if (isNew) {
        ss.faults.push(fault);
    } else {
        let index = ss.faults.findIndex(f => f.id === id);
        if (index > -1) ss.faults[index] = fault;
    }
    
    saveSS(ss);
    
    if (isNew) {
        EventEngine.dispatch(currentDashboardSSId, 'Fault Register', 'Record Created', `Fault ${id} on ${fault.equipment_name || 'equipment'}`);
    } else {
        EventEngine.dispatch(currentDashboardSSId, 'Fault Register', 'Record Updated', `Fault ${id}`);
    }
    
    showToast(isNew ? 'Fault registered successfully!' : 'Fault updated successfully!');
    closeFaultForm();
    renderFaultRegister();
}

function deleteFault() {
    let id = document.getElementById('f_id').value;
    if (!id) return;
    if (!confirm('Are you sure you want to delete this fault record?')) return;
    
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.faults) return;
    
    ss.faults = ss.faults.filter(f => f.id !== id);
    saveSS(ss);
    
    EventEngine.dispatch(currentDashboardSSId, 'Fault Register', 'Record Deleted', `Deleted fault ${id}`);
    
    showToast('Fault record deleted.');
    closeFaultForm();
    renderFaultRegister();
}

function exportFaults() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.faults || ss.faults.length === 0) {
        showToast('No faults to export.');
        return;
    }
    
    let csv = 'ID,Date,Time,Voltage,Category,Equipment,Type,Severity,Status,Downtime,Description,Root Cause\n';
    ss.faults.forEach(f => {
        let row = [
            f.id, f.date, f.time, f.voltage, f.category, `"${f.equipment_name||''}"`, f.type, f.severity, f.status, f.downtime||'', `"${f.description||''}"`, `"${f.root_cause||''}"`
        ];
        csv += row.join(',') + '\n';
    });
    
    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Faults_${ss.name}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
}

// ===================================================================
//  TRIPPING REGISTER LOGIC
// ===================================================================
function getCleanTrippingEquipment(ss) {
    let eqList = [];
    let addedNames = new Set();
    
    // Transformers
    (ss.transformers || []).forEach(tr => {
        let name = tr.name.trim();
        if(name && !addedNames.has(name)) {
            addedNames.add(name);
            eqList.push({ name: name, type: 'Transformer' });
        }
    });
    
    // Lines & Feeders
    let allowedRoles = ['66kv_incoming', '66kv_outgoing', 'tr_lv', '11kv_feeder', 'solar_import', 'solar_export'];
    (ss.feeders || []).forEach(f => {
        if (!allowedRoles.includes(f.role)) return;
        
        let name = f.name
            .replace(/\(I\)/i, '')
            .replace(/\(E\)/i, '')
            .replace(/IMPORT/i, '')
            .replace(/EXPORT/i, '')
            .replace(/INPORT/i, '')
            .replace(/\s+/g, ' ')
            .trim();
            
        if(name && !addedNames.has(name)) {
            addedNames.add(name);
            let type = 'Feeder';
            if (['66kv_incoming', '66kv_outgoing'].includes(f.role)) type = '66 KV Line';
            else if (f.role === 'tr_lv') type = '11 KV Incoming';
            else type = '11 KV Feeder';
            
            eqList.push({ name: name, type: type });
        }
    });
    
    let order = { '66 KV Line': 1, 'Transformer': 2, '11 KV Incoming': 3, '11 KV Feeder': 4, 'Feeder': 5 };
    eqList.sort((a, b) => (order[a.type] || 99) - (order[b.type] || 99));
    
    return eqList;
}

function renderTrippingRegister() {
    let ss = getSubstation(currentDashboardSSId);
    let month = document.getElementById('tripMonthPicker').value;
    if (!month) return;
    
    let trips = ss.trips || [];
    let filteredTrips = trips.filter(t => t.trip_date && t.trip_date.startsWith(month));
    
    // Build equipment base array
    let eqList = getCleanTrippingEquipment(ss).map(eq => {
        return { name: eq.name, type: eq.type, tt_c:0, tt_h:0, sf_c:0, sf_h:0, esd_c:0, esd_h:0, psd_c:0, psd_h:0 };
    });
    
    let g_total = 0, g_time = 0, max_dur = 0, min_dur = Infinity;
    
    filteredTrips.forEach(t => {
        let dur = parseFloat(t.duration) || 0;
        g_total++;
        g_time += dur;
        if(dur > max_dur) max_dur = dur;
        if(dur < min_dur) min_dur = dur;
        
        let eq = eqList.find(e => e.name === t.equipment);
        if (eq) {
            if(t.type === 'TT') { eq.tt_c++; eq.tt_h += dur; }
            else if(t.type === 'SF') { eq.sf_c++; eq.sf_h += dur; }
            else if(t.type === 'ESD') { eq.esd_c++; eq.esd_h += dur; }
            else if(t.type === 'PSD') { eq.psd_c++; eq.psd_h += dur; }
        } else {
            // Unmapped equipment just add dynamically
            eq = { name: t.equipment, type: 'Other', tt_c:0, tt_h:0, sf_c:0, sf_h:0, esd_c:0, esd_h:0, psd_c:0, psd_h:0 };
            if(t.type === 'TT') { eq.tt_c++; eq.tt_h += dur; }
            else if(t.type === 'SF') { eq.sf_c++; eq.sf_h += dur; }
            else if(t.type === 'ESD') { eq.esd_c++; eq.esd_h += dur; }
            else if(t.type === 'PSD') { eq.psd_c++; eq.psd_h += dur; }
            eqList.push(eq);
        }
    });
    
    let avg_time = g_total > 0 ? (g_time / g_total).toFixed(2) : 0;
    if (min_dur === Infinity) min_dur = 0;
    
    // Grand Totals
    document.getElementById('tripGrandTotals').innerHTML = `
        <div class="trip-summary-card"><div class="title">Total Trips</div><div class="value">${g_total}</div></div>
        <div class="trip-summary-card"><div class="title">Total Outage (H)</div><div class="value">${g_time.toFixed(2)}</div></div>
        <div class="trip-summary-card pending"><div class="title">Avg Restore (H)</div><div class="value">${avg_time}</div></div>
        <div class="trip-summary-card critical"><div class="title">Longest Trip (H)</div><div class="value">${max_dur.toFixed(2)}</div></div>
        <div class="trip-summary-card resolved"><div class="title">Shortest Trip (H)</div><div class="value">${min_dur.toFixed(2)}</div></div>
    `;
    
    // Equipment Table
    let tbodyEq = document.getElementById('tripSummaryTableBody');
    tbodyEq.innerHTML = '';
    eqList.forEach(eq => {
        let tot_c = eq.tt_c + eq.sf_c + eq.esd_c + eq.psd_c;
        let tot_h = eq.tt_h + eq.sf_h + eq.esd_h + eq.psd_h;
        if(tot_c === 0 && eq.type === 'Other') return; // ignore if no faults and not core eq
        
        let tr = document.createElement('tr');
        tr.innerHTML = `
            <td style="font-weight:600;">${eq.name}</td>
            <td>${eq.type}</td>
            <td class="center">${eq.tt_c}</td><td class="center">${eq.tt_h.toFixed(2)}</td>
            <td class="center">${eq.sf_c}</td><td class="center">${eq.sf_h.toFixed(2)}</td>
            <td class="center">${eq.esd_c}</td><td class="center">${eq.esd_h.toFixed(2)}</td>
            <td class="center">${eq.psd_c}</td><td class="center">${eq.psd_h.toFixed(2)}</td>
            <td class="center" style="border-left: 2px solid var(--border); font-weight:700;">${tot_c}</td>
            <td class="center" style="font-weight:700;">${tot_h.toFixed(2)}</td>
        `;
        tbodyEq.appendChild(tr);
    });
    
    // History Table
    let tbodyHist = document.getElementById('tripHistoryTableBody');
    tbodyHist.innerHTML = '';
    
    if (filteredTrips.length === 0) {
        tbodyHist.innerHTML = `<tr><td colspan="7" class="center">No trips recorded for this month.</td></tr>`;
    } else {
        filteredTrips.sort((a,b) => new Date(b.trip_date + 'T' + b.trip_time) - new Date(a.trip_date + 'T' + a.trip_time)).forEach(t => {
            let tr = document.createElement('tr');
            tr.onclick = () => openTripForm(t.id);
            tr.innerHTML = `
                <td>${t.id}</td>
                <td style="font-weight:600;">${t.equipment}</td>
                <td><span class="badge-sample">${t.type}</span></td>
                <td>${t.trip_date} ${t.trip_time}</td>
                <td>${t.restore_date || '-'} ${t.restore_time || '-'}</td>
                <td><span style="font-weight:700; color:var(--danger);">${t.duration ? parseFloat(t.duration).toFixed(2) : '-'}</span></td>
                <td style="white-space:normal;">${t.remarks || '-'}</td>
            `;
            tbodyHist.appendChild(tr);
        });
    }
}

function openTripForm(tripId = null) {
    document.getElementById('tripDashboardSection').style.display = 'none';
    document.getElementById('tripFormSection').style.display = 'block';
    
    let ss = getSubstation(currentDashboardSSId);
    let select = document.getElementById('t_equipment');
    select.innerHTML = '<option value="">Select Equipment...</option>';
    
    let cleanEq = getCleanTrippingEquipment(ss);
    
    let groups = {};
    cleanEq.forEach(eq => {
        if(!groups[eq.type]) {
            groups[eq.type] = document.createElement('optgroup');
            groups[eq.type].label = eq.type + 's';
            select.appendChild(groups[eq.type]);
        }
        let opt = document.createElement('option');
        opt.value = eq.name; 
        opt.textContent = eq.name;
        groups[eq.type].appendChild(opt);
    });
    
    if (tripId) {
        let trip = (ss.trips || []).find(t => t.id === tripId);
        if (trip) {
            document.getElementById('t_id').value = trip.id;
            document.getElementById('t_equipment').value = trip.equipment;
            document.getElementById('t_type').value = trip.type;
            document.getElementById('t_remarks').value = trip.remarks;
            document.getElementById('t_trip_date').value = trip.trip_date;
            document.getElementById('t_trip_time').value = trip.trip_time;
            document.getElementById('t_restore_date').value = trip.restore_date;
            document.getElementById('t_restore_time').value = trip.restore_time;
            document.getElementById('btnDeleteTrip').style.display = 'inline-flex';
            document.getElementById('btnViewAttachedPhotosTrip').style.display = 'inline-flex';
            document.getElementById('btnViewAttachedDocsTrip').style.display = 'inline-flex';
        }
    } else {
        document.getElementById('t_id').value = '';
        document.getElementById('t_equipment').value = '';
        document.getElementById('t_type').value = 'TT';
        document.getElementById('t_remarks').value = '';
        document.getElementById('t_trip_date').value = '';
        document.getElementById('t_trip_time').value = '';
        document.getElementById('t_restore_date').value = '';
        document.getElementById('t_restore_time').value = '';
        document.getElementById('t_id').readOnly = false;
        document.getElementById('btnDeleteTrip').style.display = 'none';
        document.getElementById('btnViewAttachedPhotosTrip').style.display = 'none';
        document.getElementById('btnViewAttachedDocsTrip').style.display = 'none';
    }
}

function closeTripForm() {
    document.getElementById('tripDashboardSection').style.display = 'block';
    document.getElementById('tripFormSection').style.display = 'none';
}

function saveTrip() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.trips) ss.trips = [];
    
    let id = document.getElementById('t_id').value;
    let isNew = !id;
    if (isNew) id = 'TRP-' + Date.now().toString().slice(-6);
    
    let equipment = document.getElementById('t_equipment').value;
    if(!equipment) { showToast('Please select equipment.'); return; }
    
    let t_date = document.getElementById('t_trip_date').value;
    let t_time = document.getElementById('t_trip_time').value;
    if(!t_date || !t_time) { showToast('Trip date & time are required.'); return; }
    
    let r_date = document.getElementById('t_restore_date').value;
    let r_time = document.getElementById('t_restore_time').value;
    
    let duration = 0;
    if(r_date && r_time) {
        let t1 = new Date(t_date + 'T' + t_time);
        let t2 = new Date(r_date + 'T' + r_time);
        if (t2 > t1) {
            duration = (t2 - t1) / (1000 * 60 * 60); // hours
        } else {
            showToast('Restore time must be after trip time.');
            return;
        }
    }
    
    let trip = {
        id: id,
        equipment: equipment,
        type: document.getElementById('t_type').value,
        remarks: document.getElementById('t_remarks').value,
        trip_date: t_date,
        trip_time: t_time,
        restore_date: r_date,
        restore_time: r_time,
        duration: duration.toFixed(2)
    };
    
    if (isNew) ss.trips.push(trip);
    else {
        let idx = ss.trips.findIndex(t => t.id === id);
        if(idx > -1) ss.trips[idx] = trip;
    }
    
    saveSS(ss);
    
    if (isNew) {
        EventEngine.dispatch(currentDashboardSSId, 'Tripping History', 'Record Created', `Trip ${id} on ${trip.equipment}`);
    } else {
        EventEngine.dispatch(currentDashboardSSId, 'Tripping History', 'Record Updated', `Trip ${id} updated`);
    }

    showToast(isNew ? 'Trip recorded successfully!' : 'Trip updated successfully!');
    closeTripForm();
    renderTrippingRegister();
}

function deleteTrip() {
    let id = document.getElementById('t_id').value;
    if (!id) return;
    if (!confirm('Are you sure you want to delete this trip record?')) return;
    
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.trips) return;
    
    ss.trips = ss.trips.filter(t => t.id !== id);
    saveSS(ss);
    
    EventEngine.dispatch(currentDashboardSSId, 'Tripping History', 'Record Deleted', `Deleted trip ${id}`);

    showToast('Trip record deleted.');
    closeTripForm();
    renderTrippingRegister();
}

function exportTrips() {
    let ss = getSubstation(currentDashboardSSId);
    let month = document.getElementById('tripMonthPicker').value;
    let trips = (ss.trips || []).filter(t => t.trip_date && t.trip_date.startsWith(month));
    if (trips.length === 0) {
        showToast('No trips to export for this month.');
        return;
    }
    
    let csv = 'ID,Equipment,Type,Trip Date,Trip Time,Restore Date,Restore Time,Duration(H),Remarks\n';
    trips.forEach(t => {
        csv += `${t.id},"${t.equipment}",${t.type},${t.trip_date},${t.trip_time},${t.restore_date||''},${t.restore_time||''},${t.duration},"${t.remarks||''}"\n`;
    });
    
    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Trips_${ss.name}_${month}.csv`;
    a.click();
}

// ===================================================================
//  BREAKDOWN REGISTER LOGIC
// ===================================================================
function renderBreakdownRegister() {
    let ss = getSubstation(currentDashboardSSId);
    let month = document.getElementById('bdMonthPicker').value;
    if (!month) return;
    
    let breakdowns = ss.breakdowns || [];
    let filtered = breakdowns.filter(bd => bd.startTime && bd.startTime.startsWith(month));
    
    let active = 0, resolved = 0, critical = 0, totalDowntime = 0;
    
    let tbody = document.getElementById('bdTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" class="empty-state">No breakdown records found for this month.</td></tr>`;
    } else {
        filtered.forEach(bd => {
            if (bd.status === 'Pending' || bd.status === 'Under Repair') active++;
            if (bd.status === 'Resolved' || bd.status === 'Closed') resolved++;
            if (bd.severity === 'Critical') critical++;
            totalDowntime += (parseFloat(bd.totalOutage) || 0);
            
            let severityClass = 'sev-' + (bd.severity || 'low').toLowerCase();
            let statClass = 'stat-' + (bd.status || 'pending').toLowerCase().replace(' ', '');
            
            let tr = document.createElement('tr');
            tr.onclick = () => openBreakdownForm(bd.id);
            tr.innerHTML = `
                <td><strong>${bd.bdNumber || bd.id}</strong></td>
                <td>${bd.equipmentName || 'N/A'}</td>
                <td>${bd.startTime.replace('T', ' ')}</td>
                <td>${bd.restoreTime ? bd.restoreTime.replace('T', ' ') : '-'}</td>
                <td><span class="status-badge ${severityClass}">${bd.severity || 'Medium'}</span></td>
                <td><span class="status-badge ${statClass}">${bd.status || 'Pending'}</span></td>
                <td>
                    <button class="btn btn-outline" style="padding: 4px 8px; font-size: 11px;">Edit</button>
                </td>
            `;
            tbody.appendChild(tr);
        });
    }
    
    document.getElementById('bdTotalCount').textContent = filtered.length;
    document.getElementById('bdActiveCount').textContent = active;
    document.getElementById('bdResolvedCount').textContent = resolved;
    document.getElementById('bdCriticalCount').textContent = critical;
    document.getElementById('bdTotalDowntime').textContent = totalDowntime.toFixed(1) + 'h';
    document.getElementById('bdAvgRestore').textContent = (resolved > 0 ? (totalDowntime / resolved).toFixed(1) : 0) + 'h';
}

function calcBdTimes() {
    let start = document.getElementById('bdStartTime').value;
    let restore = document.getElementById('bdRestoreTime').value;
    let repStart = document.getElementById('bdRepairStartTime').value;
    let repEnd = document.getElementById('bdRepairEndTime').value;
    
    if (start && restore) {
        let diffMs = new Date(restore) - new Date(start);
        if (diffMs >= 0) {
            document.getElementById('bdTotalOutage').value = (diffMs / (1000 * 60 * 60)).toFixed(2);
        } else {
            document.getElementById('bdTotalOutage').value = '';
        }
    }
    
    if (repStart && repEnd) {
        let diffMs = new Date(repEnd) - new Date(repStart);
        if (diffMs >= 0) {
            document.getElementById('bdRepairDuration').value = (diffMs / (1000 * 60 * 60)).toFixed(2);
        } else {
            document.getElementById('bdRepairDuration').value = '';
        }
    }
}

function openBreakdownForm(id = null) {
    document.getElementById('bdDashboardSection').style.display = 'none';
    document.getElementById('bdFormSection').style.display = 'block';
    
    let ss = getSubstation(currentDashboardSSId);
    let eqSelect = document.getElementById('bdEquipmentName');
    eqSelect.innerHTML = '<option value="">Select Equipment...</option>';
    let eqList = getCleanTrippingEquipment(ss);
    eqList.forEach(eq => {
        eqSelect.innerHTML += `<option value="${eq.name}">${eq.name} (${eq.type})</option>`;
    });
    
    if (id) {
        let bd = (ss.breakdowns || []).find(b => b.id === id);
        if (bd) {
            document.getElementById('bdFormTitle').textContent = '📝 Edit Breakdown Report: ' + bd.bdNumber;
            document.getElementById('bdId').value = bd.id;
            document.getElementById('bdNumber').value = bd.bdNumber;
            document.getElementById('bdStartTime').value = bd.startTime || '';
            document.getElementById('bdReportedBy').value = bd.reportedBy || '';
            document.getElementById('bdSeverity').value = bd.severity || 'Medium';
            document.getElementById('bdEquipmentName').value = bd.equipmentName || '';
            document.getElementById('bdMake').value = bd.make || '';
            document.getElementById('bdNature').value = bd.nature || '';
            document.getElementById('bdRootCause').value = bd.rootCause || '';
            document.getElementById('bdRepairStartTime').value = bd.repairStartTime || '';
            document.getElementById('bdRepairEndTime').value = bd.repairEndTime || '';
            document.getElementById('bdRestoreTime').value = bd.restoreTime || '';
            document.getElementById('bdTotalOutage').value = bd.totalOutage || '';
            document.getElementById('bdRepairDuration').value = bd.repairDuration || '';
            document.getElementById('bdCost').value = bd.cost || '';
            document.getElementById('bdActionsTaken').value = bd.actionsTaken || '';
            document.getElementById('bdLinkBefore').value = bd.linkBefore || '';
            document.getElementById('bdLinkAfter').value = bd.linkAfter || '';
            document.getElementById('bdLinkDoc').value = bd.linkDoc || '';
            document.getElementById('bdStatus').value = bd.status || 'Pending';
            
            document.getElementById('btnDeleteBreakdown').style.display = 'inline-flex';
            document.getElementById('btnViewAttachedPhotosBd').style.display = 'inline-flex';
            document.getElementById('btnViewAttachedDocsBd').style.display = 'inline-flex';
        }
    } else {
        document.getElementById('bdFormTitle').textContent = '📝 Report New Breakdown';
        document.getElementById('bdId').value = '';
        document.getElementById('bdNumber').value = '';
        document.getElementById('bdStartTime').value = '';
        document.getElementById('bdReportedBy').value = '';
        document.getElementById('bdSeverity').value = 'Medium';
        document.getElementById('bdEquipmentName').value = '';
        document.getElementById('bdMake').value = '';
        document.getElementById('bdNature').value = '';
        document.getElementById('bdRootCause').value = '';
        document.getElementById('bdRepairStartTime').value = '';
        document.getElementById('bdRepairEndTime').value = '';
        document.getElementById('bdRestoreTime').value = '';
        document.getElementById('bdTotalOutage').value = '';
        document.getElementById('bdRepairDuration').value = '';
        document.getElementById('bdCost').value = '';
        document.getElementById('bdActionsTaken').value = '';
        document.getElementById('bdLinkBefore').value = '';
        document.getElementById('bdLinkAfter').value = '';
        document.getElementById('bdLinkDoc').value = '';
        document.getElementById('bdStatus').value = 'Pending';
        
        document.getElementById('bdNumber').readOnly = false;
        document.getElementById('btnDeleteBreakdown').style.display = 'none';
        document.getElementById('btnViewAttachedPhotosBd').style.display = 'none';
        document.getElementById('btnViewAttachedDocsBd').style.display = 'none';
    }
}

function closeBreakdownForm() {
    document.getElementById('bdDashboardSection').style.display = 'block';
    document.getElementById('bdFormSection').style.display = 'none';
}

function saveBreakdown() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.breakdowns) ss.breakdowns = [];
    
    let id = document.getElementById('bdId').value;
    let isNew = !id;
    if (isNew) {
        id = Date.now().toString();
    }
    let bdNumber = document.getElementById('bdNumber').value || ('BD-' + id.slice(-4));
    
    let eqName = document.getElementById('bdEquipmentName').value;
    let start = document.getElementById('bdStartTime').value;
    
    if (!eqName || !start) {
        showToast('Equipment Name and Start Time are required.');
        return;
    }
    
    let bd = {
        id: id,
        bdNumber: bdNumber,
        startTime: start,
        reportedBy: document.getElementById('bdReportedBy').value,
        severity: document.getElementById('bdSeverity').value,
        equipmentName: eqName,
        make: document.getElementById('bdMake').value,
        nature: document.getElementById('bdNature').value,
        rootCause: document.getElementById('bdRootCause').value,
        repairStartTime: document.getElementById('bdRepairStartTime').value,
        repairEndTime: document.getElementById('bdRepairEndTime').value,
        restoreTime: document.getElementById('bdRestoreTime').value,
        totalOutage: document.getElementById('bdTotalOutage').value,
        repairDuration: document.getElementById('bdRepairDuration').value,
        cost: document.getElementById('bdCost').value,
        actionsTaken: document.getElementById('bdActionsTaken').value,
        linkBefore: document.getElementById('bdLinkBefore').value,
        linkAfter: document.getElementById('bdLinkAfter').value,
        linkDoc: document.getElementById('bdLinkDoc').value,
        status: document.getElementById('bdStatus').value
    };
    
    if (isNew) {
        ss.breakdowns.push(bd);
    } else {
        let idx = ss.breakdowns.findIndex(b => b.id === id);
        if (idx > -1) ss.breakdowns[idx] = bd;
    }
    
    saveSS(ss);

    if (isNew) {
        EventEngine.dispatch(currentDashboardSSId, 'Breakdown Report', 'Record Created', `Breakdown ${bdNumber} on ${eqName}`);
    } else {
        EventEngine.dispatch(currentDashboardSSId, 'Breakdown Report', 'Record Updated', `Breakdown ${bdNumber}`);
    }

    showToast(isNew ? 'Breakdown report saved successfully!' : 'Breakdown report updated successfully!');
    closeBreakdownForm();
    renderBreakdownRegister();
}

function deleteBreakdown() {
    let id = document.getElementById('bdId').value;
    if (!id) return;
    if (!confirm('Are you sure you want to delete this breakdown report?')) return;
    
    let ss = getSubstation(currentDashboardSSId);
    if (ss.breakdowns) {
        ss.breakdowns = ss.breakdowns.filter(b => b.id !== id);
        saveSS(ss);
        EventEngine.dispatch(currentDashboardSSId, 'Breakdown Report', 'Record Deleted', `Deleted breakdown ${id}`);
    }
    
    showToast('Breakdown report deleted.');
    closeBreakdownForm();
    renderBreakdownRegister();
}

function exportBreakdowns() {
    let ss = getSubstation(currentDashboardSSId);
    let month = document.getElementById('bdMonthPicker').value;
    let bds = (ss.breakdowns || []).filter(b => b.startTime && b.startTime.startsWith(month));
    
    if (bds.length === 0) {
        showToast('No breakdown reports to export for this month.');
        return;
    }
    
    let csv = 'BD Number,Equipment,Severity,Status,Start Time,Restore Time,Outage(h),Nature\n';
    bds.forEach(b => {
        let out = b.totalOutage || '';
        let nat = b.nature ? b.nature.replace(/\\n/g, ' ').replace(/"/g, '""') : '';
        csv += `${b.bdNumber},"${b.equipmentName}",${b.severity},${b.status},${b.startTime},${b.restoreTime||''},${out},"${nat}"\n`;
    });
    
    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Breakdowns_${ss.name}_${month}.csv`;
    a.click();
}

// ===================================================================
//  MAINTENANCE REGISTER LOGIC
// ===================================================================
function renderMaintenanceRegister() {
    let ss = getSubstation(currentDashboardSSId);
    if(!ss) return;
    ss.maintenance = ss.maintenance || [];
    
    let monthPicker = document.getElementById('mntMonthPicker');
    if(!monthPicker.value) {
        let now = new Date();
        monthPicker.value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    }
    
    let selMonth = monthPicker.value; // YYYY-MM
    let filtered = ss.maintenance.filter(m => (m.scheduledDate || '').startsWith(selMonth) || (m.startTime || '').startsWith(selMonth));
    
    // Summary Cards
    let total = ss.maintenance.length;
    let scheduled = ss.maintenance.filter(m => m.status === 'Scheduled' || m.status === 'Pending').length;
    let inProgress = ss.maintenance.filter(m => m.status === 'In Progress').length;
    let completed = ss.maintenance.filter(m => m.status === 'Completed').length;
    
    let overdue = 0;
    let nowTime = new Date().setHours(0,0,0,0);
    ss.maintenance.forEach(m => {
        if ((m.status === 'Scheduled' || m.status === 'Pending') && m.scheduledDate) {
            let schedTime = new Date(m.scheduledDate).getTime();
            if (schedTime < nowTime) overdue++;
        }
    });
    
    let thisMonth = filtered.length;
    
    let summaryHtml = `
        <div class="mnt-summary-card">
            <span class="title">Total Records</span>
            <span class="value">${total}</span>
        </div>
        <div class="mnt-summary-card scheduled">
            <span class="title">Scheduled</span>
            <span class="value">${scheduled}</span>
        </div>
        <div class="mnt-summary-card progress">
            <span class="title">In Progress</span>
            <span class="value">${inProgress}</span>
        </div>
        <div class="mnt-summary-card completed">
            <span class="title">Completed</span>
            <span class="value">${completed}</span>
        </div>
        <div class="mnt-summary-card overdue">
            <span class="title">Overdue</span>
            <span class="value" style="color:var(--danger)">${overdue}</span>
        </div>
        <div class="mnt-summary-card">
            <span class="title">This Month</span>
            <span class="value">${thisMonth}</span>
        </div>
    `;
    document.getElementById('mntSummaryGrid').innerHTML = summaryHtml;
    
    let tbody = document.getElementById('mntTableBody');
    tbody.innerHTML = '';
    
    if (filtered.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:20px; color:var(--text-secondary);">No maintenance records found for this month.</td></tr>`;
        return;
    }
    
    filtered.sort((a,b) => new Date(b.scheduledDate || b.startTime || 0) - new Date(a.scheduledDate || a.startTime || 0));
    
    filtered.forEach(m => {
        let badgeClass = 'sev-low';
        if(m.status === 'In Progress') badgeClass = 'stat-progress';
        if(m.status === 'Completed') badgeClass = 'stat-resolved';
        if(m.status === 'Cancelled') badgeClass = 'sev-medium';
        if(m.status === 'Scheduled' || m.status === 'Pending') badgeClass = 'stat-pending';
        
        let overdueBadge = '';
        if ((m.status === 'Scheduled' || m.status === 'Pending') && m.scheduledDate) {
            let schedTime = new Date(m.scheduledDate).getTime();
            if (schedTime < nowTime) {
                overdueBadge = ' <span class="badge-sample" style="background:var(--danger)">OVERDUE</span>';
            }
        }
        
        let row = document.createElement('tr');
        row.innerHTML = `
            <td style="font-weight:600; color:var(--primary-dark)">${m.id || '-'}</td>
            <td style="font-weight:600">${m.equipmentName || '-'}</td>
            <td>${m.type || '-'}</td>
            <td>${m.scheduledDate ? new Date(m.scheduledDate).toLocaleDateString('en-GB') : '-'}${overdueBadge}</td>
            <td><span class="status-badge ${badgeClass}">${m.status || '-'}</span></td>
            <td>${m.duration || 0} hrs</td>
            <td>
                <button class="btn-edit" style="padding:4px 8px; border:none; border-radius:4px; font-size:11px;" onclick="openMaintenanceForm('${m.id}')">View</button>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function openMaintenanceForm(id = null) {
    let ss = getSubstation(currentDashboardSSId);
    if(!ss) return;
    
    // Populate Equipment
    let equipSelect = document.getElementById('mntEquipmentName');
    let eqList = getCleanTrippingEquipment(ss);
    equipSelect.innerHTML = '<option value="">-- Select Equipment --</option>';
    eqList.forEach(eq => {
        equipSelect.innerHTML += `<option value="${eq.name}">${eq.name} (${eq.type})</option>`;
    });
    
    document.getElementById('mntDashboardSection').style.display = 'none';
    document.getElementById('mntFormSection').style.display = 'block';
    
    if (id) {
        document.getElementById('mntFormTitle').textContent = 'Edit Maintenance';
        document.getElementById('btnDeleteMaintenance').style.display = 'inline-flex';
        document.getElementById('btnViewAttachedPhotosMnt').style.display = 'inline-flex';
        document.getElementById('btnViewAttachedDocsMnt').style.display = 'inline-flex';
        
        let m = ss.maintenance.find(x => x.id === id);
        if (m) {
            document.getElementById('mntId').value = m.id;
            document.getElementById('mntEquipmentName').value = m.equipmentName || '';
            document.getElementById('mntType').value = m.type || 'Preventive';
            document.getElementById('mntDescription').value = m.description || '';
            document.getElementById('mntParts').value = m.parts || '';
            document.getElementById('mntScheduledDate').value = m.scheduledDate || '';
            document.getElementById('mntStartTime').value = m.startTime || '';
            document.getElementById('mntEndTime').value = m.endTime || '';
            document.getElementById('mntDuration').value = m.duration || '';
            document.getElementById('mntStatus').value = m.status || 'Scheduled';
            document.getElementById('mntAgency').value = m.agency || '';
            document.getElementById('mntLinkBefore').value = m.linkBefore || '';
            document.getElementById('mntLinkAfter').value = m.linkAfter || '';
            document.getElementById('mntLinkDoc').value = m.linkDoc || '';
            
            setTimeout(() => {
                loadMaintenanceChecklist(m.checklistData || []);
            }, 0);
        }
    } else {
        document.getElementById('mntFormTitle').textContent = 'New Maintenance';
        document.getElementById('btnDeleteMaintenance').style.display = 'none';
        document.getElementById('btnViewAttachedPhotosMnt').style.display = 'none';
        document.getElementById('btnViewAttachedDocsMnt').style.display = 'none';
        
        document.getElementById('mntId').value = '';
        document.getElementById('mntEquipmentName').value = '';
        document.getElementById('mntType').value = 'Preventive';
        document.getElementById('mntDescription').value = '';
        document.getElementById('mntParts').value = '';
        document.getElementById('mntScheduledDate').value = '';
        document.getElementById('mntStartTime').value = '';
        document.getElementById('mntEndTime').value = '';
        document.getElementById('mntDuration').value = '';
        document.getElementById('mntStatus').value = 'Scheduled';
        document.getElementById('mntAgency').value = '';
        document.getElementById('mntLinkBefore').value = '';
        document.getElementById('mntLinkAfter').value = '';
        document.getElementById('mntLinkDoc').value = '';
        
        document.getElementById('mntChecklistSection').style.display = 'none';
    }
}

function closeMaintenanceForm() {
    document.getElementById('mntDashboardSection').style.display = 'block';
    document.getElementById('mntFormSection').style.display = 'none';
}

function loadMaintenanceChecklist(savedData = null) {
    window._loadingChecklist = true;
    let eqSelect = document.getElementById('mntEquipmentName');
    let selectedName = eqSelect.value;
    let section = document.getElementById('mntChecklistSection');
    
    if (!selectedName) {
        section.style.display = 'none';
        window._loadingChecklist = false;
        return;
    }
    
    let ss = getSubstation(currentDashboardSSId);
    if (!ss) {
        window._loadingChecklist = false;
        return;
    }
    
    let eqList = getCleanTrippingEquipment(ss);
    let selectedEq = eqList.find(e => e.name === selectedName);
    let grid = document.getElementById('mntChecklistGrid');
    
    if (!selectedEq) {
        section.style.display = 'none';
        window._loadingChecklist = false;
        return;
    }
    
    let type = selectedEq.type;
    let list = MNT_CHECKLISTS[type];
    if (!list) {
        if (type.includes('11 KV')) list = MNT_CHECKLISTS['11 KV Feeder'];
        else list = MNT_CHECKLISTS['Circuit Breaker'];
    }
    
    if (list && list.length > 0) {
        grid.innerHTML = '';
        list.forEach((item, idx) => {
            let isChecked = false;
            if (savedData && savedData.includes(item)) {
                isChecked = true;
            } else if (savedData && savedData.includes(idx.toString())) {
                 isChecked = true;
            }
            grid.innerHTML += `
                <label class="mnt-check-item">
                    <input type="checkbox" class="mnt-checkbox" value="${item}" onchange="updateChecklistProgress()" ${isChecked ? 'checked' : ''}>
                    <span>${item}</span>
                </label>
            `;
        });
        section.style.display = 'block';
        updateChecklistProgress();
    } else {
        section.style.display = 'none';
    }
    window._loadingChecklist = false;
}

function updateChecklistProgress() {
    let checkboxes = document.querySelectorAll('.mnt-checkbox');
    let total = checkboxes.length;
    let ticked = 0;
    checkboxes.forEach(cb => {
        if(cb.checked) ticked++;
    });
    
    let percent = total > 0 ? Math.round((ticked / total) * 100) : 0;
    let text = document.getElementById('mntChecklistText');
    let bar = document.getElementById('mntChecklistBarFill');
    
    if(text) text.textContent = `${ticked} / ${total} Completed (${percent}%)`;
    if(bar) bar.style.width = `${percent}%`;
    
    if (percent === 100 && total > 0) {
        let ss = getSubstation(currentDashboardSSId);
        let id = document.getElementById('mntId').value;
        if (ss && id && !window._loadingChecklist) {
            let alreadyPushed = ss.timelineEvents && ss.timelineEvents.find(e => e.module === 'Maintenance' && e.action === 'Checklist Completed' && e.remarks.includes(id));
            if (!alreadyPushed) {
                EventEngine.dispatch(currentDashboardSSId, 'Maintenance', 'Checklist Completed', `Smart Checklist for ${id} reached 100% completion.`);
            }
        }
    }
}

function calcMntTimes() {
    let st = document.getElementById('mntStartTime').value;
    let et = document.getElementById('mntEndTime').value;
    if (st && et) {
        let diffMs = new Date(et) - new Date(st);
        if (diffMs >= 0) {
            let hrs = (diffMs / (1000 * 60 * 60)).toFixed(2);
            document.getElementById('mntDuration').value = hrs;
        } else {
            document.getElementById('mntDuration').value = 0;
        }
    } else {
        document.getElementById('mntDuration').value = '';
    }
}

function saveMaintenance() {
    let ss = getSubstation(currentDashboardSSId);
    if(!ss) return;
    ss.maintenance = ss.maintenance || [];
    ss.timelineEvents = ss.timelineEvents || [];
    
    let id = document.getElementById('mntId').value;
    let isNew = false;
    if (!id) {
        let maxSeq = 0;
        ss.maintenance.forEach(m => {
            if(m.id && m.id.startsWith('MNT-')) {
                let num = parseInt(m.id.replace('MNT-',''));
                if(num > maxSeq) maxSeq = num;
            }
        });
        id = `MNT-${String(maxSeq + 1).padStart(4, '0')}`;
        isNew = true;
    }
    
    let checkboxes = document.querySelectorAll('.mnt-checkbox');
    let checklistData = [];
    let total = checkboxes.length;
    let ticked = 0;
    
    if (document.getElementById('mntChecklistSection').style.display !== 'none') {
        checkboxes.forEach((cb) => {
            if (cb.checked) {
                ticked++;
                checklistData.push(cb.value);
            }
        });
        
        let status = document.getElementById('mntStatus').value;
        if (status === 'Completed' && total > 0 && ticked < total) {
            showToast('Please complete all checklist items before marking as Completed', 'error');
            document.getElementById('mntStatus').focus();
            return;
        }
    }
    
    let m = {
        id: id,
        equipmentName: document.getElementById('mntEquipmentName').value,
        type: document.getElementById('mntType').value,
        description: document.getElementById('mntDescription').value,
        parts: document.getElementById('mntParts').value,
        scheduledDate: document.getElementById('mntScheduledDate').value,
        startTime: document.getElementById('mntStartTime').value,
        endTime: document.getElementById('mntEndTime').value,
        duration: document.getElementById('mntDuration').value,
        status: document.getElementById('mntStatus').value,
        agency: document.getElementById('mntAgency').value,
        linkBefore: document.getElementById('mntLinkBefore').value,
        linkAfter: document.getElementById('mntLinkAfter').value,
        linkDoc: document.getElementById('mntLinkDoc').value,
        checklistData: checklistData,
        updatedAt: new Date().toISOString()
    };
    
    if (isNew) {
        ss.maintenance.push(m);
    } else {
        let idx = ss.maintenance.findIndex(x => x.id === id);
        if (idx !== -1) {
            ss.maintenance[idx] = m;
        }
    }

    saveSS(ss);

    if (isNew) {
        EventEngine.dispatch(currentDashboardSSId, 'Maintenance', 'Record Saved', `Created maintenance task ${id} for ${m.equipmentName || 'equipment'}`);
    } else {
        EventEngine.dispatch(currentDashboardSSId, 'Maintenance', 'Record Saved', `Updated maintenance task ${id}`);
    }

    showToast('Maintenance record saved!');
    closeMaintenanceForm();
    renderMaintenanceRegister();
}

function deleteMaintenance() {
    let id = document.getElementById('mntId').value;
    if (!id) return;
    if (confirm(`Are you sure you want to delete ${id}?`)) {
        let ss = getSubstation(currentDashboardSSId);
        ss.maintenance = ss.maintenance.filter(x => x.id !== id);
        saveSS(ss);
        EventEngine.dispatch(currentDashboardSSId, 'Maintenance', 'Record Deleted', `Deleted maintenance task ${id}`);
        showToast('Maintenance record deleted!');
        closeMaintenanceForm();
        renderMaintenanceRegister();
    }
}

function exportMaintenance() {
    let ss = getSubstation(currentDashboardSSId);
    let month = document.getElementById('mntMonthPicker').value;
    let bds = (ss.maintenance || []).filter(m => (m.scheduledDate || '').startsWith(month) || (m.startTime || '').startsWith(month));
    
    if (bds.length === 0) {
        showToast('No maintenance records to export for this month.');
        return;
    }
    
    let csv = 'ID,Equipment Name,Type,Description,Scheduled Date,Status,Duration (hrs),Parts,Agency\n';
    bds.forEach(m => {
        let row = [
            m.id || '',
            m.equipmentName || '',
            m.type || '',
            `"${(m.description || '').replace(/"/g, '""')}"`,
            m.scheduledDate || '',
            m.status || '',
            m.duration || '',
            `"${(m.parts || '').replace(/"/g, '""')}"`,
            m.agency || ''
        ];
        csv += row.join(',') + '\n';
    });
    
    let blob = new Blob([csv], { type: 'text/csv' });
    let url = window.URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = `Maintenance_Register_${ss.name.replace(/\s+/g,'_')}_${month}.csv`;
    a.click();
}

/* ===== PHOTO REPORT LOGIC ===== */
function renderPhotoReport() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.photos) ss.photos = [];
    
    // Auto-populate filter equipment dropdown if needed
    let filterEqSelect = document.getElementById('photoFilterEquipment');
    if (filterEqSelect.options.length <= 1) {
        let eqSet = new Set();
        Object.keys(ss.feeders || {}).forEach(cat => {
            (ss.feeders[cat] || []).forEach(f => eqSet.add(f.name));
        });
        (ss.transformers || []).forEach(t => eqSet.add(t.name));
        Array.from(eqSet).sort().forEach(eq => {
            let opt = document.createElement('option');
            opt.value = eq;
            opt.textContent = eq;
            filterEqSelect.appendChild(opt);
        });
    }
    
    let eqFilter = filterEqSelect.value;
    let catFilter = document.getElementById('photoFilterCategory').value;
    let recFilter = document.getElementById('photoFilterRecordId') ? document.getElementById('photoFilterRecordId').value.toLowerCase().trim() : '';
    
    let filtered = ss.photos.filter(p => {
        let eqMatch = !eqFilter || p.equipment === eqFilter;
        let catMatch = !catFilter || p.category === catFilter;
        let recMatch = !recFilter || (p.relatedRecord && p.relatedRecord.toLowerCase().includes(recFilter)) || (p.id && p.id.toLowerCase().includes(recFilter));
        return eqMatch && catMatch && recMatch;
    });
    
    filtered.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    let container = document.getElementById('photoGridContainer');
    container.innerHTML = '';
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">📷</div><p>No photos found. Click "Add Photo" to upload.</p></div>';
        return;
    }
    
    filtered.forEach(p => {
        let div = document.createElement('div');
        div.className = 'photo-card';
        div.innerHTML = `
            <img src="${p.url}" class="photo-img" onerror="this.src='https://via.placeholder.com/400x200?text=Invalid+Image'">
            <div class="photo-info" style="display:grid; grid-template-columns: 1fr; gap:6px; font-size:11px;">
                <div class="photo-title" style="font-size:14px;">${p.caption || 'Untitled Photo'}</div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:4px;">
                    <span style="color:var(--text-secondary);"><span class="material-icons-round" style="font-size:12px;vertical-align:middle;">calendar_today</span> ${new Date(p.timestamp).toLocaleDateString()}</span>
                    <span style="color:var(--text-secondary);"><span class="material-icons-round" style="font-size:12px;vertical-align:middle;">schedule</span> ${new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div style="display:grid; grid-template-columns: auto 1fr; gap:4px 8px; margin-top:4px;">
                    <strong style="color:var(--text-secondary);">Substation:</strong> <span>${p.substation || ss.name}</span>
                    <strong style="color:var(--text-secondary);">Category:</strong> <span>${p.category || 'N/A'}</span>
                    <strong style="color:var(--text-secondary);">Equipment:</strong> <span>${p.equipment || 'N/A'}</span>
                    <strong style="color:var(--text-secondary);">Record ID:</strong> <span style="color:var(--primary); font-weight:600;">${p.relatedRecord || '-'}</span>
                    <strong style="color:var(--text-secondary);">By:</strong> <span>${p.user || 'Unknown'}</span>
                    <strong style="color:var(--text-secondary);">GPS:</strong> <span>${p.gps || '-'}</span>
                </div>
                <div style="margin-top:4px; padding:6px; background:#f8fafc; border-radius:4px; font-style:italic;">
                    ${p.remarks || 'No remarks provided.'}
                </div>
                <div class="photo-actions" style="margin-top:auto; padding-top:8px;">
                    <button class="btn-photo-edit" onclick="openPhotoForm('${p.id}')">✏️ Edit</button>
                    <button class="btn-photo-del" onclick="deletePhotoReport('${p.id}')">🗑️ Delete</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

window.viewRelatedPhotos = function(recordId) {
    if (!recordId) {
        showToast('No Record ID found');
        return;
    }
    navigateTo('photoReport', currentDashboardSSId);
    let filterEl = document.getElementById('photoFilterRecordId');
    if (filterEl) {
        filterEl.value = recordId;
    }
    renderPhotoReport();
};

// ===== DMS LOGIC =====
window.currentDmsFolder = 'Monthly Reports';

window.setDmsFolder = function(folder) {
    window.currentDmsFolder = folder;
    document.querySelectorAll('.dms-folder').forEach(el => {
        if (el.textContent === folder) el.classList.add('active');
        else el.classList.remove('active');
    });
    renderDms();
};

window.openDmsForm = function(id = null) {
    let ss = getSubstation(currentDashboardSSId);
    let eqSelect = document.getElementById('dmsEquipment');
    eqSelect.innerHTML = '<option value="">Select Equipment</option>';
    let eqSet = new Set();
    Object.keys(ss.feeders || {}).forEach(cat => {
        (ss.feeders[cat] || []).forEach(f => eqSet.add(f.name));
    });
    (ss.transformers || []).forEach(t => eqSet.add(t.name));
    eqSet.forEach(eq => {
        eqSelect.innerHTML += `<option value="${eq}">${eq}</option>`;
    });

    document.getElementById('dmsFormSection').style.display = 'block';
    if (id) {
        let doc = (ss.documents || []).find(d => d.id === id);
        if (!doc) return;
        document.getElementById('dmsFormTitle').textContent = 'Edit Document';
        document.getElementById('dmsId').value = doc.id;
        document.getElementById('dmsDocTitle').value = doc.title;
        document.getElementById('dmsDocUrl').value = doc.url;
        document.getElementById('dmsDocFolder').value = doc.folder;
        document.getElementById('dmsEquipment').value = doc.equipment || '';
        document.getElementById('dmsRecordId').value = doc.recordId || '';
        document.getElementById('dmsStatus').value = doc.status || 'Draft';
        document.getElementById('dmsExpiry').value = doc.expiry || '';
        document.getElementById('dmsRemarks').value = doc.remarks || '';
        document.getElementById('btnDeleteDms').style.display = 'inline-flex';
    } else {
        document.getElementById('dmsFormTitle').textContent = 'Upload Document';
        document.getElementById('dmsId').value = '';
        document.getElementById('dmsDocTitle').value = '';
        document.getElementById('dmsDocUrl').value = '';
        document.getElementById('dmsDocFolder').value = window.currentDmsFolder;
        document.getElementById('dmsEquipment').value = '';
        document.getElementById('dmsRecordId').value = '';
        document.getElementById('dmsStatus').value = 'Draft';
        document.getElementById('dmsExpiry').value = '';
        document.getElementById('dmsRemarks').value = '';
        document.getElementById('btnDeleteDms').style.display = 'none';
    }
};

window.closeDmsForm = function() {
    document.getElementById('dmsFormSection').style.display = 'none';
};

window.saveDocument = function() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.documents) ss.documents = [];
    
    let id = document.getElementById('dmsId').value;
    let title = document.getElementById('dmsDocTitle').value.trim();
    let url = document.getElementById('dmsDocUrl').value.trim();
    let folder = document.getElementById('dmsDocFolder').value;
    let equipment = document.getElementById('dmsEquipment').value;
    let recordId = document.getElementById('dmsRecordId').value.trim();
    let status = document.getElementById('dmsStatus').value;
    let expiry = document.getElementById('dmsExpiry').value;
    let remarks = document.getElementById('dmsRemarks').value.trim();
    
    if (!title || !url || !folder) {
        showToast('Please fill all required fields');
        return;
    }
    
    let isNew = !id;
    let version = 'v1';
    
    if (isNew) {
        let sameNameDocs = ss.documents.filter(d => d.folder === folder && d.title === title);
        if (sameNameDocs.length > 0) {
            version = 'v' + (sameNameDocs.length + 1);
        }
    } else {
        let existing = ss.documents.find(d => d.id === id);
        if (existing) version = existing.version || 'v1';
    }
    
    let docObj = {
        title, url, folder, equipment, recordId, status, expiry, remarks, version,
        timestamp: new Date().toISOString(),
        user: 'Admin'
    };
    
    if (isNew) {
        docObj.id = 'DOC-' + Date.now();
        ss.documents.push(docObj);
        EventEngine.dispatch('document_uploaded', 'Documents', `Document Uploaded: ${title} in ${folder}`, ss.id);
        showToast('Document uploaded successfully');
    } else {
        docObj.id = id;
        let index = ss.documents.findIndex(d => d.id === id);
        if (index > -1) {
            ss.documents[index] = docObj;
            EventEngine.dispatch('document_updated', 'Documents', `Document Updated: ${title}`, ss.id);
            showToast('Document updated successfully');
        }
    }
    
    saveData();
    closeDmsForm();
    renderDms();
};

window.deleteDocument = function() {
    if (!confirm('Are you sure you want to delete this document?')) return;
    let id = document.getElementById('dmsId').value;
    let ss = getSubstation(currentDashboardSSId);
    let doc = ss.documents.find(d => d.id === id);
    if (doc) {
        ss.documents = ss.documents.filter(d => d.id !== id);
        EventEngine.dispatch('document_deleted', 'Documents', `Document Deleted: ${doc.title}`, ss.id);
        saveData();
        showToast('Document deleted');
        closeDmsForm();
        renderDms();
    }
};

window.renderDms = function() {
    let ss = getSubstation(currentDashboardSSId);
    let docs = ss.documents || [];
    let search = document.getElementById('dmsSearch').value.toLowerCase();
    let recordFilter = document.getElementById('dmsFilterRecordId').value.toLowerCase();
    
    let filtered = docs.filter(d => {
        let matchFolder = d.folder === window.currentDmsFolder;
        let matchSearch = d.title.toLowerCase().includes(search) || (d.equipment && d.equipment.toLowerCase().includes(search));
        let matchRecord = recordFilter ? (d.recordId && d.recordId.toLowerCase().includes(recordFilter)) : true;
        return matchFolder && matchSearch && matchRecord;
    });
    
    let container = document.getElementById('dmsGrid');
    container.innerHTML = '';
    
    let total = docs.length;
    let pending = docs.filter(d => d.status === 'Pending Review').length;
    let expiring = docs.filter(d => {
        if (!d.expiry) return false;
        let expDate = new Date(d.expiry);
        let now = new Date();
        let diff = expDate - now;
        return diff > 0 && diff < (30 * 24 * 60 * 60 * 1000); // within 30 days
    }).length;
    
    document.getElementById('dmsTotalDocs').textContent = total;
    document.getElementById('dmsPendingDocs').textContent = pending;
    document.getElementById('dmsExpiringDocs').textContent = expiring;
    
    if (filtered.length === 0) {
        container.innerHTML = `<div class="empty-state" style="grid-column: 1 / -1;"><div class="empty-icon">📄</div><p>No documents found.</p></div>`;
        return;
    }
    
    filtered.sort((a,b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    filtered.forEach(d => {
        let statusColor = d.status === 'Approved' ? 'var(--success)' : (d.status === 'Pending Review' ? 'var(--warning)' : 'var(--text-secondary)');
        let div = document.createElement('div');
        div.className = 'doc-card';
        div.innerHTML = `
            <div class="doc-version">${d.version}</div>
            <div class="doc-icon">📄</div>
            <div class="doc-title" title="${d.title}">${d.title}</div>
            <div class="doc-meta">
                <span><strong>Status:</strong> <span style="color:${statusColor}">${d.status}</span></span>
                ${d.equipment ? `<span><strong>Eq:</strong> ${d.equipment}</span>` : ''}
                ${d.recordId ? `<span><strong>Ref:</strong> ${d.recordId}</span>` : ''}
                ${d.expiry ? `<span><strong>Expiry:</strong> ${d.expiry}</span>` : ''}
                <span>${new Date(d.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="doc-actions">
                <button class="doc-btn-view" onclick="window.open('${d.url}', '_blank')">👁️ View</button>
                <button class="doc-btn-edit" onclick="openDmsForm('${d.id}')">✏️ Edit</button>
            </div>
        `;
        container.appendChild(div);
    });
};

window.exportDmsPdf = function() {
    let ss = getSubstation(currentDashboardSSId);
    let opt = {
        margin: [10, 10, 10, 10],
        filename: `${ss.name}_Documents_${window.currentDmsFolder}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'landscape' }
    };
    html2pdf().set(opt).from(document.getElementById('dmsGrid')).save();
};

window.viewRelatedDocuments = function(recordId) {
    if (!recordId) {
        showToast('No Record ID found');
        return;
    }
    navigateTo('dms', currentDashboardSSId);
    
    let ss = getSubstation(currentDashboardSSId);
    let doc = (ss.documents || []).find(d => d.recordId === recordId);
    if (doc) {
        window.setDmsFolder(doc.folder);
    }
    
    let filterEl = document.getElementById('dmsFilterRecordId');
    if (filterEl) {
        filterEl.value = recordId;
    }
    renderDms();
};


function openPhotoForm(id = null) {
    let ss = getSubstation(currentDashboardSSId);
    let eqSelect = document.getElementById('ph_equipment');
    eqSelect.innerHTML = '<option value="">Select Equipment</option>';
    
    let eqSet = new Set();
    Object.keys(ss.feeders || {}).forEach(cat => {
        (ss.feeders[cat] || []).forEach(f => eqSet.add(f.name));
    });
    (ss.transformers || []).forEach(t => eqSet.add(t.name));
    Array.from(eqSet).sort().forEach(eq => {
        let opt = document.createElement('option');
        opt.value = eq;
        opt.textContent = eq;
        eqSelect.appendChild(opt);
    });

    if (id) {
        let p = (ss.photos || []).find(x => x.id === id);
        if (p) {
            document.getElementById('ph_id').value = p.id;
            document.getElementById('ph_url').value = p.url || '';
            document.getElementById('ph_preview').src = p.url || 'https://via.placeholder.com/400x200?text=No+Image';
            document.getElementById('ph_equipment').value = p.equipment || '';
            document.getElementById('ph_category').value = p.category || '';
            document.getElementById('ph_caption').value = p.caption || '';
            document.getElementById('ph_gps').value = p.gps || '';
            document.getElementById('ph_remarks').value = p.remarks || '';
            document.getElementById('ph_related_record').value = p.relatedRecord || '';
        }
    } else {
        document.getElementById('ph_id').value = '';
        document.getElementById('ph_url').value = '';
        document.getElementById('ph_preview').src = 'https://via.placeholder.com/400x200?text=No+Image';
        document.getElementById('ph_equipment').value = '';
        document.getElementById('ph_category').value = 'Fault Photo';
        document.getElementById('ph_caption').value = '';
        document.getElementById('ph_gps').value = '';
        document.getElementById('ph_remarks').value = '';
        document.getElementById('ph_related_record').value = '';
    }
    
    document.getElementById('photoDashboardSection').style.display = 'none';
    document.getElementById('photoFormSection').style.display = 'block';
}

function closePhotoForm() {
    document.getElementById('photoFormSection').style.display = 'none';
    document.getElementById('photoDashboardSection').style.display = 'block';
}

function savePhotoReport() {
    let ss = getSubstation(currentDashboardSSId);
    if (!ss.photos) ss.photos = [];
    
    let id = document.getElementById('ph_id').value;
    let isNew = !id;
    if (isNew) {
        id = 'PH-' + Date.now();
    }
    
    let url = document.getElementById('ph_url').value.trim();
    if (!url) {
        showToast('Photo URL is required');
        return;
    }
    
    let eq = document.getElementById('ph_equipment').value;
    let cat = document.getElementById('ph_category').value;
    let caption = document.getElementById('ph_caption').value.trim();
    
    let photoObj = {
        id: id,
        url: url,
        equipment: eq,
        category: cat,
        caption: caption,
        gps: document.getElementById('ph_gps').value.trim(),
        remarks: document.getElementById('ph_remarks').value.trim(),
        relatedRecord: document.getElementById('ph_related_record').value.trim(),
        substation: ss.name,
        timestamp: isNew ? new Date().toISOString() : ((ss.photos.find(p => p.id === id) || {}).timestamp || new Date().toISOString()),
        user: userOperator || 'User'
    };
    
    if (isNew) {
        ss.photos.push(photoObj);
    } else {
        let idx = ss.photos.findIndex(p => p.id === id);
        if (idx !== -1) ss.photos[idx] = photoObj;
    }
    
    saveSS(ss);
    
    EventEngine.dispatch(
        currentDashboardSSId,
        'Photo Report',
        isNew ? 'Photo Uploaded' : 'Photo Updated',
        `Photo for ${eq || 'Substation'}: ${caption || cat}`
    );
    
    closePhotoForm();
    renderPhotoReport();
    showToast('Photo saved successfully!');
}

function deletePhotoReport(id) {
    if (!confirm('Are you sure you want to delete this photo?')) return;
    let ss = getSubstation(currentDashboardSSId);
    let p = ss.photos.find(x => x.id === id);
    ss.photos = ss.photos.filter(x => x.id !== id);
    saveSS(ss);
    
    EventEngine.dispatch(
        currentDashboardSSId,
        'Photo Report',
        'Record Deleted',
        `Deleted photo: ${p ? (p.caption || p.id) : id}`
    );
    
    renderPhotoReport();
    showToast('Photo deleted');
}

function exportPhotoReportPDF() {
    let element = document.getElementById('photoGridContainer');
    let opt = {
      margin:       0.5,
      filename:     'Photo_Report.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(element).save();
}

// Keyboard Shortcut for Search
document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('globalSearch').focus();
    }
    if (e.key === 'Escape') {
        closeDrawer();
        profileDropdown.classList.remove('show');
        profileBtn.classList.remove('open');
        notifPanel.classList.remove('show');
        document.getElementById('globalSearch').blur();
    }
});

// Set Substations as default active on load
setActiveMenu('substations');
