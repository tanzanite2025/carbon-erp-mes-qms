#!/usr/bin/env bash
# Simple development startup script for Carbon
# Usage: ./dev.sh

set -e

echo "========================================="
echo "  Carbon ERP/MES Development Startup"
echo "========================================="
echo ""

# Get the script directory
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Add crbn to PATH for this session
export PATH="$SCRIPT_DIR/packages/dev/bin:$PATH"

# Check if crbn is available
if ! command -v crbn &> /dev/null; then
    echo "Error: crbn command not found"
    echo "PATH: $PATH"
    exit 1
fi

echo "Starting Carbon development environment..."
echo ""
echo "This will:"
echo "  1. Start Docker containers (PostgreSQL, Redis, Supabase, etc.)"
echo "  2. Run database migrations"
echo "  3. Generate type definitions"
echo "  4. Start the selected application(s)"
echo ""

# Run crbn up with --no-portless flag
crbn up --no-portless
