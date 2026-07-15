# Docker

## 1. Backend Application Context
Docker containerizes backend services, bundling application runtime, configurations, and packages into portable container images.

## 2. Backend-Specific Pitfalls
- **Running containers as root:** Failing to configure non-root users inside Dockerfiles, exposing host systems to container breakout exploits.

## 3. Code-Shape Example
`dockerfile
# Multi-stage production build config
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
# Enforce non-root execution
USER node
EXPOSE 3000
CMD ["node", "dist/main.js"]
`

## 4. Read First
Before applying this backend application note, review the full deep-dives:
- [CI/CD](../../production_principles/delivery-and-readiness/02-ci-cd-strategy-implementation.md)
- [DevOps](../../production_principles/delivery-and-readiness/03-devops-configuration.md)
