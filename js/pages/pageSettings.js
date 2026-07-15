const pageSettingsTemplate = `
<div class="page-section" id="pageSettings" style="display:none;">
    <div class="content" style="max-width: 600px; margin: 0 auto; padding: 24px 16px;">
        <div class="section-title" style="display:flex; align-items:center; gap:10px; margin-bottom: 24px;">
            <span class="material-icons-round" style="color: var(--primary); font-size: 28px;">settings</span>
            <span>Application Settings</span>
        </div>

        <!-- USER PROFILE CARD -->
        <div class="card" style="padding: 20px; margin-bottom: 20px; border-radius: var(--radius); border: 1px solid var(--border-light); background: var(--surface); box-shadow: var(--shadow-sm);">
            <h3 style="margin-top:0; margin-bottom:16px; font-size:16px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
                <span class="material-icons-round" style="color:var(--primary);">account_circle</span>
                User Profile
            </h3>
            <div class="form-group" style="margin-bottom:0;">
                <label class="form-label">Default User Name / Operator Name</label>
                <input type="text" id="settingsUsername" class="form-control" placeholder="Enter operator name..." style="width: 100%; box-sizing: border-box;">
                <small style="color: var(--text-secondary); margin-top: 4px; display: block;">This name will be auto-filled in reports and registers.</small>
            </div>
        </div>

        <!-- AI ASSISTANT SETTINGS CARD -->
        <div class="card" style="padding: 20px; margin-bottom: 24px; border-radius: var(--radius); border: 1px solid var(--border-light); background: var(--surface); box-shadow: var(--shadow-sm);">
            <h3 style="margin-top:0; margin-bottom:8px; font-size:16px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
                <span class="material-icons-round" style="color:#00e6ac;">smart_toy</span>
                Substation AI Configuration
            </h3>
            <p style="font-size:13px; color: var(--text-secondary); margin-top:0; margin-bottom:16px; line-height:1.4;">
                Configure the behavior of your 66KV Substation AI Assistant. Toggle between local offline lookup and advanced generative AI using the Gemini API.
            </p>

            <!-- Hosted Cloud Mode Notice (Visible only on live deployments) -->
            <div id="hostedAiModeNotice" style="display:none; padding: 12px; background: rgba(0, 230, 172, 0.1); border: 1px solid rgba(0, 230, 172, 0.3); border-radius: 8px; margin-bottom: 16px; color: var(--accent-dark); font-size:12.5px; line-height:1.4;">
                <div style="display:flex; align-items:center; gap:6px; font-weight:700; margin-bottom: 4px;">
                    <span class="material-icons-round" style="font-size:18px; color: #00e6ac;">gpp_good</span>
                    <span>🛡️ Secure Cloud Mode Active</span>
                </div>
                Substation AI is running securely through Vercel's serverless backend. All API requests are processed on the server-side using your secure environment variable. No manual API Key configuration is required!
            </div>

            <!-- Mode Selector Switch (For local file:/// runs) -->
            <div id="localAiModeGroup" class="ai-settings-group" style="margin-top:0;">
                <div class="ai-settings-flex">
                    <div>
                        <strong style="display:block; font-size:13.5px; color: var(--text);">Online Gemini AI Mode</strong>
                        <span style="font-size:12px; color: var(--text-secondary);">Enable advanced natural language processing. Requires Gemini API Key.</span>
                    </div>
                    <label class="ai-toggle-switch">
                        <input type="checkbox" id="settingsAiOnlineMode" onchange="toggleApiKeyFieldVisibility()">
                        <span class="ai-toggle-slider"></span>
                    </label>
                </div>
            </div>

            <!-- API Key Input Field (For local file:/// runs) -->
            <div id="apiKeyGroup" class="form-group" style="display:none; transition: all var(--transition);">
                <label class="form-label">Gemini API Key</label>
                <div style="position: relative; display: flex; gap: 8px;">
                    <input type="password" id="settingsApiKey" class="form-control" placeholder="AIzaSy..." style="flex:1; padding-right: 40px; box-sizing: border-box;">
                    <button type="button" onclick="togglePasswordVisible('settingsApiKey')" class="btn btn-outline" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); border:none; background:transparent; padding:0 8px; height: 32px; min-width:auto; color: var(--text-secondary);">
                        <span class="material-icons-round" id="visibilityIcon_settingsApiKey" style="font-size:20px;">visibility</span>
                    </button>
                </div>
                <small style="color: var(--text-secondary); margin-top: 4px; display: block; line-height:1.4;">
                    Get a free API key from Google AI Studio. The key is stored locally on your device.
                </small>

                <!-- Test Connection Button -->
                <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 16px;">
                    <button class="btn btn-outline" onclick="testGeminiConnection()" style="padding: 6px 12px; font-size: 12px; height: auto;">
                        Test Connection
                    </button>
                    <span id="testConnectionStatus" style="font-size:12px; font-weight:600; display:flex; align-items:center; gap:4px;"></span>
                </div>
            </div>
        </div>

        <!-- DATABASE SETTINGS CARD -->
        <div class="card" style="padding: 20px; margin-bottom: 24px; border-radius: var(--radius); border: 1px solid var(--border-light); background: var(--surface); box-shadow: var(--shadow-sm);">
            <h3 style="margin-top:0; margin-bottom:8px; font-size:16px; font-weight:700; color:var(--text); display:flex; align-items:center; gap:8px;">
                <span class="material-icons-round" style="color:var(--primary);">dns</span>
                Supabase Database Integration
            </h3>
            <p style="font-size:13px; color: var(--text-secondary); margin-top:0; margin-bottom:16px; line-height:1.4;">
                Enable database sync to back up your substations, equipment, registers, and reports data to Supabase.
            </p>

            <div class="form-group" style="margin-bottom: 16px;">
                <div style="display:flex; align-items:center; justify-content:space-between; width:100%;">
                    <strong style="font-size:13.5px; color: var(--text);">Enable Supabase Sync</strong>
                    <label class="ai-toggle-switch">
                        <input type="checkbox" id="settingsDbSyncEnabled" onchange="toggleDbFieldsVisibility()">
                        <span class="ai-toggle-slider"></span>
                    </label>
                </div>
            </div>

            <div id="dbFieldsGroup" style="display:none; transition: all var(--transition);">
                <div class="form-group" style="margin-bottom: 12px;">
                    <label class="form-label">Supabase URL</label>
                    <input type="text" id="settingsDbUrl" class="form-control" placeholder="https://xxxx.supabase.co" style="width: 100%; box-sizing: border-box;">
                </div>

                <div class="form-group" style="margin-bottom: 16px;">
                    <label class="form-label">Supabase Publishable Key (Anon Key)</label>
                    <div style="position: relative; display: flex; gap: 8px;">
                        <input type="password" id="settingsDbKey" class="form-control" placeholder="sb_publishable_..." style="flex:1; padding-right: 40px; box-sizing: border-box;">
                        <button type="button" onclick="togglePasswordVisible('settingsDbKey')" class="btn btn-outline" style="position: absolute; right: 8px; top: 50%; transform: translateY(-50%); border:none; background:transparent; padding:0 8px; height: 32px; min-width:auto; color: var(--text-secondary);">
                            <span class="material-icons-round" id="visibilityIcon_settingsDbKey" style="font-size:20px;">visibility</span>
                        </button>
                    </div>
                </div>

                <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 16px;">
                    <button type="button" class="btn btn-outline" onclick="testDbConnection()" style="padding: 6px 12px; font-size: 12px; height: auto;">
                        Test Connection
                    </button>
                    <span id="testDbStatus" style="font-size:12px; font-weight:600; display:flex; align-items:center; gap:4px;"></span>
                </div>

                <div style="border-top: 1px solid var(--border-light); padding-top: 12px;">
                    <strong style="display:block; font-size:12.5px; margin-bottom:6px; color:var(--text);">SQL Database Setup Script</strong>
                    <span style="font-size:11.5px; color: var(--text-secondary); line-height: 1.4; display:block;">
                        The full script to create all 17 tables is saved locally in:
                    </span>
                    <div class="db-sql-box" id="dbSqlBox">-- Run the full setup script inside your Supabase project
-- File path: C:/Users/DELL/66KVReport/.gemini/antigravity/brain/<conversation_id>/supabase_setup.sql
-- (Or the copy in the root folder of this project)

CREATE TABLE IF NOT EXISTS public.substations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    is_sample BOOLEAN DEFAULT false NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);</div>
                    <button type="button" class="db-copy-btn" onclick="copySqlScript()">
                        <span class="material-icons-round" style="font-size:16px;">content_copy</span>
                        Copy Script Path
                    </button>
                </div>
            </div>
        </div>

        <!-- SAVE BUTTON -->
        <div style="display:flex; justify-content:flex-end;">
            <button class="btn btn-primary" onclick="saveApplicationSettings()" style="padding: 12px 28px; font-weight:600; display:flex; align-items:center; gap:8px;">
                <span class="material-icons-round">save</span>
                Save Settings
            </button>
        </div>
    </div>
</div>
`;

