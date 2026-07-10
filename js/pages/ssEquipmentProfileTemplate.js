const ssEquipmentProfileTemplate = `

        <div class="content">
            <button class="btn btn-outline" onclick="goBackTo('equipmentMaster', currentDashboardSSId)" style="margin-bottom: 16px;">
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
    
`;
