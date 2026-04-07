# Deploy AgroGyanGPT

## What changed

- The frontend now talks to the same public host as the backend instead of hardcoded `127.0.0.1`.
- FastAPI now serves the `frontend` folder directly, so one deployed URL can open the full website.
- The main page shell now stretches across the full desktop width instead of stopping around `1240px`.

## Quick deploy on Render

1. Push this project to GitHub.
2. Create a new Render Web Service from that GitHub repo.
3. Render should detect `render.yaml` automatically.
4. After deploy finishes, open your Render URL. It should load `login.html` from the same server.

## Local run

Use:

```powershell
python -m uvicorn backend.main:app --host 0.0.0.0 --port 8000 --reload
```

Then open:

```text
http://127.0.0.1:8000
```

## Important note

This project currently uses the local SQLite file `agrogyan.db`. That is fine for testing and basic demos, but for a serious public deployment you should move to a hosted database like PostgreSQL so user data is not tied to one server disk.
