// ===================================================================
//  NAVIGATION
// ===================================================================
function navigateTo(view, ssId) {
    document.querySelectorAll('.view').forEach(v => v.classList.remove('active'));
    currentView = view;

    const headerBack = document.getElementById('headerBack');

    if (view === 'dashboard') {
        document.getElementById('dashboardView').classList.add('active');
        headerBack.style.display = 'none';
        document.getElementById('headerTitle').textContent = '⚡ 66 KV SUBSTATION REPORT';
        document.getElementById('headerSubtitle').textContent = 'Monthly Report App';
        renderDashboard();
    } else if (view === 'executiveDashboard') {
        document.getElementById('executiveDashboardView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📊 Overview Dashboard';
        document.getElementById('headerSubtitle').textContent = ss.name;
        document.getElementById('edSSName').textContent = ss.name + ' Overview';
        // Note: For now we'll just render the global one, but we can customize it for specific SS later
        renderMainEnterpriseDashboard();
    } else if (view === 'setup') {
        document.getElementById('setupView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('dashboard');
        editingSSId = ssId || null;
        if (editingSSId) {
            let ss = getSubstation(editingSSId);
            document.getElementById('headerTitle').textContent = '✏️ Edit Substation';
            document.getElementById('headerSubtitle').textContent = ss.name;
        } else {
            document.getElementById('headerTitle').textContent = '➕ New Substation';
            document.getElementById('headerSubtitle').textContent = 'Create a new substation';
        }
        renderSetupForm();
    } else if (view === 'ssDashboard') {
        document.getElementById('ssDashboardView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('dashboard');
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🏠 ' + ss.name;
        document.getElementById('headerSubtitle').textContent = 'Substation Dashboard';
    } else if (view === 'dms') {
        document.getElementById('dmsView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📁 Documents (DMS)';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderDms();
    } else if (view === 'eventTimeline') {
        document.getElementById('eventTimelineView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        document.getElementById('headerTitle').textContent = '🕒 Event Timeline';
        let now = new Date();
        document.getElementById('timelineMonthFilter').value = `${now.getFullYear()}-${String(now.getMonth()+1).padStart(2,'0')}`;
        renderEventTimeline();
    } else if (view === 'report') {
        document.getElementById('reportView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        reportSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📊 ' + ss.name;
        document.getElementById('headerSubtitle').textContent = 'Monthly Report';
        renderReportPage();
    } else if (view === 'photoReport') {
        document.getElementById('photoReportView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📷 Photo Report';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderPhotoReport();
    } else if (view === 'faultRegister') {
        document.getElementById('faultRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🚨 Fault Register';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderFaultRegister();
    } else if (view === 'trippingRegister') {
        document.getElementById('trippingRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '⚡ Tripping Calculations';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('tripMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderTrippingRegister();
    } else if (view === 'breakdownRegister') {
        document.getElementById('breakdownRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🛠️ Breakdown Reports';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('bdMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderBreakdownRegister();
    } else if (view === 'maintenanceRegister') {
        document.getElementById('maintenanceRegisterView').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '🛠️ Maintenance Register';
        document.getElementById('headerSubtitle').textContent = ss.name;
        
        let now = new Date();
        document.getElementById('mntMonthPicker').value = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
        renderMaintenanceRegister();
    } else if (view === 'equipmentMaster') {
        document.getElementById('pageEquipmentMaster').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('ssDashboard', currentDashboardSSId);
        currentDashboardSSId = ssId;
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '⚙️ Equipment Master';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderEquipmentMaster();
    } else if (view === 'equipmentProfile') {
        document.getElementById('pageEquipmentProfile').classList.add('active');
        headerBack.style.display = 'flex';
        headerBack.onclick = () => navigateTo('equipmentMaster', currentDashboardSSId);
        let eqId = arguments[2];
        let ss = getSubstation(ssId);
        document.getElementById('headerTitle').textContent = '📄 Equipment Profile';
        document.getElementById('headerSubtitle').textContent = ss.name;
        renderEquipmentProfile(eqId);
    }

    window.scrollTo(0, 0);
}

function renderMainEnterpriseDashboard() {
    let subs = loadSubstations();
    if(edTimeInterval) clearInterval(edTimeInterval);
    function updateTime() {
        let el = document.getElementById('edLiveTime');
        if(el) el.textContent = 'Live Time: ' + new Date().toLocaleString();
    }
    updateTime();
    edTimeInterval = setInterval(updateTime, 1000);

    let totalFeeders = 0;
    let totalTrans = 0;
    let activeFaults = [];
    let criticalFaults = 0;
    let pendingMaint = 0;
    let totalDocs = 0;
    let allEvents = [];

    subs.forEach(ss => {
        totalFeeders += (ss.feeders || []).length;
        totalTrans += (ss.transformers || []).length;
        
        let f = ss.faults || [];
        let a = f.filter(x => !['Resolved', 'Closed'].includes(x.status));
        activeFaults.push(...a);
        criticalFaults += a.filter(x => x.severity === 'Critical').length;
        
        let m = ss.maintenance || [];
        pendingMaint += m.filter(x => x.status === 'Pending').length;
        
        totalDocs += (ss.documents || []).length;
        
        if (ss.events) {
            allEvents.push(...ss.events);
        }
    });

    document.getElementById('edKpiEq').textContent = totalFeeders + totalTrans;
    document.getElementById('edKpiFaults').textContent = activeFaults.length;
    document.getElementById('edKpiMaint').textContent = pendingMaint;
    document.getElementById('edKpiDocs').textContent = totalDocs;

    let score = 100;
    score -= (criticalFaults * 10);
    score -= ((activeFaults.length - criticalFaults) * 5);
    score -= (pendingMaint * 2);
    
    if(score < 0) score = 0;
    if(score > 100) score = 100;

    let scoreEl = document.getElementById('edHealthScore');
    if(scoreEl) scoreEl.innerHTML = score + '<span>Score</span>';
    
    let widget = document.getElementById('edHealthWidget');
    if(widget) {
        let color = score > 80 ? 'var(--success)' : (score > 50 ? 'var(--warning)' : 'var(--danger)');
        widget.style.background = `conic-gradient(${color} ${score}%, #f0f4f8 ${score}%)`;
    }

    let statusBadge = document.getElementById('edOpStatus');
    if(statusBadge) {
        if (criticalFaults > 0) {
            statusBadge.className = 'ed-status-badge ed-status-alert';
            statusBadge.textContent = 'Critical Alert';
        } else if (activeFaults.length > 0 || pendingMaint > 0) {
            statusBadge.className = 'ed-status-badge ed-status-warn';
            statusBadge.textContent = 'Needs Attention';
        } else {
            statusBadge.className = 'ed-status-badge ed-status-good';
            statusBadge.textContent = 'System Normal';
        }
    }

    allEvents.sort((a,b) => new Date(b.date) - new Date(a.date));
    let timelineHTML = '';
    if(allEvents.length === 0) {
        timelineHTML = '<div class="empty-state" style="padding: 10px;"><p>No recent events</p></div>';
    } else {
        let recentEvents = allEvents.slice(0, 5);
        recentEvents.forEach(ev => {
            let icon = 'info';
            if(ev.type === 'fault') icon = 'gpp_bad';
            if(ev.type === 'maintenance') icon = 'handyman';
            if(ev.type === 'tripping') icon = 'flash_on';
            
            timelineHTML += `
                <div class="ed-timeline-item">
                    <div class="ed-timeline-icon"><span class="material-icons-round">${icon}</span></div>
                    <div class="ed-timeline-content">
                        <div class="ed-timeline-title">${escapeHtml(ev.title)}</div>
                        <div class="ed-timeline-time">${new Date(ev.date).toLocaleString()}</div>
                    </div>
                </div>
            `;
        });
    }
    let timelineEl = document.getElementById('edTimelineContent');
    if(timelineEl) timelineEl.innerHTML = timelineHTML;

    // Charts - dummy trend for last 5 months based on faults
    let chartHTML = '';
    let months = [];
    for(let i=4; i>=0; i--) {
        let d = new Date();
        d.setMonth(d.getMonth() - i);
        months.push(d.toLocaleString('default', { month: 'short' }));
    }
    months.forEach((m, idx) => {
        let h = Math.floor(Math.random() * 80) + 10;
        chartHTML += `
            <div class="ed-chart-col">
                <div class="ed-chart-bar-wrap">
                    <div class="ed-chart-bar" style="height: ${h}%;"></div>
                </div>
                <div class="ed-chart-label">${m}</div>
            </div>
        `;
    });
    let chartEl = document.getElementById('edFaultChart');
    if(chartEl) chartEl.innerHTML = chartHTML;
}



// ===================================================================
//  TOAST NOTIFICATION
// ===================================================================
function showToast(msg) {
    const toast = document.getElementById('toast');
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
}

// ===================================================================
//  INIT
// ===================================================================
document.addEventListener('DOMContentLoaded', () => {
    setActiveMenu('substations');
});

// ===== NAVBAR - Page Navigation =====
function setActiveMenu(page) {
    // Update nav menu active states
    document.querySelectorAll('.nav-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    document.querySelectorAll('.drawer-menu-item').forEach(item => {
        item.classList.toggle('active', item.dataset.page === page);
    });
    
    const mainContent = document.getElementById('main-content');
    
    // Inject respective page template
    if (page === 'substations') {
        mainContent.innerHTML = pageSubstationsTemplate;
        document.getElementById('pageSubstations').style.display = 'block';
        document.getElementById('pageSubstations').classList.add('active');
        navigateTo('dashboard'); // Initialize substation dashboard
    } else if (page === 'reports') {
        mainContent.innerHTML = pageReportsTemplate;
        document.getElementById('pageReports').style.display = 'block';
        document.getElementById('pageReports').classList.add('active');
    } else if (page === 'notifications') {
        mainContent.innerHTML = pageNotificationsTemplate;
        document.getElementById('pageNotifications').style.display = 'block';
        document.getElementById('pageNotifications').classList.add('active');
    } else if (page === 'settings') {
        mainContent.innerHTML = pageSettingsTemplate;
        document.getElementById('pageSettings').style.display = 'block';
        document.getElementById('pageSettings').classList.add('active');
    }

    // Explicitly hide drawer if open
    document.getElementById('navDrawer').classList.remove('active');
    document.getElementById('navOverlay').classList.remove('active');

    window.scrollTo(0, 0);
}

function setActiveDrawer(page) {
    setActiveMenu(page);
    closeDrawer();
}

// ===== Hamburger / Drawer =====
const hamburger = document.getElementById('navHamburger');
const drawer = document.getElementById('navDrawer');
const navOverlay = document.getElementById('navOverlay');
const drawerCloseBtn = document.getElementById('drawerClose');

function openDrawer() {
    drawer.classList.add('open');
    navOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}
function closeDrawer() {
    drawer.classList.remove('open');
    navOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

hamburger.addEventListener('click', openDrawer);
drawerCloseBtn.addEventListener('click', closeDrawer);
navOverlay.addEventListener('click', closeDrawer);

// ===== Profile Dropdown =====
const profileBtn = document.getElementById('navProfile');
const profileDropdown = document.getElementById('profileDropdown');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileBtn.classList.toggle('open');
    profileDropdown.classList.toggle('show');
    notifPanel.classList.remove('show');
});

// ===== Notification Panel =====
const notifBtn = document.getElementById('notifBtn');
const notifPanel = document.getElementById('notifPanel');
const notifBadge = document.getElementById('notifBadge');

notifBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notifPanel.classList.toggle('show');
    profileDropdown.classList.remove('show');
    profileBtn.classList.remove('open');
});

function markAllRead() {
    document.querySelectorAll('.notif-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelectorAll('.notif-dot').forEach(dot => {
        dot.style.display = 'none';
    });
    notifBadge.style.display = 'none';
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
    if (!profileBtn.contains(e.target)) {
        profileDropdown.classList.remove('show');
        profileBtn.classList.remove('open');
    }
    if (!notifBtn.contains(e.target) && !notifPanel.contains(e.target)) {
        notifPanel.classList.remove('show');
    }
});

// Sticky nav shadow on scroll
const topNav = document.getElementById('topNav');
window.addEventListener('scroll', () => {
    topNav.classList.toggle('scrolled', window.scrollY > 4);
});

