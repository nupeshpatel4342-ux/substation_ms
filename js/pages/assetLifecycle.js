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

    // Filter real logs
    let mntList = (ss.maintenance || []).filter(m => m.equipment_id === eqId || m.equipmentName === eq.name);
    let faultList = (ss.faults || []).filter(f => f.equipment_id === eqId || f.equipment_name === eq.name);
    let tripList = (ss.trips || []).filter(t => t.equipment_id === eqId || t.equipment === eq.name);
    let bdList = (ss.breakdowns || []).filter(b => b.equipment_id === eqId || b.equipmentName === eq.name);
    let docList = (ss.documents || []).filter(d => d.equipment_id === eqId || d.equipment === eq.name);

    // Calculate Health Score dynamically based on logs
    let healthScore = 100;
    healthScore -= faultList.length * 8;
    healthScore -= tripList.length * 5;
    healthScore -= bdList.length * 15;
    healthScore = Math.max(20, healthScore); // min 20%
    
    let healthStatus = 'GOOD';
    let healthClass = 'health-good';
    if (healthScore > 90) { healthStatus = 'EXCELLENT'; healthClass = 'health-excellent'; }
    else if (healthScore < 75 && healthScore >= 60) { healthStatus = 'AVERAGE'; healthClass = 'health-average'; }
    else if (healthScore < 60) { healthStatus = 'POOR'; healthClass = 'health-poor'; }

    // Build timeline events
    let timelineEvents = [];
    if (eq.installDate) {
        timelineEvents.push({
            date: eq.installDate,
            time: '10:00',
            type: 'installation',
            title: 'Commissioned',
            desc: 'Equipment successfully commissioned and put into service.',
            operator: 'GETCO Project Div.'
        });
    }
    
    faultList.forEach(f => {
        timelineEvents.push({
            date: f.date || '',
            time: f.time || '00:00',
            type: 'fault',
            title: `Fault: ${f.severity} Severity`,
            desc: `${f.description || ''}. Status: ${f.status}`,
            operator: f.reported_by || 'Operator'
        });
    });

    tripList.forEach(t => {
        timelineEvents.push({
            date: t.trip_date || '',
            time: t.trip_time || '00:00',
            type: 'tripping',
            title: `Tripping Event (${t.type})`,
            desc: `Duration: ${t.duration} hrs. Remarks: ${t.remarks || 'None'}`,
            operator: 'System Auto'
        });
    });

    bdList.forEach(b => {
        let bDate = b.startTime ? b.startTime.split('T')[0] : '';
        let bTime = b.startTime && b.startTime.includes('T') ? b.startTime.split('T')[1].substring(0,5) : '00:00';
        timelineEvents.push({
            date: bDate,
            time: bTime,
            type: 'breakdown',
            title: `Breakdown ${b.bdNumber}`,
            desc: `${b.nature || ''}. Outage: ${b.totalOutage} hrs. Root Cause: ${b.rootCause || '-'}`,
            operator: b.reportedBy || 'Operator'
        });
    });

    mntList.forEach(m => {
        timelineEvents.push({
            date: m.scheduledDate || '',
            time: m.startTime || '00:00',
            type: 'maintenance',
            title: `${m.type} Maintenance`,
            desc: `${m.description || ''}. Status: ${m.status}`,
            operator: m.agency || 'Operator'
        });
    });

    // Sort newest first
    timelineEvents.sort((a, b) => {
        let dateA = new Date((a.date || '1970-01-01') + 'T' + (a.time || '00:00'));
        let dateB = new Date((b.date || '1970-01-01') + 'T' + (b.time || '00:00'));
        return dateB - dateA;
    });

    let timelineHtml = '';
    if (timelineEvents.length === 0) {
        timelineHtml = '<div style="padding:20px; text-align:center; color:var(--text-secondary)">No lifecycle events recorded.</div>';
    } else {
        timelineHtml = `
            <div class="alc-timeline">
                ${timelineEvents.map(evt => {
                    let icon = 'flag';
                    let iconClass = 'type-installation';
                    if (evt.type === 'fault') { icon = 'warning'; iconClass = 'type-fault'; }
                    if (evt.type === 'tripping') { icon = 'bolt'; iconClass = 'type-tripping'; }
                    if (evt.type === 'breakdown') { icon = 'error_outline'; iconClass = 'type-fault'; }
                    if (evt.type === 'maintenance') { icon = 'build'; iconClass = 'type-maintenance'; }
                    
                    return `
                        <div class="alc-timeline-item">
                            <div class="alc-timeline-icon ${iconClass}"><span class="material-icons-round">${icon}</span></div>
                            <div class="alc-timeline-content">
                                <div class="alc-timeline-header">
                                    <span class="alc-timeline-title">${evt.title}</span>
                                    <span class="alc-timeline-date">${evt.date} ${evt.time}</span>
                                </div>
                                <div class="alc-timeline-desc">${evt.desc}</div>
                                <div class="alc-timeline-meta">
                                    <span><span class="material-icons-round" style="font-size:12px; vertical-align:middle">person</span> ${evt.operator}</span>
                                </div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    }

    let mntTableHtml = '';
    if (mntList.length === 0) {
        mntTableHtml = '<div style="padding:20px; text-align:center; color:var(--text-secondary)">No maintenance history recorded for this equipment.</div>';
    } else {
        mntTableHtml = `
            <table class="data-table alc-mobile-table">
                <thead><tr><th>Date</th><th>Type</th><th>Description</th><th>Status</th><th>Performed By</th></tr></thead>
                <tbody>
                    ${mntList.map(m => `
                        <tr>
                            <td data-label="Date">${m.scheduledDate || '-'}</td>
                            <td data-label="Type">${m.type || '-'}</td>
                            <td data-label="Description">${m.description || '-'}</td>
                            <td data-label="Status">${m.status || '-'}</td>
                            <td data-label="Performed By">${m.agency || '-'}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    let combinedFaults = [];
    faultList.forEach(f => {
        combinedFaults.push({ date: f.date, event: 'Fault', details: `${f.severity} severity: ${f.description || ''}`, duration: `${f.downtime || 0} hrs`, sortDate: f.date + 'T' + (f.time || '00:00') });
    });
    tripList.forEach(t => {
        combinedFaults.push({ date: t.trip_date, event: 'Tripping', details: `${t.type} trip: ${t.remarks || ''}`, duration: `${t.duration || 0} hrs`, sortDate: t.trip_date + 'T' + (t.trip_time || '00:00') });
    });
    bdList.forEach(b => {
        let bDate = b.startTime ? b.startTime.split('T')[0] : '';
        combinedFaults.push({ date: bDate, event: 'Breakdown', details: `${b.nature || ''}`, duration: `${b.totalOutage || 0} hrs`, sortDate: b.startTime || '' });
    });
    combinedFaults.sort((a,b) => new Date(b.sortDate || 0) - new Date(a.sortDate || 0));

    let faultsTableHtml = '';
    if (combinedFaults.length === 0) {
        faultsTableHtml = '<div style="padding:20px; text-align:center; color:var(--text-secondary)">No faults or tripping events recorded for this equipment.</div>';
    } else {
        faultsTableHtml = `
             <table class="data-table alc-mobile-table">
                <thead><tr><th>Date</th><th>Event</th><th>Details</th><th>Duration</th></tr></thead>
                <tbody>
                    ${combinedFaults.map(cf => `
                        <tr>
                            <td data-label="Date">${cf.date || '-'}</td>
                            <td data-label="Event">${cf.event}</td>
                            <td data-label="Details">${cf.details}</td>
                            <td data-label="Duration">${cf.duration}</td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

    let docsTableHtml = '';
    if (docList.length === 0) {
        docsTableHtml = '<div style="padding:20px; text-align:center; color:var(--text-secondary)">No documents uploaded for this equipment.</div>';
    } else {
        docsTableHtml = `
            <table class="data-table alc-mobile-table">
                <thead><tr><th>Document Name</th><th>Type</th><th>Upload Date</th><th>Action</th></tr></thead>
                <tbody>
                    ${docList.map(d => `
                        <tr>
                            <td data-label="Document Name">${d.title}</td>
                            <td data-label="Type">${d.version || 'v1.0'}</td>
                            <td data-label="Upload Date">${d.timestamp ? d.timestamp.split('T')[0] : '-'}</td>
                            <td data-label="Action"><a href="${d.url}" target="_blank" class="btn btn-outline" style="padding:4px 8px; text-decoration:none;">View</a></td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
        `;
    }

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
            ${timelineHtml}
        </div>

        <!-- MAINTENANCE TAB -->
        <div class="alc-tab-content" id="alcTabMaintenance">
            ${mntTableHtml}
        </div>

        <!-- FAULTS TAB -->
        <div class="alc-tab-content" id="alcTabFaults">
            ${faultsTableHtml}
        </div>

        <!-- DOCS TAB -->
        <div class="alc-tab-content" id="alcTabDocs">
            <button class="btn btn-primary" style="margin-bottom:16px;">+ Upload Document</button>
            ${docsTableHtml}
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
