const reportsTemplate = `

        <div class="page-content" style="padding: 20px;">
            
            <div class="mega-menu-wrapper" id="reportsMegaMenu">
                <div class="mega-menu-header">
                    <div class="mega-menu-title" style="font-weight: 700; color: var(--primary-dark); display: flex; align-items: center; gap: 8px;">
                        <span class="material-icons-round">assessment</span>
                        Report Center
                    </div>
                    <div class="mega-menu-search">
                        <span class="material-icons-round">search</span>
                        <input type="text" id="megaMenuSearch" placeholder="Search reports..." onkeyup="filterMegaMenu(this.value)">
                    </div>
                </div>
                <div class="mega-menu-content" id="megaMenuContent">
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">insert_chart</span> Monthly Reports</h4>
                        <a href="#" class="mega-menu-item-link" onclick="handleMegaMenuItemClick(event, 'reports')"><span class="material-icons-round">visibility</span> View Monthly Reports</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">add_circle</span> Create Monthly Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Report History</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">photo_camera</span> Photo Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">image</span> Inspection Photos</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">collections</span> Equipment Photos</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">build</span> Maintenance Photos</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Photo Report History</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">warning</span> Fault Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">error</span> Active Faults</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">check_circle</span> Resolved Faults</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">assignment</span> Monthly Fault Report</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">offline_bolt</span> Tripping Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">category</span> Equipment-wise Tripping Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">event_note</span> Monthly Tripping Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">verified_user</span> Reliability Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">summarize</span> T/T Summary</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">summarize</span> SF Summary</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">summarize</span> ESD Summary</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">summarize</span> PSD Summary</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">build_circle</span> Breakdown Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Breakdown History</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">timer</span> Downtime Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">troubleshoot</span> Root Cause Analysis</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">handyman</span> Maintenance Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">engineering</span> Preventive Maintenance</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">healing</span> Corrective Maintenance</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Maintenance History</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">timeline</span> Event Timeline Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">today</span> Daily Events</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">calendar_month</span> Monthly Events</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">person_search</span> Operator Activity</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">precision_manufacturing</span> Equipment Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">electrical_services</span> Transformer Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">power</span> Feeder Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">cable</span> 66 KV Line Report</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">health_and_safety</span> Equipment Health Report</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">folder_open</span> Document Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">upload_file</span> Uploaded Documents</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">notification_important</span> Expiring Certificates</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Document History</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">insights</span> Analytics Reports</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">dashboard</span> Dashboard Analytics</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">trending_up</span> Monthly Performance</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">bar_chart</span> Equipment Performance</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">pie_chart</span> Fault Analytics</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">show_chart</span> Tripping Analytics</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">download</span> Export Center</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">picture_as_pdf</span> Export PDF</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">table_view</span> Export Excel</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">print</span> Print Reports</a>
                    </div>
                    <div class="mega-menu-group">
                        <h4><span class="material-icons-round">manage_history</span> Report History</h4>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">history</span> Previously Generated Reports</a>
                        <a href="#" class="mega-menu-item-link"><span class="material-icons-round">download_for_offline</span> Download Reports</a>
                    </div>
                </div>
            </div>

        </div>
    
`;
