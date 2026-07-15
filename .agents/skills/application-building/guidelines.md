# Application Building Guidelines

These guidelines define the styling constraints, rendering rules, and code shape configurations required to build responsive, accessible, and premium interfaces.

---

## 1. Visual Aesthetics & Design System

Every application must configure a unified design system inside `index.css`:

### Color Palettes (HSL Variables)
```css
:root {
  --primary-base: 220;
  --primary: hsl(var(--primary-base), 90%, 56%);
  --primary-hover: hsl(var(--primary-base), 90%, 46%);
  --primary-light: hsl(var(--primary-base), 90%, 96%);
  
  --dark-bg: hsl(222, 47%, 11%);
  --dark-card: hsl(223, 47%, 16%);
  --dark-border: hsl(223, 47%, 21%);
  
  --text-primary: hsl(220, 10%, 98%);
  --text-secondary: hsl(220, 10%, 70%);
  
  --transition-smooth: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  --border-radius-premium: 12px;
}
```

### Typography standards
*   Import premium fonts from Google Fonts (e.g. `Outfit` or `Inter`) instead of defaulting to browser serif fonts.
*   Enforce a clean typographic scale: `h1` (2.5rem), `h2` (2rem), `h3` (1.5rem), `p` (1rem).

---

## 2. Micro-Animations & Dynamic Interactions

*   **Buttons & Inputs**: Apply transitions on hover/focus states using `var(--transition-smooth)`.
*   **Entrance Transitions**: Configure keyframe animations to fade elements into place on load:
    ```css
    @keyframes slideUpFade {
      from {
        opacity: 0;
        transform: translateY(10px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
    .animate-entrance {
      animation: slideUpFade 0.5s ease-out forwards;
    }
    ```

---

## 3. DOM & State Wiring Standards

To write maintainable vanilla JS:
1.  **State Isolation**: Encapsulate variables inside a clean state container:
    ```javascript
    const appState = {
      users: [],
      currentFilter: 'all',
      updateState(key, value) {
        this[key] = value;
        renderUI();
      }
    };
    ```
2.  **Event Delegation**: Bind event listeners to the closest parent container rather than binding to individual elements in lists.
3.  **Dynamic Rendering**: Avoid string concatenation inside innerHTML. Use template literals and escape inputs to prevent XSS vulnerabilities.