// Helper functions for settings view
function toggleApiKeyFieldVisibility() {
    const isOnline = document.getElementById('settingsAiOnlineMode').checked;
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    if (apiKeyGroup) {
        apiKeyGroup.style.display = isOnline ? 'block' : 'none';
    }
}

function toggleDbFieldsVisibility() {
    const isSync = document.getElementById('settingsDbSyncEnabled').checked;
    const dbFieldsGroup = document.getElementById('dbFieldsGroup');
    if (dbFieldsGroup) {
        dbFieldsGroup.style.display = isSync ? 'block' : 'none';
    }
}

function togglePasswordVisible(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById('visibilityIcon_' + inputId);
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    }
}

function initSettingsPage() {
    const usernameInput = document.getElementById('settingsUsername');
    const aiModeInput = document.getElementById('settingsAiOnlineMode');
    const apiKeyInput = document.getElementById('settingsApiKey');
    const testStatus = document.getElementById('testConnectionStatus');
    const hostedNotice = document.getElementById('hostedAiModeNotice');
    const localAiModeGroup = document.getElementById('localAiModeGroup');
    const apiKeyGroup = document.getElementById('apiKeyGroup');

    // Database fields
    const dbSyncInput = document.getElementById('settingsDbSyncEnabled');
    const dbUrlInput = document.getElementById('settingsDbUrl');
    const dbKeyInput = document.getElementById('settingsDbKey');
    const testDbStatus = document.getElementById('testDbStatus');

    if (testStatus) testStatus.textContent = '';
    if (testDbStatus) testDbStatus.textContent = '';

    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === '[::1]' ||
                    window.location.protocol === 'file:';
    const isHosted = !isLocal;

    if (hostedNotice) {
        hostedNotice.style.display = isHosted ? 'block' : 'none';
    }
    if (localAiModeGroup) {
        localAiModeGroup.style.display = isHosted ? 'none' : 'block';
    }

    // Load from LocalStorage
    const storedUsername = localStorage.getItem('default_operator_name') || 'Nupesh Patel';
    const isOnlineMode = localStorage.getItem('substation_ai_online_mode') === 'true';
    const apiKey = localStorage.getItem('substation_ai_api_key') || '';

    const isDbSync = localStorage.getItem('supabase_sync_enabled') !== 'false';
    const dbUrl = localStorage.getItem('supabase_url') || 'https://cguhagyineqndzyvgjry.supabase.co';
    const dbKey = localStorage.getItem('supabase_key') || 'sb_publishable_GzzSxF1LDLNpTc7MlROqMQ_Vp09VgIS';

    if (usernameInput) usernameInput.value = storedUsername;

    if (!isHosted) {
        if (aiModeInput) {
            aiModeInput.checked = isOnlineMode;
            toggleApiKeyFieldVisibility();
        }
        if (apiKeyInput) apiKeyInput.value = apiKey;
    } else {
        if (apiKeyGroup) apiKeyGroup.style.display = 'none';
    }

    if (dbSyncInput) {
        dbSyncInput.checked = isDbSync;
        toggleDbFieldsVisibility();
    }
    if (dbUrlInput) dbUrlInput.value = dbUrl;
    if (dbKeyInput) dbKeyInput.value = dbKey;
}

