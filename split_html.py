import re
import os

html_file = 'index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    content = f.read()

# Define the sections to extract
sections = {
    'dashboardTemplate': r'<div id="pageDashboard" class="page-section" style="display:none;">(.*?)</div>\s*<!-- ===== PAGE: Substations ===== -->',
    'reportsTemplate': r'<div id="pageReports" class="page-section" style="display:none;">(.*?)</div>\s*<!-- ===== PAGE: Notifications ===== -->',
    'notificationsTemplate': r'<div id="pageNotifications" class="page-section" style="display:none;">(.*?)</div>\s*<!-- ===== PAGE: Settings ===== -->',
    'settingsTemplate': r'<div id="pageSettings" class="page-section" style="display:none;">(.*?)</div>\s*<!-- Toast -->'
}

# The pageSubstations contains multiple views. We should extract them individually.
substation_views = {
    'ssListTemplate': r'<div id="dashboardView" class="view active">(.*?)</div>\s*<!-- ===== VIEW: Setup ===== -->',
    'ssSetupTemplate': r'<div id="setupView" class="view">(.*?)</div>\s*<!-- ===== VIEW: SS Dashboard ===== -->',
    'ssDashboardTemplate': r'<div id="ssDashboardView" class="view">(.*?)</div>\s*<!-- ===== VIEW: DMS ===== -->',
    'ssDmsTemplate': r'<div id="dmsView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Event Timeline ===== -->',
    'ssEventTimelineTemplate': r'<div id="eventTimelineView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Monthly Report Form ===== -->',
    'ssReportTemplate': r'<div id="reportView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Photo Report ===== -->',
    'ssPhotoReportTemplate': r'<div id="photoReportView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Fault Register ===== -->',
    'ssFaultRegisterTemplate': r'<div id="faultRegisterView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Tripping Register ===== -->',
    'ssTrippingRegisterTemplate': r'<div id="trippingRegisterView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Breakdown Register ===== -->',
    'ssBreakdownRegisterTemplate': r'<div id="breakdownRegisterView" class="view">(.*?)</div>\s*<!-- ===== VIEW: Maintenance Register ===== -->',
    'ssMaintenanceTemplate': r'<div id="maintenanceView" class="view">(.*?)</div>\s*<!-- ===== PAGE: Equipment Master ===== -->',
    'ssEquipmentMasterTemplate': r'<div id="pageEquipmentMaster" class="view">(.*?)</div>\s*<!-- ===== PAGE: Equipment Profile ===== -->',
    'ssEquipmentProfileTemplate': r'<div id="pageEquipmentProfile" class="view">(.*?)</div>\s*</div><!-- /pageSubstations -->'
}

os.makedirs('js/pages', exist_ok=True)

def extract_and_save(pattern_dict, prefix=""):
    for name, pattern in pattern_dict.items():
        match = re.search(pattern, content, re.DOTALL)
        if match:
            inner_html = match.group(1)
            # Escape backticks
            inner_html = inner_html.replace('`', '\\`')
            
            # Wrap in JS variable
            js_content = f"const {name} = `\n{inner_html}\n`;\n"
            
            with open(f'js/pages/{name}.js', 'w', encoding='utf-8') as f:
                f.write(js_content)
            print(f"Extracted {name}")
        else:
            print(f"Could not find pattern for {name}")

extract_and_save(sections)
extract_and_save(substation_views)

# Now, we should create a new index.html that excludes these contents, and injects the script tags.
# Instead of complex regex for replacing, let's just use regex to strip out everything between 
# <!-- ===== MAIN ENTERPRISE DASHBOARD ===== --> and <!-- Toast --> and replace with <main id="main-content"></main>

new_content = re.sub(
    r'<!-- ===== MAIN ENTERPRISE DASHBOARD ===== -->.*<!-- Toast -->',
    '<!-- ===== MAIN ENTERPRISE DASHBOARD ===== -->\n    <main id="main-content"></main>\n\n    <!-- Toast -->',
    content,
    flags=re.DOTALL
)

# Insert the script tags before <script src="js/utils.js">
script_tags = ""
for name in sections:
    script_tags += f'    <script src="js/pages/{name}.js"></script>\n'
for name in substation_views:
    script_tags += f'    <script src="js/pages/{name}.js"></script>\n'

new_content = new_content.replace('<script src="js/utils.js">', script_tags + '    <script src="js/utils.js">')

with open('index_refactored.html', 'w', encoding='utf-8') as f:
    f.write(new_content)

print("Created index_refactored.html")
