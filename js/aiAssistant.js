// ===================================================================
//  ⚡ SUBSTATION AI ASSISTANT MODULE
// ===================================================================

document.addEventListener('DOMContentLoaded', () => {
    initSubstationAI();
});

// Global state for chat assistant
let isChatOpen = false;
let isChatMinimized = false;
let chatHistory = [];

// Initialize Substation AI Widget
function initSubstationAI() {
    // 1. Inject CSS and Material Icons if not already present
    if (!document.getElementById('substation-ai-styles')) {
        const link = document.createElement('link');
        link.id = 'substation-ai-styles';
        link.rel = 'stylesheet';
        link.href = 'css/substation-ai.css';
        document.head.appendChild(link);
    }

    // 2. Build the Chat Widget DOM elements dynamically
    const widgetContainer = document.createElement('div');
    widgetContainer.id = 'shAiWidgetContainer';
    widgetContainer.innerHTML = `
        <!-- Floating Toggle Button -->
        <div class="sh-ai-widget-toggle" id="shAiToggle" onclick="toggleChatPanel()" title="Ask Substation AI / સબસ્ટેશન AI ને પૂછો">
            <div class="sh-ai-badge">Ask Me</div>
            <img src="img/substation-ai-avatar.png" alt="Substation AI Avatar" class="sh-ai-avatar-img">
        </div>

        <!-- Chat Panel Window -->
        <div class="sh-ai-panel" id="shAiPanel">
            <!-- Header -->
            <div class="sh-ai-header" onclick="handleHeaderClick(event)">
                <div class="sh-ai-brand">
                    <div class="sh-ai-logo" style="overflow: hidden; border-radius: 50%; border: 1.5px solid rgba(255, 255, 255, 0.4); width: 32px; height: 32px; display: flex; align-items: center; justify-content: center; background: #ffffff;">
                        <img src="img/substation-ai-avatar.png" alt="Substation AI Logo" style="width: 100%; height: 100%; object-fit: cover;">
                    </div>
                    <div class="sh-ai-title-wrap">
                        <div class="sh-ai-title">⚡ Substation AI</div>
                        <div class="sh-ai-status">
                            <span class="sh-ai-status-dot"></span>
                            <span id="shAiStatusText">Bilingual Assistant / દ્વિભાષી મદદનીશ</span>
                        </div>
                    </div>
                </div>
                <div class="sh-ai-actions" onclick="event.stopPropagation()">
                    <button class="sh-ai-action-btn" onclick="openAISettings()" title="Settings">
                        <span class="material-icons-round">settings</span>
                    </button>
                    <button class="sh-ai-action-btn" onclick="minimizeChatPanel()" id="shAiMinBtn" title="Minimize">
                        <span class="material-icons-round">remove</span>
                    </button>
                    <button class="sh-ai-action-btn" onclick="toggleChatPanel()" title="Close">
                        <span class="material-icons-round">close</span>
                    </button>
                </div>
            </div>

            <!-- Messages stream body -->
            <div class="sh-ai-body" id="shAiBody">
                <!-- Initial welcome message gets injected here -->
            </div>

            <!-- Suggestions chips footer -->
            <div class="sh-ai-suggestions-container" id="shAiSuggestions">
                <div class="sh-ai-suggestions-title">Try asking / પૂછી જુઓ</div>
                <div class="sh-ai-suggestions-wrap">
                    <div class="sh-ai-chip" onclick="handleSuggestionClick('📊 આ સિસ્ટમનો ઉપયોગ કેવી રીતે કરવો?')">
                        <span>📊 સિસ્ટમ ગાઈડ</span>
                    </div>
                    <div class="sh-ai-chip" onclick="handleSuggestionClick('🔌 પાવર ટ્રાન્સફોર્મર વિશે સમજાવો')">
                        <span>🔌 પાવર ટ્રાન્સફોર્મર</span>
                    </div>
                    <div class="sh-ai-chip" onclick="handleSuggestionClick('🛠️ મેન્ટેનન્સ ચેકલિસ્ટ બતાવો')">
                        <span>🛠️ મેન્ટેનન્સ ચેકલિસ્ટ</span>
                    </div>
                </div>
            </div>

            <!-- Input area footer -->
            <div class="sh-ai-footer">
                <div class="sh-ai-input-wrap">
                    <input type="text" id="shAiInput" class="sh-ai-input" placeholder="Ask Substation AI... / પૂછો..." onkeydown="handleInputKeydown(event)">
                </div>
                <button class="sh-ai-send-btn" onclick="submitUserMessage()" title="Send">
                    <span class="material-icons-round">send</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(widgetContainer);

    // 3. Populate initial greeting message
    resetChatHistory();
}

// Toggle Chat open/close state
function toggleChatPanel() {
    const panel = document.getElementById('shAiPanel');
    const minBtn = document.getElementById('shAiMinBtn');
    
    if (isChatMinimized) {
        panel.classList.remove('minimized');
        isChatMinimized = false;
        minBtn.querySelector('span').textContent = 'remove';
    }

    isChatOpen = !isChatOpen;
    panel.classList.toggle('open', isChatOpen);

    if (isChatOpen) {
        document.getElementById('shAiInput').focus();
        const body = document.getElementById('shAiBody');
        body.scrollTop = body.scrollHeight;
    }
}

// Minimize panel to title bar
function minimizeChatPanel() {
    const panel = document.getElementById('shAiPanel');
    const minBtn = document.getElementById('shAiMinBtn');
    
    isChatMinimized = !isChatMinimized;
    panel.classList.toggle('minimized', isChatMinimized);

    if (isChatMinimized) {
        minBtn.querySelector('span').textContent = 'expand_less';
        minBtn.title = 'Restore';
    } else {
        minBtn.querySelector('span').textContent = 'remove';
        minBtn.title = 'Minimize';
        document.getElementById('shAiInput').focus();
    }
}

// Handle clicking header to minimize/restore
function handleHeaderClick(e) {
    if (e.target.closest('.sh-ai-action-btn')) return;
    if (isChatOpen) {
        minimizeChatPanel();
    }
}

// Route user directly to settings page
function openAISettings() {
    if (isChatOpen) {
        toggleChatPanel();
    }
    if (typeof setActiveMenu === 'function') {
        setActiveMenu('settings');
    } else {
        showToast('Settings module could not be loaded.');
    }
}

// Populate welcome starter
function resetChatHistory() {
    const body = document.getElementById('shAiBody');
    body.innerHTML = '';
    
    const welcomeHtml = `
        <div class="sh-ai-msg assistant">
            <div class="sh-ai-msg-bubble">
                <strong>⚡ Welcome to Substation AI / સબસ્ટેશન AI માં આપનું સ્વાગત છે</strong><br><br>
                Ask me anything about your <strong>Substation Management System</strong> or <strong>66KV Substations</strong>.<br>
                મને <strong>સબસ્ટેશન મેનેજમેન્ટ સિસ્ટમ</strong> અથવા <strong>66KV સબસ્ટેશન્સ</strong> વિશે કંઈપણ પૂછો.<br><br>
                <strong>Try asking: / પૂછી જુઓ:</strong><br>
                • 📊 આ સિસ્ટમનો ઉપયોગ કેવી રીતે કરવો?<br>
                • 🔌 પાવર ટ્રાન્સફોર્મર વિશે સમજાવો<br>
                • 🛠️ મેન્ટેનન્સ ચેકલિસ્ટ બતાવો
            </div>
            <div class="sh-ai-msg-time">${getCurrentTimeStr()}</div>
        </div>
    `;
    
    body.innerHTML = welcomeHtml;
    chatHistory = [{
        role: 'assistant',
        content: `Welcome to Substation AI / સબસ્ટેશન AI માં આપનું સ્વાગત છે. Ask me anything about your Substation Management System or 66KV Substations.`
    }];
}

// Helper to get time string
function getCurrentTimeStr() {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Handle press enter to submit
function handleInputKeydown(e) {
    if (e.key === 'Enter') {
        submitUserMessage();
    }
}

// Handle chip click
function handleSuggestionClick(text) {
    const input = document.getElementById('shAiInput');
    input.value = text;
    submitUserMessage();
}

// Add user message to UI and trigger assistant response
function submitUserMessage() {
    const input = document.getElementById('shAiInput');
    const message = input.value.trim();
    if (!message) return;

    input.value = '';

    renderMessage('user', message);
    chatHistory.push({ role: 'user', content: message });

    showTypingLoader();

    setTimeout(async () => {
        await generateAssistantResponse(message);
    }, 600);
}

// Render bubble in body
function renderMessage(role, text) {
    const body = document.getElementById('shAiBody');
    const msgDiv = document.createElement('div');
    msgDiv.className = `sh-ai-msg ${role}`;
    
    const formattedText = parseMarkdown(text);

    msgDiv.innerHTML = `
        <div class="sh-ai-msg-bubble">
            ${formattedText}
        </div>
        <div class="sh-ai-msg-time">${getCurrentTimeStr()}</div>
    `;
    
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
}

// Markdown to HTML Parser
function parseMarkdown(text) {
    if (!text) return '';
    let html = text;

    if (typeof escapeHtml === 'function') {
        html = escapeHtml(html);
    } else {
        html = html.replace(/[&<>"']/g, ch => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        }[ch]));
    }

    const codeBlocks = [];
    html = html.replace(/```([\w-]*)\n([\s\S]*?)```/g, (match, lang, code) => {
        const placeholder = `__CODE_BLOCK_${codeBlocks.length}__`;
        codeBlocks.push(`<pre style="background: var(--bg); border: 1px solid var(--border); padding: 10px; border-radius: var(--radius-sm); font-family: monospace; font-size: 11.5px; overflow-x: auto; margin: 8px 0; color: var(--text); line-height: 1.4; white-space: pre;"><code>${code.trim()}</code></pre>`);
        return placeholder;
    });

    html = html.replace(/`([^`]+)`/g, '<code style="background: var(--bg); padding: 2px 6px; border-radius: var(--radius-xs); font-family: monospace; font-size: 11.5px; color: var(--danger);">$1</code>');

    html = html.replace(/^### (.*?)$/gm, '<h4 style="margin: 10px 0 4px; font-size: 13.5px; font-weight: 700; color: var(--primary);">$1</h4>');
    html = html.replace(/^## (.*?)$/gm, '<h3 style="margin: 12px 0 6px; font-size: 14.5px; font-weight: 700; color: var(--primary-dark);">$1</h3>');
    html = html.replace(/^# (.*?)$/gm, '<h2 style="margin: 14px 0 8px; font-size: 15.5px; font-weight: 800; color: var(--primary-dark);">$1</h2>');

    html = html.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');

    html = html.replace(/^\s*[-*•]\s+(.*?)$/gm, '<div style="display: flex; gap: 6px; margin: 4px 0; padding-left: 8px;"><span style="color: var(--primary); flex-shrink: 0;">•</span><span>$1</span></div>');

    html = html.replace(/^---$/gm, '<hr style="border: 0; border-top: 1px solid var(--border); margin: 10px 0;">');

    html = html.replace(/\n/g, '<br>');

    codeBlocks.forEach((block, idx) => {
        html = html.replace(`__CODE_BLOCK_${idx}__`, block);
    });

    html = html.replace(/(<br>){3,}/g, '<br><br>');

    return html;
}

// Typing animation helpers
function showTypingLoader() {
    const body = document.getElementById('shAiBody');
    const loaderDiv = document.createElement('div');
    loaderDiv.id = 'shAiLoader';
    loaderDiv.className = 'sh-ai-msg assistant';
    loaderDiv.innerHTML = `
        <div class="sh-ai-msg-bubble sh-ai-typing">
            <span class="sh-ai-dot"></span>
            <span class="sh-ai-dot"></span>
            <span class="sh-ai-dot"></span>
        </div>
    `;
    body.appendChild(loaderDiv);
    body.scrollTop = body.scrollHeight;
}

function removeTypingLoader() {
    const loader = document.getElementById('shAiLoader');
    if (loader) {
        loader.remove();
    }
}

// Generate Response (Offline or Online)
async function generateAssistantResponse(userMsg) {
    const isOnlineMode = localStorage.getItem('substation_ai_online_mode') === 'true';
    const apiKey = localStorage.getItem('substation_ai_api_key') || '';
    
    // Check if running on a local development/testing environment
    const isLocal = window.location.hostname === 'localhost' || 
                    window.location.hostname === '127.0.0.1' || 
                    window.location.hostname === '[::1]' ||
                    window.location.protocol === 'file:';

    // If live on Vercel, route securely through Vercel serverless chat function.
    // In hosted cloud mode, we do NOT require a local client-side API key.
    if (!isLocal) {
        await generateOnlineResponse(userMsg, null);
    } else if (isOnlineMode && apiKey) {
        // Local direct API mode
        await generateOnlineResponse(userMsg, apiKey);
    } else {
        // Offline / Rule-based matching fallback
        generateOfflineResponse(userMsg);
    }
}

// Offline/Mock response logic
function generateOfflineResponse(userMsg) {
    removeTypingLoader();
    const cleanMsg = userMsg.toLowerCase();
    
    // Check if query is looking for real local database data
    if (cleanMsg.includes('substation') && (cleanMsg.includes('list') || cleanMsg.includes('show') || cleanMsg.includes('કેટલા') || cleanMsg.includes('કયા'))) {
        renderLocalSubstationsList();
        return;
    }

    if (cleanMsg.includes('fault') || cleanMsg.includes('ફોલ્ટ')) {
        renderLocalRecentFaults();
        return;
    }

    if (cleanMsg.includes('equipment') || cleanMsg.includes('asset') || cleanMsg.includes('સાધન') || cleanMsg.includes('ઇક્વિપમેન્ટ')) {
        renderLocalEquipmentList();
        return;
    }

    const knowledgeAnswers = [
        {
            keys: ['transformer', 'ટ્રાન્સફોર્મર', 'tr'],
            answer: `🔌 **Power Transformer / પાવર ટ્રાન્સફોર્મર:**\n\n• **Purpose / હેતુ**: Statically transfers electrical energy between circuits, stepping voltage up or down (e.g. 66KV to 11KV).\nવોલ્ટેજને વધારવા કે ઘટાડવા માટે ટ્રાન્સફોર્મરનો ઉપયોગ થાય છે.\n\n• **Core Components / મુખ્ય ભાગો**: Winding (HV/LV), Magnetic Core, Buchholz Relay, Conservator Tank, Silica Gel Breather, OTI/WTI temperatures.\nમુખ્ય ભાગોમાં કોર, વાઇન્ડિંગ, કન્ઝર્વેટર ટેન્ક, અને બુખોલ્ઝ રીલે આવે છે.\n\n• **Maintenance / માર્ગદર્શન**: Keep silica gel blue, check oil level monthly, test insulation resistance annually.\nઓઇલ લેવલ ચેક કરવું અને સિલિકા જેલ બ્લુ રાખવી જરૂરી છે.`
        },
        {
            keys: ['breaker', 'circuit breaker', 'vcb', 'sf6', 'બ્રેકર'],
            answer: `⚠️ **Circuit Breaker / સર્કિટ બ્રેકર:**\n\n• **Description / વિગત**: Automatically trips to isolate lines during short-circuit or overload faults. SF6 breakers are used for 66KV, VCBs are common for 11KV.\nઓવરલોડ અથવા શોર્ટ સર્કિટ વખતે લાઈન કટ કરવા માટે આપમેળે ઓપરેટ થાય છે.\n\n• **Maintenance / માર્ગદર્શન**: Check SF6 pressure, lubricate operation levers, timing checks, and pole contact resistance tests.\nSF6 પ્રેશર ચકાસો, મેકેનિઝમ લુબ્રિકેટ કરો, અને રેગ્યુલર ઓપરેશન્સ ટેસ્ટ કરો.`
        },
        {
            keys: ['ct', 'pt', 'cvt', 'instrument', 'કરંટ', 'પોટેન્શિયલ'],
            answer: `🔌 **Instrument Transformers (CT & PT) / કરંટ અને પોટેન્શિયલ ટ્રાન્સફોર્મર:**\n\n• **Current Transformer (CT) / કરંટ ટ્રાન્સફોર્મર**: Steps down high currents (e.g., 400A to 1A or 5A) for safe measuring and protection.\nઊંચા પ્રવાહને માપવા માટે ડાઉન કરે છે.\n\n• **Potential Transformer (PT/CVT) / પોટેન્શિયલ ટ્રાન્સફોર્મર**: Steps down high voltage (66KV to 110V) for meters and control panel relays.\nઊંચા વોલ્ટેજને રીલે અને મીટર માટે ડાઉન કરે છે.`
        },
        {
            keys: ['arrester', 'la', 'lightning', 'અરેસ્ટર'],
            answer: `⚡ **Lightning Arrester (LA) / લાઈટનિંગ અરેસ્ટર:**\n\n• **Purpose / હેતુ**: Protects switchyard equipment from high voltage surges caused by lightning. Installs at transformer and incoming line ends.\nવીજળીના આંચકા (voltage surges) સામે સબસ્ટેશન સાધનોનું રક્ષણ કરે છે.\n\n• **Function / કાર્ય**: Diverts extra surge currents safely into the earth grid.\nહાઇ વોલ્ટેજ પ્રવાહને સીધો પૃથ્વી (earth) માં વાળી દે છે.`
        },
        {
            keys: ['battery', 'charger', 'dc supply', 'બેટરી'],
            answer: `🔋 **Battery Bank & Charger / બેટરી બેંક અને ચાર્જર:**\n\n• **Purpose / હેતુ**: Provides continuous 110V/220V DC power to tripping coils, control circuits, and relays during AC blackouts.\nAC પાવર ફેલ થાય ત્યારે રીલે અને બ્રેકર ટ્રીપિંગ કોઈલ માટે ૧૧૦V/૨૨૦V DC પાવર આપે છે.\n\n• **Maintenance / માર્ગદર્શન**: Record cell voltage, specific gravity, and maintain distilled water levels monthly.\nસેલ વોલ્ટેજ, ગ્રેવિટી અને ડિસ્ટિલ્ડ વોટર લેવલ દર મહિને તપાસો.`
        },
        {
            keys: ['buchholz', 'બુખોલ્ઝ'],
            answer: `🚨 **Buchholz Relay / બુખોલ્ઝ રીલે:**\n\n• **Details / વિગત**: Gas-operated relay installed on the piping between transformer tank and conservator. Detects internal winding faults, arcing, and oil leakages.\nટ્રાન્સફોર્મર ટેન્ક અને કન્ઝર્વેટર વચ્ચે લાગે છે, જે આંતરિક વાઇન્ડિંગ ફોલ્ટ શોધીને એલાર્મ કે ટ્રીપ કરે છે.\n\n• **Indicators / સંકેતો**: Gas accumulation (alarm) or rapid oil surge (immediate breaker trip).\nનાના ફોલ્ટમાં એલાર્મ વાગે અને વાઇન્ડિંગ શોર્ટ સર્કિટમાં ટ્રાન્સફોર્મર બ્રેકર ટ્રીપ કરે.`
        },
        {
            keys: ['differential', 'protection', 'ડીફરન્શીયલ'],
            answer: `🛡️ **Differential Protection / ડીફરન્શીયલ પ્રોટેક્શન:**\n\n• **Details / વિગત**: Primary unit protection for transformers. Instantly trips both HV and LV breakers if the current entering doesn't match current exiting.\nટ્રાન્સફોર્મર માટે પ્રાઈમરી સેફ્ટી સ્કીમ છે. ઇનપુટ અને આઉટપુટ પ્રવાહમાં તફાવત આવતા જ બ્રેકર બંધ કરે છે.\n\n• **Fault Type / ઉપયોગિતા**: Highly sensitive to internal winding phase-to-phase and phase-to-earth faults.\nઆંતરિક વાઇન્ડિંગ શોર્ટ સર્કિટ થવા પર ટ્રાન્સફોર્મર બચાવવા માટે વપરાય છે.`
        },
        {
            keys: ['safety', 'ppe', 'gloves', 'helmet', 'સેફ્ટી'],
            answer: `🛡️ **Substation Safety Rules / સબસ્ટેશન સેફ્ટી નિયમો:**\n\n• **Permit (PTW) / પરમિટ**: Never work without obtaining a valid written Permit to Work.\nપરમિટ (PTW) વગર ક્યારેય કામ ચાલુ ના કરવું.\n\n• **Isolation / આઇસોલેશન**: Visually verify line isolators are open and local earthing switches are closed.\nઆઇસોલેટર ઓપન અને લાઇન અર્થ થયેલ છે તેની પુષ્ટિ કરો.\n\n• **PPE / પર્સનલ પ્રોટેક્ション**: Wear a Safety Helmet, safety boots, 15KV electrical gloves, and arc flash safety gear.\nસેફ્ટી હેલ્મેટ, જૂતા, ૧૫KV હેન્ડ ગ્લોવ્ઝ અને ફેસ શીલ્ડ હંમેશા પહેરો.`
        },
        {
            keys: ['how to use', 'system', 'guide', 'રિપોર્ટ', 'વાપરવું'],
            answer: `📊 **Substation Management System Guide / સિસ્ટમ ગાઈડ:**\n\n• **Substations**: Select a substation card on the main dashboard to view its options.\n• **Equipment Master**: Add transformers and feeders under Equipment module.\n• **Registers**: Log fault, tripping, and breakdown details when events occur.\n• **Final Finalized Reports**: Navigate to Monthly Reports to run calculations and generate PDF reports.\n\n• ૧. સબસ્ટેશન કાર્ડ સિલેક્ટ કરો.\n• ૨. **Equipment Master** માં જઈને સાધનો ઉમેરો.\n• ૩. ફોલ્ટ, ટ્રીપીંગ, મેન્ટેનન્સ રજિસ્ટરની એન્ટ્રી કરો.\n• ૪. રિપોર્ટ ગણતરી અને લોક કરવા માટે **Monthly Reports** માં જાવ.`
        },
        {
            keys: ['checklist', 'maintenance checklist', 'ચેકલિસ્ટ', 'મેન્ટેનન્સ ચેકલિસ્ટ'],
            answer: `🛠️ **Substation Maintenance Checklist / મેન્ટેનન્સ ચેકલિસ્ટ:**\n\n• **Power Transformer / પાવર ટ્રાન્સફોર્મર**:\n  - Check oil levels in main tank and OLTC.\n  - Inspect silica gel condition (replace if pink).\n  - Test Buchholz relay and check for oil leakage.\n  (ટ્રાન્સફોર્મર ઓઇલ લેવલ, સિલિકા જેલ અને લીકેજ તપાસો)\n\n• **Circuit Breaker / સર્કિટ બ્રેકર**:\n  - Check SF6 gas pressure readings.\n  - Lubricate trip/close operating mechanisms.\n  (SF6 પ્રેશર ચેક કરો અને મોટર ગિયર લુબ્રિકેટ કરો)\n\n• **Battery Bank / બેટરી બેંક**:\n  - Check cell voltages, specific gravity, and electrolyte levels.\n  (સેલ વોલ્ટેજ અને સ્પેસિફિક ગ્રેવિટી માપો)`
        }
    ];

    for (const item of knowledgeAnswers) {
        if (item.keys.some(k => cleanMsg.includes(k))) {
            renderMessage('assistant', item.answer);
            chatHistory.push({ role: 'assistant', content: item.answer });
            return;
        }
    }

    const defaultAnswer = `ℹ️ **Substation AI (Offline Mode) / સબસ્ટેશન AI (ઓફલાઇન મોડ)**\n\nI specialize in 66KV substation operations, equipment, safety, and this software. \nહું 66KV સબસ્ટેશનની કામગીરી, સાધનો, સેફ્ટી અને આ સોફ્ટવેર બાબતે માહિતી આપી શકું છું.\n\n• **Note**: To unlock smart conversational replies, please configure a **Gemini API Key** in Settings (તમારી સેટિંગ્સ પેનલમાં જઈને Gemini API Key સેટ કરો).\n\n**Try asking about / તમે આના વિશે પૂછી શકો છો:**\n- Power Transformer (ટ્રાન્સફોર્મર)\n- Circuit Breaker (બ્રેકર)\n- Instrument Transformers (CT/PT)\n- Safety & PPE (સેફ્ટી અને ગ્લોવ્ઝ)\n- Show substation list (સબસ્ટેશન લિસ્ટ બતાવો)`;
    
    renderMessage('assistant', defaultAnswer);
    chatHistory.push({ role: 'assistant', content: defaultAnswer });
}

// 1. Query Local Substation List from Browser Storage
function renderLocalSubstationsList() {
    if (typeof loadSubstations !== 'function') {
        const err = "Unable to load substation list. Storage module missing. / સબસ્ટેશન ડેટા લોડ થઈ શકતો નથી.";
        renderMessage('assistant', err);
        return;
    }

    const list = loadSubstations();
    if (!list || list.length === 0) {
        const msg = "No substations registered yet. Create one using the 'New Substation' module! / કોઈ સબસ્ટેશન નોંધાયેલ નથી.";
        renderMessage('assistant', msg);
        return;
    }

    let enMsg = `📊 **Active Substations Configured (${list.length}):**\n\n`;
    let guMsg = `📊 **કોન્ફિગર કરેલા સબસ્ટેશન્સ (${list.length}):**\n\n`;

    list.forEach((ss, idx) => {
        const feedersCount = ss.feeders ? ss.feeders.length : 0;
        const transCount = ss.transformers ? ss.transformers.length : 0;
        const eqCount = ss.equipmentMaster ? ss.equipmentMaster.length : 0;

        enMsg += `${idx + 1}. **${ss.name}**\n   • Feeders: ${feedersCount} | Transformers: ${transCount} | Equipment: ${eqCount}\n`;
        guMsg += `${idx + 1}. **${ss.name}**\n   • ફીડર: ${feedersCount} | ટ્રાન્સફોર્મર: ${transCount} | સાધનો: ${eqCount}\n`;
    });

    const combinedMsg = `${enMsg}\n---\n${guMsg}`;
    renderMessage('assistant', combinedMsg);
    chatHistory.push({ role: 'assistant', content: combinedMsg });
}

// 2. Query Local Fault Register for Active Substation
function renderLocalRecentFaults() {
    if (typeof loadSubstations !== 'function') {
        renderMessage('assistant', "Storage utility missing. / ડેટા સ્ટોરેજ ઉપલબ્ધ નથી.");
        return;
    }

    const list = loadSubstations();
    const ssId = typeof currentDashboardSSId !== 'undefined' ? currentDashboardSSId : (list[0] ? list[0].id : null);

    if (!ssId) {
        renderMessage('assistant', "Please select a substation first to see its fault log. / કૃપા કરીને કોઈ સબસ્ટેશન સિલેક્ટ કરો.");
        return;
    }

    const ss = list.find(s => s.id === ssId);
    if (!ss) {
        renderMessage('assistant', "Active substation not found. / સબસ્ટેશન મળ્યું નથી.");
        return;
    }

    const faults = ss.faults || [];
    
    if (faults.length === 0) {
        const noFaultsMsg = `✅ **Fault Log - ${ss.name}**\n\nNo faults recorded in the fault register! / ફોલ્ટ રજિસ્ટરમાં કોઈ અનિચ્છનીય બનાવ નોંધાયેલ નથી.`;
        renderMessage('assistant', noFaultsMsg);
        chatHistory.push({ role: 'assistant', content: noFaultsMsg });
        return;
    }

    const recentFaults = faults.slice(-3).reverse();

    let enMsg = `⚠️ **Recent Fault Logs - ${ss.name} (Last ${recentFaults.length}):**\n\n`;
    let guMsg = `⚠️ **તાજેતરના ફોલ્ટ રજિસ્ટર રેકોર્ડ (${recentFaults.length}):**\n\n`;

    recentFaults.forEach((f, idx) => {
        enMsg += `${idx + 1}. **Date**: ${f.date || f.entryDate || 'N/A'} | **Feeder/Asset**: ${f.feederName || f.equipment || 'N/A'}\n   • **Fault Type**: ${f.faultType || f.remarks || 'N/A'}\n`;
        guMsg += `${idx + 1}. **તારીખ**: ${f.date || f.entryDate || 'N/A'} | **ફીડર/સાધન**: ${f.feederName || f.equipment || 'N/A'}\n   • **ફોલ્ટ પ્રકાર**: ${f.faultType || f.remarks || 'N/A'}\n`;
    });

    const combinedMsg = `${enMsg}\n---\n${guMsg}`;
    renderMessage('assistant', combinedMsg);
    chatHistory.push({ role: 'assistant', content: combinedMsg });
}

// 3. Query Local Registered Equipment List
function renderLocalEquipmentList() {
    if (typeof loadSubstations !== 'function') {
        renderMessage('assistant', "Storage utility missing.");
        return;
    }

    const list = loadSubstations();
    const ssId = typeof currentDashboardSSId !== 'undefined' ? currentDashboardSSId : (list[0] ? list[0].id : null);

    if (!ssId) {
        renderMessage('assistant', "Please select a substation first to see equipment. / કૃપા કરીને સબસ્ટેશન સિલેક્ટ કરો.");
        return;
    }

    const ss = list.find(s => s.id === ssId);
    if (!ss) {
        renderMessage('assistant', "Active substation not found.");
        return;
    }

    const eqList = ss.equipmentMaster || [];
    if (eqList.length === 0) {
        const msg = `ℹ️ **Equipment Master - ${ss.name}**\n\nNo equipment registered in the master list. Use the 'Equipment Master' page to add transformers, breakers, CTs, and PTs.\nઆ સબસ્ટેશનમાં કોઈ સાધનો રજિસ્ટર થયા નથી.`;
        renderMessage('assistant', msg);
        chatHistory.push({ role: 'assistant', content: msg });
        return;
    }

    const showList = eqList.slice(0, 5);

    let enMsg = `🔌 **Registered Assets - ${ss.name} (Showing ${showList.length} of ${eqList.length}):**\n\n`;
    let guMsg = `🔌 **નોંધાયેલા સાધનો - ${ss.name} (કુલ ${eqList.length} માંથી ${showList.length} દર્શાવે છે):**\n\n`;

    showList.forEach((eq, idx) => {
        enMsg += `${idx + 1}. **${eq.name}** (${eq.equipmentType || 'N/A'})\n   • Voltage: ${eq.voltageLevel || 'N/A'} | Bay: ${eq.bayNumber || 'N/A'}\n`;
        guMsg += `${idx + 1}. **${eq.name}** (${eq.equipmentType || 'N/A'})\n   • વોલ્ટેજ: ${eq.voltageLevel || 'N/A'} | બે: ${eq.bayNumber || 'N/A'}\n`;
    });

    const combinedMsg = `${enMsg}\n---\n${guMsg}`;
    renderMessage('assistant', combinedMsg);
    chatHistory.push({ role: 'assistant', content: combinedMsg });
}

// Online Gemini AI Connection logic
async function generateOnlineResponse(userMsg, apiKey) {
    const list = loadSubstations();
    const ssId = typeof currentDashboardSSId !== 'undefined' ? currentDashboardSSId : (list[0] ? list[0].id : null);
    const ss = list.find(s => s.id === ssId) || list[0] || {};

    const dbContext = {
        substationName: ss.name || 'Unknown Substation',
        feedersCount: ss.feeders ? ss.feeders.length : 0,
        transformersCount: ss.transformers ? ss.transformers.length : 0,
        feedersList: ss.feeders ? ss.feeders.map(f => ({ name: f.name, role: f.role })) : [],
        transformersList: ss.transformers ? ss.transformers.map(t => t.name) : [],
        recentFaults: ss.faults ? ss.faults.slice(-5) : [],
        recentTrippings: ss.trippings ? ss.trippings.slice(-5) : [],
        equipmentRegistered: ss.equipmentMaster ? ss.equipmentMaster.slice(0, 10).map(e => ({ name: e.name, type: e.equipmentType })) : []
    };

    const systemInstruction = `
You are ⚡ Substation AI, a professional electrical substation engineer and assistant built exclusively for this Substation Management System (66KV).
Your response style MUST follow these instructions:
1. Always reply in BOTH English and Gujarati (provide explanations or matching translations so the user understands in both languages).
2. Keep replies concise, accurate, and safety-focused. Highlight insulation, PTW (permit to work), LOTO (lockout-tagout) and safety equipment (PPE) when operations or maintenance is mentioned.
3. You have access to the user's active substation database. If they ask about their feeders, transformers, faults, equipment, or monthly reports, use the following JSON database context to answer accurately:
---
Active Substation Context:
${JSON.stringify(dbContext, null, 2)}
---
4. Answer questions about 66KV substation operations (charging/discharging lines, Buchholz relays, differential protection, SF6 breakers, CT/PT) using expert power grid engineering knowledge.
5. If they ask how to use the website, guide them step by step.
6. Special safety warning: Do NOT give step-by-step high-voltage switching sequences that enable unsafe live operations. Recommend following the approved organization SOPs.
    `;

    const historyWindow = chatHistory.slice(-8);
    const apiContents = [];

    historyWindow.forEach(msg => {
        const role = msg.role === 'user' ? 'user' : 'model';
        apiContents.push({
            role: role,
            parts: [{ text: msg.content }]
        });
    });

    try {
        let url;
        let options;

        if (apiKey) {
            url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: apiContents,
                    systemInstruction: {
                        parts: [{ text: systemInstruction }]
                    },
                    generationConfig: {
                        maxOutputTokens: 800,
                        temperature: 0.2
                    }
                })
            };
        } else {
            url = '/api/chat';
            options = {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    contents: apiContents,
                    systemInstruction: systemInstruction
                })
            };
        }

        const response = await fetch(url, options);
        removeTypingLoader();

        if (response.ok) {
            const data = await response.json();
            
            let reply = '';
            if (data.candidates?.[0]?.content?.parts?.[0]?.text) {
                reply = data.candidates[0].content.parts[0].text;
            } else if (data.error?.message) {
                throw new Error(data.error.message);
            } else {
                reply = "Received empty response from Gemini. / મોડેલ તરફથી ખાલી જવાબ મળ્યો છે.";
            }

            renderMessage('assistant', reply);
            chatHistory.push({ role: 'assistant', content: reply });
        } else {
            const errData = await response.json();
            const errMsg = errData.error?.message || response.statusText;
            const apiErrorMsg = `❌ **API Error / API ભૂલ:**\n\nFailed to fetch response: ${errMsg}\n\n*System Fallback*: Switching temporarily to offline responses.`;
            renderMessage('assistant', apiErrorMsg);
            
            generateOfflineResponse(userMsg);
        }
    } catch (e) {
        removeTypingLoader();
        const connErrorMsg = `❌ **Connection Error / કનેક્શન ભૂલ:**\n\n${e.message}\n\n*System Fallback*: Switching temporarily to offline responses.`;
        renderMessage('assistant', connErrorMsg);
        
        generateOfflineResponse(userMsg);
    }
}
