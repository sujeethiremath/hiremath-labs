# End-to-End Testing with Playwright

Hiremath Labs utilizes [Playwright](https://playwright.dev/) for cross-browser, cross-device end-to-end (E2E) testing.

---

## 1. Test Architecture

The testing suite covers critical user flows, responsive viewports, accessibility standards, and route protection:

| Suite | File | Coverage |
| :--- | :--- | :--- |
| **Homepage** | `tests/e2e/homepage.spec.ts` | Hero, Summary, Projects, LeetCode, GitHub, Contact sections, and external links |
| **Navigation** | `tests/e2e/navigation.spec.ts` | Top navigation bar, mobile hamburger menu, anchor scrolling, and route switches |
| **Contact Form** | `tests/e2e/contact.spec.ts` | Form validation, successful submission, rate limiting (with mocked network routes) |
| **Auth Protection** | `tests/e2e/auth-protection.spec.ts` | Gated routes (`/resume-creator`, `/server-dashboard`, `/camera`, `/terminal`) and authentication flow |
| **Responsive** | `tests/e2e/responsive.spec.ts` | Desktop (1280px), Tablet (768px), and Mobile (375px) layouts without scroll overflows |
| **Accessibility** | `tests/e2e/accessibility.spec.ts` | ARIA roles, semantic landmarks (`main`, `nav`, `footer`), headings, and keyboard navigation |

---

## 2. Running Tests Locally

### Run all tests headless:
```bash
npm run test:e2e
```

### Run tests in interactive UI mode:
```bash
npm run test:e2e:ui
```

### Run tests in debug mode (step-by-step inspector):
```bash
npm run test:e2e:debug
```

### View the HTML test report:
```bash
npm run test:e2e:report
```

---

## 3. Network Mocking & Safety

To prevent accidental side-effects during testing:
- **No real emails are sent**: The `/api/contact` route is intercepted using `page.route('**/api/contact', ...)` to return deterministic 200 or 429 status codes.
- **Hardware independence**: Telemetry and camera feeds are mocked so tests run cleanly in any environment without requiring the physical Stratus Raspberry Pi to be online.
- **Firebase Auth isolation**: Simulated sessions verify both locked and authenticated UI states without requiring live Google OAuth roundtrips in CI.

---

## 4. Continuous Integration (CI)

Tests run automatically on every push and pull request via `.github/workflows/playwright.yml`. On test failures, Playwright automatically records screenshots, videos, and trace archives, which are uploaded as CI artifacts for fast root-cause analysis.
