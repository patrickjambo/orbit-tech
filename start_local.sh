#!/bin/bash

echo "========================================="
echo "  Starting OrbitTech Local Environment"
echo "========================================="

# 1. Start PostgreSQL Service
echo "[1/4] Starting PostgreSQL Database..."
if command -v systemctl &> /dev/null; then
    sudo systemctl start postgresql
    if [ $? -ne 0 ]; then
        echo "❌ Failed to start PostgreSQL via systemctl. Make sure postgresql is installed."
        exit 1
    fi
    echo "✅ PostgreSQL started successfully."
elif command -v service &> /dev/null; then
    sudo service postgresql start
    if [ $? -ne 0 ]; then
        echo "❌ Failed to start PostgreSQL via service. Make sure postgresql is installed."
        exit 1
    fi
    echo "✅ PostgreSQL started successfully."
else
    echo "⚠️ Warning: systemctl/service not found, assuming database is running or managed manually."
fi

# 2. Check Database Connection & Generate Prisma Client
echo "[2/4] Verifying database connection and generating Prisma client..."
npx prisma generate
npx prisma db push --accept-data-loss
if [ $? -ne 0 ]; then
    echo "❌ Database connection failed Check your .env file or PostgreSQL status."
    exit 1
fi
echo "✅ Database schema completely synced."

# 3. Build the application (Optional, uncomment if you want fresh prod builds every time)
# echo "[3/4] Rebuilding application..."
# rm -rf .next
# npm run build

# 4. Start the Application Server
echo "[4/4] Starting Next.js Production Server..."
PORT=3000 npm run start &
SERVER_PID=$!

echo "========================================="
echo "✅ OrbitTech is running on http://localhost:3000"
echo "   Server PID: $SERVER_PID"
echo "   To stop the server exactly, run: ./stop_local.sh"
echo "========================================="

# Save PID to a file so we can stop it easily later
echo $SERVER_PID > .app_pid

# Wait for process (keeps the terminal process alive to view logs if needed)
wait $SERVER_PID
