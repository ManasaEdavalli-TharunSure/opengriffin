---
name: kubernetes-manifest
description: Use when the user wants to write or review a Kubernetes manifest (Deployment, Service, Ingress, etc.).
license: Apache-2.0
author: OpenGriffin
---

# Kubernetes manifests

## Minimal Deployment + Service

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: app
  labels: { app: app }
spec:
  replicas: 3
  selector: { matchLabels: { app: app } }
  template:
    metadata:
      labels: { app: app }
    spec:
      containers:
      - name: app
        image: ghcr.io/me/app:v1.2.3      # NEVER `latest`
        ports: [{ containerPort: 8000 }]
        resources:
          requests: { cpu: 100m, memory: 128Mi }
          limits:   { cpu: 500m, memory: 512Mi }
        readinessProbe:
          httpGet: { path: /healthz, port: 8000 }
          periodSeconds: 5
        livenessProbe:
          httpGet: { path: /healthz, port: 8000 }
          periodSeconds: 30
        env:
        - name: DATABASE_URL
          valueFrom: { secretKeyRef: { name: db, key: url } }
---
apiVersion: v1
kind: Service
metadata: { name: app }
spec:
  selector: { app: app }
  ports: [{ port: 80, targetPort: 8000 }]
```

## Rules

- **Pin image tags**, never `latest`.
- **Set resource requests AND limits** — without requests, scheduler over-packs nodes.
- **readinessProbe + livenessProbe** — readiness controls traffic routing, liveness restarts hung pods.
- **Liveness should NOT depend on downstream services** — they kill cascading dependencies.
- **Use Secrets, not ConfigMap, for credentials**. Mount them as files when possible (env vars leak via `/proc`).
- **Set `revisionHistoryLimit: 3`** on Deployments — saves etcd from accumulating history.
- **PodDisruptionBudget** for anything user-facing — prevents evicting all replicas simultaneously.

## Anti-patterns

- `command:` overriding the image's own ENTRYPOINT — fragile.
- Running multiple processes in one container — use sidecars.
- `hostNetwork: true` "for performance" — almost always wrong; breaks isolation.
- Probes that hit `/` — `/` may auth-redirect; use a dedicated `/healthz`.
