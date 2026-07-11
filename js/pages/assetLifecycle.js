// assetLifecycle.js

function renderAssetLifecycleDashboard() {
    const ss = getSubstation(currentDashboardSSId);
    if (!ss) return;

    let eqMaster = ss.equipmentMaster || [];
    
    // KPI Calculation
    let totalAssets = eqMaster.length;
    let healthyCount = 0;
    let maintenanceCount = 0;
    let failedCount = 0;
    let warningCount = 0;

    // We assign mock status for demo if not present
    eqMaster.forEach(eq => {
        if (!eq.healthStatus) {
            let rnd = Math.random();
            if (rnd < 0.7) eq.healthStatus = 'Healthy';
            else if (rnd < 0.85) eq.healthStatus = 'Maintenance';
            else if (rnd < 0.95) eq.healthStatus = 'Warning';
            else eq.healthStatus = 'Failed';
        }

        if (eq.healthStatus === 'Healthy') healthyCount++;
        else if (eq.healthStatus === 'Maintenance') maintenanceCount++;
        else if (eq.healthStatus === 'Warning') warningCount++;
        else failedCount++;
    });

    let kpiHtml = `
        <div class="alc-kpi-grid">
            <div class="alc-kpi-card">
                <span class="alc-kpi-icon"><span class="material-icons-round">inventory_2</span></span>
                <div class="alc-kpi-value">${totalAssets}</div>
                <div class="alc-kpi-label">Total Assets</div>
            </div>
            <div class="alc-kpi-card healthy">
                <span class="alc-kpi-icon"><span class="material-icons-round">verified</span></span>
                <div class="alc-kpi-value">${healthyCount}</div>
                <div class="alc-kpi-label">Healthy Assets</div>
            </div>
            <div class="alc-kpi-card maintenance">
                <span class="alc-kpi-icon"><span class="material-icons-round">build_circle</span></span>
                <div class="alc-kpi-value">${maintenanceCount}</div>
                <div class="alc-kpi-label">Under Maintenance</div>
            </div>
            <div class="alc-kpi-card warning">
                <span class="alc-kpi-icon"><span class="material-icons-round">report_problem</span></span>
                <div class="alc-kpi-value">${warningCount}</div>
                <div class="alc-kpi-label">Warning / EOL</div>
            </div>
            <div class="alc-kpi-card failed">
                <span class="alc-kpi-icon"><span class="material-icons-round">dangerous</span></span>
                <div class="alc-kpi-value">${failedCount}</div>
                <div class="alc-kpi-label">Failed Equipment</div>
            </div>
        </div>
    `;

    let tableHtml = `
        <div class="alc-controls">
            <div class="alc-filters">
                <input type="text" id="alcSearch" class="form-control" placeholder="Search Asset..." oninput="filterAssetLifecycle()" style="width:200px;">
                <select id="alcStatusFilter" class="form-control" onchange="filterAssetLifecycle()">
                    <option value="all">All Status</option>
                    <option value="Healthy">Healthy</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Warning">Warning</option>
                    <option value="Failed">Failed</option>
                </select>
            </div>
            <div class="alc-actions">
                <button class="btn btn-outline" onclick="alert('Export to Excel')"> Excel</button>
                <button class="btn btn-outline" onclick="alert('Export to PDF')"> PDF</button>
                <button class="btn btn-outline" onclick="window.print()"> Print</button>
            </div>
        </div>
        <div class="table-responsive">
            <table class="data-table alc-mobile-table">
                <thead>
                    <tr>
                        <th>Asset ID</th>
                        <th>Equipment Name</th>
                        <th>Category</th>
                        <th>Bay</th>
                        <th>Health Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody id="alcTableBody">
                    ${eqMaster.map(eq => `
                        <tr class="alc-row" data-status="${eq.healthStatus}" data-name="${(eq.name || '').toLowerCase()}">
                            <td data-label="Asset ID">${eq.id}</td>
                            <td data-label="Equipment" style="font-weight:600">${eq.name || 'N/A'}</td>
                            <td data-label="Category">${eq.category || 'N/A'}</td>
                            <td data-label="Bay">${eq.bayNumber || 'N/A'}</td>
                            <td data-label="Status"><span class="alc-badge alc-badge-${getBadgeColor(eq.healthStatus)}">${eq.healthStatus}</span></td>
                            <td data-label="Action">
                                <button class="btn btn-primary" style="padding:4px 8px; font-size:12px;" onclick="navigateTo('assetLifecycleProfile', '${ss.id}', '${eq.id}')">View Profile</button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('assetLifecycleDashboardContent').innerHTML = kpiHtml + tableHtml;
}

function filterAssetLifecycle() {
    let search = document.getElementById('alcSearch').value.toLowerCase();
    let status = document.getElementById('alcStatusFilter').value;
    
    document.querySelectorAll('.alc-row').forEach(row => {
        let matchSearch = row.dataset.name.includes(search) || row.children[0].innerText.toLowerCase().includes(search);
        let matchStatus = status === 'all' || row.dataset.status === status;
        row.style.display = (matchSearch && matchStatus) ? '' : 'none';
    });
}

