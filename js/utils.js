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
        { id:'f6',  name:'66 K.V. TR-2 H.V-2',                      mf:1.5, role:'tr_hv' },
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
    equipmentMaster: [], // Will be auto-populated by migration
    oppositeSSEntries: [
        { id:'o1', name:'MANSAR SS END (E)',         linkedFeederId:'f1' },
        { id:'o2', name:'MANSAR SS END (I)',         linkedFeederId:'f2' },
        { id:'o3', name:'GHANSHYAMGADH SS END (E)',  linkedFeederId:'f4' },
        { id:'o4', name:'GHANSHYAMGADH SS END (I)',  linkedFeederId:'f3' }
    ],
    reports: {},
    events: [],
    faults: [],
    trippings: [],
    maintenance: [],
    breakdowns: []
};


// ===================================================================
//  SECURITY HELPERS — output encoding and URL validation
// ===================================================================
function escapeHtml(value) {
    return String(value ?? '').replace(/[&<>"']/g, ch => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[ch]));
}

function sanitizeUrl(value, fallback = '#') {
    try {
        const url = new URL(String(value || ''), window.location.origin);
        if (url.protocol === 'https:' || url.protocol === 'http:') return url.href;
    } catch (e) {
        // Invalid URLs intentionally fall through to fallback.
    }
    return fallback;
}

function openSafeUrl(value) {
    const safeUrl = sanitizeUrl(value);
    if (safeUrl === '#') {
        alert('Invalid or unsupported URL.');
        return;
    }
    const opened = window.open(safeUrl, '_blank', 'noopener,noreferrer');
    if (opened) opened.opener = null;
}

// ===================================================================
//  DATA MANAGEMENT — LocalStorage
// ===================================================================
const STORAGE_KEY = '66kv_substations';

function loadSubstations() {
    let data = localStorage.getItem(STORAGE_KEY);
    let list;
    if (!data) {
        // First load: seed with Halvad-3 sample
        list = [JSON.parse(JSON.stringify(HALVAD3_SAMPLE))];
    } else {
        try {
            list = JSON.parse(data);
        } catch (e) {
            console.error('Stored substation data is corrupted and could not be parsed.', e);
            list = [JSON.parse(JSON.stringify(HALVAD3_SAMPLE))];
            saveSubstations(list);
        }
    }
    
    // Auto-migrate legacy equipment data to Equipment Master
    let needsSave = false;
    list.forEach(ss => {
        if (!ss.equipmentMaster) {
            ss.equipmentMaster = [];
            needsSave = true;
            
            // Migrate Feeders
            if (ss.feeders) {
                ss.feeders.forEach(f => {
                    let cat = '11 KV Feeder';
                    if (f.role === '66kv_incoming') cat = '66 KV Incoming Line';
                    if (f.role === '66kv_outgoing') cat = '66 KV Outgoing Line';
                    if (f.role === 'tr_hv' || f.role === 'tr_lv') cat = 'Control Panel';
                    
                    ss.equipmentMaster.push({
                        id: f.id,
                        category: cat,
                        name: f.name,
                        voltageLevel: cat.includes('66') ? '66 KV' : '11 KV',
                        manufacturer: '',
                        capacity: '',
                        status: 'Healthy',
                        installDate: '',
                        // Legacy mappings
                        mf: f.mf,
                        role: f.role
                    });
                });
            }
            
            // Migrate Transformers
            if (ss.transformers) {
                ss.transformers.forEach(t => {
                    ss.equipmentMaster.push({
                        id: t.id,
                        category: 'Power Transformer',
                        name: t.name,
                        voltageLevel: '66/11 KV',
                        manufacturer: '',
                        capacity: '',
                        status: 'Healthy',
                        installDate: '',
                        hvFeederId: t.hvFeederId,
                        lvFeederId: t.lvFeederId
                    });
                });
            }
        }
        
        // Ensure other arrays exist
        ['events', 'faults', 'trippings', 'maintenance', 'breakdowns', 'documents', 'photos'].forEach(arr => {
            if (!ss[arr]) { ss[arr] = []; needsSave = true; }
        });
    });
    
    if (needsSave) {
        saveSubstations(list);
    }
    
    return list;
}

function saveSubstations(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

function preloadSampleEquipment(ss) {
    if (ss.name === '66 K.V. HALVAD-3 S/S') {
        if (!ss.equipmentMaster) ss.equipmentMaster = [];

        // Fix typo in existing local storage for Halvad-3 TR-2 feeder
        if (ss.feeders) {
            let f6 = ss.feeders.find(f => f.id === 'f6' && f.name === '66 K.V. TR-1 H.V-2');
            if (f6) f6.name = '66 K.V. TR-2 H.V-2';
        }

        let hasDynamicSample = ss.equipmentMaster.some(eq => eq.isDynamicSampleV16 === true);
        if (!hasDynamicSample) {
            // FORCE A COMPLETE WIPE to fix any corrupted old data or manual test entries on the live server
            ss.equipmentMaster = [];

            let newSampleData = [];
            let processedTransformers = new Set();

            // 1. Generate related equipment for Feeders (Deduplicate Import/Export lines)
            if (ss.feeders) {
                let processedLines = new Set();
                
                ss.feeders.forEach(f => {
                    // Extract base name by stripping (I), (E), INPORT, EXPORT, IMPORT
                    let baseName = f.name.replace(/\s*\((I|E)\)\s*$/i, '')
                                         .replace(/\s*(INPORT|IMPORT|EXPORT)\s*$/i, '')
                                         .trim();
                    
                    // Skip if we already created physical equipment for this line
                    if (processedLines.has(baseName)) return;
                    processedLines.add(baseName);

                    // If this is an HV Breaker for a transformer, insert the main Transformer equipment FIRST
                    if (f.role === 'tr_hv' && ss.transformers) {
                        let t = ss.transformers.find(tr => tr.hvFeederId === f.id);
                        if (!t) {
                            let trMatch = f.name.match(/TR\s*-?\s*(\d+)/i);
                            if (trMatch) {
                                let trNum = trMatch[1]; // Just the number
                                t = ss.transformers.find(tr => tr.name.replace(/[^a-zA-Z0-9]/g, '').toUpperCase().includes('TR' + trNum));
                            }
                        }
                        
                        if (t && !processedTransformers.has(t.name)) {
                            processedTransformers.add(t.name);
                            // The Transformer Itself
                            newSampleData.push({ id: generateId(), name: t.name, category: 'Power Transformer', voltageLevel: '66/11 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Crompton Greaves' });
                            // Associated Equipment
                            newSampleData.push({ id: generateId(), name: t.name + ' - LA', category: 'Lightning Arrester', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Oblum' });
                            newSampleData.push({ id: generateId(), name: t.name + ' - RTCC Panel', category: 'Control Panel', voltageLevel: '110V DC', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'EASUN' });
                            newSampleData.push({ id: generateId(), name: t.name + ' - Neutral Earth Pit', category: 'Earthing', voltageLevel: '-', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Local' });
                        }
                    }

                    if (f.role === '66kv_incoming' || f.role === '66kv_outgoing') {
                        // The Line Itself
                        newSampleData.push({ id: generateId(), name: baseName, category: f.role === '66kv_incoming' ? '66 KV Incoming Line' : '66 KV Outgoing Line', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: '-' });
                        // Associated Equipment
                        newSampleData.push({ id: generateId(), name: baseName + ' - LA', category: 'Lightning Arrester', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Oblum' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - Circuit Breaker', category: 'Breaker', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Alstom' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - CT', category: 'CT/PT', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'ABB' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - Line Isolator', category: 'Isolator', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'S&S Power' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - Bus Isolator', category: 'Isolator', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'S&S Power' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - CRP Panel', category: 'Control Panel', voltageLevel: '110V DC', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Siemens' });
                    } else if (f.role === '11kv_feeder' || f.role === 'solar_export' || f.role === 'solar_import') {
                        // Associated Equipment (Only Breaker and Relay for 11KV)
                        newSampleData.push({ id: generateId(), name: baseName + ' - VCB Panel', category: 'Breaker', voltageLevel: '11 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Schneider' });
                        newSampleData.push({ id: generateId(), name: baseName + ' - Relay Panel', category: 'Relay', voltageLevel: '110V DC', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'ABB' });
                    } else if (f.role === 'tr_hv') {
                        newSampleData.push({ id: generateId(), name: f.name + ' - HV Breaker', category: 'Breaker', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'CGL' });
                        newSampleData.push({ id: generateId(), name: f.name + ' - HV CT', category: 'CT/PT', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'BHEL' });
                    } else if (f.role === 'tr_lv') {
                        newSampleData.push({ id: generateId(), name: f.name + ' - LV VCB Panel', category: 'Breaker', voltageLevel: '11 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Siemens' });
                        newSampleData.push({ id: generateId(), name: f.name + ' - LV CT', category: 'CT/PT', voltageLevel: '11 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'BHEL' });
                    }
                });
            }

            // 2. Generate any remaining Transformers that didn't match a feeder
            if (ss.transformers) {
                ss.transformers.forEach(t => {
                    if (!processedTransformers.has(t.name)) {
                        processedTransformers.add(t.name);
                        // The Transformer Itself
                        newSampleData.push({ id: generateId(), name: t.name, category: 'Power Transformer', voltageLevel: '66/11 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Crompton Greaves' });
                        // Associated Equipment
                        newSampleData.push({ id: generateId(), name: t.name + ' - LA', category: 'Lightning Arrester', voltageLevel: '66 KV', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Oblum' });
                        newSampleData.push({ id: generateId(), name: t.name + ' - RTCC Panel', category: 'Control Panel', voltageLevel: '110V DC', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'EASUN' });
                        newSampleData.push({ id: generateId(), name: t.name + ' - Neutral Earth Pit', category: 'Earthing', voltageLevel: '-', status: 'Healthy', isDynamicSampleV16: true, manufacturer: 'Local' });
                    }
                });
            }

            // 3. Keep some generic station equipment
            newSampleData.push({ id: generateId(), name: 'Main Station Earth Mat', category: 'Earthing', voltageLevel: '-', status: 'Healthy', isDynamicSampleV4: true, manufacturer: '-' });
            newSampleData.push({ id: generateId(), name: '110V Battery Bank', category: 'Battery', voltageLevel: '110V DC', status: 'Healthy', isDynamicSampleV4: true, manufacturer: 'Exide' });
            newSampleData.push({ id: generateId(), name: 'Station DG Set 125kVA', category: 'Auxiliary', voltageLevel: '415V AC', status: 'Healthy', isDynamicSampleV4: true, manufacturer: 'Cummins' });
            newSampleData.push({ id: generateId(), name: 'Fire Fighting System', category: 'Safety', voltageLevel: '-', status: 'Healthy', isDynamicSampleV4: true, manufacturer: 'Minimax' });

            newSampleData.forEach(item => ss.equipmentMaster.push(item));
            return true;
        }
    }
    return false;
}

function getSubstation(id) {
    let list = loadSubstations();
    let ss = list.find(s => s.id === id);
    if (ss && preloadSampleEquipment(ss)) {
        saveSubstations(list);
    }
    return ss;
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
let edTimeInterval = null;

