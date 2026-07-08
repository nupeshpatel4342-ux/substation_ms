const pageDashboardTemplate = `
<div class="page-section" id="pageDashboard" style="display:none;">
<div class="page-content" style="max-width: 1200px; margin: 0 auto;">
<div class="ed-layout">
<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
<div>
<h2 id="edSSName" style="font-size: 22px; font-weight: 800; color: var(--text); margin-bottom: 4px;">Global Enterprise Overview</h2>
<div id="edLiveTime" style="font-size: 13px; font-weight: 600; color: var(--text-secondary);">Live Time: --:--:--</div>
</div>
<div class="ed-status-badge ed-status-good" id="edOpStatus" style="font-size: 14px; padding: 6px 12px;">System Normal</div>
</div>
<div class="ed-kpi-grid">
<div class="ed-kpi-card">
<div class="ed-kpi-label">Total Equipment</div>
<div class="ed-kpi-val" id="edKpiEq">0</div>
</div>
<div class="ed-kpi-card">
<div class="ed-kpi-label">Active Faults</div>
<div class="ed-kpi-val" id="edKpiFaults" style="color: var(--danger);">0</div>
</div>
<div class="ed-kpi-card">
<div class="ed-kpi-label">Pending Maint.</div>
<div class="ed-kpi-val" id="edKpiMaint" style="color: var(--warning);">0</div>
</div>
<div class="ed-kpi-card">
<div class="ed-kpi-label">Total Documents</div>
<div class="ed-kpi-val" id="edKpiDocs">0</div>
</div>
</div>
<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 16px;">
<div class="ed-section" style="display: flex; flex-direction: column; align-items: center; justify-content: center;">
<div class="ed-section-title" style="align-self: flex-start; margin-bottom: 20px;">
<span class="material-icons-round">health_and_safety</span> Global Network Health
                        </div>
<div class="ed-health-widget" id="edHealthWidget">
<div class="ed-health-score" id="edHealthScore">100<span>Score</span></div>
</div>
</div>
<div class="ed-section">
<div class="ed-section-title">
<span class="material-icons-round">bar_chart</span> System Faults Trend
                        </div>
<div class="ed-chart-container" id="edFaultChart">
<!-- Dynamic Bars -->
</div>
</div>
</div>
<div class="ed-section">
<div class="ed-section-header">
<div class="ed-section-title"><span class="material-icons-round">apps</span> Jump to Substations</div>
</div>
<div class="ed-quick-actions">
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">assessment</span>
<span>Monthly Report</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">photo_camera</span>
<span>Photo Report</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">gpp_bad</span>
<span>Faults</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">flash_on</span>
<span>Tripping</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">build</span>
<span>Breakdowns</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">handyman</span>
<span>Maintenance</span>
</div>
<div class="ed-qa-btn" onclick="setActiveMenu('substations'); showToast('Please select a Substation first');">
<span class="material-icons-round">folder</span>
<span>Documents</span>
</div>
</div>
</div>
<div class="ed-section">
<div class="ed-section-header">
<div class="ed-section-title"><span class="material-icons-round">history</span> Global Recent Events</div>
</div>
<div class="ed-timeline" id="edTimelineContent">
<!-- Dynamic Timeline -->
</div>
</div>
</div>
</div>
</div>
`;
