// ===== REGISTERS MODULE DATA & LOGIC =====

const registerCategories = [
    {
        title: "📝 Operational Registers",
        items: [
            { id: 'op_batt', title: 'Battery Maintenance Register', desc: 'Daily voltage and specific gravity records.', icon: 'battery_charging_full', theme: 'theme-log' },
            { id: 'op_check', title: 'Daily Checklist Register', desc: 'Routine visual and operational checks.', icon: 'checklist', theme: 'theme-maint' },
            { id: 'op_hoto', title: 'HO / TO Register', desc: 'Hand Over and Take Over between shifts.', icon: 'handshake', theme: 'theme-switch' },
            { id: 'op_maint', title: 'Daily Maintenance Register', desc: 'Routine minor maintenance activities.', icon: 'build', theme: 'theme-maint' },
            { id: 'op_weath', title: 'Daily Weather Register', desc: 'Temperature, humidity and weather conditions.', icon: 'wb_sunny', theme: 'theme-inspect' },
            { id: 'op_la', title: 'LA Counter Register', desc: 'Lightning Arrester strike counts and currents.', icon: 'flash_on', theme: 'theme-trip' },
            { id: 'op_def', title: 'Defect Register', desc: 'Identified equipment defects and rectification status.', icon: 'report_problem', theme: 'theme-trip' },
            { id: 'op_inst', title: 'Instruction Register', desc: 'Important operational instructions from authorities.', icon: 'gavel', theme: 'theme-visitor' },
            { id: 'op_insp', title: 'Inspection Register', desc: 'Regular substation inspection logs.', icon: 'policy', theme: 'theme-inspect' },
            { id: 'op_vis', title: 'Visitor Register', desc: 'Record of all internal and external visitors.', icon: 'badge', theme: 'theme-visitor' },
            { id: 'op_log', title: 'Daily Log Book Register', desc: 'Master log of all daily events and parameters.', icon: 'menu_book', theme: 'theme-log' },
            { id: 'op_sw', title: 'Switching Operation Register', desc: 'Records of all switching operations and permits.', icon: 'sync_alt', theme: 'theme-switch' },
            { id: 'op_trip', title: 'Tripping Register', desc: 'Details of all relay trippings and fault clearings.', icon: 'offline_bolt', theme: 'theme-trip' },
            { id: 'op_shut', title: 'Shutdown Register', desc: 'Planned and emergency shutdowns details.', icon: 'power_off', theme: 'theme-shutdown' }
        ]
    },
    {
        title: "🧪 Testing Registers",
        items: [
            { id: 't_rel', title: 'Relay Testing Register', desc: 'Periodic protection relay calibration.', icon: 'settings_input_component', theme: 'theme-meter' },
            { id: 't_ct', title: 'CT Testing Register', desc: 'Current Transformer tests.', icon: 'transform', theme: 'theme-meter' },
            { id: 't_pt', title: 'PT / CVT Testing Register', desc: 'Potential Transformer tests.', icon: 'transform', theme: 'theme-meter' },
            { id: 't_cb', title: 'Circuit Breaker Testing Register', desc: 'CRM, DCRM and timing tests.', icon: 'electrical_services', theme: 'theme-meter' },
            { id: 't_tx', title: 'Transformer Testing Register', desc: 'Oil BDV, DGA, IR and Tan Delta tests.', icon: 'ev_station', theme: 'theme-meter' },
            { id: 't_bl', title: 'Battery Load Test Register', desc: 'Battery bank discharging tests.', icon: 'battery_alert', theme: 'theme-meter' },
            { id: 't_bc', title: 'Battery Capacity Test Register', desc: 'Battery impedance and capacity checks.', icon: 'battery_full', theme: 'theme-meter' },
            { id: 't_er', title: 'Earth Resistance Test Register', desc: 'Earth pit and grid resistance tests.', icon: 'grass', theme: 'theme-meter' },
            { id: 't_ir', title: 'Insulation Resistance Test Register', desc: 'Megger records for all equipment.', icon: 'speed', theme: 'theme-meter' },
            { id: 't_la', title: 'Lightning Arrester Testing Register', desc: 'LA leakage current tests.', icon: 'bolt', theme: 'theme-meter' },
            { id: 't_sf6', title: 'SF6 Gas Testing Register', desc: 'Purity, moisture and dew point tests.', icon: 'science', theme: 'theme-meter' },
            { id: 't_cab', title: 'Control Cable Testing Register', desc: 'Cable IR and continuity tests.', icon: 'cable', theme: 'theme-meter' }
        ]
    },
    {
        title: "🛡 Safety & Compliance Registers",
        items: [
            { id: 's_mat', title: 'Material / Spare Register', desc: 'Inventory of critical spares and tools.', icon: 'inventory_2', theme: 'theme-inspect' },
            { id: 's_safe', title: 'Safety Equipment Register', desc: 'Inspection of gloves, earth rods, helmets.', icon: 'health_and_safety', theme: 'theme-maint' },
            { id: 's_ptw', title: 'Permit To Work (PTW) Register', desc: 'Records of all PTWs issued and cancelled.', icon: 'assignment_turned_in', theme: 'theme-log' },
            { id: 's_fire', title: 'Fire Extinguisher Inspection Register', desc: 'Monthly checks of fire safety systems.', icon: 'fire_extinguisher', theme: 'theme-trip' },
            { id: 's_ldc', title: 'LDC Communication Register', desc: 'Messages and codes from Load Dispatch.', icon: 'record_voice_over', theme: 'theme-visitor' },
            { id: 's_cal', title: 'Calibration Register', desc: 'Calibration status of all testing kits.', icon: 'fact_check', theme: 'theme-inspect' },
            { id: 's_train', title: 'Training Register', desc: 'Staff training and mock drill records.', icon: 'model_training', theme: 'theme-log' },
            { id: 's_aud', title: 'Audit Observation Register', desc: 'Internal and external audit findings.', icon: 'plagiarism', theme: 'theme-switch' },
            { id: 's_comp', title: 'Compliance Register', desc: 'Statutory compliance tracking.', icon: 'verified_user', theme: 'theme-maint' }
        ]
    }
];

