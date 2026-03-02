# 🚀 Deployment Guide: Render (Backend)

Follow these steps to host your clinical platform backend on Render.

## 1. Create a New Web Service
1. Log in to [Render.com](https://dashboard.render.com).
2. Click **New +** > **Web Service**.
3. Connect your GitHub account and select the **care-coordination-platform-v01** repository.

## 2. Configure Service Settings
When setting up, use these specific configurations:

| Setting | Value |
| :--- | :--- |
| **Name** | `care-clinical-backend` |
| **Environment** | `Node` |
| **Region** | (Select the one closest to you) |
| **Branch** | `main` |
| **Root Directory** | `backend` |
| **Build Command** | `npm install && npm run build` |
| **Start Command** | `npm start` |

## 3. Environment Variables
Click on the **Environment** tab and add the following keys from your local `.env`:

| Key | Value (Example) |
| :--- | :--- |
| `MONGODB_URI` | `mongodb+srv://...` (Your Atlas URL) |
| `JWT_SECRET` | `A_VERY_LONG_RANDOM_STRING` |
| `JWT_EXPIRATION` | `1h` |
| `REFRESH_TOKEN_SECRET` | `ANOTHER_LONG_RANDOM_STRING` |
| `REFRESH_TOKEN_EXPIRATION` | `7d` |
| `NODE_ENV` | `production` |
| `BCRYPT_SALT_ROUNDS` | `10` |
| `INITIAL_ADMIN_EMAIL` | `admin@care.com` |
| `INITIAL_ADMIN_PASSWORD` | `YOUR_SECURE_PASSWORD` |
| `INITIAL_ADMIN_NAME` | `System Admin` |

## 4. IP Whitelisting (CRITICAL)
Since Render's outgoing IP addresses change, you must allow connections from anywhere in MongoDB Atlas:
1. Go to [MongoDB Atlas Dashboard](https://cloud.mongodb.com).
2. Go to **Network Access**.
3. Click **Add IP Address**.
4. Select **Allow Access From Anywhere** (IP `0.0.0.0/0`).
5. Click **Confirm**.

## 5. Deployment Note
Once you click **Create Web Service**, Render will:
1. Pull your code from GitHub.
2. Run `npm run build` (Compiles TypeScript to JavaScript).
3. Run `npm start` (Runs the compiled server).

---

### After Deployment is Finished:
*   Render will give you a URL like `https://care-clinical-backend.onrender.com`.
*   You will need this URL to update your **Frontend** so it can talk to the live backend!
