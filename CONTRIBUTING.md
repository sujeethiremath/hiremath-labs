# Contributing to Hiremath Labs

Thank you for your interest in contributing to the **Hiremath Labs** portfolio and engineering platform!

---

## 1. Branching & Git Workflow

We adhere to a strict branching model:
- `main`: Permanent production branch. Strictly deployed to live infrastructure.
- `dev`: Permanent development branch. All active integration occurs here.
- `feature/<feature-name>`: Ephemeral feature branches branched from `dev`.

### Rules
1. **Never commit directly to `main`**.
2. Create feature branches from `dev`:
   ```bash
   git checkout dev
   git pull origin dev
   git checkout -b feature/your-feature-name
   ```
3. Once completed and verified with all tests passing:
   - Merge `feature/your-feature-name` into `dev`.
   - Merge `dev` into `main`.
   - Delete the ephemeral `feature/your-feature-name` branch.

---

## 2. Local Setup & Development

1. **Clone the repository**:
   ```bash
   git clone https://github.com/hiremath09/hiremath-labs.git
   cd hiremath-labs
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment**:
   Copy `.env.example` to `.env.local` and configure your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. **Start Development Server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 3. Testing Requirements

All contributions must pass linting, building, and end-to-end tests before being merged:

```bash
# Run ESLint
npm run lint

# Build the project
npm run build

# Run Playwright E2E tests
npm run test:e2e
```

When writing new features, please add corresponding Playwright E2E tests in the `tests/e2e/` directory.

---

## 4. Code Style & Best Practices

- **TypeScript**: Strict types everywhere; avoid `any` wherever possible.
- **Tailwind CSS 4**: Utilize utility classes and maintain the cybernetic dark HUD aesthetic for server components.
- **Security**: Never hardcode API keys, tokens, IP addresses, or internal hostnames.