let currentRegCatIndex = parseInt(localStorage.getItem('lastRegisterCategory') || '0');

function switchRegisterCategory(index) {
    currentRegCatIndex = index;
    localStorage.setItem('lastRegisterCategory', index.toString());
    renderRegistersCards();
}

function renderRegistersCards() {
    const container = document.getElementById('registersContainer');
    if (!container) return;
    
    // Validate index
    if (currentRegCatIndex < 0 || currentRegCatIndex >= registerCategories.length) {
        currentRegCatIndex = 0;
    }
    
    let html = '<div class="reg-tabs">';
    registerCategories.forEach((cat, idx) => {
        const activeClass = (idx === currentRegCatIndex) ? 'active' : '';
        html += `<button class="reg-tab ${activeClass}" onclick="switchRegisterCategory(${idx})">${cat.title}</button>`;
    });
    html += '</div>';
    
    const activeCategory = registerCategories[currentRegCatIndex];
    html += `<div class="reg-grid">`;
    activeCategory.items.forEach(item => {
        html += `
            <div class="reg-card ${item.theme} register-item" data-title="${item.title.toLowerCase()}" onclick="openCommonRegister('${item.title}')" style="cursor: pointer;">
                <div>
                    <div class="reg-card-icon"><span class="material-icons-round">${item.icon}</span></div>
                    <div class="reg-card-title">${item.title}</div>
                    <div class="reg-card-desc">${item.desc}</div>
                </div>
                <div class="reg-card-action">
                    <span>Open Register</span>
                    <span class="material-icons-round">arrow_forward</span>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    
    container.innerHTML = html;
    
    // Re-apply filter if there's text in search box
    filterRegisters();
}

function filterRegisters() {
    const searchInput = document.getElementById('regSearchInput');
    if (!searchInput) return;
    
    const term = searchInput.value.toLowerCase();
    const items = document.querySelectorAll('.register-item');
    
    items.forEach(item => {
        if (item.dataset.title.includes(term)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

// Mock Role-Based Access Control
const currentUserRole = 'Admin'; // Could be 'Super Admin', 'Admin', 'AE', 'JE', 'Operator', 'Viewer'

function applyRolePermissions() {
    const addBtn = document.getElementById('btnAddNewEntry');
    const editBtns = document.querySelectorAll('.edit-btn');
    const deleteBtns = document.querySelectorAll('.delete-btn');
    
    if (currentUserRole === 'Viewer') {
        if(addBtn) addBtn.style.display = 'none';
        editBtns.forEach(btn => btn.style.display = 'none');
        deleteBtns.forEach(btn => btn.style.display = 'none');
    } else if (currentUserRole === 'Operator') {
        deleteBtns.forEach(btn => btn.style.display = 'none'); // Operators can't delete
    }
}

function openCommonRegister(title) {
    if (typeof navigateTo === 'function') {
        navigateTo('commonRegisterView', window.currentDashboardSSId || 1);
        
        const headerTitle = document.getElementById('headerTitle');
        const headerSubtitle = document.getElementById('headerSubtitle');
        
        if(headerTitle) headerTitle.textContent = title;
        if(headerSubtitle) {
            let desc = 'Manage entries for ' + title;
            for(let cat of registerCategories) {
                const found = cat.items.find(i => i.title === title);
                if (found) {
                    desc = found.desc;
                    break;
                }
            }
            headerSubtitle.textContent = desc;
        }
        
        // Setup Back Button to return to Registers View instead of ssDashboard
        const headerBack = document.getElementById('headerBack');
        if (headerBack) {
            headerBack.onclick = () => {
                navigateTo('registersView', window.currentDashboardSSId || 1);
            };
        }
    }
    
    // Simulate loading
    const emptyState = document.getElementById('commonRegisterEmpty');
    const dummyRow = document.querySelector('.dummy-row');
    
    if (emptyState) emptyState.style.display = 'table-row';
    if (dummyRow) dummyRow.style.display = 'none';
    
    setTimeout(() => {
        if (emptyState) emptyState.style.display = 'none';
        if (dummyRow) dummyRow.style.display = 'table-row';
        applyRolePermissions();
    }, 500);
}

function openRegisterEntryModal() {
    const modal = document.getElementById('genericRegisterModal');
    if (modal) {
        modal.style.display = 'flex';
    } else {
        showToast("Modal not found in DOM");
    }
}

function closeRegisterEntryModal() {
    const modal = document.getElementById('genericRegisterModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveRegisterEntry() {
    showToast("Entry saved successfully!");
    closeRegisterEntryModal();
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Attempt to render registers if container is already there
    setTimeout(renderRegistersCards, 100);
});
