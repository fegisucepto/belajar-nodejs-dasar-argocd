# 🚀 Node.js + ArgoCD Continuous Deployment

Project Node.js dengan ArgoCD untuk continuous deployment yang support local testing dan production.

## 📋 Overview

```
GitHub Repo → GitHub Actions → Docker Hub → ArgoCD → Kubernetes Cluster
     ↓               ↓              ↓         ↓            ↓
  Source Code    Build & Push   Container   Auto Sync   Running App
  K8s Manifests   Update Tag     Registry    Health Check  Users
```

## 🛠️ Tech Stack

- **Backend**: Node.js + Express + MongoDB
- **Containerization**: Docker
- **CI/CD**: GitHub Actions
- **GitOps**: ArgoCD
- **Orchestration**: Kubernetes (Minikube/Production)
- **Registry**: Docker Hub

## 🚀 Quick Start

### 1. Prerequisites

```bash
# Install required tools
curl -LO https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl
chmod +x kubectl && sudo mv kubectl /usr/local/bin/

curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
chmod +x minikube-linux-amd64 && sudo mv minikube-linux-amd64 /usr/local/bin/minikube

# Install Docker & create Docker Hub account
# Setup GitHub secrets: DOCKERHUB_USERNAME, DOCKERHUB_TOKEN
```

### 2. Local Testing Setup

```bash
# Clone repository
git clone https://github.com/fegisucepto/belajar-nodejs-dasar-argocd.git
cd belajar-nodejs-dasar-argocd

# Start Minikube
minikube start --driver=docker --cpus=2 --memory=4096 --disk-size=20g
minikube addons enable ingress

# Install ArgoCD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Wait for ArgoCD
kubectl wait --for=condition=available --timeout=300s deployment/argocd-server -n argocd

# Access ArgoCD UI
kubectl port-forward svc/argocd-server -n argocd 8080:443 &
# Browser: http://localhost:8080 (admin/password)
```

### 3. Deploy Application

```bash
# Setup ArgoCD application
kubectl apply -f k8s/argocd-app.yaml

# Install ArgoCD CLI
curl -sSL -o argocd-linux-amd64 https://github.com/argoproj/argo-cd/releases/latest/download/argocd-linux-amd64
sudo install -m 555 argocd-linux-amd64 /usr/local/bin/argocd && rm argocd-linux-amd64

# Login and sync
ARGOCD_PASSWORD=$(kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath="{.data.password}" | base64 -d)
argocd login localhost:8080 --username admin --password "$ARGOCD_PASSWORD" --insecure
argocd app sync belajar-nodejs-dasar

# Test deployment
SERVICE_URL=$(minikube service belajar-nodejs-dasar --url -n belajar-nodejs)
curl "$SERVICE_URL/health"
```

## 🌍 Deployment Environments

| Branch/Tag    | Environment | Replicas | Trigger         |
|---------------|-------------|----------|-----------------|
| `develop`     | Local       | 1        | Auto/Push       |
| `main`        | Staging     | 1        | Auto/Push       |
| `v*` tags     | Production  | 3        | Auto/Tag Push   |

### Manual Deployment

```bash
# Local testing
git push origin develop

# Staging
git push origin main

# Production
git tag v1.0.0 && git push origin v1.0.0
```

### GitHub Actions Manual Trigger

1. Actions → ArgoCD Continuous Deployment
2. Click "Run workflow"
3. Select environment: `local`, `staging`, or `production`
4. Enable "Force ArgoCD sync" (optional)
5. Click "Run workflow"

## 🧪 Testing

### Health Check

```bash
# Get service URL
SERVICE_URL=$(minikube service belajar-nodejs-dasar --url -n belajar-nodejs)
echo "Service: $SERVICE_URL"

# Test health
curl -f "$SERVICE_URL/health"

# Alternative via NodePort
NODE_PORT=$(kubectl get service belajar-nodejs-dasar -n belajar-nodejs -o jsonpath='{.spec.ports[0].nodePort}')
curl -f "http://$(minikube ip):$NODE_PORT/health"
```

### ArgoCD Status

```bash
# Application status
argocd app get belajar-nodejs-dasar
argocd app list

# Force sync
argocd app sync belajar-nodejs-dasar --force

# Application history
argocd app history belajar-nodejs-dasar
```

