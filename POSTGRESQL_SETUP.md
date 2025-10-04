# PostgreSQL Local Setup Guide

## ✅ PostgreSQL 17 Detected
Installation Path: `C:/Program Files/PostgreSQL/17`

---

## Step 1: Create Database

Open a new **PowerShell** or **Command Prompt** window and run:

```bash
# Option A: Using createdb (will ask for password)
"C:\Program Files\PostgreSQL\17\bin\createdb.exe" -U postgres expensetracker

# Option B: Using psql
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres
# Then type:
CREATE DATABASE expensetracker;
\q
```

**Note:** You'll be prompted for the PostgreSQL password you set during installation.

---

## Step 2: Find Your PostgreSQL Password

If you forgot your password, you can reset it:

1. Open **pgAdmin 4** (installed with PostgreSQL)
2. Connect to PostgreSQL server
3. Right-click on **postgres** user → Properties → Definition → Enter new password

OR

1. Locate `pg_hba.conf` file at: `C:\Program Files\PostgreSQL\17\data\pg_hba.conf`
2. Change authentication method from `md5` to `trust` temporarily
3. Restart PostgreSQL service
4. Connect and reset password with:
   ```sql
   ALTER USER postgres PASSWORD 'your_new_password';
   ```
5. Change `pg_hba.conf` back to `md5`
6. Restart PostgreSQL service again

---

## Step 3: Update .env File

After creating the database, update your `.env` file with:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/expensetracker?schema=public"
```

Replace `YOUR_PASSWORD` with your actual PostgreSQL password.

---

## Step 4: Verify Database Was Created

```bash
"C:\Program Files\PostgreSQL\17\bin\psql.exe" -U postgres -l
```

You should see `expensetracker` in the list of databases.

---

## Step 5: Run Prisma Migration

After updating `.env`, run in your project directory:

```bash
npx prisma db push
```

This will create all the tables in your database.

---

## Step 6: Verify Tables (Optional)

```bash
npx prisma studio
```

This opens a GUI at http://localhost:5555 to view your database.

---

## Quick Reference Commands

```bash
# Add PostgreSQL to PATH for current session (Git Bash)
export PATH="/c/Program Files/PostgreSQL/17/bin:$PATH"

# List databases
psql -U postgres -l

# Connect to database
psql -U postgres -d expensetracker

# View tables
\dt

# Exit psql
\q
```

---

## Troubleshooting

### Error: "createdb: command not found"
**Solution:** Use full path to createdb.exe:
```bash
"/c/Program Files/PostgreSQL/17/bin/createdb.exe" -U postgres expensetracker
```

### Error: "password authentication failed"
**Solution:** 
1. Check password in pgAdmin
2. Or reset using steps above

### Error: "database already exists"
**Solution:** Database is already created! Skip to Step 3.

### PostgreSQL Service Not Running
**Solution:**
1. Open Services (Win + R → `services.msc`)
2. Find "postgresql-x64-17"
3. Right-click → Start

---

## Current Status

- [x] PostgreSQL 17 installed at `C:/Program Files/PostgreSQL/17`
- [ ] Database `expensetracker` created (follow Step 1 above)
- [ ] `.env` updated with connection string (Step 3)
- [ ] Tables created with `npx prisma db push` (Step 5)

