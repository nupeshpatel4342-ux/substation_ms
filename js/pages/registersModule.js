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
            { id: 'op_ef', title: 'Equipment Failure Register', desc: 'Identified equipment defects and failures.', icon: 'broken_image', theme: 'theme-trip' },
            { id: 'op_inst', title: 'Instruction Register', desc: 'Important operational instructions from authorities.', icon: 'gavel', theme: 'theme-visitor' },
            { id: 'op_insp', title: 'Inspection Register', desc: 'Regular substation inspection logs.', icon: 'policy', theme: 'theme-inspect' },
            { id: 'op_vis', title: 'Visitor Register', desc: 'Record of all internal and external visitors.', icon: 'badge', theme: 'theme-visitor' },
            { id: 'op_log', title: 'Daily Log Book Register', desc: 'Master log of all daily events and parameters.', icon: 'menu_book', theme: 'theme-log' },
            { id: 'op_sw', title: 'Switching Operation Register', desc: 'Records of all switching operations and permits.', icon: 'sync_alt', theme: 'theme-switch' },
            { id: 'op_trip', title: 'Tripping Register', desc: 'Details of all relay trippings and fault clearings.', icon: 'offline_bolt', theme: 'theme-trip' },
            { id: 'op_shut', title: 'Shutdown Register', desc: 'Planned and emergency shutdowns details.', icon: 'power_off', theme: 'theme-shutdown' },
            { id: 'op_gp', title: 'Gate Pass Book', desc: 'Material and personnel gate passes.', icon: 'local_shipping', theme: 'theme-visitor' },
            { id: 'op_hlm', title: 'Hot Line Maintenance Register', desc: 'Hot line washing and maintenance.', icon: 'cleaning_services', theme: 'theme-maint' },
            { id: 'op_ed', title: 'Equipment Details Register', desc: 'Nameplate and parameter details.', icon: 'info', theme: 'theme-inspect' },
            { id: 'op_inv', title: 'Inventory Register', desc: 'Stock of materials and spares.', icon: 'inventory', theme: 'theme-log' },
            { id: 'op_di', title: 'Daily Interruption Register', desc: 'Daily supply interruptions.', icon: 'power_off', theme: 'theme-trip' },
            { id: 'op_fi', title: 'Feeder-wise Interruption Register', desc: 'Interruptions per feeder.', icon: 'format_list_bulleted', theme: 'theme-trip' },
            { id: 'op_sld', title: 'Statistical Load Data Register', desc: 'Hourly load and statistical data.', icon: 'bar_chart', theme: 'theme-meter' },
            { id: 'op_sea', title: 'Stage-wise Energy Audit Register', desc: 'Energy audit records.', icon: 'analytics', theme: 'theme-meter' },
            { id: 'op_msg', title: 'Message Register', desc: 'Operational messages and instructions.', icon: 'message', theme: 'theme-visitor' }
        ]
    },
    {
        title: "🧪 Testing Registers",
        items: [
            { id: 't_rel', title: 'Relay Testing Register', desc: 'Periodic protection relay calibration.', icon: 'settings_input_component', theme: 'theme-meter' },
            { id: 't_ctm', title: 'Current Transformer (CT) Maintenance Register', desc: 'Current Transformer tests.', icon: 'transform', theme: 'theme-meter' },
            { id: 't_ptm', title: 'Potential Transformer (PT) Maintenance Register', desc: 'Potential Transformer tests.', icon: 'transform', theme: 'theme-meter' },
            { id: 't_cbm', title: 'Circuit Breaker & Control Relay Panel Maintenance Register', desc: 'CRM, DCRM and timing tests.', icon: 'electrical_services', theme: 'theme-meter' },
            { id: 't_txt', title: 'Power Transformer Testing Register', desc: 'Oil BDV, DGA, IR and Tan Delta tests.', icon: 'ev_station', theme: 'theme-meter' },
            { id: 't_txm', title: 'Power Transformer Maintenance & Testing Register', desc: 'Transformer comprehensive maintenance.', icon: 'engineering', theme: 'theme-meter' },
            { id: 't_lam', title: 'Lightning Arrester Maintenance & Testing Register', desc: 'LA leakage current and maintenance.', icon: 'bolt', theme: 'theme-meter' },
            { id: 't_epr', title: 'Earth Pin Resistance Register', desc: 'Earth pit and grid resistance tests.', icon: 'grass', theme: 'theme-meter' },
            { id: 't_bl', title: 'Battery Load Test Register', desc: 'Battery bank discharging tests.', icon: 'battery_alert', theme: 'theme-meter' },
            { id: 't_bc', title: 'Battery Capacity Test Register', desc: 'Battery impedance and capacity checks.', icon: 'battery_full', theme: 'theme-meter' },
            { id: 't_ir', title: 'Insulation Resistance Test Register', desc: 'Megger records for all equipment.', icon: 'speed', theme: 'theme-meter' },
            { id: 't_sf6', title: 'SF6 Gas Testing Register', desc: 'Purity, moisture and dew point tests.', icon: 'science', theme: 'theme-meter' },
            { id: 't_cab', title: 'Control Cable Testing Register', desc: 'Cable IR and continuity tests.', icon: 'cable', theme: 'theme-meter' }
        ]
    },
    {
        title: "🛡 Safety & Compliance Registers",
        items: [
            { id: 's_tp', title: 'Test Permit Register', desc: 'Test permits for equipment testing.', icon: 'assignment', theme: 'theme-log' },
            { id: 's_wp', title: 'Work Permit Register', desc: 'Records of all PTWs issued and cancelled.', icon: 'assignment_turned_in', theme: 'theme-log' },
            { id: 's_fe', title: 'Fire Extinguisher Register', desc: 'Monthly checks of fire safety systems.', icon: 'fire_extinguisher', theme: 'theme-trip' },
            { id: 's_lc', title: 'Line Clear Permit (LC) Book', desc: 'Line clear permits.', icon: 'task', theme: 'theme-switch' },
            { id: 's_lcp', title: 'Line Clear Permit (LCP) Issued / Taken Register', desc: 'LCP issued and taken records.', icon: 'checklist_rtl', theme: 'theme-switch' },
            { id: 's_safe', title: 'Safety Equipment Register', desc: 'Inspection of gloves, earth rods, helmets.', icon: 'health_and_safety', theme: 'theme-maint' },
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
    
    // Category Tabs
    let html = `<div class="reg-tabs">`;
    registerCategories.forEach((cat, index) => {
        const isActive = index === currentRegCatIndex ? 'active' : '';
        // Extract "Operational", "Testing", "Safety" from "📝 Operational Registers"
        let shortTitle = cat.title.split(' ')[1]; 
        html += `<div class="reg-tab ${isActive}" onclick="switchRegisterCategory(${index})">${shortTitle}</div>`;
    });
    html += `</div>`;
    
    html += `<div class="reg-grid">`;
    const activeCat = registerCategories[currentRegCatIndex];
    if (activeCat && activeCat.items) {
        activeCat.items.forEach(item => {
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
    }
    html += `</div>`;
    
    container.innerHTML = html;
    
    // Re-apply filter if there's text in search box
    filterRegisters();
}

function updateEquipmentDropdown(bayName, targetId) {
    const targetSelect = document.getElementById(targetId);
    if (!targetSelect) return;
    
    // First time caching the original options
    if (!targetSelect.hasAttribute('data-original-options')) {
        targetSelect.setAttribute('data-original-options', targetSelect.innerHTML);
    }
    
    const originalHtml = targetSelect.getAttribute('data-original-options');
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `<select>${originalHtml}</select>`;
    const allOptions = Array.from(tempDiv.firstChild.options);
    
    targetSelect.innerHTML = ''; // Clear current
    
    allOptions.forEach(opt => {
        if (!opt.value || !bayName || opt.getAttribute('data-bay') === bayName) {
            targetSelect.add(opt.cloneNode(true));
        }
    });
    
    targetSelect.value = "";
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

// In-memory mock database for register entries (Persisted to localStorage)
let registerEntriesDB = {};
try {
    const stored = localStorage.getItem('substation_registers_db');
    if (stored) {
        registerEntriesDB = JSON.parse(stored);
    }
} catch (e) {
    console.error('Error loading from localStorage', e);
}

function saveToLocalStorage() {
    try {
        localStorage.setItem('substation_registers_db', JSON.stringify(registerEntriesDB));
    } catch (e) {
        console.error('Error saving to localStorage', e);
    }
}

function openCommonRegister(title) {
    if (typeof navigateTo === 'function') {
        navigateTo('commonRegisterView', window.currentDashboardSSId || 1, title);
    } else {
        window.currentActiveRegisterTitle = title;
        renderRegisterTableEntries(title);
        setTimeout(() => {
            applyRolePermissions();
        }, 500);
    }
}

function renderRegisterTableEntries(title) {
    const emptyState = document.getElementById('commonRegisterEmpty');
    const dummyRow = document.querySelector('.dummy-row');
    const tableBody = document.querySelector('#commonRegisterTable tbody');
    
    if(!tableBody) return;

    // Remove all dynamically added rows
    Array.from(tableBody.children).forEach(row => {
        if (row.id !== 'commonRegisterEmpty' && !row.classList.contains('dummy-row')) {
            row.remove();
        }
    });

    const entries = registerEntriesDB[title] || [];
    
    if (entries.length === 0) {
        if (emptyState) emptyState.style.display = 'table-row';
        if (dummyRow) dummyRow.style.display = 'none';
    } else {
        if (emptyState) emptyState.style.display = 'none';
        if (dummyRow) dummyRow.style.display = 'none';
        
        // Render entries (latest first)
        entries.forEach((entry, index) => {
            const newRow = document.createElement('tr');
            newRow.innerHTML = `
                <td>${entry.date}</td>
                <td>${entry.time}</td>
                <td>${entry.shift}</td>
                <td style="font-size: 13px;">${entry.details}</td>
                <td>${entry.remarks}</td>
                <td>Nupesh Patel</td>
                <td>
                    <button class="icon-btn" title="View" onclick="alert('Viewing Entry:\\nDate: ${entry.date}\\nTime: ${entry.time}\\nShift: ${entry.shift}')"><span class="material-icons-round" style="color: #1976d2; font-size:18px;">visibility</span></button>
                    <button class="icon-btn edit-btn" title="Edit" onclick="editRegisterEntry('${title}', ${index})"><span class="material-icons-round" style="color: #f57c00; font-size:18px;">edit</span></button>
                    <button class="icon-btn delete-btn" title="Delete" onclick="deleteRegisterEntry('${title}', ${index})"><span class="material-icons-round" style="color: #d32f2f; font-size:18px;">delete</span></button>
                </td>
            `;
            tableBody.appendChild(newRow);
        });
    }
}

function editRegisterEntry(title, index) {
    const entry = registerEntriesDB[title][index];
    window.currentEditingRegisterIndex = index;
    openRegisterEntryModal();
    
    setTimeout(() => {
        const dateInput = document.getElementById('regEntryDate');
        const timeInput = document.getElementById('regEntryTime');
        const shiftInput = document.getElementById('regEntryShift');
        const remarksInput = document.getElementById('regEntryRemarks');
        
        if(dateInput) dateInput.value = entry.date || '';
        if(timeInput) timeInput.value = entry.time || '';
        if(remarksInput) remarksInput.value = entry.remarks === '-' ? '' : entry.remarks;
        
        if(shiftInput) {
            for(let i=0; i<shiftInput.options.length; i++) {
                if(shiftInput.options[i].text === entry.shift) {
                    shiftInput.selectedIndex = i;
                    break;
                }
            }
        }
        
        // Parse the dynamic details HTML back into form fields
        const container = document.getElementById('dynamicFormFieldsContainer');
        if(container && entry.details) {
            const dynamicInputs = container.querySelectorAll('input, select, textarea');
            const detailsLines = entry.details.split('<br>');
            
            detailsLines.forEach(line => {
                let match = line.match(/<b>(.*?)<\/b>:\s*(.*)/);
                if(match) {
                    let nameLabel = match[1].trim(); // e.g. "EquipmentName"
                    let val = match[2].trim();
                    if(val === '-') val = '';
                    
                    dynamicInputs.forEach(input => {
                        let fieldNameFormatted = input.name.charAt(0).toUpperCase() + input.name.slice(1);
                        if(fieldNameFormatted === nameLabel || input.name === nameLabel.toLowerCase()) {
                            if(input.tagName === 'SELECT') {
                                for(let i=0; i<input.options.length; i++) {
                                    if(input.options[i].text === val || input.options[i].value === val) {
                                        input.selectedIndex = i;
                                        break;
                                    }
                                }
                            } else {
                                input.value = val;
                            }
                        }
                    });
                }
            });
        }
    }, 100);
}

function deleteRegisterEntry(title, index) {
    if(confirm('Are you sure you want to delete this entry?')) {
        registerEntriesDB[title].splice(index, 1);
        saveToLocalStorage();
        renderRegisterTableEntries(title);
        showToast('Entry deleted successfully');
    }
}

function openRegisterEntryModal() {
    const modal = document.getElementById('genericRegisterModal');
    if (modal) {
        const container = document.getElementById('dynamicFormFieldsContainer');
        if (container && typeof registerFieldSchemas !== 'undefined') {
            const title = window.currentActiveRegisterTitle || "default";
            const schema = registerFieldSchemas[title] || registerFieldSchemas["default"];
            
            let html = `
                <div style="grid-column: 1 / -1; margin-top: 15px; margin-bottom: 5px; padding-bottom: 8px; border-bottom: 1px solid var(--border-light);">
                    <span style="color: var(--primary); font-weight: 600; font-size: 14px; display: flex; align-items: center; gap: 6px;">
                        <span class="material-icons-round" style="font-size: 18px;">auto_awesome</span>
                        Specific Fields for ${title}
                    </span>
                </div>
            `;
            schema.forEach(field => {
                const requiredAttr = field.required ? 'required' : '';
                const requiredAsterisk = field.required ? ' *' : '';
                const gridColumn = field.width === 'full' ? '1 / -1' : 'span 1';
                
                let inputHtml = '';
                if (field.type === 'select-bay') {
                    let ss = getSubstation(currentDashboardSSId || 1);
                    let bays = ss && ss.equipmentMaster ? [...new Set(ss.equipmentMaster.map(eq => eq.bayNumber).filter(Boolean))] : [];
                    inputHtml = `<select class="form-control" id="regField_${field.name}" name="${field.name}" ${requiredAttr} onchange="updateEquipmentDropdown(this.value, 'regField_equipmentMasterName')">
                        <option value="">Select ${field.label}</option>
                        ${bays.map(b => `<option value="${b}">${b}</option>`).join('')}
                    </select>`;
                } else if (field.type === 'select-equipment') {
                    // It will be populated dynamically based on bay selection, but we render all as default initially
                    let ss = getSubstation(currentDashboardSSId || 1);
                    let eqs = ss && ss.equipmentMaster ? ss.equipmentMaster : [];
                    inputHtml = `<select class="form-control" id="regField_${field.name}" name="${field.name}" ${requiredAttr}>
                        <option value="">Select ${field.label}</option>
                        ${eqs.map(eq => `<option value="${eq.name}" data-bay="${eq.bayNumber || ''}">${eq.name}</option>`).join('')}
                    </select>`;
                } else if (field.type === 'select') {
                    inputHtml = `<select class="form-control" name="${field.name}" ${requiredAttr}>
                        <option value="">Select ${field.label}</option>
                        ${field.options.map(opt => `<option value="${opt}">${opt}</option>`).join('')}
                    </select>`;
                } else if (field.type === 'textarea') {
                    inputHtml = `<textarea class="form-control" name="${field.name}" rows="3" placeholder="Enter ${field.label.toLowerCase()}..." ${requiredAttr}></textarea>`;
                } else {
                    inputHtml = `<input type="${field.type}" class="form-control" name="${field.name}" placeholder="Enter ${field.label.toLowerCase()}" ${requiredAttr}>`;
                }
                
                html += `
                <div class="form-group" style="grid-column: ${gridColumn};">
                    <label class="form-label">${field.label}${requiredAsterisk}</label>
                    ${inputHtml}
                </div>`;
            });
            
            container.innerHTML = html;
        }
        
        modal.style.display = 'block';
    } else {
        showToast("Modal not found in DOM");
    }
}

function closeRegisterEntryModal() {
    window.currentEditingRegisterIndex = null;
    const modal = document.getElementById('genericRegisterModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function saveRegisterEntry() {
    const dateInput = document.getElementById('regEntryDate');
    const timeInput = document.getElementById('regEntryTime');
    const shiftInput = document.getElementById('regEntryShift');
    const remarksInput = document.getElementById('regEntryRemarks');
    
    // Basic validation
    if(!dateInput.value || !timeInput.value || !shiftInput.value) {
        showToast("Please fill all required fields (Date, Time, Shift)!");
        return;
    }

    const title = window.currentActiveRegisterTitle;
    if(!title) return;

    // Extract shift display text
    const shiftText = shiftInput.options[shiftInput.selectedIndex].text;
    
    // Generate a summary from dynamic fields for the "Details" column
    const container = document.getElementById('dynamicFormFieldsContainer');
    const dynamicInputs = container.querySelectorAll('input, select, textarea');
    let detailsArr = [];
    dynamicInputs.forEach(input => {
        if(input.value && input.name) {
            let displayVal = input.value;
            if(input.tagName === 'SELECT' && input.selectedIndex > 0) {
                displayVal = input.options[input.selectedIndex].text;
            }
            detailsArr.push(`<b>${input.name.charAt(0).toUpperCase() + input.name.slice(1)}:</b> ${displayVal}`);
        }
    });
    
    let detailsHtml = detailsArr.length > 0 ? detailsArr.join('<br>') : '<i style="color:#888;">No details provided</i>';
    let remarksText = remarksInput.value ? remarksInput.value : '-';

    const newEntry = {
        date: dateInput.value,
        time: timeInput.value,
        shift: shiftText,
        details: detailsHtml,
        remarks: remarksText
    };

    if(!registerEntriesDB[title]) {
        registerEntriesDB[title] = [];
    }
    
    if (typeof window.currentEditingRegisterIndex !== 'undefined' && window.currentEditingRegisterIndex !== null) {
        // Update existing entry
        registerEntriesDB[title][window.currentEditingRegisterIndex] = newEntry;
        window.currentEditingRegisterIndex = null;
        showToast("Entry updated successfully!");
    } else {
        // Add to front of array so newest is top
        registerEntriesDB[title].unshift(newEntry);
        showToast("Entry saved successfully!");
    }
    
    saveToLocalStorage();
    
    renderRegisterTableEntries(title);
    
    closeRegisterEntryModal();
    
    // Reset form
    dateInput.value = '';
    timeInput.value = '';
    shiftInput.value = '';
    remarksInput.value = '';
    dynamicInputs.forEach(input => input.value = '');
}

// Hook into DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Attempt to render registers if container is already there
    setTimeout(renderRegistersCards, 100);
});
