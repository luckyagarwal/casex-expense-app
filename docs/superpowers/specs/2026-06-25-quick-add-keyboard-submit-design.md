# Design Spec: Quick Add Keyboard Submission

## Requirements
Modify the Quick Add input box (a `<textarea>`) to allow users to submit their text input using keyboard shortcuts.

### Detailed Key Behavior:
- **Plain `Enter`**: Submits the expense form.
- **`Cmd + Enter`** (Mac) / **`Ctrl + Enter`** (Windows/Linux): Submits the expense form.
- **`Shift + Enter`**: Inserts a newline character in the `<textarea>`.

## Proposed Changes

### [Component: screens.jsx](file:///Users/casex/PersonalProject/casex-expense-app/expense-app-source/screens.jsx)

Modify the `<textarea>` component inside the `QuickAddCard` component to include an `onKeyDown` event handler.

#### Keydown Handler Logic:
```javascript
onKeyDown={e => {
  if (e.key === 'Enter' && !e.shiftKey) {
    e.preventDefault();
    handleSubmit(e);
  }
}}
```

## Verification Plan

### Manual Verification
1. Run `npm run dev` to start the Cloudflare Wrangler dev server.
2. Open the application in the browser.
3. Focus on the Quick Add text area.
4. Type a valid expense description (e.g., "150 lunch").
5. Press **Enter** and verify the form is submitted and cleared.
6. Type another expense description.
7. Press **Cmd + Enter** (on Mac) / **Ctrl + Enter** (on Windows) and verify the form is submitted.
8. Type text, press **Shift + Enter**, verify a new line is inserted, and then press **Enter** to submit the multi-line input.
