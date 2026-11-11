## 2023-11-11 - Form Input Accessibility
**Learning:** In purely semantic static HTML forms without frameworks, using `span` for visual labels creates significant accessibility barriers. Explicitly associating form controls with `<label for="id">` and helper text with `aria-describedby` dramatically improves screen reader navigation and creates larger click targets for mouse users.
**Action:** When auditing forms, prioritize converting visual labels (like `.slider-name` spans) to semantic `<label>` elements and explicit ARIA associations for helper text.
