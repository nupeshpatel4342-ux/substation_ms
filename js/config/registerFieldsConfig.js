const registerFieldSchemas = {
    // 1. Operational Registers
    "Battery Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "batteryVoltage", label: "Battery Voltage (V)", type: "number", required: true, width: "half" },
        { name: "specificGravity", label: "Specific Gravity", type: "number", required: true, width: "half" },
        { name: "electrolyteLevel", label: "Electrolyte Level", type: "select", options: ["Normal", "Low", "Top-up Required"], required: true, width: "half" },
        { name: "terminalCondition", label: "Terminal Condition", type: "select", options: ["Clean", "Corroded", "Cleaned Today"], required: true, width: "half" }
    ],
    "Daily Checklist Register": [
        { name: "yardInspection", label: "Yard Switchyard Inspection", type: "select", options: ["Satisfactory", "Unsatisfactory"], required: true, width: "half" },
        { name: "controlRoom", label: "Control Room Panels", type: "select", options: ["Satisfactory", "Unsatisfactory"], required: true, width: "half" },
        { name: "acdcSupply", label: "AC/DC Supply Status", type: "select", options: ["Normal", "Abnormal"], required: true, width: "half" },
        { name: "fireExtinguishers", label: "Fire Extinguishers Check", type: "select", options: ["Intact", "Needs Refill"], required: true, width: "half" }
    ],
    "HO / TO Register": [
        { name: "handoverBy", label: "Handed Over By", type: "text", required: true, width: "half" },
        { name: "takenOverBy", label: "Taken Over By", type: "text", required: true, width: "half" },
        { name: "pendingWorks", label: "Pending Works/Permits", type: "textarea", required: true, width: "full" },
        { name: "keysHandedOver", label: "Substation Keys Handed Over?", type: "select", options: ["Yes", "No"], required: true, width: "half" }
    ],
    "Daily Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "maintenanceType", label: "Maintenance Type", type: "select", options: ["Preventive", "Corrective", "Cleaning", "Tightening", "Lubrication"], required: true, width: "half" },
        { name: "workDetails", label: "Work Details", type: "textarea", required: true, width: "full" }
    ],
    "Daily Weather Register": [
        { name: "maxTemp", label: "Max Temperature (°C)", type: "number", required: true, width: "half" },
        { name: "minTemp", label: "Min Temperature (°C)", type: "number", required: true, width: "half" },
        { name: "humidity", label: "Humidity (%)", type: "number", required: true, width: "half" },
        { name: "weatherCondition", label: "Weather Condition", type: "select", options: ["Clear", "Cloudy", "Rainy", "Foggy"], required: true, width: "half" }
    ],
    "LA Counter Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "phase", label: "Phase", type: "select", options: ["R Phase", "Y Phase", "B Phase"], required: true, width: "half" },
        { name: "counterReading", label: "Counter Reading", type: "number", required: true, width: "half" },
        { name: "leakageCurrent", label: "Leakage Current (mA)", type: "number", required: true, width: "half" }
    ],
    "Equipment Failure Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "defectType", label: "Defect Type", type: "select", options: ["Mechanical", "Electrical", "Oil Leakage", "Other"], required: true, width: "half" },
        { name: "severity", label: "Severity Level", type: "select", options: ["Low", "Medium", "High", "Critical"], required: true, width: "half" },
        { name: "actionTaken", label: "Immediate Action Taken", type: "text", required: false, width: "full" }
    ],
    "Instruction Register": [
        { name: "issuedBy", label: "Instruction Issued By", type: "text", required: true, width: "half" },
        { name: "targetRole", label: "Target Role / Person", type: "text", required: true, width: "half" },
        { name: "instructionDetails", label: "Instruction Details", type: "textarea", required: true, width: "full" },
        { name: "complianceStatus", label: "Compliance Status", type: "select", options: ["Pending", "In Progress", "Completed"], required: true, width: "half" }
    ],
    "Inspection Register": [
        { name: "inspectedBy", label: "Inspected By", type: "text", required: true, width: "half" },
        { name: "designation", label: "Designation", type: "text", required: true, width: "half" },
        { name: "inspectionType", label: "Inspection Type", type: "select", options: ["Routine", "Surprise", "Safety", "Pre-Monsoon"], required: true, width: "half" },
        { name: "observations", label: "Key Observations", type: "textarea", required: true, width: "full" }
    ],
    "Visitor Register": [
        { name: "visitorName", label: "Visitor Name", type: "text", required: true, width: "half" },
        { name: "organization", label: "Organization / Company", type: "text", required: true, width: "half" },
        { name: "purpose", label: "Purpose of Visit", type: "text", required: true, width: "full" },
        { name: "contactNumber", label: "Contact Number", type: "text", required: true, width: "half" }
    ],
    "Daily Log Book Register": [
        { name: "logCategory", label: "Log Category", type: "select", options: ["Routine Event", "Abnormal Event", "System Disturbance", "Load Shedding"], required: true, width: "half" },
        { name: "logDetails", label: "Log Details", type: "textarea", required: true, width: "full" }
    ],
    "Switching Operation Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "operationType", label: "Operation Type", type: "select", options: ["Opening (Tripping)", "Closing", "Isolator Opening", "Isolator Closing"], required: true, width: "half" },
        { name: "reason", label: "Reason for Operation", type: "text", required: true, width: "full" }
    ],
    "Tripping Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "relayOperated", label: "Relay Operated", type: "text", required: true, width: "half" },
        { name: "faultCurrent", label: "Fault Current (kA)", type: "number", required: false, width: "half" },
        { name: "restorationTime", label: "Restoration Time", type: "time", required: false, width: "half" }
    ],
    "Shutdown Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "shutdownType", label: "Shutdown Type", type: "select", options: ["Planned", "Emergency", "Forced"], required: true, width: "half" },
        { name: "availingAgency", label: "Availing Agency/Person", type: "text", required: true, width: "half" },
        { name: "expectedRestoration", label: "Expected Restoration Time", type: "time", required: true, width: "half" }
    ],

    // 2. Testing Registers
    "Relay Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "relayMake", label: "Relay Make & Model", type: "text", required: true, width: "half" },
        { name: "testType", label: "Test Type", type: "select", options: ["Routine", "Commissioning", "Post-Fault"], required: true, width: "half" },
        { name: "testResult", label: "Overall Test Result", type: "select", options: ["Pass", "Fail", "Requires Calibration"], required: true, width: "half" }
    ],
    "Current Transformer (CT) Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "testConducted", label: "Test Conducted", type: "select", options: ["IR Value (Megger)", "Ratio Test", "Polarity Test", "Knee Point Voltage"], required: true, width: "half" },
        { name: "resultValue", label: "Measured Value", type: "text", required: true, width: "half" }
    ],
    "Potential Transformer (PT) Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "testConducted", label: "Test Conducted", type: "select", options: ["IR Value", "Ratio Test", "Capacitance Measurement"], required: true, width: "half" },
        { name: "resultValue", label: "Measured Value", type: "text", required: true, width: "half" }
    ],
    "Circuit Breaker & Control Relay Panel Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "testType", label: "Test Type", type: "select", options: ["CRM (Contact Resistance)", "DCRM", "Timing Test", "IR Test"], required: true, width: "half" },
        { name: "pole", label: "Pole Tested", type: "select", options: ["R Pole", "Y Pole", "B Pole", "All 3 Poles"], required: true, width: "half" }
    ],
    "Power Transformer Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "testType", label: "Test Type", type: "select", options: ["Oil BDV", "DGA", "IR Value", "Tan Delta", "Winding Resistance"], required: true, width: "half" },
        { name: "testResult", label: "Result/Value", type: "text", required: true, width: "half" }
    ],
    "Battery Load Test Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "dischargeCurrent", label: "Discharge Current (A)", type: "number", required: true, width: "half" },
        { name: "endVoltage", label: "End Voltage (V)", type: "number", required: true, width: "half" }
    ],
    "Battery Capacity Test Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "measuredCapacity", label: "Measured Capacity (AH)", type: "number", required: true, width: "half" },
        { name: "cellCondition", label: "Overall Cell Condition", type: "select", options: ["Good", "Weak", "Needs Replacement"], required: true, width: "half" }
    ],
    "Earth Pin Resistance Register": [
        { name: "pitNumber", label: "Earth Pit No. / Location", type: "text", required: true, width: "half" },
        { name: "soilCondition", label: "Soil Condition", type: "select", options: ["Dry", "Wet", "Moist"], required: true, width: "half" },
        { name: "resistanceValue", label: "Resistance Value (Ohms)", type: "number", required: true, width: "half" }
    ],
    "Insulation Resistance Test Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "meggerVoltage", label: "Megger Voltage (kV)", type: "select", options: ["0.5 kV", "1 kV", "2.5 kV", "5 kV"], required: true, width: "half" },
        { name: "irValue", label: "IR Value (M Ohms)", type: "text", required: true, width: "half" }
    ],
    "Lightning Arrester Maintenance & Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "testType", label: "Test Type", type: "select", options: ["Leakage Current", "Third Harmonic Resistive Current"], required: true, width: "half" },
        { name: "result", label: "Test Result", type: "text", required: true, width: "half" }
    ],
    "SF6 Gas Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "gasPressure", label: "Gas Pressure (Bar)", type: "number", required: true, width: "half" },
        { name: "dewPoint", label: "Dew Point (°C)", type: "number", required: true, width: "half" },
        { name: "purity", label: "Purity (%)", type: "number", required: true, width: "half" }
    ],
    "Control Cable Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "coresTested", label: "No. of Cores Tested", type: "number", required: true, width: "half" },
        { name: "continuityStatus", label: "Continuity Status", type: "select", options: ["OK", "Broken/Faulty"], required: true, width: "half" }
    ],

    // 3. Safety & Compliance Registers
    "Inventory Register": [
        { name: "materialName", label: "Material / Spare Name", type: "text", required: true, width: "half" },
        { name: "transactionType", label: "Transaction Type", type: "select", options: ["Received", "Issued", "Returned"], required: true, width: "half" },
        { name: "quantity", label: "Quantity", type: "number", required: true, width: "half" },
        { name: "balance", label: "Balance Stock", type: "number", required: true, width: "half" }
    ],
    "Safety Equipment Register": [
        { name: "equipmentName", label: "Safety Equipment Name", type: "text", required: true, width: "half" },
        { name: "condition", label: "Physical Condition", type: "select", options: ["Good / Usable", "Damaged / Discarded", "Sent for Testing"], required: true, width: "half" },
        { name: "nextTestDate", label: "Next Due Date for Testing", type: "date", required: true, width: "half" }
    ],
    "Work Permit Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "ptwNumber", label: "PTW Number", type: "text", required: true, width: "half" },
        { name: "issuedTo", label: "PTW Issued To (Name)", type: "text", required: true, width: "half" },
        { name: "ptwStatus", label: "PTW Status", type: "select", options: ["Issued", "Returned/Cancelled"], required: true, width: "half" }
    ],
    "Fire Extinguisher Register": [
        { name: "extinguisherId", label: "Extinguisher ID / Location", type: "text", required: true, width: "half" },
        { name: "type", label: "Type", type: "select", options: ["CO2", "DCP", "Foam", "Water"], required: true, width: "half" },
        { name: "pressureStatus", label: "Pressure Status", type: "select", options: ["OK (Green Zone)", "Low (Recharge Needed)"], required: true, width: "half" },
        { name: "expiryDate", label: "Expiry / Due Date", type: "date", required: true, width: "half" }
    ],
    "LDC Communication Register": [
        { name: "messageFrom", label: "Message From (LDC Person)", type: "text", required: true, width: "half" },
        { name: "messageCode", label: "Message / Code No.", type: "text", required: false, width: "half" },
        { name: "instruction", label: "Instruction Given", type: "textarea", required: true, width: "full" }
    ],
    "Calibration Register": [
        { name: "instrumentName", label: "Instrument Name", type: "text", required: true, width: "half" },
        { name: "serialNumber", label: "Serial Number", type: "text", required: true, width: "half" },
        { name: "calibratedBy", label: "Calibrated By (Agency)", type: "text", required: true, width: "half" },
        { name: "validUpto", label: "Validity Upto", type: "date", required: true, width: "half" }
    ],
    "Training Register": [
        { name: "trainingTopic", label: "Training Topic", type: "text", required: true, width: "half" },
        { name: "conductedBy", label: "Conducted By", type: "text", required: true, width: "half" },
        { name: "participantsCount", label: "No. of Participants", type: "number", required: true, width: "half" }
    ],
    "Audit Observation Register": [
        { name: "auditType", label: "Audit Type", type: "select", options: ["Internal", "External", "Safety Audit", "ISO Audit"], required: true, width: "half" },
        { name: "observation", label: "Observation / Non-Compliance", type: "textarea", required: true, width: "full" },
        { name: "targetDate", label: "Target Date for Closure", type: "date", required: true, width: "half" },
        { name: "status", label: "Closure Status", type: "select", options: ["Open", "In Progress", "Closed"], required: true, width: "half" }
    ],
    "Compliance Register": [
        { name: "complianceName", label: "Compliance Name", type: "text", required: true, width: "half" },
        { name: "authority", label: "Statutory Authority", type: "text", required: true, width: "half" },
        { name: "submissionDate", label: "Submission Date", type: "date", required: true, width: "half" },
        { name: "status", label: "Status", type: "select", options: ["Complied", "Pending", "Delayed"], required: true, width: "half" }
    ],

    // Newly Added Registers
    "Gate Pass Book": [
        { name: "gatePassNo", label: "Gate Pass No.", type: "text", required: true, width: "half" },
        { name: "passType", label: "Pass Type", type: "select", options: ["Returnable", "Non-Returnable", "Personnel"], required: true, width: "half" },
        { name: "personnelName", label: "Personnel / Agency Name", type: "text", required: true, width: "half" },
        { name: "materialDetails", label: "Material Details", type: "textarea", required: false, width: "full" }
    ],
    "Hot Line Maintenance Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "maintenanceType", label: "Maintenance Type", type: "select", options: ["Insulator Washing", "Hot Spot Tightening", "Thermography", "Other"], required: true, width: "half" },
        { name: "clearanceObtained", label: "Clearance Obtained", type: "select", options: ["Yes", "No"], required: true, width: "half" },
        { name: "workDetails", label: "Work Details", type: "textarea", required: true, width: "full" }
    ],
    "Equipment Details Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "makeAndModel", label: "Make & Model", type: "text", required: true, width: "half" },
        { name: "serialNumber", label: "Serial Number", type: "text", required: true, width: "half" },
        { name: "installationDate", label: "Installation Date", type: "date", required: true, width: "half" }
    ],
    "Daily Interruption Register": [
        { name: "interruptionType", label: "Interruption Type", type: "select", options: ["Grid Failure", "Feeder Tripping", "Planned Outage", "Load Shedding"], required: true, width: "half" },
        { name: "interruptionTime", label: "Interruption Time", type: "time", required: true, width: "half" },
        { name: "restorationTime", label: "Restoration Time", type: "time", required: true, width: "half" },
        { name: "reason", label: "Reason / Details", type: "textarea", required: true, width: "full" }
    ],
    "Feeder-wise Interruption Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "trippingTime", label: "Tripping Time", type: "time", required: true, width: "half" },
        { name: "restorationTime", label: "Restoration Time", type: "time", required: true, width: "half" },
        { name: "relayIndications", label: "Relay Indications", type: "text", required: false, width: "half" }
    ],
    "Statistical Load Data Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "maxLoad", label: "Max Load (Amps/MW)", type: "number", required: true, width: "half" },
        { name: "minLoad", label: "Min Load (Amps/MW)", type: "number", required: true, width: "half" },
        { name: "averageVoltage", label: "Average Voltage (kV)", type: "number", required: false, width: "half" }
    ],
    "Stage-wise Energy Audit Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "initialReading", label: "Initial Reading (kWh)", type: "number", required: true, width: "half" },
        { name: "finalReading", label: "Final Reading (kWh)", type: "number", required: true, width: "half" },
        { name: "unitsConsumed", label: "Units Consumed", type: "number", required: true, width: "half" }
    ],
    "Message Register": [
        { name: "messageFrom", label: "Message From", type: "text", required: true, width: "half" },
        { name: "messageTo", label: "Message To", type: "text", required: true, width: "half" },
        { name: "messageContent", label: "Message Content", type: "textarea", required: true, width: "full" },
        { name: "actionTaken", label: "Action Taken", type: "textarea", required: false, width: "full" }
    ],
    "Power Transformer Maintenance & Testing Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "maintenanceType", label: "Maintenance Type", type: "select", options: ["Preventive", "Breakdown", "Overhauling"], required: true, width: "half" },
        { name: "oilLevelStatus", label: "Oil Level Status", type: "select", options: ["Normal", "Low", "Top-up Done"], required: true, width: "half" },
        { name: "remarks", label: "Maintenance Remarks", type: "textarea", required: true, width: "full" }
    ],
    "Test Permit Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "permitNo", label: "Permit No.", type: "text", required: true, width: "half" },
        { name: "issuedTo", label: "Issued To (Agency)", type: "text", required: true, width: "half" },
        { name: "status", label: "Permit Status", type: "select", options: ["Issued", "Cancelled", "Returned"], required: true, width: "half" }
    ],
    "Line Clear Permit (LC) Book": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "lcNumber", label: "LC Number", type: "text", required: true, width: "half" },
        { name: "issuedBy", label: "Issued By", type: "text", required: true, width: "half" },
        { name: "status", label: "LC Status", type: "select", options: ["Issued", "Returned"], required: true, width: "half" }
    ],
    "Line Clear Permit (LCP) Issued / Taken Register": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "lcpType", label: "LCP Type", type: "select", options: ["Issued", "Taken"], required: true, width: "half" },
        { name: "permitNumber", label: "Permit Number", type: "text", required: true, width: "half" },
        { name: "authorityName", label: "Authority Name", type: "text", required: true, width: "half" },
        { name: "workDescription", label: "Work Description", type: "textarea", required: true, width: "full" }
    ],

    // Fallback default
    "default": [
        { name: "equipmentLocation", label: "Equipment Location (Bay)", type: "select-bay", required: true, width: "half" },
        { name: "equipmentMasterName", label: "Equipment Name", type: "select-equipment", required: true, width: "half" },
        { name: "status", label: "Current Status", type: "select", options: ["Normal", "Abnormal", "Needs Attention"], required: true, width: "half" },
        { name: "observedValue", label: "Observed Value / Reading", type: "text", required: false, width: "half" }
    ]
};
