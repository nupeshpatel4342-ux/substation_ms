const pageSubstationsTemplate = `
<div class="page-section active" id="pageSubstations">
<!-- ===== APP HEADER ===== -->
<div class="app-header ss-header" id="appHeader" style="border-radius: 0 0 24px 24px; margin-bottom: 0px;">
    <div class="ss-circuit-grid"></div>
    <div class="ss-glow g1"></div>
    <div class="ss-glow g2"></div>
    <div class="ss-glow g3"></div>
    <div class="ss-current-line l1"></div>
    <div class="ss-current-line l2"></div>
    <div class="ss-current-line l3"></div>
    <svg class="ss-pulse-bolt" viewBox="0 0 24 24" fill="#7CFFCB">
        <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" />
    </svg>
    <div class="ss-spark s1"></div>
    <div class="ss-spark s2"></div>
    <div class="ss-spark s3"></div>
    <div class="ss-spark s4"></div>
    <div class="ss-glass" style="margin-top: 8px;">
        <div class="ss-brand-row">
            <button class="header-back" id="headerBack" onclick="navigateTo('dashboard')" style="display:none; position:relative; left:0; top:0; transform:none; margin-right: 12px; width: 42px; height: 42px; border-radius: 12px; font-size: 24px;">←</button>
            <div class="ss-logo-badge" id="ssLogoBadge">
                <svg viewBox="0 0 24 24" fill="none">
                    <path d="M13 2L4 14h6l-1 8 9-12h-6l1-8z" fill="#0b3d91" />
                </svg>
            </div>
            <div class="ss-brand-text">
                <span class="ss-brand-name">Substation<span style="color: #7CFFCB; text-shadow: 0 0 10px rgba(124, 255, 203, 0.7), 0 0 20px rgba(124, 255, 203, 0.4);">MS</span></span>
                <span class="ss-brand-tag">
                    <span class="ss-dot"></span>
                    Substation &amp; Power Grid Management
                </span>
                <span id="headerTitle" style="display:none;"></span>
                <span id="headerSubtitle" style="display:none;"></span>
            </div>
        </div>
        <div class="ss-icon-row">
            <div class="ss-avatar">NP</div>
        </div>
    </div>
</div>
<!-- ===== DASHBOARD VIEW ===== -->
<div class="content">
<div class="view active" id="dashboardView">
<div class="section-title">📋 Your Substations</div>
<div class="card-grid" id="ssCardGrid">
<!-- Cards rendered by JS -->
</div>
</div>
<!-- ===== SS SPECIFIC DASHBOARD VIEW ===== -->
<div class="view" id="ssDashboardView">
<div class="ss-dashboard-grid">
<div class="ss-dashboard-card" onclick="navigateTo('executiveDashboard', currentDashboardSSId)">
<span class="material-icons-round" style="color: #673ab7; background: #ede7f6;">dashboard</span>
<div class="card-title">Overview Dashboard</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('report', currentDashboardSSId)">
<span class="material-icons-round" style="color: #1976d2; background: #e3f2fd;">assessment</span>
<div class="card-title">Monthly Reports</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('photoReport', currentDashboardSSId)">
<span class="material-icons-round" style="color: #9c27b0; background: #f3e5f5;">photo_camera</span>
<div class="card-title">Photo Reports</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('faultRegister', currentDashboardSSId)">
<span class="material-icons-round" style="color: #d32f2f; background: #ffebee;">gpp_bad</span>
<div class="card-title">Fault Register</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('trippingRegister', currentDashboardSSId)">
<span class="material-icons-round" style="color: #ed6c02; background: #fff3e0;">flash_on</span>
<div class="card-title">Tripping Calculations</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('breakdownRegister', currentDashboardSSId)">
<span class="material-icons-round" style="color: #d81b60; background: #fce4ec;">build</span>
<div class="card-title">Breakdown Reports</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('eventTimeline', currentDashboardSSId)">
<span class="material-icons-round" style="color: #0288d1; background: #e1f5fe;">timeline</span>
<div class="card-title">Event Timeline</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('maintenanceRegister', currentDashboardSSId)">
<span class="material-icons-round" style="color: #2e7d32; background: #e8f5e9;">handyman</span>
<div class="card-title">Maintenance</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('registersView', currentDashboardSSId)">
<span class="material-icons-round" style="color: #00796b; background: #e0f2f1;">library_books</span>
<div class="card-title">Registers Module</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('equipmentMaster', currentDashboardSSId)">
<span class="material-icons-round" style="color: #455a64; background: #eceff1;">precision_manufacturing</span>
<div class="card-title">Equipment Master</div>
</div>
<div class="ss-dashboard-card">
<span class="material-icons-round" style="color: #00838f; background: #e0f7fa;">analytics</span>
<div class="card-title">Analytics</div>
</div>
<div class="ss-dashboard-card" onclick="navigateTo('dms', currentDashboardSSId)">
<span class="material-icons-round" style="color: #795548; background: #efebe9;">folder</span>
<div class="card-title">Documents</div>
</div>
</div>
</div>
<!-- ===== DMS VIEW ===== -->
<div class="view" id="dmsView">
<div class="dms-layout">
<!-- Sidebar -->
<div class="dms-sidebar">
<h3 style="margin-bottom:15px; font-size:16px;">📂 Folders</h3>
<div class="dms-folder active" onclick="setDmsFolder('Monthly Reports')">Monthly Reports</div>
<div class="dms-folder" onclick="setDmsFolder('Shutdown Permits')">Shutdown Permits</div>
<div class="dms-folder" onclick="setDmsFolder('Maintenance Reports')">Maintenance Reports</div>
<div class="dms-folder" onclick="setDmsFolder('Fault Reports')">Fault Reports</div>
<div class="dms-folder" onclick="setDmsFolder('Tripping Reports')">Tripping Reports</div>
<div class="dms-folder" onclick="setDmsFolder('Breakdown Reports')">Breakdown Reports</div>
<div class="dms-folder" onclick="setDmsFolder('Equipment Manuals')">Equipment Manuals</div>
<div class="dms-folder" onclick="setDmsFolder('SOPs')">SOPs</div>
<div class="dms-folder" onclick="setDmsFolder('Others')">Others</div>
</div>
<!-- Main Content -->
<div class="dms-main">
<!-- Action Bar -->
<div class="dms-action-bar">
<button class="btn btn-primary" onclick="openDmsForm()">➕ Add Document</button>
<input class="form-input" id="dmsSearch" oninput="renderDms()" placeholder="🔍 Search docs..." style="width:250px;" type="text"/>
<input class="form-input" id="dmsFilterRecordId" oninput="renderDms()" placeholder="Ref ID (e.g. FLT-123)" style="width:150px;" type="text"/>
<button class="btn btn-outline" onclick="exportDmsPdf()">Export PDF</button>
</div>
<!-- Summary Widgets -->
<div style="display:flex; gap:15px; margin-bottom:20px; flex-wrap:wrap;">
<div class="dms-widget">
<div>Total Documents</div>
<div id="dmsTotalDocs" style="font-size:24px; font-weight:700; color:var(--primary);">0</div>
</div>
<div class="dms-widget">
<div>Pending Review</div>
<div id="dmsPendingDocs" style="font-size:24px; font-weight:700; color:var(--warning);">0</div>
</div>
<div class="dms-widget">
<div>Expiring Soon</div>
<div id="dmsExpiringDocs" style="font-size:24px; font-weight:700; color:var(--danger);">0</div>
</div>
</div>
<!-- Grid -->
<div class="dms-grid" id="dmsGrid"></div>
</div>
</div>
<!-- DMS Form Modal -->
<div class="form-section-overlay" id="dmsFormSection" style="display:none;">
<div class="form-card" style="position:relative; max-width:600px; margin:40px auto;">
<button class="btn-close" onclick="closeDmsForm()" style="position:absolute; top:15px; right:15px; background:transparent; border:none; font-size:20px; cursor:pointer;">✖</button>
<h3 id="dmsFormTitle">Upload Document</h3>
<input id="dmsId" type="hidden"/>
<div class="form-row">
<div class="form-group" style="flex:1;">
<label class="form-label">Title <span style="color:var(--danger)">*</span></label>
<input class="form-input" id="dmsDocTitle" placeholder="e.g. Transformer Manual" type="text"/>
</div>
<div class="form-group" style="flex:1;">
<label class="form-label">Folder <span style="color:var(--danger)">*</span></label>
<select class="form-input" id="dmsDocFolder">
<option>Monthly Reports</option>
<option>Shutdown Permits</option>
<option>Maintenance Reports</option>
<option>Fault Reports</option>
<option>Tripping Reports</option>
<option>Breakdown Reports</option>
<option>Equipment Manuals</option>
<option>SOPs</option>
<option>Others</option>
</select>
</div>
</div>
<div class="form-group">
<label class="form-label">Document URL (Drive/Server Link) <span style="color:var(--danger)">*</span></label>
<input class="form-input" id="dmsDocUrl" placeholder="https://..." type="url"/>
<small style="color:var(--text-secondary); margin-top:5px; display:block;">Pasting URL prevents browser storage crash (5MB limit).</small>
</div>
<div class="form-row">
<div class="form-group" style="flex:1;">
<label class="form-label">Related Equipment</label>
<select class="form-input" id="dmsEquipment"></select>
</div>
<div class="form-group" style="flex:1;">
<label class="form-label">Related Record ID</label>
<input class="form-input" id="dmsRecordId" placeholder="e.g. FLT-12345" type="text"/>
</div>
</div>
<div class="form-row">
<div class="form-group" style="flex:1;">
<label class="form-label">Status</label>
<select class="form-input" id="dmsStatus">
<option>Draft</option>
<option>Pending Review</option>
<option>Approved</option>
</select>
</div>
<div class="form-group" style="flex:1;">
<label class="form-label">Expiry Date</label>
<input class="form-input" id="dmsExpiry" type="date"/>
</div>
</div>
<div class="form-group">
<label class="form-label">Remarks</label>
<textarea class="form-input" id="dmsRemarks" rows="2"></textarea>
</div>
<div style="display:flex; justify-content:space-between; margin-top:20px;">
<button class="btn btn-danger" id="btnDeleteDms" onclick="deleteDocument()" style="display:none;" type="button">Delete</button>
<div style="margin-left:auto; display:flex; gap:10px;">
<button class="btn btn-outline" onclick="closeDmsForm()" type="button">Cancel</button>
<button class="btn btn-primary" onclick="saveDocument()" type="button">Save Document</button>
</div>
</div>
</div>
</div>
</div>
<!-- ===== SETUP VIEW ===== -->
<div class="view" id="setupView">
<div class="form-card">
<div class="form-group">
<label class="form-label">Substation Name</label>
<input class="form-input" id="setupName" placeholder="e.g., 66 K.V. HALVAD-3 S/S" type="text"/>
</div>
</div>
<!-- Feeders Section — Category-wise -->
<div id="feederCategorySetup"></div>
<!-- Transformers Section -->
<div class="section-title">🔌 Transformers</div>
<div id="transformerList"></div>
<button class="btn btn-add" onclick="addTransformerRow()">+ Add Transformer</button>
<!-- Opposite SS Section -->
<div class="section-title">📡 Opposite SS Entries (Line Loss)</div>
<div id="oppositeList"></div>
<button class="btn btn-add" onclick="addOppositeRow()">+ Add Opposite SS Entry</button>
<div class="btn-group">
<button class="btn btn-success" onclick="saveSubstation()">💾 Save Substation</button>
<button class="btn btn-danger" id="btnDeleteSS" onclick="deleteSubstation()" style="display:none">🗑️ Delete</button>
</div>
</div>
<!-- ===== REPORT VIEW ===== -->
<div class="view" id="reportView">
<div class="month-bar no-print">
<label for="reportMonth">📅 MONTH :</label>
<input id="reportMonth" placeholder="e.g., JUN-2026" type="text"/>
</div>
<!-- Status Bar -->
<div class="report-status-bar no-print" style="background: var(--card); border-radius: var(--radius); box-shadow: var(--shadow); padding: 12px 16px; margin-bottom: 16px; display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;">
<div style="display:flex; align-items:center; gap: 8px;">
<span style="font-size: 13px; font-weight: 700; color: var(--text-secondary);">STATUS:</span>
<span class="status-badge stat-pending" id="reportStatusBadge">Draft</span>
</div>
<div style="display:flex; gap: 8px; flex-wrap: wrap;">
<button class="btn btn-outline" id="btnSubmitReport" onclick="submitReport()" style="padding: 8px 16px; font-size: 12px;">Submit</button>
<button class="btn btn-success" id="btnApproveReport" onclick="approveReport()" style="padding: 8px 16px; font-size: 12px;">Approve</button>
<button class="btn btn-danger" id="btnRejectReport" onclick="rejectReport()" style="padding: 8px 16px; font-size: 12px;">Reject</button>
<button class="btn btn-outline" id="btnLockReport" onclick="toggleLockReport()" style="padding: 8px 16px; font-size: 12px;">Lock/Unlock</button>
<button class="btn btn-primary" onclick="exportData()" style="padding: 8px 16px; font-size: 12px;">Export Excel</button>
<button class="btn btn-primary" onclick="window.print()" style="padding: 8px 16px; font-size: 12px;">Export PDF</button>
</div>
</div>
<!-- Feeder Readings — Category-wise (rendered by JS) -->
<div id="feederCategoryContainer"></div>
<!-- Opposite SS Inputs -->
<div class="report-card" id="oppositeCard" style="display:none">
<div class="report-card-header">📡 Opposite SS End Units (Line Loss)</div>
<div id="oppositeInputs" style="padding: 12px;"></div>
</div>
<!-- Calculate Button -->
<div class="btn-group no-print" style="margin-bottom: 16px;">
<button class="btn btn-success" onclick="calculateReport()" style="flex:2">📊 Calculate &amp; Generate Report</button>
<button class="btn btn-outline" onclick="resetReport()">↺ Reset</button>
</div>
<!-- Totals Section -->
<div class="report-card" id="totalsCard" style="display:none">
<div class="report-card-header">📊 Totals</div>
<div id="totalsBody"></div>
</div>
<!-- Loss Calculation Section -->
<div class="report-card" id="lossCard" style="display:none">
<div class="report-card-header">📉 Loss Calculation</div>
<div id="lossBody"></div>
</div>
<!-- PDF Button -->
<div class="btn-group no-print" id="pdfBtnGroup" style="display:none">
<button class="btn btn-primary" onclick="exportPDF()">📄 Save as PDF</button>
</div>
</div>
<!-- ===== PHOTO REPORT VIEW ===== -->
<div class="view" id="photoReportView">
<div id="photoDashboardSection">
<div class="fault-action-bar">
<div class="fault-action-left">
<select class="form-select" id="photoFilterEquipment" onchange="renderPhotoReport()" style="width:160px;">
<option value="">All Equipment</option>
</select>
<select class="form-select" id="photoFilterCategory" onchange="renderPhotoReport()" style="width:160px;">
<option value="">All Categories</option>
<option value="Fault Photo">Fault Photo</option>
<option value="Tripping Evidence">Tripping Evidence</option>
<option value="Breakdown">Breakdown</option>
<option value="Before Maintenance">Before Maintenance</option>
<option value="During Maintenance">During Maintenance</option>
<option value="After Maintenance">After Maintenance</option>
<option value="Safety Inspection">Safety Inspection</option>
</select>
<input class="form-input" id="photoFilterRecordId" onkeyup="renderPhotoReport()" placeholder="Search Record ID..." style="width:160px;" type="text"/>
</div>
<div class="fault-action-right">
<button class="btn btn-outline" onclick="exportPhotoReportPDF()">📥 Export PDF</button>
<button class="btn btn-primary" onclick="openPhotoForm()">➕ Add Photo</button>
</div>
</div>
<div class="photo-grid" id="photoGridContainer">
<!-- Photos will be rendered here -->
</div>
</div>
<!-- Form Section -->
<div id="photoFormSection" style="display:none;">
<input id="ph_id" type="hidden"/>
<div class="form-card">
<div class="section-title" style="margin-top:0;">📷 Photo Details</div>
<div class="fault-form-grid">
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Photo Image URL</label>
<input class="form-input" id="ph_url" oninput="document.getElementById('ph_preview').src = this.value || 'https://via.placeholder.com/400x200?text=No+Image'" placeholder="https://example.com/photo.jpg" type="text"/>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<img id="ph_preview" src="https://via.placeholder.com/400x200?text=No+Image" style="width: 100%; height: 200px; object-fit: cover; border-radius: 8px; border: 1px solid var(--border);"/>
</div>
<div class="form-group">
<label class="form-label">Equipment</label>
<select class="form-select" id="ph_equipment">
<option value="">Select Equipment</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Category</label>
<select class="form-select" id="ph_category">
<option value="Fault Photo">Fault Photo</option>
<option value="Tripping Evidence">Tripping Evidence</option>
<option value="Breakdown">Breakdown</option>
<option value="Before Maintenance">Before Maintenance</option>
<option value="During Maintenance">During Maintenance</option>
<option value="After Maintenance">After Maintenance</option>
<option value="Safety Inspection">Safety Inspection</option>
</select>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Caption / Title</label>
<input class="form-input" id="ph_caption" placeholder="Short description of the photo" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Related Record ID (Optional)</label>
<input class="form-input" id="ph_related_record" placeholder="e.g. FLT-1234" type="text"/>
</div>
<div class="form-group">
<label class="form-label">GPS Coordinates (Optional)</label>
<input class="form-input" id="ph_gps" placeholder="e.g. 23.0225, 72.5714" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Remarks</label>
<input class="form-input" id="ph_remarks" placeholder="Any additional notes" type="text"/>
</div>
</div>
</div>
<div class="btn-group" style="margin-top:20px;">
<button class="btn btn-outline" onclick="closePhotoForm()">Cancel</button>
<button class="btn btn-primary" onclick="savePhotoReport()">Save Photo</button>
</div>
</div>
</div>
<!-- ===== FAULT REGISTER VIEW ===== -->
<div class="view" id="faultRegisterView">
<!-- Dashboard Section -->
<div id="faultDashboardSection">
<div class="fault-action-bar">
<div class="fault-action-left">
<input class="form-input" id="faultSearch" oninput="renderFaultRegister()" placeholder="🔍 Search faults..." style="flex:1;" type="text"/>
<select class="form-select" id="faultFilterStatus" onchange="renderFaultRegister()" style="width:140px;">
<option value="">All Statuses</option>
<option value="Pending">Pending</option>
<option value="Under Investigation">Under Investigation</option>
<option value="In Progress">In Progress</option>
<option value="Resolved">Resolved</option>
<option value="Closed">Closed</option>
</select>
</div>
<div class="fault-action-right">
<button class="btn btn-outline" onclick="exportFaults()">📥 Export CSV</button>
<button class="btn btn-primary" onclick="openFaultForm()">➕ Register Fault</button>
</div>
</div>
<div class="fault-summary-grid" id="faultSummaryGrid">
<!-- Summary Cards -->
</div>
<div class="analytics-grid" id="faultAnalyticsGrid">
<!-- Analytics -->
</div>
<div class="section-title">🕒 Fault History</div>
<div class="fault-table-container">
<table class="modern-table">
<thead>
<tr>
<th>ID &amp; Date</th>
<th>Equipment</th>
<th>Fault Type</th>
<th>Severity</th>
<th>Status</th>
<th>Downtime</th>
</tr>
</thead>
<tbody id="faultTableBody">
<!-- Rows generated by JS -->
</tbody>
</table>
</div>
</div>
<!-- Form Section -->
<div id="faultFormSection" style="display:none;">
<input id="f_id" type="hidden"/>
<div class="form-card">
<div class="section-title" style="margin-top:0;">📝 General Information</div>
<div class="fault-form-grid">
<div class="form-group">
<label class="form-label">Fault Date</label>
<input class="form-input" id="f_date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Fault Time</label>
<input class="form-input" id="f_time" type="time"/>
</div>
<div class="form-group">
<label class="form-label">Voltage Level</label>
<select class="form-select" id="f_voltage">
<option value="66KV">66 KV</option>
<option value="11KV">11 KV</option>
<option value="LV">LV (415V/230V)</option>
<option value="DC">DC System</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Equipment Category</label>
<select class="form-select" id="f_category">
<option value="Transformer">Transformer</option>
<option value="Breaker">Breaker (CB)</option>
<option value="Isolator">Isolator</option>
<option value="CT/PT">CT / PT</option>
<option value="Control Panel">Control &amp; Relay Panel</option>
<option value="Battery/Charger">Battery &amp; Charger</option>
<option value="Other">Other</option>
</select>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Equipment Name / Identification</label>
<select class="form-select" id="f_equipment_name"></select>
</div>
</div>
</div>
<div class="form-card">
<div class="section-title" style="margin-top:0;">🔍 Fault Details</div>
<div class="fault-form-grid">
<div class="form-group">
<label class="form-label">Fault Type</label>
<select class="form-select" id="f_type">
<option value="Transient">Transient</option>
<option value="Permanent">Permanent</option>
<option value="Mechanical">Mechanical</option>
<option value="Electrical">Electrical</option>
<option value="Insulation">Insulation Failure</option>
<option value="Relay Operation">Relay Operation</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Severity</label>
<select class="form-select" id="f_severity">
<option value="Low">Low</option>
<option value="Medium">Medium</option>
<option value="High">High</option>
<option value="Critical">Critical</option>
</select>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Description of Fault</label>
<input class="form-input" id="f_description" placeholder="Briefly describe what happened" type="text"/>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Probable Root Cause</label>
<input class="form-input" id="f_root_cause" placeholder="e.g. Weather, Aging, Overload" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Reported By</label>
<input class="form-input" id="f_reported_by" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Assigned To</label>
<input class="form-input" id="f_assigned_to" type="text"/>
</div>
</div>
</div>
<div class="form-card">
<div class="section-title" style="margin-top:0;">📍 Location Details</div>
<div class="fault-form-grid">
<div class="form-group">
<label class="form-label">Bay No.</label>
<input class="form-input" id="f_bay" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Feeder / Line</label>
<input class="form-input" id="f_feeder" type="text"/>
</div>
</div>
</div>
<div class="form-card">
<div class="section-title" style="margin-top:0;">📋 Status &amp; Resolution</div>
<div class="fault-form-grid">
<div class="form-group">
<label class="form-label">Current Status</label>
<select class="form-select" id="f_status">
<option value="Pending">Pending</option>
<option value="Under Investigation">Under Investigation</option>
<option value="In Progress">In Progress</option>
<option value="Resolved">Resolved</option>
<option value="Closed">Closed</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Downtime (Hours)</label>
<input class="form-input" id="f_downtime" min="0" step="0.1" type="number"/>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Corrective Action Taken</label>
<input class="form-input" id="f_corrective" type="text"/>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Preventive Action Recommended</label>
<input class="form-input" id="f_preventive" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Resolution Date</label>
<input class="form-input" id="f_resolution_date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Resolution Notes</label>
<input class="form-input" id="f_resolution_notes" type="text"/>
</div>
</div>
</div>
<div class="btn-group">
<button class="btn btn-success" onclick="saveFault()">💾 Save Fault Record</button>
<button class="btn btn-outline" onclick="closeFaultForm()">✖ Cancel</button>
<button class="btn btn-danger" id="btnDeleteFault" onclick="deleteFault()" style="display:none;">🗑️ Delete</button>
<button class="btn btn-outline" id="btnViewAttachedPhotosFault" onclick="viewRelatedPhotos(document.getElementById('f_id').value)" style="display:none;" type="button">📷 View Attached Photos</button>
</div>
</div>
</div>
</div>
<!-- ===== TRIPPING REGISTER VIEW ===== -->
<div class="view" id="trippingRegisterView">
<!-- Dashboard Section -->
<div id="tripDashboardSection">
<div class="trip-action-bar">
<div class="trip-action-left">
<label style="font-weight:700; color:var(--primary-dark);">Month:</label>
<input class="form-input" id="tripMonthPicker" onchange="renderTrippingRegister()" style="width: auto;" type="month"/>
</div>
<div class="trip-action-right">
<button class="btn btn-outline" onclick="exportTrips()">📥 Export CSV</button>
<button class="btn btn-primary" onclick="openTripForm()">➕ New Trip</button>
</div>
</div>
<div class="section-title">📊 Grand Totals</div>
<div class="trip-summary-grid" id="tripGrandTotals">
<!-- Cards injected by JS -->
</div>
<div class="section-title">🏭 Equipment Summary</div>
<div class="trip-table-container">
<table class="trip-table">
<thead>
<tr>
<th rowspan="2">Equipment Name</th>
<th rowspan="2">Type</th>
<th class="center" colspan="2" style="border-bottom: 1px solid var(--border);">T/T (Trial Tripping)</th>
<th class="center" colspan="2" style="border-bottom: 1px solid var(--border);">S/F (Sustain Fault)</th>
<th class="center" colspan="2" style="border-bottom: 1px solid var(--border);">ESD (Emergency)</th>
<th class="center" colspan="2" style="border-bottom: 1px solid var(--border);">PSD (Planned)</th>
<th class="center" colspan="2" style="border-bottom: 1px solid var(--border); border-left: 2px solid var(--border);">Total</th>
</tr>
<tr>
<th class="center">Cnt</th><th class="center">Time (H)</th>
<th class="center">Cnt</th><th class="center">Time (H)</th>
<th class="center">Cnt</th><th class="center">Time (H)</th>
<th class="center">Cnt</th><th class="center">Time (H)</th>
<th class="center" style="border-left: 2px solid var(--border);">Cnt</th><th class="center">Time (H)</th>
</tr>
</thead>
<tbody id="tripSummaryTableBody">
<!-- Rows generated by JS -->
</tbody>
</table>
</div>
<div class="section-title">🕒 Trip History</div>
<div class="trip-table-container">
<table class="trip-table">
<thead>
<tr>
<th>ID</th>
<th>Equipment</th>
<th>Trip Type</th>
<th>Trip D&amp;T</th>
<th>Restore D&amp;T</th>
<th>Duration (H)</th>
<th>Remarks</th>
</tr>
</thead>
<tbody id="tripHistoryTableBody">
<!-- Rows generated by JS -->
</tbody>
</table>
</div>
</div>
<!-- Form Section -->
<div id="tripFormSection" style="display:none;">
<input id="t_id" type="hidden"/>
<div class="form-card">
<div class="section-title" style="margin-top:0;">⚡ Trip Details</div>
<div class="trip-form-grid">
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Equipment</label>
<select class="form-select" id="t_equipment">
<!-- Populated dynamically -->
</select>
</div>
<div class="form-group">
<label class="form-label">Trip Type</label>
<select class="form-select" id="t_type">
<option value="TT">T/T (Trial Tripping)</option>
<option value="SF">S/F (Sustain Fault)</option>
<option value="ESD">ESD (Emergency Shut Down)</option>
<option value="PSD">PSD (Planned Shut Down)</option>
</select>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Remarks / Description</label>
<input class="form-input" id="t_remarks" placeholder="Brief reason for tripping" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Trip Date</label>
<input class="form-input" id="t_trip_date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Trip Time</label>
<input class="form-input" id="t_trip_time" type="time"/>
</div>
<div class="form-group">
<label class="form-label">Restore Date</label>
<input class="form-input" id="t_restore_date" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Restore Time</label>
<input class="form-input" id="t_restore_time" type="time"/>
</div>
</div>
</div>
<div class="btn-group">
<button class="btn btn-success" onclick="saveTrip()">💾 Save Trip Record</button>
<button class="btn btn-outline" onclick="closeTripForm()">✖ Cancel</button>
<button class="btn btn-danger" id="btnDeleteTrip" onclick="deleteTrip()" style="display:none;">🗑️ Delete</button>
<button class="btn btn-outline" id="btnViewAttachedPhotosTrip" onclick="viewRelatedPhotos(document.getElementById('t_id').value)" style="display:none;" type="button">📷 View Attached Photos</button>
</div>
</div>
</div>
<!-- ===== BREAKDOWN REGISTER VIEW ===== -->
<div class="view" id="breakdownRegisterView">
<!-- Dashboard Section -->
<div id="bdDashboardSection">
<div class="breakdown-action-bar">
<div class="breakdown-action-left">
<label style="font-weight:700; color:var(--primary-dark);">Month:</label>
<input class="form-input" id="bdMonthPicker" onchange="renderBreakdownRegister()" style="width: auto;" type="month"/>
</div>
<div class="breakdown-action-right">
<button class="btn btn-outline" onclick="exportBreakdowns()">📥 Export CSV</button>
<button class="btn btn-primary" onclick="openBreakdownForm()">➕ New Breakdown</button>
</div>
</div>
<div class="section-title">📊 Dashboard</div>
<div class="breakdown-summary-grid">
<div class="breakdown-summary-card">
<span class="title">Total Breakdowns</span>
<span class="value" id="bdTotalCount">0</span>
</div>
<div class="breakdown-summary-card pending">
<span class="title">Active</span>
<span class="value" id="bdActiveCount">0</span>
</div>
<div class="breakdown-summary-card resolved">
<span class="title">Resolved</span>
<span class="value" id="bdResolvedCount">0</span>
</div>
<div class="breakdown-summary-card critical">
<span class="title">Critical</span>
<span class="value" id="bdCriticalCount">0</span>
</div>
<div class="breakdown-summary-card">
<span class="title">Total Downtime</span>
<span class="value" id="bdTotalDowntime">0h</span>
</div>
<div class="breakdown-summary-card">
<span class="title">Avg Restore</span>
<span class="value" id="bdAvgRestore">0h</span>
</div>
</div>
<div class="section-title">📋 Breakdown History</div>
<div class="breakdown-table-container">
<table class="modern-table">
<thead>
<tr>
<th>BD ID</th>
<th>Equipment</th>
<th>Start Time</th>
<th>Restore Time</th>
<th>Severity</th>
<th>Status</th>
<th>Action</th>
</tr>
</thead>
<tbody id="bdTableBody">
<!-- Populated dynamically -->
</tbody>
</table>
</div>
</div>
<!-- Form Section -->
<div id="bdFormSection" style="display:none;">
<div class="section-title" id="bdFormTitle">📝 Report New Breakdown</div>
<input id="bdId" type="hidden"/>
<input id="bdNumber" type="hidden"/>
<div class="breakdown-form-section">
<h4>General Information</h4>
<div class="breakdown-form-grid col-3">
<div class="form-group">
<label class="form-label">Breakdown Start Date &amp; Time</label>
<input class="form-input" id="bdStartTime" onchange="calcBdTimes()" type="datetime-local"/>
</div>
<div class="form-group">
<label class="form-label">Reported By</label>
<input class="form-input" id="bdReportedBy" placeholder="Name / Designation" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Severity Level</label>
<select class="form-select" id="bdSeverity">
<option value="Low">Low (No immediate impact)</option>
<option selected="" value="Medium">Medium (Partial loss)</option>
<option value="High">High (Significant impact)</option>
<option value="Critical">Critical (Total failure/safety risk)</option>
</select>
</div>
</div>
</div>
<div class="breakdown-form-section">
<h4>Equipment Details</h4>
<div class="breakdown-form-grid">
<div class="form-group">
<label class="form-label">Equipment Name</label>
<select class="form-select" id="bdEquipmentName">
<!-- Populated dynamically based on SS -->
</select>
</div>
<div class="form-group">
<label class="form-label">Make / Manufacturer</label>
<input class="form-input" id="bdMake" type="text"/>
</div>
</div>
</div>
<div class="breakdown-form-section">
<h4>Breakdown Details</h4>
<div class="form-group">
<label class="form-label">Nature of Breakdown / Observations</label>
<textarea class="form-input" id="bdNature" placeholder="Describe the issue in detail..." rows="3"></textarea>
</div>
<div class="form-group">
<label class="form-label">Root Cause (if known)</label>
<textarea class="form-input" id="bdRootCause" placeholder="e.g. Moisture ingress, mechanical wear..." rows="2"></textarea>
</div>
</div>
<div class="breakdown-form-section">
<h4>Repair &amp; Restoration</h4>
<div class="breakdown-form-grid col-3">
<div class="form-group">
<label class="form-label">Repair Start Time</label>
<input class="form-input" id="bdRepairStartTime" onchange="calcBdTimes()" type="datetime-local"/>
</div>
<div class="form-group">
<label class="form-label">Repair End Time</label>
<input class="form-input" id="bdRepairEndTime" onchange="calcBdTimes()" type="datetime-local"/>
</div>
<div class="form-group">
<label class="form-label">Restoration Time</label>
<input class="form-input" id="bdRestoreTime" onchange="calcBdTimes()" type="datetime-local"/>
</div>
</div>
<div class="breakdown-form-grid col-3" style="margin-top:10px;">
<div class="form-group">
<label class="form-label">Total Outage (Hours)</label>
<input class="form-input" id="bdTotalOutage" readonly="" style="background:#f1f5f9;" type="number"/>
</div>
<div class="form-group">
<label class="form-label">Repair Duration (Hours)</label>
<input class="form-input" id="bdRepairDuration" readonly="" style="background:#f1f5f9;" type="number"/>
</div>
<div class="form-group">
<label class="form-label">Cost of Repair (₹)</label>
<input class="form-input" id="bdCost" placeholder="Optional" type="number"/>
</div>
</div>
<div class="form-group" style="margin-top:16px;">
<label class="form-label">Actions Taken / Remarks</label>
<textarea class="form-input" id="bdActionsTaken" placeholder="What was done to fix it? Parts replaced?" rows="2"></textarea>
</div>
</div>
<div class="breakdown-form-section">
<h4>Photos &amp; Documents</h4>
<p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Enter valid URLs to cloud storage (Google Drive, Dropbox, etc.) to keep the report lightweight.</p>
<div class="breakdown-form-grid">
<div class="form-group">
<label class="form-label">Link to Before Photo</label>
<input class="form-input" id="bdLinkBefore" placeholder="https://..." type="url"/>
</div>
<div class="form-group">
<label class="form-label">Link to After Photo</label>
<input class="form-input" id="bdLinkAfter" placeholder="https://..." type="url"/>
</div>
<div class="form-group" style="grid-column: span 2;">
<label class="form-label">Link to Additional Document (PDF/Report)</label>
<input class="form-input" id="bdLinkDoc" placeholder="https://..." type="url"/>
</div>
</div>
</div>
<div class="breakdown-form-section">
<h4>Status Tracking</h4>
<div class="form-group">
<label class="form-label">Current Status</label>
<select class="form-select" id="bdStatus">
<option value="Pending">Pending / Open</option>
<option value="Under Repair">Under Repair</option>
<option value="Resolved">Resolved / Restored</option>
<option value="Closed">Closed</option>
</select>
</div>
</div>
<div class="btn-group">
<button class="btn btn-success" onclick="saveBreakdown()">💾 Save Breakdown Report</button>
<button class="btn btn-outline" onclick="closeBreakdownForm()">✖ Cancel</button>
<button class="btn btn-danger" id="btnDeleteBreakdown" onclick="deleteBreakdown()" style="display:none;">🗑️ Delete</button>
<button class="btn btn-outline" id="btnViewAttachedPhotosBd" onclick="viewRelatedPhotos(document.getElementById('bdNumber').value)" style="display:none;" type="button">📷 View Attached Photos</button>
</div>
</div>
</div>
<!-- ===== EVENT TIMELINE VIEW ===== -->
<div class="view" id="eventTimelineView">
<div class="fault-action-bar">
<div class="fault-action-left">
<input class="form-input" id="timelineMonthFilter" onchange="renderEventTimeline()" style="max-width:200px" type="month"/>
<select class="form-select" id="timelineActionFilter" onchange="renderEventTimeline()" style="max-width:200px">
<option value="">All Modules</option>
<option value="Monthly Report">Monthly Report</option>
<option value="Maintenance">Maintenance</option>
<option value="Fault Register">Fault Register</option>
<option value="Tripping History">Tripping History</option>
<option value="Breakdown Report">Breakdown Report</option>
<option value="Photo Report">Photo Report</option>
</select>
</div>
</div>
<div class="fault-table-container">
<table class="modern-table">
<thead>
<tr>
<th>Date &amp; Time</th>
<th>Operator</th>
<th>Role</th>
<th>Module</th>
<th>Action</th>
<th>Remarks</th>
</tr>
</thead>
<tbody id="timelineTableBody">
</tbody>
</table>
</div>
<div class="empty-state" id="timelineEmptyState" style="display:none">
<div class="empty-icon">🕒</div>
<p>No events found for the selected filters.</p>
</div>
</div>
<!-- ===== MAINTENANCE REGISTER VIEW ===== -->
<div class="view" id="maintenanceRegisterView">
<div id="mntDashboardSection">
<div class="mnt-action-bar">
<div class="mnt-action-left">
<h2 style="color:var(--primary-dark); font-size:18px;">Maintenance Management</h2>
<input class="form-input" id="mntMonthPicker" onchange="renderMaintenanceRegister()" style="width:auto; font-weight:700;" type="month"/>
</div>
<div class="mnt-action-right">
<button class="btn btn-outline" onclick="exportMaintenance()">📥 Export CSV</button>
<button class="btn btn-primary" onclick="openMaintenanceForm()">➕ New Maintenance</button>
</div>
</div>
<div class="mnt-summary-grid" id="mntSummaryGrid">
<!-- Populated by JS -->
</div>
<div class="mnt-table-container">
<table class="modern-table">
<thead>
<tr>
<th>ID</th>
<th>Equipment</th>
<th>Type</th>
<th>Scheduled Date</th>
<th>Status</th>
<th>Duration</th>
<th>Actions</th>
</tr>
</thead>
<tbody id="mntTableBody">
<!-- Populated by JS -->
</tbody>
</table>
</div>
</div>
<div id="mntFormSection" style="display:none;">
<div class="form-card">
<h3 id="mntFormTitle" style="color:var(--primary-dark); margin-bottom:16px;">New Maintenance</h3>
<input id="mntId" type="hidden"/>
<div class="mnt-form-section">
<h4>General Info &amp; Equipment</h4>
<div class="mnt-form-grid">
<div class="form-group">
<label class="form-label">Equipment Name</label>
<select class="form-select" id="mntEquipmentName" onchange="loadMaintenanceChecklist()">
<!-- Populated dynamically -->
</select>
</div>
<div class="form-group">
<label class="form-label">Maintenance Type</label>
<select class="form-select" id="mntType">
<option value="Preventive">Preventive</option>
<option value="Corrective">Corrective</option>
<option value="Predictive">Predictive</option>
<option value="Condition-Based">Condition-Based</option>
</select>
</div>
</div>
</div>
<div class="mnt-form-section">
<h4>Work Details</h4>
<div class="form-group">
<label class="form-label">Description of Work</label>
<textarea class="form-input" id="mntDescription" placeholder="Describe the maintenance work..." rows="3"></textarea>
</div>
<div class="form-group">
<label class="form-label">Parts Replaced / Consumables Used</label>
<textarea class="form-input" id="mntParts" placeholder="List parts replaced..." rows="2"></textarea>
</div>
</div>
<div class="mnt-form-section" id="mntChecklistSection" style="display:none;">
<h4>Smart Checklist</h4>
<div class="checklist-container">
<div class="progress-container">
<div class="progress-text">
<span>Completion Progress</span>
<span id="mntChecklistText">0 / 0 Completed (0%)</span>
</div>
<div class="progress-bar">
<div class="progress-bar-fill" id="mntChecklistBarFill"></div>
</div>
</div>
<div class="checklist-grid" id="mntChecklistGrid">
<!-- Checkboxes injected here -->
</div>
</div>
</div>
<div class="mnt-form-section">
<h4>Schedule &amp; Status</h4>
<div class="mnt-form-grid col-3">
<div class="form-group">
<label class="form-label">Scheduled Date</label>
<input class="form-input" id="mntScheduledDate" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Actual Start</label>
<input class="form-input" id="mntStartTime" onchange="calcMntTimes()" type="datetime-local"/>
</div>
<div class="form-group">
<label class="form-label">Actual End</label>
<input class="form-input" id="mntEndTime" onchange="calcMntTimes()" type="datetime-local"/>
</div>
</div>
<div class="mnt-form-grid col-3" style="margin-top:10px;">
<div class="form-group">
<label class="form-label">Duration (Hours)</label>
<input class="form-input" id="mntDuration" readonly="" step="0.01" style="background:#f1f5f9;" type="number"/>
</div>
<div class="form-group">
<label class="form-label">Status</label>
<select class="form-select" id="mntStatus">
<option value="Scheduled">Scheduled</option>
<option value="In Progress">In Progress</option>
<option value="Completed">Completed</option>
<option value="Cancelled">Cancelled</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Maintenance Agency</label>
<input class="form-input" id="mntAgency" placeholder="Internal/Contractor" type="text"/>
</div>
</div>
</div>
<div class="mnt-form-section">
<h4>Photos &amp; Documents</h4>
<p style="font-size:12px; color:var(--text-secondary); margin-bottom:12px;">Enter valid URLs to cloud storage.</p>
<div class="mnt-form-grid">
<div class="form-group">
<label class="form-label">Link to Before Photo</label>
<input class="form-input" id="mntLinkBefore" placeholder="https://..." type="url"/>
</div>
<div class="form-group">
<label class="form-label">Link to After Photo</label>
<input class="form-input" id="mntLinkAfter" placeholder="https://..." type="url"/>
</div>
<div class="form-group" style="grid-column: span 2;">
<label class="form-label">Link to Additional Document (PDF/Report)</label>
<input class="form-input" id="mntLinkDoc" placeholder="https://..." type="url"/>
</div>
</div>
</div>
<div class="btn-group">
<button class="btn btn-success" onclick="saveMaintenance()">💾 Save Maintenance</button>
<button class="btn btn-outline" onclick="closeMaintenanceForm()">✖ Cancel</button>
<button class="btn btn-danger" id="btnDeleteMaintenance" onclick="deleteMaintenance()" style="display:none;">🗑️ Delete</button>
<button class="btn btn-outline" id="btnViewAttachedPhotosMnt" onclick="viewRelatedPhotos(document.getElementById('mntId').value)" style="display:none;" type="button">📷 View Attached Photos</button>
</div>
</div>
</div>
</div>
<!-- ===== PAGE: Equipment Master ===== -->
<div class="view" id="pageEquipmentMaster">
<div class="content">
<div class="eq-list-header">
<h2 class="eq-list-title">Equipment Dashboard</h2>
<div class="eq-list-actions">
<button class="btn btn-outline" onclick="alert('Export functionality coming soon.')">📥 Export</button>
<button class="btn btn-primary" onclick="openEquipmentModal()">➕ Add Equipment</button>
</div>
</div>
<div class="eq-dashboard-grid">
<div class="eq-kpi-card">
<div class="eq-kpi-icon"><span class="material-icons-round">precision_manufacturing</span></div>
<div class="eq-kpi-title">Total Equipment</div>
<div class="eq-kpi-value" id="eqTotalCount">0</div>
</div>
<div class="eq-kpi-card">
<div class="eq-kpi-icon"><span class="material-icons-round">bolt</span></div>
<div class="eq-kpi-title">Transformers</div>
<div class="eq-kpi-value" id="eqTransformerCount">0</div>
</div>
<div class="eq-kpi-card">
<div class="eq-kpi-icon"><span class="material-icons-round">cable</span></div>
<div class="eq-kpi-title">Feeders</div>
<div class="eq-kpi-value" id="eqFeederCount">0</div>
</div>
<div class="eq-kpi-card">
<div class="eq-kpi-icon"><span class="material-icons-round">settings_input_component</span></div>
<div class="eq-kpi-title">Breakers</div>
<div class="eq-kpi-value" id="eqBreakerCount">0</div>
</div>
</div>
<!-- Equipment List -->
<div class="fault-table-container">
<table class="modern-table">
<thead>
<tr>
<th>Name</th>
<th>Category</th>
<th>Voltage</th>
<th>Manufacturer</th>
<th>Status</th>
<th>Actions</th>
</tr>
</thead>
<tbody id="eqListContainer">
<!-- Populated by JS -->
</tbody>
</table>
</div>
<!-- Equipment Modal -->
<div class="modal" id="equipmentModal">
<div class="modal-content">
<div class="modal-header">
<h3 class="modal-title">Add / Edit Equipment</h3>
<button class="close-modal" onclick="closeEquipmentModal()">✖</button>
</div>
<form id="equipmentForm" onsubmit="saveEquipment(event)">
<input id="eqId" type="hidden"/>
<div class="eq-form-grid">
<div class="form-group">
<label class="form-label">Name *</label>
<input class="form-input" id="eqName" required="" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Category *</label>
<select class="form-input" id="eqCategory" required="">
<option value="Power Transformer">Power Transformer</option>
<option value="66 KV Incoming Line">66 KV Incoming Line</option>
<option value="66 KV Outgoing Line">66 KV Outgoing Line</option>
<option value="11 KV Feeder">11 KV Feeder</option>
<option value="Breaker">Breaker</option>
<option value="Isolator">Isolator</option>
<option value="CT/PT">CT / PT</option>
<option value="Control Panel">Control Panel</option>
<option value="Relay">Relay</option>
<option value="Battery">Battery Bank</option>
<option value="Charger">Battery Charger</option>
<option value="Earthing">Earthing System</option>
<option value="Auxiliary">Auxiliary</option>
<option value="Safety">Safety / Fire Fighting</option>
<option value="Communication">Communication</option>
<option value="Capacitor Bank">Capacitor Bank</option>
<option value="Lightning Arrester">Lightning Arrester</option>
<option value="Structural">Structural</option>
<option value="Bus Bar">Bus Bar</option>
<option value="Other">Other</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Voltage Level</label>
<select class="form-input" id="eqVoltage">
<option value="">N/A</option>
<option value="66 KV">66 KV</option>
<option value="11 KV">11 KV</option>
<option value="66/11 KV">66/11 KV</option>
<option value="415V AC">415V AC</option>
<option value="230V AC">230V AC</option>
<option value="220V DC">220V DC</option>
<option value="110V DC">110V DC</option>
<option value="48V DC">48V DC</option>
</select>
</div>
<div class="form-group">
<label class="form-label">Bay Number</label>
<input class="form-input" id="eqBayNumber" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Manufacturer</label>
<input class="form-input" id="eqManufacturer" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Model</label>
<input class="form-input" id="eqModel" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Serial No</label>
<input class="form-input" id="eqSerial" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Capacity / Rating</label>
<input class="form-input" id="eqCapacity" type="text"/>
</div>
<div class="form-group">
<label class="form-label">Install Date</label>
<input class="form-input" id="eqInstallDate" type="date"/>
</div>
<div class="form-group">
<label class="form-label">Status</label>
<select class="form-input" id="eqStatus">
<option value="Healthy">Healthy (In Service)</option>
<option value="Faulty">Faulty</option>
<option value="Under Maintenance">Under Maintenance</option>
<option value="Decommissioned">Decommissioned</option>
</select>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Location / Substation</label>
<input class="form-input" id="eqLocation" type="text"/>
</div>
<div class="form-group" style="grid-column: 1 / -1;">
<label class="form-label">Description / Notes</label>
<textarea class="form-input" id="eqDescription" rows="3" style="resize:vertical;"></textarea>
</div>
</div>
<div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px; border-top:1px solid var(--border-light); padding-top:16px;">
<button class="btn btn-outline" onclick="closeEquipmentModal()" type="button">Cancel</button>
<button class="btn btn-primary" type="submit">Save Equipment</button>
</div>
</form>
</div>
</div>
</div>
</div>
<!-- ===== PAGE: Equipment Profile ===== -->
<div class="view" id="pageEquipmentProfile">
<div class="content">
<button class="btn btn-outline" onclick="navigateTo('equipmentMaster', currentDashboardSSId)" style="margin-bottom: 16px;">
<span class="material-icons-round" style="font-size:16px;">arrow_back</span> Back to Master
            </button>
<div class="eq-profile-header">
<div class="eq-profile-title-area">
<div class="eq-profile-icon"><span class="material-icons-round" id="profIcon">precision_manufacturing</span></div>
<div>
<div class="eq-profile-name" id="profName">Equipment Name</div>
<div class="eq-profile-meta">
<span id="profCategory">Category</span> • 
                            <span id="profVoltage">Voltage</span> • 
                            <span id="profBay">Bay No</span>
</div>
</div>
</div>
<div class="eq-list-actions">
<div class="status-badge stat-resolved" id="profStatusBadge">In Service</div>
<button class="btn btn-outline" id="profEditBtn">Edit Profile</button>
</div>
</div>
<div class="eq-lifecycle-grid">
<!-- Lifecycle Summary -->
<div class="eq-lifecycle-card">
<div class="eq-lifecycle-card-title"><span class="material-icons-round">analytics</span> Lifecycle Health</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Health Score</span>
<span class="eq-stat-val" id="profHealthScore" style="color:var(--success)">98%</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Total Faults</span>
<span class="eq-stat-val" id="profTotalFaults">0</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Total Breakdowns</span>
<span class="eq-stat-val" id="profTotalBreakdowns">0</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Last Maintenance</span>
<span class="eq-stat-val" id="profLastMaintenance">-</span>
</div>
</div>
<!-- Asset Details -->
<div class="eq-lifecycle-card">
<div class="eq-lifecycle-card-title"><span class="material-icons-round">info</span> Asset Details</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Manufacturer</span>
<span class="eq-stat-val" id="profDetailManufacturer">-</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Model</span>
<span class="eq-stat-val" id="profDetailModel">-</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Serial No</span>
<span class="eq-stat-val" id="profDetailSerial">-</span>
</div>
<div class="eq-lifecycle-stat">
<span class="eq-stat-label">Install Date</span>
<span class="eq-stat-val" id="profDetailInstall">-</span>
</div>
</div>
</div>
<!-- Linked Records -->
<div class="eq-records-section">
<div class="eq-records-tabs">
<div class="eq-tab active" onclick="alert('Faults view coming soon')">Faults</div>
<div class="eq-tab" onclick="alert('Maintenance view coming soon')">Maintenance</div>
<div class="eq-tab" onclick="alert('Trippings view coming soon')">Trippings</div>
<div class="eq-tab" onclick="alert('Breakdowns view coming soon')">Breakdowns</div>
</div>
<div class="fault-table-container" style="box-shadow:none; margin-bottom:0;">
<table class="modern-table">
<thead>
<tr>
<th>Date</th>
<th>Record Type</th>
<th>Description</th>
<th>Status</th>
</tr>
</thead>
<tbody id="profRecordsContainer">
<!-- Populated by JS -->
</tbody>
</table>
</div>
</div>
</div>
</div>
<!-- ===== EXECUTIVE DASHBOARD VIEW ===== -->
<div class="view" id="executiveDashboardView">
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
</div>
<!-- ===== REGISTERS MODULE VIEW ===== -->
<div class="view" id="registersView">
    <div class="reg-actions" style="margin-top: 0px; margin-bottom: 16px;">
        <input type="text" class="reg-search-input" id="regSearchInput" placeholder="🔍 Search Registers..." onkeyup="filterRegisters()" style="width: 100%;">
    </div>
    
    <div id="registersContainer"></div>
</div>

<!-- ===== COMMON REGISTER TEMPLATE VIEW ===== -->
<div class="view" id="commonRegisterView">
    <div class="reg-actions" style="margin-bottom: 20px;">
        <input type="text" class="reg-search-input" placeholder="🔍 Search Entries...">
        <button class="reg-btn reg-btn-outline"><span class="material-icons-round">filter_alt</span> Advanced Filter</button>
        <button class="reg-btn reg-btn-outline"><span class="material-icons-round">date_range</span> Date</button>
        
        <div style="flex-grow: 1;"></div>
        
        <button class="reg-btn reg-btn-outline" onclick="showToast('Printing document...')"><span class="material-icons-round">print</span> Print</button>
        <button class="reg-btn reg-btn-outline" onclick="showToast('Generating PDF report...')"><span class="material-icons-round">picture_as_pdf</span> PDF</button>
        <button class="reg-btn reg-btn-outline" onclick="showToast('Exporting to Excel...')"><span class="material-icons-round">table_view</span> Excel</button>
        <button class="reg-btn reg-btn-primary" id="btnAddNewEntry" onclick="openRegisterEntryModal()"><span class="material-icons-round">add</span> Add New Entry</button>
    </div>

    <!-- Responsive Table Container -->
    <div class="card" style="padding: 0; overflow-x: auto;">
        <table class="data-table" id="commonRegisterTable">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Shift</th>
                    <th>Details</th>
                    <th>Remarks</th>
                    <th>Added By</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <!-- Empty State -->
                <tr id="commonRegisterEmpty">
                    <td colspan="7" style="text-align: center; padding: 40px;">
                        <span class="material-icons-round" style="font-size: 48px; color: #ccc;">folder_open</span>
                        <div style="margin-top: 10px; color: #888;">No entries found. Click 'Add New Entry' to start.</div>
                    </td>
                </tr>
                <!-- Dummy Row for preview -->
                <tr class="dummy-row" style="display:none;">
                    <td>2026-07-08</td>
                    <td>10:30 AM</td>
                    <td>Shift 1</td>
                    <td>Sample entry data...</td>
                    <td>Normal</td>
                    <td>Nupesh Patel</td>
                    <td>
                        <button class="icon-btn" title="View" onclick="alert('Viewing Entry:\\nDate: ' + this.closest('tr').children[0].innerText + '\\nTime: ' + this.closest('tr').children[1].innerText + '\\nShift: ' + this.closest('tr').children[2].innerText)"><span class="material-icons-round" style="color: #1976d2; font-size:18px;">visibility</span></button>
                        <button class="icon-btn edit-btn" title="Edit" onclick="showToast('Edit mode activated. (UI to be implemented)')"><span class="material-icons-round" style="color: #f57c00; font-size:18px;">edit</span></button>
                        <button class="icon-btn delete-btn" title="Delete" onclick="if(confirm('Are you sure you want to delete this entry?')) { this.closest('tr').remove(); showToast('Entry deleted successfully'); }"><span class="material-icons-round" style="color: #d32f2f; font-size:18px;">delete</span></button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    
    <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 15px; color: #666; font-size: 14px;">
        <div>Showing 0 to 0 of 0 entries</div>
        <div style="display: flex; gap: 8px;">
            <button class="reg-btn reg-btn-outline" style="padding: 4px 8px;" disabled>Prev</button>
            <button class="reg-btn reg-btn-outline" style="padding: 4px 8px;" disabled>Next</button>
        </div>
    </div>
</div>
`;

