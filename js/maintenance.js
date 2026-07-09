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
                <div style="font-size:11px; color:var(--text-secondary); max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${escapeHtml(f.description||'')}</div>
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
    
    let eqSelect = document.getElementById('f_equipment_name');
    eqSelect.innerHTML = '<option value="">Select Equipment...</option>';
    let eqList = getCleanTrippingEquipment(ss);
    eqList.forEach(eq => {
        eqSelect.innerHTML += `<option value="${escapeHtml(eq.name)}">${escapeHtml(eq.name)} (${eq.type})</option>`;
    });
    
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
            f.id, f.date, f.time, f.voltage, f.category, `"${f.equipment_name||''}"`, f.type, f.severity, f.status, f.downtime||'', `"${escapeHtml(f.description||'')}"`, `"${f.root_cause||''}"`
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
    if (ss.equipmentMaster && ss.equipmentMaster.length > 0) {
        return ss.equipmentMaster.map(eq => ({ name: eq.name, type: eq.category, id: eq.id }));
    }
    return [];
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
            <td style="font-weight:600;">${escapeHtml(eq.name)}</td>
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
        eqSelect.innerHTML += `<option value="${escapeHtml(eq.name)}">${escapeHtml(eq.name)} (${eq.type})</option>`;
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
        equipSelect.innerHTML += `<option value="${escapeHtml(eq.name)}">${escapeHtml(eq.name)} (${eq.type})</option>`;
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
            <img src="${sanitizeUrl(p.url, 'https://via.placeholder.com/400x200?text=Invalid+Image')}" class="photo-img" onerror="this.src='https://via.placeholder.com/400x200?text=Invalid+Image'">
            <div class="photo-info" style="display:grid; grid-template-columns: 1fr; gap:6px; font-size:11px;">
                <div class="photo-title" style="font-size:14px;">${escapeHtml(p.caption || 'Untitled Photo')}</div>
                <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding-bottom:4px;">
                    <span style="color:var(--text-secondary);"><span class="material-icons-round" style="font-size:12px;vertical-align:middle;">calendar_today</span> ${new Date(p.timestamp).toLocaleDateString()}</span>
                    <span style="color:var(--text-secondary);"><span class="material-icons-round" style="font-size:12px;vertical-align:middle;">schedule</span> ${new Date(p.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                </div>
                <div style="display:grid; grid-template-columns: auto 1fr; gap:4px 8px; margin-top:4px;">
                    <strong style="color:var(--text-secondary);">Substation:</strong> <span>${escapeHtml(p.substation || ss.name)}</span>
                    <strong style="color:var(--text-secondary);">Category:</strong> <span>${escapeHtml(p.category || 'N/A')}</span>
                    <strong style="color:var(--text-secondary);">Equipment:</strong> <span>${escapeHtml(p.equipment || 'N/A')}</span>
                    <strong style="color:var(--text-secondary);">Record ID:</strong> <span style="color:var(--primary); font-weight:600;">${escapeHtml(p.relatedRecord || '-')}</span>
                    <strong style="color:var(--text-secondary);">By:</strong> <span>${escapeHtml(p.user || 'Unknown')}</span>
                    <strong style="color:var(--text-secondary);">GPS:</strong> <span>${escapeHtml(p.gps || '-')}</span>
                </div>
                <div style="margin-top:4px; padding:6px; background:#f8fafc; border-radius:4px; font-style:italic;">
                    ${escapeHtml(p.remarks || 'No remarks provided.')}
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
    let eqList = getCleanTrippingEquipment(ss);
    eqList.forEach(eq => {
        eqSelect.innerHTML += `<option value="${escapeHtml(eq.name)}">${escapeHtml(eq.name)} (${eq.type})</option>`;
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
            <div class="doc-version">${escapeHtml(d.version)}</div>
            <div class="doc-icon">📄</div>
            <div class="doc-title" title="${escapeHtml(d.title)}">${escapeHtml(d.title)}</div>
            <div class="doc-meta">
                <span><strong>Status:</strong> <span style="color:${statusColor}">${escapeHtml(d.status)}</span></span>
                ${d.equipment ? `<span><strong>Eq:</strong> ${escapeHtml(d.equipment)}</span>` : ''}
                ${d.recordId ? `<span><strong>Ref:</strong> ${escapeHtml(d.recordId)}</span>` : ''}
                ${d.expiry ? `<span><strong>Expiry:</strong> ${escapeHtml(d.expiry)}</span>` : ''}
                <span>${new Date(d.timestamp).toLocaleDateString()}</span>
            </div>
            <div class="doc-actions">
                <button class="doc-btn-view" data-url="${escapeHtml(sanitizeUrl(d.url))}" onclick="openSafeUrl(this.dataset.url)">👁️ View</button>
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
    
    let eqList = getCleanTrippingEquipment(ss);
    eqList.forEach(eq => {
        let opt = document.createElement('option');
        opt.value = eq.name;
        opt.textContent = `${eq.name} (${eq.type})`;
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

// ===== MEGA MENU LOGIC =====
function filterMegaMenu(query) {
    const filter = query.toLowerCase();
    const groups = document.querySelectorAll('.mega-menu-group');
    
    groups.forEach(group => {
        const links = group.querySelectorAll('.mega-menu-item-link');
        let hasVisibleLink = false;
        
        links.forEach(link => {
            if (link.innerText.toLowerCase().includes(filter)) {
                link.style.display = 'flex';
                hasVisibleLink = true;
            } else {
                link.style.display = 'none';
            }
        });
        
        if (hasVisibleLink) {
            group.style.display = 'flex';
        } else {
            group.style.display = 'none';
        }
    });
}

function handleMegaMenuItemClick(e, pageId) {
    e.preventDefault();
    setActiveMenu(pageId);
}

// ===================================================================
// EQUIPMENT MASTER LOGIC
// ===================================================================

function renderEquipmentMaster() {
    let ss = getSubstation(currentDashboardSSId);
    let eqList = ss.equipmentMaster || [];
    
    // KPIs
    document.getElementById('eqTotalCount').textContent = eqList.length;
    document.getElementById('eqTransformerCount').textContent = eqList.filter(e => e.category.includes('Transformer')).length;
    document.getElementById('eqFeederCount').textContent = eqList.filter(e => e.category.includes('Feeder') || e.category.includes('Line')).length;
    document.getElementById('eqBreakerCount').textContent = eqList.filter(e => e.category === 'Breaker').length;
    
    // Table
    let html = '';
    eqList.forEach(eq => {
        let statusColor = eq.status === 'Healthy' || eq.status === 'In Service' ? 'var(--success)' : (eq.status === 'Faulty' ? 'var(--danger)' : 'var(--warning)');
        html += `
            <tr style="cursor:pointer;" onclick="navigateTo('equipmentProfile', '${ss.id}', '${eq.id}')">
                <td style="font-weight:600;">${escapeHtml(eq.name)}</td>
                <td>${escapeHtml(eq.category)}</td>
                <td>${escapeHtml(eq.voltageLevel)}</td>
                <td>${escapeHtml(eq.manufacturer || '-')}</td>
                <td><span style="display:inline-block; padding:4px 8px; border-radius:4px; font-size:12px; font-weight:600; color:white; background:${statusColor};">${escapeHtml(eq.status)}</span></td>
                <td>
                    <div style="display:flex; gap:8px;">
                        <button class="btn btn-outline" style="padding:4px 8px; font-size:12px;" onclick="event.stopPropagation(); openEquipmentModal('${eq.id}')">Edit</button>
                        <button class="btn btn-outline" style="padding:4px 8px; font-size:12px; color:var(--danger); border-color:var(--danger);" onclick="event.stopPropagation(); deleteEquipment('${eq.id}')">Delete</button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    if (eqList.length === 0) {
        html = '<tr><td colspan="6" style="text-align:center; padding:20px;">No equipment found.</td></tr>';
    }
    
    document.getElementById('eqListContainer').innerHTML = html;
}

function openEquipmentModal(eqId) {
    let ss = getSubstation(currentDashboardSSId);
    let eq = eqId ? ss.equipmentMaster.find(e => e.id === eqId) : null;
    
    document.getElementById('eqId').value = eq ? eq.id : '';
    document.getElementById('eqName').value = eq ? eq.name : '';
    document.getElementById('eqCategory').value = eq ? eq.category : 'Feeder';
    document.getElementById('eqVoltage').value = eq ? eq.voltageLevel : '11 KV';
    document.getElementById('eqBayNumber').value = eq ? (eq.bayNumber || '') : '';
    document.getElementById('eqManufacturer').value = eq ? (eq.manufacturer || '') : '';
    document.getElementById('eqModel').value = eq ? (eq.model || '') : '';
    document.getElementById('eqSerial').value = eq ? (eq.serialNo || '') : '';
    document.getElementById('eqCapacity').value = eq ? (eq.capacity || '') : '';
    document.getElementById('eqInstallDate').value = eq ? (eq.installDate || '') : '';
    let currentStatus = eq ? eq.status : 'Healthy';
    if (!['Healthy', 'In Service', 'Faulty', 'Under Maintenance', 'Decommissioned'].includes(currentStatus)) {
        currentStatus = 'Healthy';
    } else if (currentStatus === 'In Service') {
        currentStatus = 'Healthy';
    }
    document.getElementById('eqStatus').value = currentStatus;
    document.getElementById('eqLocation').value = eq ? (eq.location || '') : '';
    document.getElementById('eqDescription').value = eq ? (eq.description || '') : '';
    
    document.getElementById('equipmentModal').style.display = 'block';
}

function closeEquipmentModal() {
    document.getElementById('equipmentModal').style.display = 'none';
}

function deleteEquipment(eqId) {
    if (confirm("Are you sure you want to delete this equipment? This action cannot be undone.")) {
        let ssId = currentDashboardSSId;
        let subs = loadSubstations();
        let ss = subs.find(s => s.id === ssId);
        
        if (ss && ss.equipmentMaster) {
            ss.equipmentMaster = ss.equipmentMaster.filter(e => e.id !== eqId);
            saveSubstations(subs);
            renderEquipmentMaster(ss.id);
        }
    }
}

function saveEquipment(event) {
    event.preventDefault();
    let ssId = currentDashboardSSId;
    let subs = loadSubstations();
    let ss = subs.find(s => s.id === ssId);
    
    let eqId = document.getElementById('eqId').value;
    let name = document.getElementById('eqName').value.trim();
    
    if (!ss.equipmentMaster) ss.equipmentMaster = [];
    
    // Duplicate check
    let duplicate = ss.equipmentMaster.find(e => e.name.toLowerCase() === name.toLowerCase() && e.id !== eqId);
    if (duplicate) {
        alert("Equipment with this name already exists in this substation!");
        return;
    }
    
    let eqData = {
        name: name,
        category: document.getElementById('eqCategory').value,
        voltageLevel: document.getElementById('eqVoltage').value,
        bayNumber: document.getElementById('eqBayNumber').value,
        manufacturer: document.getElementById('eqManufacturer').value,
        model: document.getElementById('eqModel').value,
        serialNo: document.getElementById('eqSerial').value,
        capacity: document.getElementById('eqCapacity').value,
        installDate: document.getElementById('eqInstallDate').value,
        status: document.getElementById('eqStatus').value,
        location: document.getElementById('eqLocation').value,
        description: document.getElementById('eqDescription').value
    };
    
    let eventMsg = "";
    if (eqId) {
        let eq = ss.equipmentMaster.find(e => e.id === eqId);
        if(eq.status !== eqData.status) {
            eventMsg = `Equipment status changed: ${eqData.name} is now ${eqData.status}.`;
        } else {
            eventMsg = `Equipment updated: ${eqData.name}.`;
        }
        Object.assign(eq, eqData);
    } else {
        eqData.id = 'eq_' + Date.now();
        ss.equipmentMaster.push(eqData);
        eventMsg = `New equipment added: ${eqData.name}.`;
    }
    
    // Add event timeline
    if(!ss.events) ss.events = [];
    ss.events.push({
        id: 'ev_' + Date.now(),
        date: new Date().toISOString().split('T')[0],
        time: new Date().toTimeString().split(' ')[0].substring(0,5),
        type: 'General',
        description: eventMsg,
        user: 'Admin'
    });
    
    saveSubstations(subs);
    closeEquipmentModal();
    renderEquipmentMaster();
}

function renderEquipmentProfile(eqId) {
    let ss = getSubstation(currentDashboardSSId);
    let eq = ss.equipmentMaster.find(e => e.id === eqId);
    if(!eq) return;
    
    document.getElementById('profName').textContent = eq.name;
    document.getElementById('profCategory').textContent = eq.category;
    document.getElementById('profVoltage').textContent = eq.voltageLevel || 'N/A';
    document.getElementById('profBay').textContent = eq.bayNumber ? 'Bay: ' + eq.bayNumber : 'Bay: N/A';
    
    let statusColor = eq.status === 'Healthy' || eq.status === 'In Service' ? 'var(--success)' : (eq.status === 'Faulty' ? 'var(--danger)' : 'var(--warning)');
    document.getElementById('profStatusBadge').textContent = eq.status;
    document.getElementById('profStatusBadge').style.backgroundColor = statusColor;
    document.getElementById('profStatusBadge').style.color = '#fff';
    
    document.getElementById('profDetailManufacturer').textContent = eq.manufacturer || '-';
    document.getElementById('profDetailModel').textContent = eq.model || '-';
    document.getElementById('profDetailSerial').textContent = eq.serialNo || '-';
    document.getElementById('profDetailInstall').textContent = eq.installDate || '-';
    
    // Calculations
    let faults = (ss.faults || []).filter(f => f.equipmentId === eq.id || f.equipmentName === eq.name);
    let breakDowns = (ss.breakdowns || []).filter(b => b.equipmentId === eq.id || b.equipmentName === eq.name);
    let mnts = (ss.maintenance || []).filter(m => m.equipmentId === eq.id || m.equipmentName === eq.name);
    
    let totalFaults = faults.length;
    let totalBreakdowns = breakDowns.length;
    let totalMnt = mnts.length;
    
    let healthScore = 100 - (totalFaults * 5) - (totalBreakdowns * 10) + (totalMnt * 2);
    if(healthScore > 100) healthScore = 100;
    if(healthScore < 0) healthScore = 0;
    
    if(eq.status === 'Faulty') healthScore = 0;
    if(eq.status === 'Under Maintenance' || eq.status === 'Decommissioned') healthScore = Math.min(healthScore, 50);
    
    let healthColor = healthScore > 80 ? 'var(--success)' : (healthScore > 50 ? 'var(--warning)' : 'var(--danger)');
    
    document.getElementById('profHealthScore').textContent = healthScore + '%';
    document.getElementById('profHealthScore').style.color = healthColor;
    document.getElementById('profTotalFaults').textContent = totalFaults;
    document.getElementById('profTotalBreakdowns').textContent = totalBreakdowns;
    document.getElementById('profLastMaintenance').textContent = mnts.length > 0 ? mnts[mnts.length-1].date : '-';
    document.getElementById('profEditBtn').onclick = () => openEquipmentModal(eqId);
    
    // Linked Records HTML
    let recordsHtml = '';
    
    let allRecords = [];
    faults.forEach(f => allRecords.push({ date: f.date, type: 'Fault', desc: f.description, status: f.status }));
    breakDowns.forEach(b => allRecords.push({ date: b.date, type: 'Breakdown', desc: b.description, status: b.status || 'Logged' }));
    mnts.forEach(m => allRecords.push({ date: m.date, type: 'Maintenance', desc: m.description, status: m.status || 'Logged' }));
    
    allRecords.sort((a,b) => new Date(b.date) - new Date(a.date));
    
    allRecords.forEach(rec => {
        let typeColor = rec.type === 'Fault' ? 'var(--danger)' : (rec.type === 'Maintenance' ? 'var(--success)' : 'var(--warning)');
        recordsHtml += `
            <tr>
                <td>${escapeHtml(rec.date)}</td>
                <td><span style="font-weight:600; color:${typeColor}">${escapeHtml(rec.type)}</span></td>
                <td>${escapeHtml(rec.desc)}</td>
                <td>${escapeHtml(rec.status)}</td>
            </tr>
        `;
    });
    
    if(!recordsHtml) {
        recordsHtml = '<tr><td colspan="4" style="text-align:center; padding:20px;">No linked records found.</td></tr>';
    }
    document.getElementById('profRecordsContainer').innerHTML = recordsHtml;
}

// Set Substations as default active on load