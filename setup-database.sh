#!/bin/bash
# PostgreSQL Database Setup Script for Git Bash

echo "========================================"
echo "PostgreSQL Database Setup"
echo "========================================"
echo ""

# Check if PostgreSQL is installed
PGBIN="/c/Program Files/PostgreSQL/17/bin"

if [ ! -f "$PGBIN/psql.exe" ]; then
    echo "ERROR: PostgreSQL 17 not found at C:/Program Files/PostgreSQL/17"
    echo "Please install PostgreSQL or update the path in this script."
    exit 1
fi

echo "PostgreSQL 17 found!"
echo ""

echo "Step 1: Creating database 'expensetracker'"
echo "You will be prompted for the PostgreSQL password."
echo ""

"$PGBIN/createdb.exe" -U postgres expensetracker

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "SUCCESS! Database created successfully."
    echo "========================================"
    echo ""
    echo "Next steps:"
    echo "1. Update your .env file with:"
    echo "   DATABASE_URL=\"postgresql://postgres:YOUR_PASSWORD@localhost:5432/expensetracker?schema=public\""
    echo ""
    echo "2. Run: npx prisma db push"
    echo ""
    echo "3. Run: npm run dev"
    echo ""
else
    echo ""
    echo "========================================"
    echo "Database may already exist or password was incorrect."
    echo "========================================"
    echo ""
    echo "Trying to verify if database exists..."
    echo ""
    "$PGBIN/psql.exe" -U postgres -l | grep expensetracker
    
    if [ $? -eq 0 ]; then
        echo "Database 'expensetracker' already exists! You can proceed to next steps."
        echo ""
        echo "Next steps:"
        echo "1. Update your .env file with:"
        echo "   DATABASE_URL=\"postgresql://postgres:YOUR_PASSWORD@localhost:5432/expensetracker?schema=public\""
        echo ""
        echo "2. Run: npx prisma db push"
        echo ""
    else
        echo "Please check your PostgreSQL password and try again."
    fi
fi

echo ""
read -p "Press Enter to continue..."
