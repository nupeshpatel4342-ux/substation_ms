# 66 KV Substation - Monthly Report App

Welcome to the 66 KV Substation Reporting Application! This project is a completely standalone Vanilla HTML, CSS, and JavaScript application. It is designed to be extremely fast, requiring no complex server builds or Node packages.

## 🚀 How to Run

Because this project is built entirely with Vanilla web technologies, running it is incredibly simple:
1. Open the project folder on your computer.
2. Double-click the `index.html` file.
3. The application will instantly open and run in your default web browser!

## 📁 Folder Structure

To make expanding this project as easy as possible for any developer, the code is meticulously organized by feature. When you need to edit a specific part of the app, simply look for the corresponding file in the `js` folder:

```text
66KVReport/
│
├── index.html            # The main UI structure and layout of the application
│
├── css/                  # Module-based Stylesheets
│   ├── variables.css     # CSS root variables
│   ├── base.css          # Resets, typography, layout, modals, toasts
│   ├── forms.css         # Form styles, equipment inputs, dynamic lists
│   ├── dashboard.css     # Dashboard cards, DMS styles, mega menu
│   ├── reports.css       # Report tables, photo report styles
│   ├── maintenance.css   # Registers and checklists styles
│   └── responsive.css    # Media queries for tablet and mobile
│
└── js/                   # Module-based JavaScript
    ├── utils.js          # Core helpers, constants, state management, and LocalStorage logic
    ├── app.js            # General initialization, Mega Menu, and navigation
    ├── setup.js          # Logic for adding/editing substation equipment and feeders
    ├── dashboard.js      # Rendering the main dashboard and substation cards
    ├── reports.js        # The calculation engine and logic for generating PDF reports
    └── maintenance.js    # Logic for fault registers, tripping registers, and DMS
```

## 🛠️ Modifying the App

If you are a developer looking to add a new feature:
- **Styling**: Add any new classes directly to `css/style.css`.
- **Logic**: If the feature fits an existing category (like a new report calculation), add it to `js/reports.js`. If it's a completely new major feature, you can create a new `.js` file in the `js/` folder and link it at the bottom of `index.html`.
- **UI**: Add the new HTML structural elements directly into `index.html`.

## 📦 Data Storage

All application data is currently stored using the browser's native `localStorage`. This means your data is saved locally on your device. The handling for data saving and loading is managed securely within `js/utils.js`.
