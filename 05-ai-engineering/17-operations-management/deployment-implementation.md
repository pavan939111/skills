# Model and Prompt Deployment

## 1. Definition & Core Concepts
Model and Prompt Deployment is the technical pipeline for packaging, routing, orchestrating, and launching new AI models and versioned prompt configurations into production environments.

## 2. Why It Exists / What Problem It Solves
Deploying AI models is significantly different from deploying traditional microservices. Models are large files (often 10GB to 100GB+) that require specialized GPU hardware and long initialization times. Prompts are dynamic assets that must be rolled out in sync with application logic. Deployment strategies orchestrate GPU clusters, handle container cold starts, and route traffic safely without downtime.

## 3. What Breaks in Production Without It
- **GPU Outages During Releases:** Redeploying a service shuts down existing GPU containers before new ones are ready to serve traffic, resulting in application outages.
- **Out-of-Sync Prompts:** A backend service is deployed that expects a JSON output, but the corresponding prompt version was not updated, crashing schema parsers.
- **Resource Starvation:** Pods crash because they try to load model weights that exceed the allocated GPU memory limit (VRAM).

## 4. Best Practices
- **Implement Blue-Green Deployments:** When launching new model servers, keep the old cluster fully active until the new cluster has loaded weights, passed tests, and is ready to receive traffic.
- **Decouple Code and Prompt Deployments:** Use config gateways or prompt registries to update prompts instantly without rebuilds.
- **Pre-download weight files:** Build containers that pull model weights from close storage buckets (e.g. S3, GCS) during build time, or cache them on shared network drives to reduce container start times.

## 5. Common Mistakes / Anti-Patterns
- **Pulling weights on start from public APIs:** Downloading models directly from Hugging Face public registries during pod startup, introducing dependency on third-party uptime.
- **Direct production code edits:** Modifying prompt strings directly in production server databases or code targets.

## 6. Security Considerations
- **Vulnerability Scanning in Containers:** Scan model server images (like vLLM or Triton) for container CVEs, and verify that only signed, authenticated model files are mounted.

## 7. Performance Considerations
- **Minimizing Cold Starts:** Use lightweight base images, optimize model loader scripts, and pre-warm GPU pods by sending dummy inference requests during startup checks.

## 8. Scalability Considerations
- **Autoscaling on Custom GPU Metrics:** Scale model deployments based on GPU memory usage and concurrent query counts rather than standard CPU/memory metrics.

## 9. How Major Companies Implement It
- **Netflix:** Deploys large models using a custom orchestration layer on Kubernetes that pre-warms GPU nodes and validates endpoint latency before routing production traffic.

## 10. Decision Checklist (Deployment Environments)
- Use **Serverless Model Hosting (e.g. RunPod, Baseten, Replicate)** when:
  - Running low-to-medium traffic workloads where GPU scale swings dynamically and low maintenance overhead is key.
- Use **Dedicated Kubernetes GPU Nodes (EKS/GKE)** when:
  - Running high-throughput, latency-critical enterprise workloads with strict data governance needs.

## 11. AI Coding-Agent Guidelines
- Write Helm charts or Docker Compose configurations that explicitly manage model caching volumes, GPU access allocations, and pre-warming check steps.

## 12. Reusable Checklist
- [ ] Blue-green or rolling deployment strategies active for model servers
- [ ] Model weights pre-downloaded or cached on local volumes
- [ ] Startup checks include GPU pre-warming with synthetic requests
- [ ] Container limits match model VRAM constraints (GPU memory check)
- [ ] Decoupled prompt registry active for prompt deployments
- [ ] Fallback routing active in case new endpoints fail readiness checks
