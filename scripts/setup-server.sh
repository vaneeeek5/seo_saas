#!/bin/bash
set -e

echo "=================================================="
echo "🛠 Checking & Installing Prerequisites on Server..."
echo "=================================================="

# 1. Update system packages
apt-get update -y && apt-get upgrade -y
apt-get install -y curl git ufw ca-certificates gnupg lsb-release

# 2. Check & Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed successfully!"
else
    echo "✅ Docker is already installed."
fi

# 3. Check & Install Docker Compose
if ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose plugin..."
    apt-get install -y docker-compose-plugin
    echo "✅ Docker Compose plugin installed!"
else
    echo "✅ Docker Compose is ready."
fi

# 4. Configure Firewall (UFW)
echo "🔒 Configuring UFW Firewall (allowing SSH 22, HTTP 80, HTTPS 443, Web 3000, API 4000)..."
ufw allow 22/tcp || true
ufw allow 80/tcp || true
ufw allow 443/tcp || true
ufw allow 3000/tcp || true
ufw allow 4000/tcp || true
ufw --force enable || true

echo "=================================================="
echo "🎉 Server Setup Completed! Server is 100% ready."
echo "=================================================="
