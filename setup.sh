#!/bin/bash

# VoxForge IDE Setup Script
# This script helps set up the development environment

set -e

echo "🎙️ VoxForge IDE Setup"
echo "====================="
echo ""

# Check Node.js version
echo "Checking Node.js version..."
NODE_VERSION=$(node --version)
echo "✓ Node.js $NODE_VERSION installed"

# Check npm/pnpm
if command -v pnpm &> /dev/null; then
    PNPM_VERSION=$(pnpm --version)
    echo "✓ pnpm $PNPM_VERSION installed (recommended)"
    PKG_MANAGER="pnpm"
elif command -v npm &> /dev/null; then
    NPM_VERSION=$(npm --version)
    echo "✓ npm $NPM_VERSION installed"
    PKG_MANAGER="npm"
else
    echo "❌ No package manager found. Please install npm or pnpm."
    exit 1
fi

echo ""
echo "Installing dependencies..."
$PKG_MANAGER install

echo ""
echo "Building packages..."
cd packages/core && $PKG_MANAGER run build
cd ../voice && $PKG_MANAGER run build
cd ../ai && $PKG_MANAGER run build
cd ../..

echo ""
echo "✅ Setup complete!"
echo ""
echo "Available commands:"
echo "  $PKG_MANAGER run dev          - Start all development servers"
echo "  $PKG_MANAGER run web:dev      - Start web app only"
echo "  $PKG_MANAGER run build        - Build all packages"
echo "  $PKG_MANAGER run test         - Run tests"
echo ""
echo "To start developing, run:"
echo "  $PKG_MANAGER run web:dev"
echo ""
