#!/bin/bash

echo "========================================="
echo "  Stopping OrbitTech Local Environment"
echo "========================================="

# 1. Stop Next.js Server
if [ -f .app_pid ]; then
    SERVER_PID=$(cat .app_pid)
    echo "[1/2] Stopping Next.js Server (PID: $SERVER_PID)..."
    
    if ps -p $SERVER_PID > /dev/null; then
        kill $SERVER_PID
        echo "✅ Next.js server stopped."
    else
        echo "⚠️ Next.js server is not running on PID $SERVER_PID"
    fi
    # Wait until it actually closes and clean the file
    rm .app_pid
else
    # Fallback to general process killing for Next.js if the file wasn't created
    echo "[1/2] Looking for any stray Next.js processes..."
    pkill -f "next start"
    pkill -f "next dev"
    echo "✅ Checked and cleaned Next.js processes."
fi

# 2. Stop PostgreSQL Database (Optional - usually fine to keep running for other local tasks, but we stop it per specs)
echo "[2/2] Stopping PostgreSQL Database..."
if command -v systemctl &> /dev/null; then
    sudo systemctl stop postgresql
    echo "✅ PostgreSQL stopped successfully."
elif command -v service &> /dev/null; then
    sudo service postgresql stop
    echo "✅ PostgreSQL stopped successfully."
else
    echo "⚠️ Systemctl/service not found. Cannot stop PostgreSQL."
fi

echo "========================================="
echo "✅ Everything has been stopped!"
echo "========================================="
