# JustFour — AWS Deployment Guide

**Stack**: EC2 t4g.micro + Docker Compose + Caddy (auto-HTTPS)
**Estimated cost**: ~$6–8/month (or free for 12 months on t2.micro free tier)
**No ALB, no Nginx, no manual cert management.**

---

## Architecture

```
Internet
   │  443 / 80
   ▼
EC2 instance (public IP)
   │
 Caddy  ──── auto TLS via Let's Encrypt
   │
   │  :3000 (internal)
   ▼
Next.js app (Docker)
   │
   ├── Supabase (hosted, external)
   └── Anthropic API (external)
```

---

## Cost Breakdown

| Resource | Cost |
|---|---|
| EC2 t4g.micro (ARM, 2 vCPU, 1 GB RAM) | ~$6.05/month |
| EC2 t2.micro — **free tier (first 12 months)** | $0 |
| Elastic IP (free while instance is running) | $0 |
| EBS storage 20 GB gp3 | ~$1.60/month |
| Data transfer (20 users, light) | ~$0.10/month |
| **Total (after free tier)** | **~$8/month** |

> For 20 validation users, a t4g.micro is more than enough. It handles ~50 concurrent connections comfortably.

---

## Prerequisites

- AWS account with EC2 access
- A domain name pointed to your EC2 IP (required for HTTPS / magic links)
- Your `.env.local` values ready

---

## Step 1 — Launch EC2 Instance

1. Go to **EC2 → Launch Instance**
2. **Name**: `justfour-prod`
3. **AMI**: Ubuntu 24.04 LTS (free tier eligible, ARM for t4g)
4. **Instance type**:
   - Free tier: `t2.micro` (x86)
   - Cheapest paid: `t4g.micro` (ARM — pick ARM AMI if using this)
5. **Key pair**: Create new → download `.pem` file → save it safely
6. **Security group** — create new with these inbound rules:

   | Type | Port | Source |
   |------|------|--------|
   | SSH | 22 | My IP |
   | HTTP | 80 | 0.0.0.0/0 |
   | HTTPS | 443 | 0.0.0.0/0 |

7. **Storage**: 20 GB gp3 (change from default 8 GB)
8. Click **Launch Instance**

---

## Step 2 — Assign Elastic IP

1. Go to **EC2 → Elastic IPs → Allocate Elastic IP address**
2. Click **Allocate**
3. Select the new IP → **Actions → Associate Elastic IP**
4. Associate it with your `justfour-prod` instance
5. Note the IP address — you'll need it for DNS

---

## Step 3 — Point Your Domain to the Instance

In your domain registrar's DNS settings, add:

```
A    @      <your-elastic-ip>    TTL 300
A    www    <your-elastic-ip>    TTL 300
```

