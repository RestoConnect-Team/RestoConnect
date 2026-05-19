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

## Run backend

```bash
uvicorn app.main:app --reload
```