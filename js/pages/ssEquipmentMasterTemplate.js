const ssEquipmentMasterTemplate = `

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
            <div id="equipmentModal" class="modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3 class="modal-title">Add / Edit Equipment</h3>
                        <button class="close-modal" onclick="closeEquipmentModal()">✖</button>
                    </div>
                    <form id="equipmentForm" onsubmit="saveEquipment(event)">
                        <input type="hidden" id="eqId">
                        <div class="eq-form-grid">
                            <div class="form-group">
                                <label class="form-label">Name *</label>
                                <input type="text" id="eqName" class="form-input" required>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Category *</label>
                                <select id="eqCategory" class="form-input" required>
                                    <option value="Transformer">Transformer</option>
                                    <option value="Feeder">Feeder</option>
                                    <option value="Breaker">Breaker</option>
                                    <option value="Isolator">Isolator</option>
                                    <option value="CT">Current Transformer</option>
                                    <option value="PT">Potential Transformer</option>
                                    <option value="Battery">Battery Bank</option>
                                    <option value="Other">Other</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Voltage Level</label>
                                <select id="eqVoltage" class="form-input">
                                    <option value="">N/A</option>
                                    <option value="66KV">66 KV</option>
                                    <option value="11KV">11 KV</option>
                                    <option value="415V">415 V</option>
                                </select>
                            </div>
                            <div class="form-group">
                                <label class="form-label">Bay Number</label>
                                <input type="text" id="eqBayNumber" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Manufacturer</label>
                                <input type="text" id="eqManufacturer" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Model</label>
                                <input type="text" id="eqModel" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Serial No</label>
                                <input type="text" id="eqSerial" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Capacity / Rating</label>
                                <input type="text" id="eqCapacity" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Install Date</label>
                                <input type="date" id="eqInstallDate" class="form-input">
                            </div>
                            <div class="form-group">
                                <label class="form-label">Status</label>
                                <select id="eqStatus" class="form-input">
                                    <option value="In Service">In Service</option>
                                    <option value="Under Maintenance">Under Maintenance</option>
                                    <option value="Decommissioned">Decommissioned</option>
                                </select>
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">Location / Substation</label>
                                <input type="text" id="eqLocation" class="form-input">
                            </div>
                            <div class="form-group" style="grid-column: 1 / -1;">
                                <label class="form-label">Description / Notes</label>
                                <textarea id="eqDescription" class="form-input" rows="3" style="resize:vertical;"></textarea>
                            </div>
                        </div>
                        <div style="display:flex; justify-content:flex-end; gap:12px; margin-top:20px; border-top:1px solid var(--border-light); padding-top:16px;">
                            <button type="button" class="btn btn-outline" onclick="closeEquipmentModal()">Cancel</button>
                            <button type="submit" class="btn btn-primary">Save Equipment</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    
`;
