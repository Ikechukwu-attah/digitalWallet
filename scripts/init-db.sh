#!/bin/bash
set -e

echo "📌 Initializing multiple PostgreSQL databases..."

# Create auth_db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE auth_db;
    CREATE USER auth_user WITH PASSWORD 'auth_password';
    GRANT ALL PRIVILEGES ON DATABASE auth_db TO auth_user;
EOSQL

# Create payment_db
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE DATABASE payment_db;
    CREATE USER payment_user WITH PASSWORD 'payment_password';
    GRANT ALL PRIVILEGES ON DATABASE payment_db TO payment_user;
EOSQL

echo "✅ Databases auth_db and payment_db initialized successfully!"
