# Zero-Trust Security Dashboard

This dashboard provides real-time visibility into the security posture, risk scoring, and compliance status of your Kubernetes environment. 

## Features
- Real-time risk scoring (OPA, Falco, Vault integration)
- Compliance and audit reporting
- Threat and anomaly alerts

## Getting Started
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the dashboard:
   ```bash
   npm start
   ```
3. The dashboard will be available at http://localhost:3000

---

## Integration Points
- OPA/Gatekeeper metrics API
- Falco/Sysdig alert feeds
- Vault secret/cert status

You can extend `App.js` to fetch and display these metrics.