### Kubernetes Resources

```bash
# Deployments & Pods
kubectl get deployments -n belajar-nodejs
kubectl get pods -n belajar-nodejs -o wide

# Services & Ingress
kubectl get services -n belajar-nodejs
kubectl get ingress -n belajar-nodejs

# Logs
kubectl logs -n belajar-nodejs -l app=belajar-nodejs-dasar --tail=20
```

## 🔧 Troubleshooting

### Common Issues

#### ArgoCD Server Not Ready
```bash
kubectl get pods -n argocd
kubectl logs -n argocd deployment/argocd-server
kubectl rollout restart deployment/argocd-server -n argocd
```

#### Application Sync Failed
```bash
argocd app get belajar-nodejs-dasar
argocd app sync belajar-nodejs-dasar --force --drift
kubectl get all -n belajar-nodejs
```

#### Image Pull Error
```bash
# Check image
grep "image:" k8s/deployment.yaml
docker pull fegisucepto/belajar-nodejs-dasar-argocd:latest

# Update manually
kubectl set image deployment/belajar-nodejs-dasar app=fegisucepto/belajar-nodejs-dasar-argocd:latest -n belajar-nodejs
```

### Reset Environment

```bash
# Clean reset
minikube delete
minikube start --driver=docker --cpus=2 --memory=4096 --disk-size=20g
minikube addons enable ingress
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml
```

## 📁 Project Structure

```
.
├── .github/workflows/
│   ├── ci.yml          # Continuous Integration
│   ├── cd.yml          # ArgoCD Continuous Deployment
│   └── sonarcloud.yml  # Code Quality
├── k8s/
│   ├── deployment.yaml    # K8s Deployment & Service
│   ├── service.yaml       # Service & Ingress
│   └── argocd-app.yaml   # ArgoCD Application
├── app.js               # Express Application
├── Dockerfile           # Container Definition
├── package.json         # Node.js Dependencies
└── README.md           # This file
```

## 🎯 ArgoCD Features

### Auto-Sync Configuration
- **Automated**: Prune & self-heal enabled
- **Retry Logic**: 5 retries with backoff
- **Ignore Differences**: Replica count changes
- **Sync Options**: CreateNamespace, PrunePropagation

### Application Health
- **Startup Probe**: Initial application health
- **Liveness Probe**: Ongoing health checks
- **Readiness Probe**: Traffic readiness
- **Resource Limits**: CPU & Memory constraints

## 🔐 Security Best Practices

1. **Secrets Management**: Use GitHub secrets
2. **Image Security**: Use specific image tags
3. **Network Policies**: Implement when needed
4. **RBAC**: Configure proper permissions
5. **Resource Limits**: Prevent resource exhaustion

## 📊 Monitoring

### ArgoCD UI Access
```bash
# Port-forward
kubectl port-forward svc/argocd-server -n argocd 8080:443 &

# Credentials
URL: http://localhost:8080
Username: admin
Password: kubectl -n argocd get secret argocd-initial-admin-secret -o jsonpath='{.data.password}' | base64 -d
```

### Application Monitoring
- **Health Status**: Real-time application health
- **Sync Status**: GitOps synchronization status
- **Resource Usage**: CPU, memory, storage
- **Deployment History**: Rollback capabilities

## 🚀 Production Deployment

### Pre-deployment Checklist
- [ ] All tests passing in CI
- [ ] Security scan completed
- [ ] Image tagged with version
- [ ] ArgoCD configuration reviewed
- [ ] Resource limits configured
- [ ] Health checks implemented
- [ ] Monitoring enabled

### Deployment Steps
1. **Tag release**: `git tag v1.0.0 && git push origin v1.0.0`
2. **Monitor CI**: Watch GitHub Actions build
3. **ArgoCD Sync**: Verify auto-sync in ArgoCD UI
4. **Health Check**: Test application endpoints
5. **Monitor**: Observe application metrics

## 📚 Additional Resources

- [ArgoCD Documentation](https://argo-cd.readthedocs.io/)
- [Kubernetes Basics](https://kubernetes.io/docs/tutorials/kubernetes-basics/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Docs](https://docs.github.com/en/actions)

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

This project is licensed under the ISC License.

---

🎉 **Happy Coding with ArgoCD!**
