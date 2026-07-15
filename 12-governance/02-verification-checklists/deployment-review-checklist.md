# Deployment Review Checklist

## 1. Purpose
The Deployment Review Checklist is an audit tool used to verify that Docker configs compile safely, resources are declared, and migrations are backward-compatible.

## 2. Checklist
- [ ] Dockerfile configures non-root user permissions (USER node)
- [ ] Kubernetes pods declare CPU and memory limits
- [ ] Migrations check for backward-compatible schema changes
- [ ] CI/CD configuration files verify testing runs before deployment
- [ ] Environment variable changes documented in .env.example

## 3. Cross-References
- [DevOps reference](../01-devops-readiness/)
- [Database migrations](..07-data-access/database-migrations.md)

## 4. Sign-off Criteria
- Approved when staging builds succeed, container permissions are checked, and migrations compile.
