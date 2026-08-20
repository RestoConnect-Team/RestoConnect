# Backend

## Create virtual environment

```bash
python -m venv venv 
or py -m venv venv
```

## Activate virtual environment

### Linux / macOS

```bash
source venv/bin/activate
```

### Windows

```bash
venv\Scripts\activate
```

## Install dependencies

```bash
pip install -r requirements.txt
```

## PostgreSQL Installation

Before running the backend, make sure that PostgreSQL is installed and running on your machine.

This project uses PostgreSQL as the database system.  
The backend will automatically:

- create the database if it does not exist
- create all tables
- seed the database with initial data

However, PostgreSQL must already be installed locally.

### Install PostgreSQL + pgAdmin4

Download PostgreSQL (includes pgAdmin4):

[Download PostgreSQL](https://www.postgresql.org/download/)

During installation:

- keep the default port: `5432`
- remember the password you set for the `postgres` user

---

## Create a `.env` file

Create a `.env` file at the root of the backend project and add:

```env
DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@localhost:5432/restos_connect
```

## Create required folders

At the root of the project, you must create the following folders before running the application:

```text
/uploads
    /avatars
```

### Create the folders

Linux / macOS (or Git Bash)
```bash
mkdir -p uploads/avatars 
for bash
```

Windows (Command Prompt)
```cmd
mkdir uploads\avatars 
on windows
```

## Run backend

```bash
uvicorn app.main:app --reload
```