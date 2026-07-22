#!/bin/bash
export DEBIAN_FRONTEND=noninteractive

echo "=================================================="
echo "🛠 Preparing Server Environment & Installing Docker..."
echo "=================================================="

# 1. Disable UFW Firewall & reset iptables blocking rules
echo "🔓 Disabling UFW firewall and clearing iptables blocking..."
ufw disable || true
iptables -F || true

# 2. Update package lists
apt-get update -y -qq

# 3. Check & Install Docker
if ! command -v docker &> /dev/null; then
    echo "🐳 Installing Docker Engine..."
    curl -fsSL https://get.docker.com | sh
    systemctl enable docker
    systemctl start docker
    echo "✅ Docker installed successfully!"
else
    echo "✅ Docker is already installed."
fi

# 4. Check & Install Docker Compose
if ! docker compose version &> /dev/null; then
    echo "🐳 Installing Docker Compose plugin..."
    apt-get install -y -qq docker-compose-plugin
    echo "✅ Docker Compose plugin installed!"
else
    echo "✅ Docker Compose is ready."
fi

echo "=================================================="
echo "🎉 Server Environment Ready!"
echo "=================================================="
