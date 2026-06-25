# Quick Add Keyboard Submission Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Enable submission of the Quick Add form via plain Enter and Cmd/Ctrl+Enter, while Shift+Enter inserts newlines.

**Architecture:** Add an `onKeyDown` event handler to the `<textarea>` element in `QuickAddCard`. Check if the pressed key is "Enter" and Shift is not held, then prevent default and trigger form submission.

**Tech Stack:** React (JSX)

---

### Task 1: Add keydown handler to Quick Add textarea

**Files:**
- Modify: `expense-app-source/screens.jsx`

- [ ] **Step 1: Implement keydown handler on the textarea**
  Add the `onKeyDown` attribute to the `<textarea>` inside `QuickAddCard` in `expense-app-source/screens.jsx`.
  
  ```jsx
  onKeyDown={e => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  }}
  ```

- [ ] **Step 2: Commit changes**

  ```bash
  git add expense-app-source/screens.jsx
  git commit -m "feat: submit Quick Add on Enter and Cmd/Ctrl+Enter"
  ```