function saveApplicationSettings() {
    const username = document.getElementById('settingsUsername').value.trim();
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === '[::1]' ||
                    window.location.protocol === 'file:';
    const isHosted = !isLocal;

    if (!username) {
        showToast('Please enter a username');
        return;
    }

    if (!isHosted) {
        const isOnlineMode = document.getElementById('settingsAiOnlineMode').checked;
        const apiKey = document.getElementById('settingsApiKey').value.trim();

        if (isOnlineMode && !apiKey) {
            showToast('API Key is required for Online Gemini AI Mode');
            return;
        }

        localStorage.setItem('substation_ai_online_mode', isOnlineMode ? 'true' : 'false');
        localStorage.setItem('substation_ai_api_key', apiKey);
    }

    // Database Sync Settings
    const isDbSync = document.getElementById('settingsDbSyncEnabled').checked;
    const dbUrl = document.getElementById('settingsDbUrl').value.trim();
    const dbKey = document.getElementById('settingsDbKey').value.trim();

    if (isDbSync && (!dbUrl || !dbKey)) {
        showToast('Supabase URL and Anon Key are required for Database Sync');
        return;
    }

    localStorage.setItem('supabase_sync_enabled', isDbSync ? 'true' : 'false');
    localStorage.setItem('supabase_url', dbUrl);
    localStorage.setItem('supabase_key', dbKey);

    // Save profile username
    localStorage.setItem('default_operator_name', username);

    // Sync initials in the header
    const userHeaderEl = document.querySelector('.sh-user');
    if (userHeaderEl) {
        const initials = username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        userHeaderEl.textContent = initials;
    }

    // Re-initialize database sync client
    if (typeof DatabaseManager !== 'undefined') {
        DatabaseManager.init();
    }

    showToast('Settings saved successfully!');
}

