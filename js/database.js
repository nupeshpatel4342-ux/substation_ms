// ===================================================================
//  SUPABASE DATABASE & SYNC MANAGER
// ===================================================================

const DatabaseManager = {
    client: null,

    init() {
        const url = localStorage.getItem('supabase_url') || 'https://cguhagyineqndzyvgjry.supabase.co';
        const key = localStorage.getItem('supabase_key') || 'sb_publishable_GzzSxF1LDLNpTc7MlROqMQ_Vp09VgIS';
        const enabled = localStorage.getItem('supabase_sync_enabled') !== 'false';

        if (enabled && url && key && window.supabase) {
            try {
                this.client = window.supabase.createClient(url, key);
                console.log("Supabase Client initialized successfully.");
                this.updateStatusUI('connected');
                // Trigger initial data pull
                this.pullData();
            } catch (e) {
                console.error("Failed to initialize Supabase client:", e);
                this.updateStatusUI('error');
            }
        } else if (url && key && window.supabase) {
            this.updateStatusUI('disabled');
        } else {
            this.updateStatusUI('not_configured');
        }
    },

    updateStatusUI(status) {
        console.log(`Database sync status: ${status}`);
    },

    generateUuid(str) {
        let hash = 0;
        for (let i = 0; i < str.length; i++) {
            hash = str.charCodeAt(i) + ((hash << 5) - hash);
        }
        let hex = '';
        for (let i = 0; i < 16; i++) {
            let value = (hash >> (i * 2)) & 0xff;
            hex += ('00' + value.toString(16)).slice(-2);
        }
        return [
            hex.slice(0, 8),
            hex.slice(8, 12),
            '4' + hex.slice(12, 15),
            'a' + hex.slice(15, 18),
            hex.slice(18, 30)
        ].join('-');
    },

    async testConnection(url, key) {
        if (!window.supabase) {
            return { success: false, message: 'Supabase library not loaded. Check internet connection.' };
        }
        try {
            const testClient = window.supabase.createClient(url, key);
            // Query a lightweight system or public table
            const { data, error } = await testClient.from('substations').select('id').limit(1);
            if (error) {
                return { success: false, message: error.message };
            }
            return { success: true, message: 'Successfully connected to Supabase database!' };
        } catch (e) {
            return { success: false, message: e.message || 'Unknown connection error.' };
        }
    },

    async deleteSubstation(ssId) {
        if (!this.client) return;
        try {
            await this.client.from('substations').delete().eq('id', ssId);
            console.log(`Substation ${ssId} deleted from Supabase.`);
        } catch (e) {
            console.error(`Error deleting substation ${ssId} from Supabase:`, e);
        }
    },

    async pushData(list) {
        if (!this.client) return;
        this.updateStatusUI('syncing');

        try {
            const ssData = [];
            const feedersData = [];
            const transformersData = [];
            const oppositesData = [];
            const equipmentData = [];
            const faultsData = [];
            const tripsData = [];
            const breakdownsData = [];
            const maintenanceData = [];
            const timelineData = [];
            const photosData = [];
            const docsData = [];

            const reportsData = [];
            const reportFeedersData = [];
            const reportOppositesData = [];

            list.forEach(ss => {
                ssData.push({
                    id: ss.id,
                    name: ss.name,
                    is_sample: !!ss.isSample
                });

                if (ss.feeders) {
                    ss.feeders.forEach(f => {
                        feedersData.push({
                            id: f.id,
                            substation_id: ss.id,
                            name: f.name || '',
                            mf: parseFloat(f.mf) || 2,
                            role: f.role || '11kv_feeder'
                        });
                    });
                }

                if (ss.transformers) {
                    ss.transformers.forEach(t => {
                        transformersData.push({
                            id: t.id,
                            substation_id: ss.id,
                            name: t.name || '',
                            hv_feeder_id: t.hvFeederId || null,
                            lv_feeder_id: t.lvFeederId || null
                        });
                    });
                }

                if (ss.oppositeSSEntries) {
                    ss.oppositeSSEntries.forEach(o => {
                        oppositesData.push({
                            id: o.id,
                            substation_id: ss.id,
                            name: o.name || '',
                            linked_feeder_id: o.linkedFeederId || null
                        });
                    });
                }

                if (ss.equipmentMaster) {
                    ss.equipmentMaster.forEach(eq => {
                        equipmentData.push({
                            id: eq.id,
                            substation_id: ss.id,
                            name: eq.name || '',
                            category: eq.category || '',
                            voltage_level: eq.voltageLevel || '',
                            bay_number: eq.bayNumber || '',
                            manufacturer: eq.manufacturer || null,
                            model: eq.model || null,
                            serial_no: eq.serialNo || null,
                            capacity: eq.capacity || null,
                            install_date: eq.installDate ? eq.installDate : null,
                            commission_date: eq.commissionDate ? eq.commissionDate : null,
                            warranty_expiry: eq.warrantyExpiry ? eq.warrantyExpiry : null,
                            sap_code: eq.sapCode || null,
                            last_maintenance: eq.lastMaintenance ? eq.lastMaintenance : null,
                            next_maintenance: eq.nextMaintenance ? eq.nextMaintenance : null,
                            oil_capacity: eq.oilCapacity || null,
                            gas_pressure: eq.gasPressure || null,
                            ct_pt_ratio: eq.ctPtRatio || null,
                            status: eq.status || 'Healthy',
                            location: eq.location || null,
                            description: eq.description || null
                        });
                    });
                }

                if (ss.faults) {
                    ss.faults.forEach(f => {
                        faultsData.push({
                            id: f.id,
                            substation_id: ss.id,
                            equipment_id: ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === f.equipment_name)?.id || null,
                            equipment_name: f.equipment_name || '',
                            date: f.date || new Date().toISOString().split('T')[0],
                            time: f.time || null,
                            voltage: f.voltage || '',
                            category: f.category || '',
                            type: f.type || '',
                            severity: f.severity || '',
                            description: f.description || null,
                            root_cause: f.root_cause || null,
                            reported_by: f.reported_by || null,
                            assigned_to: f.assigned_to || null,
                            bay: f.bay || null,
                            status: f.status || 'Pending',
                            downtime: parseFloat(f.downtime) || 0,
                            resolution: f.resolution || null,
                            resolved_date: f.resolved_date ? f.resolved_date : null,
                            resolved_time: f.resolved_time || null,
                            remarks: f.remarks || null
                        });
                    });
                }

                if (ss.trips) {
                    ss.trips.forEach(t => {
                        tripsData.push({
                            id: t.id,
                            substation_id: ss.id,
                            equipment_id: ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === t.equipment)?.id || null,
                            equipment_name: t.equipment || '',
                            type: t.type || '',
                            remarks: t.remarks || null,
                            trip_date: t.trip_date || new Date().toISOString().split('T')[0],
                            trip_time: t.trip_time || '00:00',
                            restore_date: t.restore_date ? t.restore_date : null,
                            restore_time: t.restore_time || null,
                            duration: parseFloat(t.duration) || 0
                        });
                    });
                }

                if (ss.breakdowns) {
                    ss.breakdowns.forEach(b => {
                        breakdownsData.push({
                            id: b.id,
                            substation_id: ss.id,
                            bd_number: b.bdNumber || ('BD-' + b.id.slice(-4)),
                            start_time: b.startTime ? new Date(b.startTime).toISOString() : new Date().toISOString(),
                            reported_by: b.reportedBy || null,
                            severity: b.severity || '',
                            equipment_id: b.equipment_id || (ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === b.equipmentName)?.id) || null,
                            equipment_name: b.equipmentName || '',
                            make: b.make || null,
                            nature: b.nature || null,
                            root_cause: b.rootCause || null,
                            repair_start_time: b.repairStartTime ? new Date(b.repairStartTime).toISOString() : null,
                            repair_end_time: b.repairEndTime ? new Date(b.repairEndTime).toISOString() : null,
                            restore_time: b.restoreTime ? new Date(b.restoreTime).toISOString() : null,
                            total_outage: parseFloat(b.totalOutage) || 0,
                            repair_duration: parseFloat(b.repairDuration) || 0,
                            cost: parseFloat(b.cost) || 0,
                            actions_taken: b.actionsTaken || null,
                            link_before: b.linkBefore || null,
                            link_after: b.linkAfter || null,
                            link_doc: b.linkDoc || null,
                            status: b.status || 'Pending'
                        });
                    });
                }

                if (ss.maintenance) {
                    ss.maintenance.forEach(m => {
                        maintenanceData.push({
                            id: m.id,
                            substation_id: ss.id,
                            equipment_id: m.equipment_id || (ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === m.equipmentName)?.id) || null,
                            equipment_name: m.equipmentName || '',
                            type: m.type || '',
                            description: m.description || null,
                            parts: m.parts || null,
                            scheduled_date: m.scheduledDate || new Date().toISOString().split('T')[0],
                            start_time: m.startTime || null,
                            end_time: m.endTime || null,
                            duration: parseFloat(m.duration) || 0,
                            status: m.status || 'Scheduled',
                            agency: m.agency || null,
                            link_before: m.linkBefore || null,
                            link_after: m.linkAfter || null,
                            link_doc: m.linkDoc || null,
                            checklist_data: m.checklistData || [],
                            updated_at: m.updatedAt || new Date().toISOString()
                        });
                    });
                }

                if (ss.timelineEvents) {
                    ss.timelineEvents.forEach(evt => {
                        timelineData.push({
                            id: evt.id,
                            substation_id: ss.id,
                            date: evt.date || new Date().toISOString().split('T')[0],
                            time: evt.time || '00:00',
                            month: evt.month || '',
                            year: evt.year || '',
                            operator: evt.operator || 'System',
                            role: evt.role || 'Admin',
                            module: evt.module || '',
                            action: evt.action || '',
                            remarks: evt.remarks || null
                        });
                    });
                }

                if (ss.photos) {
                    ss.photos.forEach(p => {
                        photosData.push({
                            id: p.id,
                            substation_id: ss.id,
                            url: p.url || '',
                            equipment_id: p.equipment_id || (ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === p.equipment)?.id) || null,
                            equipment: p.equipment || null,
                            category: p.category || null,
                            caption: p.caption || null,
                            gps: p.gps || null,
                            remarks: p.remarks || null,
                            related_record_id: p.relatedRecord || null,
                            timestamp: p.timestamp || new Date().toISOString(),
                            uploader: p.user || null
                        });
                    });
                }

                if (ss.documents) {
                    ss.documents.forEach(d => {
                        docsData.push({
                            id: d.id,
                            substation_id: ss.id,
                            title: d.title || '',
                            version: d.version || 'v1.0',
                            status: d.status || 'Approved',
                            equipment_id: d.equipment_id || (ss.equipmentMaster && ss.equipmentMaster.find(e => e.name === d.equipment)?.id) || null,
                            equipment: d.equipment || null,
                            record_id: d.recordId || null,
                            expiry: d.expiry ? d.expiry : null,
                            timestamp: d.timestamp || new Date().toISOString(),
                            url: d.url || '',
                            folder: d.folder || ''
                        });
                    });
                }

                if (ss.reports) {
                    Object.entries(ss.reports).forEach(([month, rep]) => {
                        const reportId = DatabaseManager.generateUuid(ss.id + '_' + month);
                        reportsData.push({
                            id: reportId,
                            substation_id: ss.id,
                            month: month,
                            status: rep.status || 'Draft'
                        });

                        if (rep.readings) {
                            const feederIds = [...new Set(Object.keys(rep.readings).map(k => k.split('_')[1]))];
                            feederIds.forEach(fid => {
                                if (!fid) return;
                                const r24 = parseFloat(rep.readings[`r24_${fid}`]) || 0;
                                const r00 = parseFloat(rep.readings[`r00_${fid}`]) || 0;
                                const feeder = ss.feeders && ss.feeders.find(f => f.id === fid);
                                const mf = feeder ? feeder.mf : 2;
                                const difference = r24 > 0 || r00 > 0 ? (r24 - r00) : 0;
                                const units = difference * mf;

                                reportFeedersData.push({
                                    report_id: reportId,
                                    feeder_id: fid,
                                    reading_24: r24,
                                    reading_00: r00,
                                    difference: difference,
                                    units: units
                                });
                            });
                        }

                        if (rep.oppositeReadings) {
                            Object.entries(rep.oppositeReadings).forEach(([oppKey, val]) => {
                                const oppId = oppKey.replace('opp_', '');
                                reportOppositesData.push({
                                    report_id: reportId,
                                    opposite_id: oppId,
                                    reading: parseFloat(val) || 0
                                });
                            });
                        }
                    });
                }
            });

            const client = this.client;

            // Run requests
            if (ssData.length > 0) await client.from('substations').upsert(ssData);
            if (feedersData.length > 0) await client.from('feeders').upsert(feedersData);
            if (transformersData.length > 0) await client.from('transformers').upsert(transformersData);
            if (oppositesData.length > 0) await client.from('opposite_ss_entries').upsert(oppositesData);
            if (equipmentData.length > 0) await client.from('equipment_master').upsert(equipmentData);
            if (faultsData.length > 0) await client.from('fault_register').upsert(faultsData);
            if (tripsData.length > 0) await client.from('tripping_register').upsert(tripsData);
            if (breakdownsData.length > 0) await client.from('breakdown_register').upsert(breakdownsData);
            if (maintenanceData.length > 0) await client.from('maintenance_register').upsert(maintenanceData);
            if (timelineData.length > 0) await client.from('timeline_events').upsert(timelineData);
            if (photosData.length > 0) await client.from('photos').upsert(photosData);
            if (docsData.length > 0) await client.from('documents').upsert(docsData);

            if (reportsData.length > 0) await client.from('reports').upsert(reportsData);
            if (reportFeedersData.length > 0) await client.from('report_feeder_readings').upsert(reportFeedersData);
            if (reportOppositesData.length > 0) await client.from('report_opposite_readings').upsert(reportOppositesData);

            this.updateStatusUI('connected');
            console.log("Substations batch synced to Supabase successfully.");
        } catch (e) {
            console.error("Error syncing substations to Supabase:", e);
            this.updateStatusUI('error');
        }
    },

    async pushRegisters(rDB) {
        if (!this.client) return;
        this.updateStatusUI('syncing');

        try {
            const entriesData = [];

            Object.entries(rDB).forEach(([title, entries]) => {
                if (!entries || !Array.isArray(entries)) return;

                entries.forEach(entry => {
                    const uniqueStr = (entry.substation_id || currentDashboardSSId || 'global') + '_' + title + '_' + entry.date + '_' + entry.time + '_' + entry.shift;
                    const entryId = this.generateUuid(uniqueStr);

                    entriesData.push({
                        id: entryId,
                        substation_id: entry.substation_id || currentDashboardSSId || 'halvad3',
                        title: title,
                        entry_date: entry.date,
                        entry_time: entry.time + ':00',
                        shift: entry.shift,
                        details: typeof entry.details === 'string' ? { html: entry.details } : (entry.details || {}),
                        remarks: entry.remarks || '',
                        created_by: entry.created_by || 'Operator',
                        attachments: entry.attachments || [],
                        equipment_id: entry.equipment_id || null
                    });
                });
            });

            if (entriesData.length > 0) {
                await this.client.from('register_entries').upsert(entriesData);
            }

            this.updateStatusUI('connected');
            console.log("Registers synced to Supabase successfully.");
        } catch (e) {
            console.error("Error syncing registers to Supabase:", e);
            this.updateStatusUI('error');
        }
    },

    async pullData() {
        if (!this.client) return;
        this.updateStatusUI('syncing');

        try {
            const client = this.client;

            // Fetch substations first
            const { data: dbSubs, error: errSubs } = await client.from('substations').select('*');
            if (errSubs) throw errSubs;

            if (!dbSubs || dbSubs.length === 0) {
                console.log("No data in Supabase, pushing local data...");
                const localSubs = loadSubstations();
                await this.pushData(localSubs);
                const localRegs = JSON.parse(localStorage.getItem('substation_registers_db') || '{}');
                await this.pushRegisters(localRegs);
                return;
            }

            // Fetch all other tables in parallel
            const [
                { data: dbFeeders },
                { data: dbTransformers },
                { data: dbOpposites },
                { data: dbEquipment },
                { data: dbFaults },
                { data: dbTrips },
                { data: dbBreakdowns },
                { data: dbMaintenance },
                { data: dbTimeline },
                { data: dbPhotos },
                { data: dbDocs },
                { data: dbReports },
                { data: dbReportReadings },
                { data: dbReportOpposites }
            ] = await Promise.all([
                client.from('feeders').select('*'),
                client.from('transformers').select('*'),
                client.from('opposite_ss_entries').select('*'),
                client.from('equipment_master').select('*'),
                client.from('fault_register').select('*'),
                client.from('tripping_register').select('*'),
                client.from('breakdown_register').select('*'),
                client.from('maintenance_register').select('*'),
                client.from('timeline_events').select('*'),
                client.from('photos').select('*'),
                client.from('documents').select('*'),
                client.from('reports').select('*'),
                client.from('report_feeder_readings').select('*'),
                client.from('report_opposite_readings').select('*')
            ]);

            // Reconstruct substations
            const newList = dbSubs.map(dbSS => {
                const ssId = dbSS.id;

                const feeders = (dbFeeders || []).filter(f => f.substation_id === ssId).map(f => ({
                    id: f.id,
                    name: f.name,
                    mf: parseFloat(f.mf),
                    role: f.role
                }));

                const transformers = (dbTransformers || []).filter(t => t.substation_id === ssId).map(t => ({
                    id: t.id,
                    name: t.name,
                    hvFeederId: t.hv_feeder_id,
                    lvFeederId: t.lv_feeder_id
                }));

                const oppositeSSEntries = (dbOpposites || []).filter(o => o.substation_id === ssId).map(o => ({
                    id: o.id,
                    name: o.name,
                    linkedFeederId: o.linked_feeder_id
                }));

                const equipmentMaster = (dbEquipment || []).filter(e => e.substation_id === ssId).map(e => ({
                    id: e.id,
                    name: e.name,
                    category: e.category,
                    voltageLevel: e.voltage_level,
                    bayNumber: e.bay_number,
                    manufacturer: e.manufacturer || '',
                    model: e.model || '',
                    serialNo: e.serial_no || '',
                    capacity: e.capacity || '',
                    installDate: e.install_date || '',
                    commissionDate: e.commission_date || '',
                    warrantyExpiry: e.warranty_expiry || '',
                    sapCode: e.sap_code || '',
                    lastMaintenance: e.last_maintenance || '',
                    nextMaintenance: e.next_maintenance || '',
                    oilCapacity: e.oil_capacity || '',
                    gasPressure: e.gas_pressure || '',
                    ctPtRatio: e.ct_pt_ratio || '',
                    status: e.status,
                    location: e.location || '',
                    description: e.description || ''
                }));

                const faults = (dbFaults || []).filter(f => f.substation_id === ssId).map(f => ({
                    id: f.id,
                    equipment_name: f.equipment_name,
                    date: f.date,
                    time: f.time ? f.time.substring(0, 5) : '',
                    voltage: f.voltage,
                    category: f.category,
                    type: f.type,
                    severity: f.severity,
                    description: f.description || '',
                    root_cause: f.root_cause || '',
                    reported_by: f.reported_by || '',
                    assigned_to: f.assigned_to || '',
                    bay: f.bay || '',
                    status: f.status,
                    downtime: f.downtime,
                    resolution: f.resolution || '',
                    resolved_date: f.resolved_date || '',
                    resolved_time: f.resolved_time ? f.resolved_time.substring(0, 5) : '',
                    remarks: f.remarks || ''
                }));

                const trips = (dbTrips || []).filter(t => t.substation_id === ssId).map(t => ({
                    id: t.id,
                    equipment: t.equipment_name,
                    type: t.type,
                    remarks: t.remarks || '',
                    trip_date: t.trip_date,
                    trip_time: t.trip_time ? t.trip_time.substring(0, 5) : '00:00',
                    restore_date: t.restore_date || '',
                    restore_time: t.restore_time ? t.restore_time.substring(0, 5) : '',
                    duration: t.duration
                }));

                const breakdowns = (dbBreakdowns || []).filter(b => b.substation_id === ssId).map(b => ({
                    id: b.id,
                    bdNumber: b.bd_number,
                    startTime: b.start_time,
                    reportedBy: b.reported_by || '',
                    severity: b.severity,
                    equipmentName: b.equipment_name,
                    make: b.make || '',
                    nature: b.nature || '',
                    rootCause: b.root_cause || '',
                    repairStartTime: b.repair_start_time || '',
                    repairEndTime: b.repair_end_time || '',
                    restoreTime: b.restore_time || '',
                    totalOutage: b.total_outage,
                    repairDuration: b.repair_duration,
                    cost: b.cost,
                    actionsTaken: b.actions_taken || '',
                    linkBefore: b.link_before || '',
                    linkAfter: b.link_after || '',
                    linkDoc: b.link_doc || '',
                    status: b.status
                }));

                const maintenance = (dbMaintenance || []).filter(m => m.substation_id === ssId).map(m => ({
                    id: m.id,
                    equipmentName: m.equipment_name,
                    type: m.type,
                    description: m.description || '',
                    parts: m.parts || '',
                    scheduledDate: m.scheduled_date,
                    startTime: m.start_time ? m.start_time.substring(0, 5) : '',
                    endTime: m.end_time ? m.end_time.substring(0, 5) : '',
                    duration: m.duration,
                    status: m.status,
                    agency: m.agency || '',
                    linkBefore: m.link_before || '',
                    linkAfter: m.link_after || '',
                    linkDoc: m.link_doc || '',
                    checklistData: m.checklist_data,
                    updatedAt: m.updated_at
                }));

                const timelineEvents = (dbTimeline || []).filter(e => e.substation_id === ssId).map(e => ({
                    id: e.id,
                    date: e.date,
                    time: e.time ? e.time.substring(0, 5) : '00:00',
                    month: e.month,
                    year: e.year,
                    operator: e.operator,
                    role: e.role,
                    module: e.module,
                    action: e.action,
                    remarks: e.remarks || ''
                }));

                const photos = (dbPhotos || []).filter(p => p.substation_id === ssId).map(p => ({
                    id: p.id,
                    url: p.url,
                    equipment: p.equipment || '',
                    category: p.category || '',
                    caption: p.caption || '',
                    gps: p.gps || '',
                    remarks: p.remarks || '',
                    relatedRecord: p.related_record_id || '',
                    timestamp: p.timestamp,
                    user: p.uploader || ''
                }));

                const documents = (dbDocs || []).filter(d => d.substation_id === ssId).map(d => ({
                    id: d.id,
                    title: d.title,
                    version: d.version,
                    status: d.status,
                    equipment: d.equipment || '',
                    recordId: d.record_id || '',
                    expiry: d.expiry || '',
                    timestamp: d.timestamp,
                    url: d.url,
                    folder: d.folder
                }));

                const reports = {};
                const ssReports = (dbReports || []).filter(r => r.substation_id === ssId);
                ssReports.forEach(r => {
                    const readings = {};
                    const oppositeReadings = {};

                    const repReadings = (dbReportReadings || []).filter(rd => rd.report_id === r.id);
                    repReadings.forEach(rd => {
                        readings[`r24_${rd.feeder_id}`] = rd.reading_24;
                        readings[`r00_${rd.feeder_id}`] = rd.reading_00;
                    });

                    const repOpposites = (dbReportOpposites || []).filter(ro => ro.report_id === r.id);
                    repOpposites.forEach(ro => {
                        oppositeReadings[`opp_${ro.opposite_id}`] = ro.reading;
                    });

                    reports[r.month] = {
                        status: r.status,
                        readings: readings,
                        oppositeReadings: oppositeReadings
                    };
                });

                return {
                    id: ssId,
                    name: dbSS.name,
                    isSample: dbSS.is_sample,
                    feeders,
                    transformers,
                    oppositeSSEntries,
                    equipmentMaster,
                    faults,
                    trips,
                    breakdowns,
                    maintenance,
                    timelineEvents,
                    photos,
                    documents,
                    reports
                };
            });

            // Save to local storage
            localStorage.setItem(STORAGE_KEY, JSON.stringify(newList));

            // Pull registers
            const { data: dbRegisters, error: errRegs } = await client.from('register_entries').select('*');
            if (errRegs) throw errRegs;

            const newRegistersDB = {};
            if (dbRegisters) {
                dbRegisters.forEach(entry => {
                    const title = entry.title;
                    if (!newRegistersDB[title]) newRegistersDB[title] = [];

                    newRegistersDB[title].push({
                        date: entry.entry_date,
                        time: entry.entry_time ? entry.entry_time.substring(0, 5) : '00:00',
                        shift: entry.shift,
                        details: entry.details?.html || entry.details || '',
                        remarks: entry.remarks || '',
                        substation_id: entry.substation_id,
                        attachments: entry.attachments || []
                    });
                });
            }
            localStorage.setItem('substation_registers_db', JSON.stringify(newRegistersDB));

            if (typeof registerEntriesDB !== 'undefined') {
                registerEntriesDB = newRegistersDB;
            }

            this.updateStatusUI('connected');
            console.log("Supabase pull and merge completed successfully.");

            // Rerender active view
            if (typeof renderDashboard === 'function' && currentView === 'dashboard') {
                renderDashboard();
            } else if (currentView === 'ssDashboard' && typeof currentDashboardSSId !== 'undefined') {
                navigateTo(currentView, currentDashboardSSId);
            }
        } catch (e) {
            console.error("Error pulling data from Supabase:", e);
            this.updateStatusUI('error');
        }
    }
};
