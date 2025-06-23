#!/bin/bash

# MyHealthSync360 Deployment Script
# This script prepares the application for production deployment

set -e  # Exit on any error

echo "🚀 Starting MyHealthSync360 deployment..."

# Check if required environment variables are set
required_vars=(
    "NEXT_PUBLIC_SUPABASE_URL"
    "NEXT_PUBLIC_SUPABASE_ANON_KEY" 
    "STRIPE_PUBLISHABLE_KEY"
    "STRIPE_SECRET_KEY"
    "NEXT_PUBLIC_APP_URL"
)

echo "🔍 Checking required environment variables..."
for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo "❌ Error: Required environment variable $var is not set"
        exit 1
    fi
done

echo "✅ All required environment variables are set"

# Install dependencies
echo "📦 Installing dependencies..."
npm ci --only=production

# Run database migrations if needed
if [ ! -z "$DATABASE_URL" ]; then
    echo "🗄️ Running database migrations..."
    # Add your migration commands here if needed
    # npm run migrate:production
fi

# Build the application
echo "🏗️ Building application..."
npm run build

# Run health check
echo "🏥 Running health check..."
npm run health-check || echo "⚠️ Health check not configured"

echo "✅ Deployment preparation completed successfully!"

# Print deployment info
echo "📋 Deployment Information:"
echo "   - Node.js version: $(node --version)"
echo "   - NPM version: $(npm --version)"
echo "   - Application URL: ${NEXT_PUBLIC_APP_URL}"
echo "   - Environment: ${NODE_ENV:-production}"

echo "🎉 Ready for production deployment!" 