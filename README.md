# 🏎️ Team Expense Tracker

A full-stack web application built for student vehicle development teams (BAJA, Go-Kart, Formula) to manage bills, track team contributions, and upload invoices directly to cloud storage.

## 🛑 Phase 0: System Setup (For a fresh laptop)

If you are running this on a brand new laptop, you must install these three core technologies before doing anything else.

1. **Install a Code Editor (VS Code):**
   * Download and install from: https://code.visualstudio.com/
2. **Install Node.js (For the Frontend):**
   * Download the **LTS (Long Term Support)** version from: https://nodejs.org/
   * Install it with all the default settings.
3. **Install Python (For the Backend) - ⚠️ CRITICAL STEP:**
   * Download Python (3.10 or higher) from: https://www.python.org/downloads/
   * **STOP when the installer opens!** At the very bottom of the first installation screen, you MUST check the box that says **"Add Python to PATH"** before clicking Install. If you miss this, the backend will not work.

Once those are installed, restart your computer to ensure all system paths are updated.

---

## ⚙️ Phase 1: Backend Setup (FastAPI)

1. Open **VS Code**.
2. Go to `File > Open Folder` and select the unzipped `BillTracker` folder.
3. Open a new terminal inside VS Code (`Terminal > New Terminal`).
4. Navigate into the backend folder:
   ```bash
   cd backend
   ```
5. Create a virtual environment to isolate the Python packages:
   ```bash
   python -m venv venv
   ```
6. Activate the virtual environment:
   * Windows: `venv\Scripts\activate`
   * Mac/Linux: `source venv/bin/activate`

   (You should see `(venv)` appear at the start of your terminal line).

7. Install the required backend dependencies:
   ```bash
   pip install fastapi uvicorn sqlalchemy pydantic pyjwt passlib bcrypt
   ```
8. Start the FastAPI server:
   ```bash
   uvicorn app.main:app --reload
   ```

The backend is now running at `http://127.0.0.1:8000`

## 🎨 Phase 2: Frontend Setup (React + Vite)

1. Leave the backend terminal running. Open a SECOND terminal window in VS Code (click the `+` icon in the terminal panel).
2. Navigate into the frontend folder:
   ```bash
   cd frontend
   ```
3. Install all the necessary Node packages (Tailwind, React Query, Axios, etc.):
   ```bash
   npm install
   ```
4. Start the frontend development server:
   ```bash
   npm run dev
   ```

The frontend is now running at `http://localhost:5173`

## 🚀 Phase 3: First-Time Login & Database Seeding

Because the SQLite database is completely fresh, you need to create your first Admin/Captain account to bypass the login screen.

1. Open your browser and go to the backend API documentation:
   👉 http://localhost:8000/docs

2. Scroll down to the green `POST /seed-admin` endpoint.

3. Click on the row to expand it, click the "Try it out" button, and then click the large blue "Execute" button. This injects the test user into your local database.

4. Now, open the actual application:
   👉 http://localhost:5173

5. Log in with the newly created credentials:
   * Email: `captain@bajateam.com`
   * Password: `password123`

You are now authenticated and ready to upload bills!
