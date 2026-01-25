# Portfolio Website

This is a full-stack portfolio application built with **React (Vite)** on the frontend and **Express (Node.js)** on the backend.

## Prerequisites

- Node.js (v18 or higher recommended)
- npm

## Installation

1. Clone the repository (if you haven't already).
2. Install dependencies:
   ```bash
   npm install
   ```

## Configuration

Create a `.env` file in the root directory to configure the application. You can use the following template:

```env
PORT=3001
NODE_ENV=development
JWT_SECRET=your_super_secret_jwt_key
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=your_bcrypt_password_hash
```

### Generating the Admin Password Hash

The application uses bcrypt to secure the admin password. To generate a hash for your desired password, run the utility script:

```bash
node generate_hash.js
```

1. Enter your desired password when prompted.
2. Copy the output hash.
3. Paste it into your `.env` file as the value for `ADMIN_PASSWORD_HASH`.

## Running Locally

To start the development environment, which includes both the backend API and the frontend dev server:

```bash
npm run dev
```

- **Frontend**: http://localhost:5173 (standard Vite port, or check terminal output)
- **Backend**: http://localhost:3001

The `dev` command uses `concurrently` to run both services simultaneously.

## Building for Production

To build the application for deployment:

1. Compile the TypeScript code and build the React frontend:
   ```bash
   npm run build
   ```
   This will create a `dist` directory with the static assets.

## Running in Production

After building the project, you can start the production server. The backend is configured to serve the static frontend files from the `dist` folder.

1. Ensure the `NODE_ENV` is set to `production` in your `.env` file (optional but recommended).
2. Start the server:
   ```bash
   npm run server
   ```
   *Or directly via Node:*
   ```bash
   node server.js
   ```

The application will be available at `http://localhost:3001`.

## DigitalOcean Droplet Deployment

### 1. Create and Connect to your Droplet
1. Create a new **Ubuntu** Droplet on DigitalOcean.
2. SSH into your droplet: `ssh root@your_droplet_ip`

### 2. Initial Server Setup
```bash
sudo apt update && sudo apt upgrade -y

# Use nvm to manage nodejs version
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc
nvm install 20 

npm install pm2 -g
sudo apt install git -y
```

### 3. Clone and Secure the App
```bash
# if on Github 
git clone https://github.com/pekempy/portfolio.git /var/www/portfolio
# scp to ssh copy (from your host machine)
scp -r /path/to/your-repo root@your_droplet_ip:/var/www/portfolio

cd /var/www/portfolio

npm install
npm run build

cp .env.example .env 
nano .env 
```

### 4. Process Management (PM2)
Start the app and ensure it survives reboots:
```bash
pm2 start server.js --name "portfolio"
pm2 save
pm2 startup 
```

### 5. Reverse Proxy (Caddy)
Caddy reverse proxy for automatic https and reverse proxying.

1. **Install Caddy**:
   Follow the [official instructions](https://caddyserver.com/docs/install#debian-ubuntu-raspbian) for Ubuntu.

2. **Configure Caddyfile**:
   ```bash
   sudo nano /etc/caddy/Caddyfile
   ```
   Replace the content with (updating for your domain):
   ```caddy
   yourdomain.com {
       reverse_proxy localhost:3001
   }
   ```

3. **Restart Caddy**:
   ```bash
   sudo systemctl restart caddy
   ```

### 6. Firewall (UFW)
```bash
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw allow OpenSSH
sudo ufw enable
```

## Running Tests

The project uses **Vitest** for unit and integration testing.

- Run tests once:
  ```bash
  npm run test:run
  ```
- Run tests in watch mode:
  ```bash
  npm test
  ```
