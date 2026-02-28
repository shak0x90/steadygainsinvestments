#!/bin/bash
# ═══════════════════════════════════════════════════════════
# Steady Gains Investments — VPS Deploy Script
# Server: 107.174.96.136 (RackNerd KVM)
# ═══════════════════════════════════════════════════════════
# Existing sites on this server:
#   shakilahmed.space   → localhost:3005 (Next.js)
#   themoneyman.live    → localhost:3000 (Node)
#
# This app:
#   steadygains.online  → localhost:5008 (backend API)
#                       → /var/www/steadygains/dist (frontend)
# ═══════════════════════════════════════════════════════════

set -e  # Exit immediately if any command fails

APP_DIR="/var/www/steadygains"
BACKEND_PORT=5008
DOMAIN="steadygains.online"
PM2_NAME="steadygains"

echo ""
echo "╔═══════════════════════════════════════════╗"
echo "║   Steady Gains — Deploying to VPS         ║"
echo "╚═══════════════════════════════════════════╝"
echo ""

# ── 0. Install dependencies if not present ──────────────────
if ! command -v node &> /dev/null; then
    echo "📦 Installing Node.js 20..."
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt-get install -y nodejs
fi

if ! command -v pm2 &> /dev/null; then
    echo "📦 Installing PM2..."
    npm install -g pm2
fi

# ── 1. Pull latest code ──────────────────────────────────────
echo "📥 Pulling latest code from GitHub..."
if [ -d "$APP_DIR" ]; then
    cd "$APP_DIR"
    git pull origin devphase2
else
    git clone -b devphase2 https://github.com/shak0x90/steadygainsinvestments.git "$APP_DIR"
    cd "$APP_DIR"
fi

# ── 2. Install frontend dependencies and build ──────────────
echo "🔨 Building frontend..."
npm install
npm run build
echo "✅ Frontend built → $APP_DIR/dist"

# ── 3. Install backend dependencies ─────────────────────────
echo "📦 Installing backend dependencies..."
cd "$APP_DIR/server"
npm install

# ── 4. Run Prisma migrations ─────────────────────────────────
echo "🗄️  Running Prisma migrations..."
npx prisma generate
npx prisma migrate deploy

# ── 5. Create uploads directory ──────────────────────────────
mkdir -p "$APP_DIR/server/public/uploads"
echo "📁 Uploads directory ready"

# ── 6. Start/Restart backend with PM2 ───────────────────────
echo "🚀 Starting backend on port $BACKEND_PORT..."
cd "$APP_DIR/server"
pm2 delete "$PM2_NAME" 2>/dev/null || true
NODE_ENV=production PORT=$BACKEND_PORT pm2 start src/index.js \
    --name "$PM2_NAME" \
    --time
pm2 save
echo "✅ Backend running as PM2 process: $PM2_NAME"

# ── 7. Configure Nginx ───────────────────────────────────────
echo "🌐 Configuring Nginx..."
cat > /etc/nginx/sites-available/steadygains << NGINXCONF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # API — proxy to backend
    location /api/ {
        proxy_pass http://localhost:$BACKEND_PORT;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_cache_bypass \$http_upgrade;
    }

    # Uploads — proxy to backend static files
    location /uploads/ {
        proxy_pass http://localhost:$BACKEND_PORT;
    }

    # Frontend — serve built React app
    location / {
        root $APP_DIR/dist;
        try_files \$uri \$uri/ /index.html;
        expires 1h;
        add_header Cache-Control "public, no-transform";
    }

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";
    add_header Referrer-Policy "no-referrer-when-downgrade";
}
NGINXCONF

# Enable site
ln -sf /etc/nginx/sites-available/steadygains /etc/nginx/sites-enabled/steadygains

# Test and reload nginx
nginx -t && systemctl reload nginx
echo "✅ Nginx configured and reloaded"

# ── 8. Setup SSL with Certbot ────────────────────────────────
echo ""
echo "🔐 Setting up SSL certificate..."
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
fi
certbot --nginx -d "$DOMAIN" -d "www.$DOMAIN" --non-interactive --agree-tos --email admin@$DOMAIN || echo "⚠️  SSL setup failed — run manually: certbot --nginx -d $DOMAIN"

# ── 9. Setup PM2 on system startup ──────────────────────────
pm2 startup systemd -u root --hp /root 2>/dev/null || true
pm2 save

# ── Done! ────────────────────────────────────────────────────
echo ""
echo "╔════════════════════════════════════════════════════════╗"
echo "║   ✅ Deployment Complete!                              ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║   Site:      https://$DOMAIN                  ║"
echo "║   Backend:   localhost:$BACKEND_PORT (internal only)          ║"
echo "║   PM2 name:  $PM2_NAME                              ║"
echo "╠════════════════════════════════════════════════════════╣"
echo "║   Other sites still running:                           ║"
echo "║   shakilahmed.space   → :3005                          ║"
echo "║   themoneyman.live    → :3000                          ║"
echo "╚════════════════════════════════════════════════════════╝"
echo ""
echo "  📋 Useful commands:"
echo "     pm2 logs steadygains    — view live logs"
echo "     pm2 status              — check all processes"
echo "     pm2 restart steadygains — restart the backend"
echo ""
