# Zero-Trust Security Orchestration Framework

## Overview
This project implements a comprehensive zero-trust security framework designed to integrate with DevOps pipelines and enforce stringent security controls throughout the application lifecycle. It utilizes industry-standard tools and custom automation to ensure continuous validation, least privilege, and automated remediation.

---

## Features
- **Secret Management:** Hashicorp Vault with automated certificate rotation
- **Kubernetes Security:** Pod Security Policies, Network Policies, OPA/Gatekeeper
- **Service Mesh:** Istio/Linkerd for mTLS and service identity
- **CI/CD Security:** GitGuardian & Snyk scanning, supply chain provenance
- **Runtime Security:** Falco, Sysdig, behavioral analytics
- **Automated Remediation:** Custom Kubernetes Operator
- **Dashboard:** Real-time security posture, risk scoring, and compliance reporting

---

## Directory Structure
```
zero-trust-framework/
  ├── infra/                  # Terraform IaC modules
  ├── k8s/                    # Kubernetes manifests, OPA policies, Operators
  ├── mesh/                   # Istio/Linkerd configs
  ├── vault/                  # Vault policies, scripts, cert automation
  ├── ci-cd/                  # Pipeline scripts for Snyk/GG, provenance
  ├── runtime-security/       # Falco/Sysdig config, rules
  ├── dashboard/              # Security posture dashboard (React/Node)
  ├── docs/                   # Compliance, audit, architecture docs
  └── README.md
```

---

## Quick Start
1. **Provision Infrastructure:**
   - `cd infra && terraform init && terraform apply`
2. **Deploy to Kubernetes:**
   - `kubectl apply -f k8s/`
3. **Install Service Mesh:**
   - `kubectl apply -f mesh/`
4. **Configure Vault:**
   - Follow scripts in `vault/`
5. **Set up CI/CD:**
   - Integrate `ci-cd/` scripts with your pipeline
6. **Deploy Runtime Security:**
   - `kubectl apply -f runtime-security/`
7. **Launch Dashboard:**
   - See `dashboard/README.md` for instructions

---

## Compliance & Outcomes
- Automated compliance with major frameworks (PCI DSS, HIPAA, etc.)
- Real-time risk scoring and posture monitoring
- Automated audit reporting
- Integration with incident response workflows

---

## Authors & License
- Author: [Your Name]
- License: MIT

---

## Zero-Trust Security Dashboard: Live Integration Notes (2025-04-19)

### Cluster Setup & Integrations
- **Kubernetes (Minikube):**
  - Ensure Minikube is running and `kubectl` is configured.
- **Gatekeeper (OPA):**
  - Deploy using:
    ```sh
    kubectl apply -f https://raw.githubusercontent.com/open-policy-agent/gatekeeper/release-3.15/deploy/gatekeeper.yaml
    ```
  - Port-forward metrics:
    ```sh
    kubectl port-forward -n gatekeeper-system pod/<controller-pod-name> 8888:8888
    ```
- **Vault:**
  - Install with Helm:
    ```sh
    helm repo add hashicorp https://helm.releases.hashicorp.com
    helm repo update
    kubectl create namespace vault
    helm install vault hashicorp/vault --namespace vault --set "server.dev.enabled=true"
    ```
  - Port-forward Vault:
    ```sh
    kubectl port-forward -n vault svc/vault 8200:8200
    ```
  - Vault UI: http://localhost:8200
- **Falco Alerts:**
  - Ensure Falco is running and webhook is set to backend endpoint.
- **MongoDB:**
  - Backend requires `MONGO_URI` environment variable.

### Dashboard Features
- Live OPA/Gatekeeper metrics (via port-forwarded pod)
- Vault health status (via port-forwarded service)
- Kubernetes pod info (requires at least one non-system pod, e.g. nginx)
- Falco alerts persisted and displayed (requires MongoDB and Falco webhook)

### Troubleshooting
- If Vault or Gatekeeper metrics are not visible, verify port-forwarding and backend API URLs.
- If dashboard shows "No pods found", deploy a sample workload:
  ```sh
  kubectl create deployment nginx --image=nginx
  ```
- For Vault dev mode, the root token is in the Vault pod logs.
