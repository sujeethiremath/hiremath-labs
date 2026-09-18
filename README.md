<div align="center">

# ⚡ Hiremath Labs

**Enterprise Architecture, Cloud/AI Platforms & IoT Infrastructure Portfolio**

[![Next.js](https://img.shields.io/badge/Next.js-16.2.4-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.5-blue?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4.1-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![Playwright](https://img.shields.io/badge/Playwright-E2E%20Tests-2EAD33?logo=playwright)](https://playwright.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

*Architected and engineered by [Sujeet Hiremath](https://sujeethiremath.com)*

</div>

---

## 🚀 Overview

**Hiremath Labs** is a production-grade portfolio and engineering showcase designed to demonstrate advanced enterprise architecture, full-stack engineering, and IoT hardware integration.

In addition to highlighting enterprise platforms in tolling, automotive, finance, and healthcare, Hiremath Labs integrates directly with **Stratus**—a custom Raspberry Pi 5 16GB home-lab server—via Cloudflare Zero Trust tunnels to provide real-time hardware telemetry, encrypted live camera streaming, and an in-browser authenticated remote SSH terminal.

---

## ✨ Key Features

- **Executive Architecture Showcase**: Deep dives into mission-critical distributed systems, high-throughput message buses, and cloud architectures.
- **Dynamic Stats Integration**: Live synchronization with LeetCode GraphQL and GitHub REST APIs, cached in Firestore.
- **Interactive Resume Creator**: Multi-agent LLM workflow orchestrating job description analysis, resume tailoring, and PDF dossier generation.
- **Stratus IoT Server HUD**: Real-time server telemetry dashboard monitoring CPU, dual NVMe drives, thermals, fans, and network throughput.
- **Private Live Camera Feed**: In-browser low-latency video and audio stream tunneled via Cloudflare from a CSI-2 camera sensor.
- **Secure Remote Web Terminal**: Full-featured interactive PTY shell (`xterm.js`) connected to Stratus over authenticated WebSockets.
- **Zero-Trust Security**: Multi-layer security enforcing Firebase ID token validation against Google public x509 certificates and strict email allowlists.
- **End-to-End Test Suite**: Complete cross-browser test coverage using Playwright across desktop, tablet, and mobile devices.

---

## 🛠 Tech Stack

| Domain | Technology |
| :--- | :--- |
| **Frontend Framework** | [Next.js 16 (Turbopack, App Router)](https://nextjs.org/) |
| **UI & Styling** | [React 19](https://react.dev/), [Tailwind CSS 4](https://tailwindcss.com/), [Framer Motion](https://www.framer.com/motion/) |
| **Terminal & Viz** | [xterm.js](https://xtermjs.org/), [Chart.js](https://www.chartjs.org/) |
| **Backend & Cloud** | [Firebase Authentication](https://firebase.google.com/docs/auth), [Cloud Firestore](https://firebase.google.com/docs/firestore), [Nodemailer](https://nodemailer.com/) |
| **IoT & Edge Tunneling** | [Cloudflare Zero Trust](https://www.cloudflare.com/products/tunnel/), [Raspberry Pi 5](https://www.raspberrypi.com/) |
| **Testing** | [Playwright E2E](https://playwright.dev/), [ESLint](https://eslint.org/) |
| **Deployment** | [Vercel](https://vercel.com/) |

---

## 🏁 Getting Started

### Prerequisites
- Node.js 20+
- npm 10+

### 1. Clone & Install
```bash
git clone https://github.com/hiremath09/hiremath-labs.git
cd hiremath-labs
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env.local` and set your configuration:
```bash
cp .env.example .env.local
```
Refer to `.env.example` for details on Firebase, SMTP, and Cloudflare tunnel variables.

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Testing

Comprehensive End-to-End testing is powered by Playwright:

```bash
# Run all E2E tests headless across Chromium, Firefox, WebKit
npm run test:e2e

# Run tests in interactive UI mode
npm run test:e2e:ui

# View latest HTML test report
npm run test:e2e:report
```

For complete testing documentation and network mocking architecture, see [docs/testing.md](docs/testing.md).

---

## 🔒 Security

For vulnerability disclosures and reporting guidelines, please consult [SECURITY.md](SECURITY.md).

---

## 🤝 Contributing

Contributions and feedback are welcome! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for branch management and pull request workflows.

---

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.
