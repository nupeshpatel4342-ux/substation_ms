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

