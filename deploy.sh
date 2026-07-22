#!/bin/bash
set -e

SERVER_IP="80.78.241.208"
SERVER_USER="root"
REMOTE_DIR="/var/www/seo_saas"

echo "=========================================="
echo "🚀 Deploying SEO Content Factory OS to $SERVER_IP"
echo "=========================================="

echo "📦 1. Synchronizing repository on server..."
ssh ${SERVER_USER}@${SERVER_IP} "mkdir -p ${REMOTE_DIR} && cd ${REMOTE_DIR} && if [ -d .git ]; then git pull origin main; else git clone https://github.com/vaneeeek5/seo_saas.git .; fi"

echo "🐳 2. Building & launching Docker containers..."
ssh ${SERVER_USER}@${SERVER_IP} "cd ${REMOTE_DIR} && docker compose down && docker compose up -d --build"

echo "=========================================="
echo "🎉 Deployment completed successfully!"
echo "🌐 Web Dashboard: http://${SERVER_IP}:3000"
echo "⚡ NestJS REST API: http://${SERVER_IP}:4000"
echo "=========================================="
