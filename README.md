# 🎭 Portfolio Website

A high-performance, full-stack portfolio application featuring real-time content editing, automatic image optimisation, and a premium cinematic UI.

**Built with:** React (Vite) • Express.js • Sharp (Image optimisation) • Mantine UI • Framer Motion

---

## 🚀 Quick Start

### 1. Installation
```bash
git clone https://github.com/pekempy/portfolio.git
cd portfolio
npm install
```

### 2. Environment Setup
Copy `.env.example` to `.env` and fill in your secrets:
```env
PORT=3001
JWT_SECRET=your_secret_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=generate_with_script
```

### 3. Start Developing
```bash
npm run dev
```
*   **Frontend**: `http://localhost:5173`
*   **Backend**: `http://localhost:3001`

---

## ⚙️ Key Features & Config

### 🖼️ Automatic Image optimisation
The server uses **Sharp** to automatically convert all uploads to WebP, resize to 2000px, and compress for instant loading.

### 🔐 Admin Authentication
To generate a secure password hash for your `.env`:
```bash
node generate_hash.js
```

---

## 📦 VPS Deployment (Ubuntu/IONOS)

### 1. Server Prep
```bash
# Update and install dependencies
sudo apt update && sudo apt upgrade -y
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
sudo npm install -g pm2
```

### 2. Deploy & Run
```bash
git clone <repo_url> /var/www/portfolio && cd /var/www/portfolio
npm install
npm run build
pm2 start server.js --name "portfolio"
```

### 3. Reverse Proxy (Caddy)
Add this to your `/etc/caddy/Caddyfile`:
```caddy
yourdomain.com {
    reverse_proxy localhost:3001
}
```

---

## 🔄 Maintenance (Production)

To push updates to your live server:
```bash
ssh <USER>@<IP>
cd /var/www/portfolio
git pull
npm install
npm run build
pm2 restart portfolio
```

### 🖼️ One-time Image Migration
If you have existing images on the server, run this *once* after deploying to convert them all to optimised WebP format:
```bash
node scripts/optimise_images.js
```

---

## 🧪 Testing

```bash
npm test          # Watch mode
npm run test:run  # CI/Single run
```
