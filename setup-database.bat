@echo off
REM PostgreSQL Database Setup Script for Windows
REM This script helps you create the expensetracker database

echo ========================================
echo PostgreSQL Database Setup
echo ========================================
echo.

REM Check if PostgreSQL is installed
if not exist "C:\Program Files\PostgreSQL\17\bin\psql.exe" (
    echo ERROR: PostgreSQL 17 not found at C:\Program Files\PostgreSQL\17
    echo Please install PostgreSQL or update the path in this script.
    pause
    exit /b 1
)

echo PostgreSQL 17 found!
echo.

REM Set PostgreSQL bin path
set PGBIN=C:\Program Files\PostgreSQL\17\bin

echo Step 1: Creating database 'expensetracker'
echo You will be prompted for the PostgreSQL password.
echo.

"%PGBIN%\createdb.exe" -U postgres expensetracker

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ========================================
    echo SUCCESS! Database created successfully.
    echo ========================================
    echo.
    echo Next steps:
    echo 1. Update your .env file with:
    echo    DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/expensetracker?schema=public"
    echo.
    echo 2. Run: npx prisma db push
    echo.
    echo 3. Run: npm run dev
    echo.
) else (
    echo.
    echo ========================================
    echo Database may already exist or password was incorrect.
    echo ========================================
    echo.
    echo Trying to verify if database exists...
    echo.
    "%PGBIN%\psql.exe" -U postgres -l | findstr expensetracker
    
    if %ERRORLEVEL% EQU 0 (
        echo Database 'expensetracker' already exists! You can proceed to next steps.
        echo.
        echo Next steps:
        echo 1. Update your .env file with:
        echo    DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/expensetracker?schema=public"
        echo.
        echo 2. Run: npx prisma db push
        echo.
    ) else (
        echo Please check your PostgreSQL password and try again.
    )
)

echo.
pause
