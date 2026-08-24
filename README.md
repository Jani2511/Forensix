# FORENSIX v0.2

This version adds the first interactive Case 001 scene and a backend location for hidden solution data.

## Frontend
cd frontend
npm install
npm run dev

## Backend
cd backend
python -m venv .venv
Windows: .venv\\Scripts\\activate
macOS/Linux: source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

## IMPORTANT SECURITY
The case solution is intentionally NOT placed in React. Keep it on the backend.
Before deployment set FORENSIX_ADMIN_KEY to a long random secret. Never put it in frontend code or GitHub.
