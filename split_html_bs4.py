from bs4 import BeautifulSoup
import os

html_file = 'index.html'

with open(html_file, 'r', encoding='utf-8') as f:
    soup = BeautifulSoup(f, 'html.parser') # standard parser is enough

# IDs to extract
page_ids = [
    'pageDashboard',
    'pageSubstations',
    'pageReports',
    'pageNotifications',
    'pageSettings',
    # We shouldn't extract the views inside pageSubstations individually if we want to keep them grouped,
    # OR we can extract them all and delete the parent pageSubstations wrapper.
    # But for simplicity, let's just extract the main ones.
    # Actually, the views inside pageSubstations are huge. Let's extract them.
    'dashboardView',
    'setupView',
    'ssDashboardView',
    'dmsView',
    'eventTimelineView',
    'reportView',
    'photoReportView',
    'faultRegisterView',
    'trippingRegisterView',
    'breakdownRegisterView',
    'maintenanceView',
    'pageEquipmentMaster',
    'pageEquipmentProfile'
]

os.makedirs('js/pages', exist_ok=True)

# Also let's extract the modals if any
modals = [
    'modalAddSubstation',
    'modalViewSubstation',
    'modalAddEquipment'
]

all_ids = page_ids + modals

for element_id in all_ids:
    element = soup.find(id=element_id)
    if element:
        # Extract HTML as string
        html_str = str(element)
        html_str = html_str.replace('`', '\\`')
        js_content = f"const {element_id}Template = `\n{html_str}\n`;\n"
        with open(f'js/pages/{element_id}.js', 'w', encoding='utf-8') as f:
            f.write(js_content)
        print(f"Extracted {element_id}")
        
        # Remove from soup
        element.extract()
    else:
        print(f"ID not found: {element_id}")

# Find where to put main-content. We can append it to body, just before toasts
# or we can find the nav and put it after nav Overlay and Drawer.
drawer = soup.find(id='navDrawer')
if drawer:
    main_tag = soup.new_tag('main', id='main-content')
    drawer.insert_after(main_tag)

# Add script tags before utils.js
utils_script = soup.find('script', src='js/utils.js')
if utils_script:
    for element_id in all_ids:
        # Only add script tag if file exists
        if os.path.exists(f'js/pages/{element_id}.js'):
            script_tag = soup.new_tag('script', src=f'js/pages/{element_id}.js')
            utils_script.insert_before(script_tag)

with open('index_bs4.html', 'w', encoding='utf-8') as f:
    f.write(str(soup))
print("Created index_bs4.html")
