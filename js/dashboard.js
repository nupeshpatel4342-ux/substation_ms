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
            <div class="card-name">${escapeHtml(ss.name)} ${sampleBadge}</div>
            <div class="card-meta" style="flex-direction:column; gap:6px;">
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <span style="color:#0d47a1;"> ${cnt66kv} 66KV Line</span>
                    <span style="color:#7b1fa2;"> ${cntTR} TR</span>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap;">
                    <span style="color:#e65100;"> ${cntTrLV} 11KV Incoming</span>
                    <span style="color:#2e7d32;"> ${cnt11kv} 11KV Feeder</span>
                </div>
                <div style="display:flex; gap:12px; flex-wrap:wrap; padding-top:6px; border-top:1px solid #e0e0e0; margin-top:2px;">
                    <span style="font-weight:700; color:#1a1a2e;">⏲ Total Meter: ${feederTotal}</span>
                    <span> ${reportCount} Reports</span>
                </div>
            </div>
            <div class="card-actions">
                <button class="btn-report" onclick="event.stopPropagation(); navigateTo('report','${ss.id}', 'new')"> Report</button>
                <button class="btn-edit" onclick="event.stopPropagation(); navigateTo('setup','${ss.id}')"> Edit</button>
                <button class="btn-delete-card" onclick="event.stopPropagation(); deleteSSFromDashboard('${ss.id}')"></button>
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

