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

            <!-- Mode Selector Switch -->
            <div class="ai-settings-group" style="margin-top:0;">
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

            <!-- API Key Input Field -->
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

    if (testStatus) testStatus.textContent = '';

    // Load from LocalStorage
    const storedUsername = localStorage.getItem('default_operator_name') || 'Nupesh Patel';
    const isOnlineMode = localStorage.getItem('substation_ai_online_mode') === 'true';
    const apiKey = localStorage.getItem('substation_ai_api_key') || '';

    if (usernameInput) usernameInput.value = storedUsername;
    if (aiModeInput) {
        aiModeInput.checked = isOnlineMode;
        toggleApiKeyFieldVisibility();
    }
    if (apiKeyInput) apiKeyInput.value = apiKey;
}

function saveApplicationSettings() {
    const username = document.getElementById('settingsUsername').value.trim();
    const isOnlineMode = document.getElementById('settingsAiOnlineMode').checked;
    const apiKey = document.getElementById('settingsApiKey').value.trim();

    if (!username) {
        showToast('Please enter a username');
        return;
    }

    if (isOnlineMode && !apiKey) {
        showToast('API Key is required for Online Gemini AI Mode');
        return;
    }

    // Save to LocalStorage
    localStorage.setItem('default_operator_name', username);
    localStorage.setItem('substation_ai_online_mode', isOnlineMode ? 'true' : 'false');
    localStorage.setItem('substation_ai_api_key', apiKey);

    // Sync user field in header if exists
    const userHeaderEl = document.querySelector('.sh-user');
    if (userHeaderEl) {
        // Use initials of username
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
