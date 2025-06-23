# 🚀 MyHealthSync360 Deployment Guide for Coolify

This guide will walk you through deploying MyHealthSync360 on your VPS using Coolify.

## 📋 Prerequisites

Before deploying, ensure you have:

1. **Coolify installed on your VPS** - [Installation Guide](https://coolify.io/docs/installation)
2. **GitHub repository** - Your code pushed to GitHub
3. **Supabase project** - Set up for production
4. **Stripe account** - For payment processing
5. **Domain name** (optional but recommended)

## 🔧 Pre-Deployment Setup

### 1. Environment Variables

You'll need to configure these environment variables in Coolify:

#### **Required Variables:**
```bash
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-production-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_production_service_role_key_here

# Stripe Configuration
STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
STRIPE_SECRET_KEY=sk_live_your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_production_webhook_secret_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_stripe_publishable_key_here
```

#### **Optional Variables:**
```bash
# Security
NEXTAUTH_SECRET=your_super_secret_nextauth_secret_here
JWT_SECRET=your_jwt_secret_here

# Database (if using external database)
DATABASE_URL=postgresql://username:password@host:port/database_name

# Monitoring
NEXT_TELEMETRY_DISABLED=1
```

### 2. Supabase Setup

1. **Create Production Project** in Supabase
2. **Copy your production URL and keys**
3. **Set up authentication** providers
4. **Configure RLS policies** for your tables
5. **Set up storage buckets** if using file uploads

### 3. Stripe Setup

1. **Switch to Live mode** in Stripe Dashboard
2. **Copy your live API keys**
3. **Set up webhooks** pointing to `https://your-domain.com/api/stripe/webhook`
4. **Configure your products** and pricing

## 🚀 Deployment Steps

### Step 1: Create New Application in Coolify

1. **Login to your Coolify dashboard**
2. **Click "New Resource"**
3. **Select "Application"**
4. **Choose "Docker Compose" or "Dockerfile"**

### Step 2: Configure Git Repository

1. **Connect your GitHub repository**
   - Repository: `https://github.com/yourusername/MyHealthSync360`
   - Branch: `main`
   - Build Pack: `Docker`

2. **Set Dockerfile path**
   - Path: `./Dockerfile`

### Step 3: Configure Environment Variables

In Coolify's environment section, add all the variables from the list above:

```bash
# Application
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-domain.com
PORT=3000

# Supabase (replace with your values)
NEXT_PUBLIC_SUPABASE_URL=https://xxxxxxxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe (replace with your live keys)
STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
```

### Step 4: Configure Domain (Optional)

1. **Add your domain** in Coolify
2. **Configure DNS** to point to your VPS IP
3. **Enable SSL** (Coolify handles this automatically)

### Step 5: Deploy

1. **Click "Deploy"** in Coolify
2. **Monitor the build logs**
3. **Wait for deployment to complete**

## 🔍 Post-Deployment Verification

### 1. Health Check

Run the health check to verify everything is working:

```bash
# The app automatically runs health checks
# Check the logs in Coolify to see the results
```

### 2. Test Core Functionality

1. **Visit your domain** - Homepage should load
2. **Test authentication** - Login/Register
3. **Test cart functionality** - Add items to cart
4. **Test payments** - Complete a test purchase
5. **Check Supabase** - Verify data is being saved

### 3. Monitor Logs

In Coolify dashboard:
1. **Check application logs** for errors
2. **Monitor resource usage**
3. **Verify health checks are passing**

## 🛠 Troubleshooting

### Common Issues:

#### **Build Failures**
```bash
# Check if all environment variables are set
# Verify Dockerfile syntax
# Check build logs in Coolify
```

#### **Runtime Errors**
```bash
# Check application logs
# Verify environment variables
# Test Supabase connection
# Check Stripe configuration
```

#### **Database Connection Issues**
```bash
# Verify Supabase URL and keys
# Check RLS policies
# Test connection from your local environment first
```

#### **Payment Issues**
```bash
# Verify Stripe keys are for live mode
# Check webhook configuration
# Test with small amount first
```

## 📊 Monitoring

### Health Checks
- Automatic health checks run every 30 seconds
- Checks application responsiveness
- Verifies environment configuration

### Resource Monitoring
- Monitor CPU and memory usage in Coolify
- Set up alerts for high resource usage
- Scale resources as needed

### Logs
- Application logs available in Coolify dashboard
- Health check logs show system status
- Error logs help with debugging

## 🔧 Maintenance

### Regular Tasks:
1. **Monitor application performance**
2. **Check for security updates**
3. **Backup Supabase data regularly**
4. **Monitor Stripe transactions**
5. **Update environment variables as needed**

### Updates:
1. **Push changes to GitHub**
2. **Coolify will auto-deploy** (if configured)
3. **Or manually trigger deployment**

## 🆘 Support

If you encounter issues:

1. **Check Coolify logs** first
2. **Verify environment variables**
3. **Test locally** with production config
4. **Check Supabase status**
5. **Verify Stripe configuration**

## 🎉 Success!

Once deployed successfully, your MyHealthSync360 app will be:

- ✅ **Running in production mode**
- ✅ **Auto-scaling with demand**
- ✅ **Health monitoring enabled**
- ✅ **SSL certificate configured**
- ✅ **Ready for users**

Remember to:
- **Monitor performance regularly**
- **Keep dependencies updated**
- **Backup data regularly**
- **Monitor user feedback**

---

**Congratulations! Your MyHealthSync360 app is now live! 🚀** 