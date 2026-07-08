# Developer Rules for 66 KV Substation Project

## Folder Structure and Architecture Rule
- When the user requests a new feature, menu, or page, ALWAYS act like a professional developer by maintaining the established module-based folder structure.
- **NEVER** write large blocks of CSS or JavaScript inside `index.html`.
- **CSS**: Place all new styling in the appropriate file inside the `css/` folder (e.g., `css/reports.css`, `css/forms.css`). If it's a completely new major feature, create a new CSS file.
- **JavaScript**: Place all new logic in the appropriate file inside the `js/` folder (e.g., `js/dashboard.js`, `js/maintenance.js`). If it's a completely new major feature, create a new JS file and link it properly in `index.html`.
- **HTML**: Keep `index.html` as a clean structural skeleton. Inject complex HTML and data dynamically via JavaScript DOM manipulation when possible.
- **Technology Stack**: Do NOT introduce Node.js, React, Vite, or any build tools unless explicitly instructed. Keep it 100% Vanilla HTML, CSS, and JS.

## Git Workflow Rule
- **Manual Commits**: Do NOT run `git commit` automatically. Let the user manually commit changes via Visual Studio Code or terminal unless explicitly asked to do it for them.