async function testDbConnection() {
    const url = document.getElementById('settingsDbUrl').value.trim();
    const key = document.getElementById('settingsDbKey').value.trim();
    const testStatus = document.getElementById('testDbStatus');

    if (!url || !key) {
        testStatus.style.color = 'var(--danger)';
        testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">error</span> Enter URL & Key first';
        return;
    }

    testStatus.style.color = 'var(--text-secondary)';
    testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px; animation: db-spin 1.2s linear infinite;">autorenew</span> Testing...';

    if (typeof DatabaseManager !== 'undefined') {
        const result = await DatabaseManager.testConnection(url, key);
        if (result.success) {
            testStatus.style.color = 'var(--success)';
            testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">check_circle</span> Success!';
        } else {
            testStatus.style.color = 'var(--danger)';
            testStatus.innerHTML = `<span class="material-icons-round" style="font-size:16px;">error</span> Failed: ${result.message.substring(0, 30)}`;
        }
    } else {
        testStatus.style.color = 'var(--danger)';
        testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">error</span> Database manager not loaded';
    }
}

function copySqlScript() {
    const setupFilePath = "C:/Users/DELL/66KVReport/supabase_setup.sql";
    navigator.clipboard.writeText(setupFilePath).then(() => {
        showToast("Setup file path copied to clipboard!");
    }).catch(err => {
        alert("Copy the setup file from workspace: C:/Users/DELL/66KVReport/supabase_setup.sql");
    });
}


// Helper functions for settings view
function toggleApiKeyFieldVisibility() {
    const isOnline = document.getElementById('settingsAiOnlineMode').checked;
    const apiKeyGroup = document.getElementById('apiKeyGroup');
    if (apiKeyGroup) {
        apiKeyGroup.style.display = isOnline ? 'block' : 'none';
    }
}

function togglePasswordVisible(inputId) {
    const input = document.getElementById(inputId);
    const icon = document.getElementById('visibilityIcon_' + inputId);
    if (input && icon) {
        if (input.type === 'password') {
            input.type = 'text';
            icon.textContent = 'visibility_off';
        } else {
            input.type = 'password';
            icon.textContent = 'visibility';
        }
    }
}