Wait 5–10 minutes for DNS to propagate before running Caddy (it needs DNS to be live for Let's Encrypt).

---

## Step 4 — SSH into the Instance

```bash
chmod 400 your-key.pem
ssh -i your-key.pem ubuntu@<your-elastic-ip>
```

---

## Step 5 — Install Docker

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker ubuntu

# Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# Reload group membership (or log out and back in)
newgrp docker

# Verify
docker --version
docker compose version
```

---

## Step 6 — Clone the Repo

```bash
# Install git
sudo apt install -y git

# Clone your repo (use HTTPS or SSH)
git clone https://github.com/YOUR_USERNAME/justfour.git
cd justfour
```

If your repo is private, use a [GitHub personal access token](https://github.com/settings/tokens):
```bash
git clone https://YOUR_TOKEN@github.com/YOUR_USERNAME/justfour.git
```

---

## Step 7 — Configure Environment Variables

```bash
# Copy the example and fill in real values
cp .env.local .env.production

nano .env.production
```

Fill in all values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_...
SUPABASE_SERVICE_ROLE_KEY=eyJ...
ANTHROPIC_API_KEY=sk-ant-api03-...
RESEND_API_KEY=re_...
DATABASE_URL=postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
NEXT_PUBLIC_APP_URL=https://justfour.ai
```

> **Important**: `NEXT_PUBLIC_APP_URL` must be your real domain with `https://` — Supabase uses it for magic link redirects.

---

## Step 8 — Configure Caddy

Edit the `Caddyfile` to replace the placeholder domain:

```bash
nano Caddyfile
```

Change `justfour.ai` and `www.justfour.ai` to your actual domain:

```
justfour.ai {
    ...
}

www.justfour.ai {
    redir https://justfour.ai{uri} permanent
}
```

---

## Step 9 — Update Supabase Auth Settings

In **Supabase Dashboard → Authentication → URL Configuration**:

1. **Site URL**: `https://justfour.ai`
2. **Redirect URLs**: Add `https://justfour.ai/auth/callback`

---

## Step 10 — Build and Start

```bash
# Load env vars and start everything
docker compose --env-file .env.production up -d --build

# Watch logs
docker compose logs -f
```

Caddy will automatically:
- Request a TLS certificate from Let's Encrypt
- Start serving HTTPS on port 443
- Redirect HTTP → HTTPS

First deploy takes 3–5 minutes to build the Next.js image.

**Verify it's running:**
```bash
docker compose ps
# Both 'justfour_app' and 'justfour_caddy' should show 'healthy'

curl https://justfour.ai/healthz
# Should return 200 ok
```

---

## Deploying Updates

```bash
# On the EC2 instance, inside the repo directory
git pull

docker compose --env-file .env.production up -d --build

# Old container stops, new one starts — ~30 second downtime
```

For zero-downtime deploys, see the advanced section below.

---

## Useful Commands

```bash
# View live logs
docker compose logs -f app

# View Caddy logs (TLS cert status, access logs)
docker compose logs -f caddy

# Restart just the app (without rebuilding)
docker compose restart app

# Stop everything
docker compose down

# Stop and remove volumes (WARNING: deletes TLS certs — Caddy will re-request on next start)
docker compose down -v

# Check container resource usage
docker stats
```

---

## Monitoring & Alerts (Minimal Setup)

For 20 users, AWS CloudWatch basic metrics are free and sufficient:

1. **EC2 Console → Monitoring** — CPU, network, disk
2. Set a CloudWatch alarm: **EC2 → Actions → Monitor and Troubleshoot → Manage CloudWatch Alarms**
   - Metric: CPUUtilization
   - Threshold: > 80% for 5 minutes
   - Action: Send email via SNS

---

## Cost Optimisation Tips

| Tip | Saving |
|-----|--------|
| Use t4g.micro (ARM) over t2.micro after free tier | ~15% cheaper |
| Stop instance when not needed (dev/staging) | $0 while stopped (EBS still billed) |
| Use gp3 storage instead of gp2 | ~20% cheaper |
| Reserve instance for 1 year (after validation) | ~40% cheaper |

---

## Advanced: Zero-Downtime Deploys (Optional)

For updates without the ~30s restart gap:

```bash
# Build new image without stopping current
docker compose --env-file .env.production build app

# Swap to new image
docker compose --env-file .env.production up -d --no-deps app
```

Caddy keeps serving during the app container swap and reconnects automatically.

---

## Troubleshooting

**Caddy shows "certificate obtain error"**
- DNS hasn't propagated yet — wait 10 minutes and restart Caddy: `docker compose restart caddy`
- Port 80 must be open in security group (Let's Encrypt uses HTTP-01 challenge)

**App container unhealthy**
```bash
docker compose logs app  # Check for startup errors
# Common cause: missing env var
```

**Magic link redirects to wrong URL**
- Check `NEXT_PUBLIC_APP_URL` in `.env.production` matches your domain exactly
- Check Supabase Dashboard → Auth → Redirect URLs includes `https://justfour.ai/auth/callback`

**Out of memory (t4g.micro has 1 GB)**
```bash
# Add swap space
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

**SSH locked out (lost key)**
- Use EC2 Instance Connect in the AWS console (Ubuntu AMIs support this)
- Or stop instance → detach root volume → attach to another instance → fix → reattach
