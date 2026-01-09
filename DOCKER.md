# Docker Setup - Quick Reference

## What's Dockerized

Your application now runs in a completely isolated Docker container with:

- **Node.js 20.19.6** - Isolated from your host system
- **matugen 3.1.0** - Isolated from your host system  
- **npm packages** - All dependencies installed only in the container
- **Ubuntu 25.04 base** - Provides glibc 2.41 required by matugen

## Quick Commands

```bash
# Start the application
docker-compose up -d

# Stop the application
docker-compose down

# View logs
docker-compose logs -f

# Rebuild after code changes
docker-compose up -d --build

# Check status
docker-compose ps

# Access the app
# Open browser to http://localhost:3000
```

## Verify Isolation

```bash
# Check versions inside container
docker exec matugen-palette-app node --version    # v20.19.6
docker exec matugen-palette-app matugen --version # matugen 3.1.0

# These commands should NOT work on your host (unless you have them installed):
which matugen  # Should return nothing if not installed on host
node --version # Will show host version or error if not installed
```

## What's Isolated vs. Shared

### Isolated (inside container only):
- Node.js runtime
- matugen binary
- npm packages
- Application code

### Shared (mounted from host):
- `./uploads/` directory - Persists uploaded images

### Exposed:
- Port 3000 - Accessible at http://localhost:3000

## Health Check

```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok","matugen":"matugen 3.1.0"}
```

## Troubleshooting

```bash
# View container logs
docker-compose logs -f

# Restart container
docker-compose restart

# Rebuild from scratch (clears cache)
docker-compose down
docker-compose build --no-cache
docker-compose up -d

# Access container shell
docker exec -it matugen-palette-app /bin/bash
```

## File Structure

```
.
├── Dockerfile           # Container definition
├── docker-compose.yml   # Container orchestration
├── .dockerignore        # Files excluded from container
├── server.js            # Application entry point
├── package.json         # npm dependencies
├── public/              # Static files
├── views/               # EJS templates
└── uploads/             # Uploaded images (mounted volume)
```