function initSettingsPage() {
    const usernameInput = document.getElementById('settingsUsername');
    const aiModeInput = document.getElementById('settingsAiOnlineMode');
    const apiKeyInput = document.getElementById('settingsApiKey');
    const testStatus = document.getElementById('testConnectionStatus');
    const hostedNotice = document.getElementById('hostedAiModeNotice');
    const localAiModeGroup = document.getElementById('localAiModeGroup');
    const apiKeyGroup = document.getElementById('apiKeyGroup');

    if (testStatus) testStatus.textContent = '';

    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === '[::1]' ||
                    window.location.protocol === 'file:';
    const isHosted = !isLocal;

    // Show secure cloud mode notice and hide input fields if hosted on Vercel
    if (hostedNotice) {
        hostedNotice.style.display = isHosted ? 'block' : 'none';
    }
    if (localAiModeGroup) {
        localAiModeGroup.style.display = isHosted ? 'none' : 'block';
    }

    // Load from LocalStorage
    const storedUsername = localStorage.getItem('default_operator_name') || 'Nupesh Patel';
    const isOnlineMode = localStorage.getItem('substation_ai_online_mode') === 'true';
    const apiKey = localStorage.getItem('substation_ai_api_key') || '';

    if (usernameInput) usernameInput.value = storedUsername;

    if (!isHosted) {
        if (aiModeInput) {
            aiModeInput.checked = isOnlineMode;
            toggleApiKeyFieldVisibility();
        }
        if (apiKeyInput) apiKeyInput.value = apiKey;
    } else {
        if (apiKeyGroup) apiKeyGroup.style.display = 'none';
    }
}

function saveApplicationSettings() {
    const username = document.getElementById('settingsUsername').value.trim();
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === '[::1]' ||
                    window.location.protocol === 'file:';
    const isHosted = !isLocal;

    if (!username) {
        showToast('Please enter a username');
        return;
    }

    if (!isHosted) {
        const isOnlineMode = document.getElementById('settingsAiOnlineMode').checked;
        const apiKey = document.getElementById('settingsApiKey').value.trim();

        if (isOnlineMode && !apiKey) {
            showToast('API Key is required for Online Gemini AI Mode');
            return;
        }

        // Save AI settings for local runs
        localStorage.setItem('substation_ai_online_mode', isOnlineMode ? 'true' : 'false');
        localStorage.setItem('substation_ai_api_key', apiKey);
    }

    // Save profile username
    localStorage.setItem('default_operator_name', username);

    // Sync initials in the header
    const userHeaderEl = document.querySelector('.sh-user');
    if (userHeaderEl) {
        const initials = username.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
        userHeaderEl.textContent = initials;
    }

    showToast('Settings saved successfully!');
}

async function testGeminiConnection() {
    const apiKey = document.getElementById('settingsApiKey').value.trim();
    const testStatus = document.getElementById('testConnectionStatus');

    if (!apiKey) {
        testStatus.style.color = 'var(--danger)';
        testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">error</span> Enter API key first';
        return;
    }

    testStatus.style.color = 'var(--text-secondary)';
    testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px; animation: sh-float 1s infinite;">autorenew</span> Testing...';

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: "Hello! Reply with exactly 'Success'." }]
                }]
            })
        });

        if (response.ok) {
            const data = await response.json();
            const replyText = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
            if (replyText.toLowerCase().includes('success')) {
                testStatus.style.color = 'var(--success)';
                testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">check_circle</span> Connection successful!';
            } else {
                testStatus.style.color = 'var(--warning)';
                testStatus.innerHTML = '<span class="material-icons-round" style="font-size:16px;">warning</span> Unexpected response';
            }
        } else {
            const errData = await response.json();
            const errMsg = errData.error?.message || response.statusText;
            testStatus.style.color = 'var(--danger)';
            testStatus.innerHTML = `<span class="material-icons-round" style="font-size:16px;">error</span> Failed: ${errMsg}`;
        }
    } catch (e) {
        testStatus.style.color = 'var(--danger)';
        testStatus.innerHTML = `<span class="material-icons-round" style="font-size:16px;">error</span> Error: ${e.message}`;
    }
}
