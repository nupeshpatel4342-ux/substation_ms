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
        { key: 'cat_66kv',  label: '66 KV Incoming / Outgoing Line',  icon: '', cssClass: 'cat-66kv',  roles: ['66kv_incoming', '66kv_outgoing'] },
        { key: 'cat_trhv',  label: '66 KV Transformer HV Side',       icon: '', cssClass: 'cat-trhv',  roles: ['tr_hv'] },
        { key: 'cat_trlv',  label: '11 KV Incoming Line LV Side',     icon: '', cssClass: 'cat-trlv',  roles: ['tr_lv'] },
        { key: 'cat_11kv',  label: '11 KV Feeder',                    icon: '', cssClass: 'cat-11kv',  roles: ['11kv_feeder', 'solar_import', 'solar_export', 'station_aux', 'info_only'] }
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
            <div class="table-responsive">
                <table class="data-table">
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
            </div>
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

    showToast(' Report Generated!');

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
        document.querySelector('#eventTimelineView .table-responsive').style.display = 'none';
    } else {
        document.getElementById('timelineEmptyState').style.display = 'none';
        document.querySelector('#eventTimelineView .table-responsive').style.display = 'block';
        
        filtered.forEach(e => {
            let tr = document.createElement('tr');
            tr.innerHTML = `
                <td data-label="Date">
                    <div style="font-weight:600; color:var(--text);">${e.date}</div>
                    <div style="font-size:11px; color:var(--text-secondary);">${e.time}</div>
                </td>
                <td data-label="Operator"><span style="font-weight:600;">${e.operator}</span></td>
                <td data-label="Role"><span class="status-badge" style="background:#f1f5f9; color:#475569;">${e.role}</span></td>
                <td data-label="Module"><span class="status-badge" style="background:var(--primary-light); color:var(--primary-dark);">${e.module || 'System'}</span></td>
                <td data-label="Action"><span style="font-weight:600; color:var(--primary);">${e.action}</span></td>
                <td data-label="Remarks"><span style="font-size:12px;">${e.remarks || '-'}</span></td>
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
    let appHeader = document.getElementById('appHeader') || document.getElementById('shHeader');
    let content = document.querySelector('.content');
    
    if (appHeader) appHeader.style.display = 'none';
    if (content) content.style.display = 'none';

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
            if (appHeader) appHeader.style.display = '';
            if (content) content.style.display = '';
            showToast(' PDF downloaded!');
        }).catch(err => {
            console.error(err);
            document.body.removeChild(pdfContainer);
            if (appHeader) appHeader.style.display = '';
            if (content) content.style.display = '';
            showToast(' PDF Generation Failed');
        });
    }, 150);
}

