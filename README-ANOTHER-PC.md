# Student Resources Hub - Run on Another Windows PC

This project is prepared so a new Windows PC can be set up with two clicks after Node.js is installed.

## 1. Install Node.js

Install the current Node.js LTS release on the other PC, then restart the terminal if necessary.

## 2. Copy the project

Extract the complete project folder. Do not copy only `frontend` because the backend is required for login, resources, bookmarks, admin features and AI APIs.

## 3. First-time setup

Double-click:

`setup.bat`

This installs dependencies and creates:

- `backend/.env`
- `frontend/.env.local`

## 4. Configure backend/.env

Open `backend/.env` and replace the placeholder values:

- `MONGO_URI` - MongoDB Atlas connection string
- `JWT_SECRET` - a private random secret
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `GEMINI_API_KEY` - needed for AI features

`PORT=5000` can normally stay unchanged.

## 5. Start everything

Double-click:

`START.bat`

It opens two terminal windows:

- Backend: `http://localhost:5000`
- Frontend: `http://localhost:5173`

Open `http://localhost:5173` in the browser.

## Important

The application uses online services for data/storage:

- MongoDB Atlas for database data
- Cloudinary for uploaded files
- Google Gemini for AI features

So the other PC needs internet access and valid credentials in `backend/.env`.

Never upload `backend/.env` to GitHub or share it publicly.