function getBadgeColor(status) {
    if (status === 'Healthy') return 'success';
    if (status === 'Maintenance') return 'warning';
    if (status === 'Failed') return 'danger';
    if (status === 'Warning') return 'warning';
    return 'info';
}

function renderAssetLifecycleProfile(eqId) {
    const ss = getSubstation(currentDashboardSSId);
    if (!ss || !ss.equipmentMaster) return;
    
    let eq = ss.equipmentMaster.find(e => e.id === eqId);
    if (!eq) return;

    // Calculate Health Score
    let healthScore = Math.floor(Math.random() * 40) + 60; // Mock 60-100
    let healthStatus = 'GOOD';
    let healthClass = 'health-good';
    if (healthScore > 90) { healthStatus = 'EXCELLENT'; healthClass = 'health-excellent'; }
    else if (healthScore < 75) { healthStatus = 'AVERAGE'; healthClass = 'health-average'; }
    else if (healthScore < 60) { healthStatus = 'POOR'; healthClass = 'health-poor'; }

    let profileHtml = `
        <div class="alc-profile-header">
            <div class="alc-profile-info">
                <div class="alc-profile-icon">
                    <span class="material-icons-round">precision_manufacturing</span>
                </div>
                <div>
                    <div class="alc-profile-name">${eq.name || 'Unknown Equipment'}</div>
                    <div class="alc-profile-sub">Asset ID: ${eq.id} &nbsp;|&nbsp; ${eq.category || 'Equipment'} &nbsp;|&nbsp; ${eq.voltageLevel || ''}</div>
                </div>
            </div>
            <div class="alc-health-score">
                <div class="alc-health-value ${healthClass}">${healthScore}%</div>
                <div class="alc-health-label ${healthClass}">${healthStatus}</div>
            </div>
        </div>

        <div class="alc-tabs">
            <div class="alc-tab active" onclick="switchAlcTab(this, 'alcTabInfo')">Information</div>
            <div class="alc-tab" onclick="switchAlcTab(this, 'alcTabTimeline')">Lifecycle Timeline</div>
            <div class="alc-tab" onclick="switchAlcTab(this, 'alcTabMaintenance')">Maintenance History</div>
            <div class="alc-tab" onclick="switchAlcTab(this, 'alcTabFaults')">Faults & Trippings</div>
            <div class="alc-tab" onclick="switchAlcTab(this, 'alcTabDocs')">Documents</div>
        </div>

        <!-- INFO TAB -->
        <div class="alc-tab-content active" id="alcTabInfo">
            <div class="alc-info-grid">
                <div class="alc-info-section">
                    <h3>Technical Details</h3>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Category</span><span class="alc-kv-val">${eq.category || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Manufacturer</span><span class="alc-kv-val">${eq.manufacturer || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Model Number</span><span class="alc-kv-val">${eq.model || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Serial Number</span><span class="alc-kv-val">${eq.serialNo || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Voltage Level</span><span class="alc-kv-val">${eq.voltageLevel || '-'}</span></div>
                </div>
                <div class="alc-info-section">
                    <h3>Installation & Lifecycle</h3>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Location / Bay</span><span class="alc-kv-val">${eq.bayNumber || 'Switchyard'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Installation Date</span><span class="alc-kv-val">${eq.installDate || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Capacity / Rating</span><span class="alc-kv-val">${eq.capacity || '-'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Current Status</span><span class="alc-kv-val">${eq.status || 'Healthy'}</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Expected Life</span><span class="alc-kv-val">25 Years</span></div>
                </div>
                <div class="alc-info-section">
                    <h3>Next Schedule</h3>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Next Maintenance</span><span class="alc-kv-val" style="color:var(--warning-color)">2026-08-15</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Next Testing</span><span class="alc-kv-val">2026-10-10</span></div>
                    <div class="alc-kv-pair"><span class="alc-kv-key">Next Inspection</span><span class="alc-kv-val">2026-07-20</span></div>
                </div>
            </div>
        </div>

        <!-- TIMELINE TAB -->
        <div class="alc-tab-content" id="alcTabTimeline">
            <div class="alc-timeline">
                <div class="alc-timeline-item">
                    <div class="alc-timeline-icon type-testing"><span class="material-icons-round">science</span></div>
                    <div class="alc-timeline-content">
                        <div class="alc-timeline-header">
                            <span class="alc-timeline-title">Routine Testing (CRM & IR)</span>
                            <span class="alc-timeline-date">2026-02-15 10:30</span>
                        </div>
                        <div class="alc-timeline-desc">Performed Contact Resistance and Insulation Resistance testing. Results within permissible limits.</div>
                        <div class="alc-timeline-meta">
                            <span><span class="material-icons-round" style="font-size:12px; vertical-align:middle">person</span> NP Patel</span>
                            <span style="color:var(--primary-color); cursor:pointer;"><span class="material-icons-round" style="font-size:12px; vertical-align:middle">attach_file</span> Test_Report.pdf</span>
                        </div>
                    </div>
                </div>
                
                <div class="alc-timeline-item">
                    <div class="alc-timeline-icon type-fault"><span class="material-icons-round">bolt</span></div>
                    <div class="alc-timeline-content">
                        <div class="alc-timeline-header">
                            <span class="alc-timeline-title">Tripping Event</span>
                            <span class="alc-timeline-date">2025-11-04 14:22</span>
                        </div>
                        <div class="alc-timeline-desc">Line tripped on Earth Fault. Distance 14.5 KM. Auto-reclosure successful.</div>
                        <div class="alc-timeline-meta">
                            <span><span class="material-icons-round" style="font-size:12px; vertical-align:middle">person</span> System Auto</span>
                        </div>
                    </div>
                </div>

                <div class="alc-timeline-item">
                    <div class="alc-timeline-icon type-maintenance"><span class="material-icons-round">build</span></div>
                    <div class="alc-timeline-content">
                        <div class="alc-timeline-header">
                            <span class="alc-timeline-title">Preventive Maintenance</span>
                            <span class="alc-timeline-date">2025-06-10 09:00</span>
                        </div>
                        <div class="alc-timeline-desc">Half-yearly maintenance performed. Mechanisms lubricated and gas pressure checked.</div>
                        <div class="alc-timeline-meta">
                            <span><span class="material-icons-round" style="font-size:12px; vertical-align:middle">person</span> RK Sharma (Maintenance Team)</span>
                        </div>
                    </div>
                </div>

                <div class="alc-timeline-item">
                    <div class="alc-timeline-icon type-installation"><span class="material-icons-round">flag</span></div>
                    <div class="alc-timeline-content">
                        <div class="alc-timeline-header">
                            <span class="alc-timeline-title">Commissioned</span>
                            <span class="alc-timeline-date">2018-06-01 11:00</span>
                        </div>
                        <div class="alc-timeline-desc">Equipment successfully commissioned and put into service.</div>
                        <div class="alc-timeline-meta">
                            <span><span class="material-icons-round" style="font-size:12px; vertical-align:middle">person</span> GETCO Project Div.</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- MAINTENANCE TAB -->
        <div class="alc-tab-content" id="alcTabMaintenance">
            <table class="data-table alc-mobile-table">
                <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Performed By</th></tr></thead>
                <tbody>
                    <tr><td data-label="Date">2025-06-10</td><td data-label="Type">Preventive</td><td data-label="Description">Half-yearly maintenance</td><td data-label="Performed By">RK Sharma</td></tr>
                    <tr><td data-label="Date">2024-12-05</td><td data-label="Type">Preventive</td><td data-label="Description">Yearly maintenance</td><td data-label="Performed By">RK Sharma</td></tr>
                </tbody>
            </table>
        </div>

        <!-- FAULTS TAB -->
        <div class="alc-tab-content" id="alcTabFaults">
             <table class="data-table alc-mobile-table">
                <thead><tr><th>Date</th><th>Event</th><th>Details</th><th>Duration</th></tr></thead>
                <tbody>
                    <tr><td data-label="Date">2025-11-04</td><td data-label="Event">Tripping</td><td data-label="Details">Earth Fault</td><td data-label="Duration">Auto-reclose</td></tr>
                    <tr><td data-label="Date">2022-08-12</td><td data-label="Event">Breakdown</td><td data-label="Details">Mechanism Failure</td><td data-label="Duration">4 hrs 30 mins</td></tr>
                </tbody>
            </table>
        </div>

        <!-- DOCS TAB -->
        <div class="alc-tab-content" id="alcTabDocs">
            <button class="btn btn-primary" style="margin-bottom:16px;">+ Upload Document</button>
            <table class="data-table alc-mobile-table">
                <thead><tr><th>Document Name</th><th>Type</th><th>Upload Date</th><th>Action</th></tr></thead>
                <tbody>
                    <tr><td data-label="Document Name">Equipment_Manual.pdf</td><td data-label="Type">Manual</td><td data-label="Upload Date">2018-06-01</td><td data-label="Action"><button class="btn btn-outline" style="padding:4px 8px">View</button></td></tr>
                    <tr><td data-label="Document Name">Test_Report_Feb2026.pdf</td><td data-label="Type">Test Report</td><td data-label="Upload Date">2026-02-15</td><td data-label="Action"><button class="btn btn-outline" style="padding:4px 8px">View</button></td></tr>
                </tbody>
            </table>
        </div>
    `;

    document.getElementById('assetLifecycleProfileContent').innerHTML = profileHtml;
}

function switchAlcTab(tabEl, contentId) {
    let tabs = tabEl.parentElement.querySelectorAll('.alc-tab');
    tabs.forEach(t => t.classList.remove('active'));
    tabEl.classList.add('active');

    let contents = tabEl.parentElement.parentElement.querySelectorAll('.alc-tab-content');
    contents.forEach(c => c.classList.remove('active'));
    document.getElementById(contentId).classList.add('active');
}
