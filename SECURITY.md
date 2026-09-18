# Security Policy

## Supported Versions

Only the latest version deployed on the `main` branch is actively supported with security updates.

| Branch / Version | Supported          |
| ---------------- | ------------------ |
| `main`           | :white_check_mark: |
| `dev`            | :white_check_mark: |
| legacy tags      | :x:                |

---

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please **do not open a public GitHub issue**. Instead, please report it responsibly:

- **Email**: [sujeetshiremath@gmail.com](mailto:sujeetshiremath@gmail.com)
- **Subject**: `[SECURITY] Vulnerability Report - Hiremath Labs`

Please include the following information in your report:
1. Description of the vulnerability.
2. Steps to reproduce the issue (proof of concept code or request transcripts if possible).
3. Potential impact and attack vectors.
4. Suggested mitigations or fixes, if known.

### Response Timeline
- **Acknowledgment**: Within 48 hours.
- **Assessment & Triage**: Within 5 business days.
- **Fix & Deployment**: Promptly pushed to `dev` -> `main` with appropriate attribution (unless you prefer anonymity).

---

## Security Architecture Highlights

- **Zero Open Ports**: All server telemetry, camera feeds, and terminal sessions communicate through Cloudflare Zero Trust tunnels without exposing home LAN or cloud servers to the public internet.
- **Dual-Layer Authentication**: Protected routes require Firebase Authentication ID tokens verified against Google's public x509 certs, along with strict email allowlisting.
- **Rate Limiting**: Public API endpoints (such as the contact form) enforce Firestore-backed rate limiting.
- **Secret Isolation**: Secrets are strictly stored in environment variables, and never committed to version control.
