# Sample .env

```
NODE_ENV="development"
LOG_LEVEL="info"

APP_HOST="localhost"
APP_PORT="8080"

DB_HOST="localhost"
DB_PORT="6500"

POSTGRES_USER="postgres"
POSTGRES_PASSWORD="postgres"
POSTGRES_DB="ratings-${NODE_ENV}"

DATABASE_URL="postgresql://${POSTGRES_USER}:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/postgres?schema=public"
```

# Setup
Use bun I guess
