---
name: application-building
description: Guidelines and execution triggers for bootstrapping, building, styling, and verifying production-grade web applications.
---

# AI Skill: Application Building

This skill defines the execution lifecycle, styling principles, and verification checkpoints for building modern, responsive, and visually premium web applications.

## Trigger Conditions
- **Trigger Cwd**: Triggers on any project-bootstrap or layout edit commands.
- **Trigger Inputs**: Triggers when prompt contains keywords like `build web app`, `create UI`, `initialize frontend`, `design interface`.

## Expected Inputs
- `project_name`: Name of the target application folder.
- `styling_framework`: Vanilla CSS (preferred), TailwindCSS (requires confirmation).
- `responsive_targets`: Mobile, Tablet, Desktop.

## Expected Outputs
- `index.html`: Fully structured semantic HTML5 entry point.
- `index.css`: Custom CSS variables and global theme files.
- `app.js` / `main.js`: Main event handlers and application state controller.

## Reusable Execution Workflow
1.  **Read Registry**: Load the workspace `/registry/skills.json` mappings.
2.  **Theme Config**: Initialize `index.css` with HSL tailored variables, gradients, and transition easing properties.
3.  **Bootstrap HTML**: Create semantic layout elements (`<header>`, `<main>`, `<section>`, `<footer>`).
4.  **Wire Logic**: Write state-management and fetch event listeners inside script controllers.
5.  **Quality Check**: Validate using the responsive layouts checklist before finalizing the turn.
