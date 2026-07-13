# Deployment Guide

This guide explains how to deploy the **Advanced Nagar Rakshak** application on the web, connect the database, and set up configurations securely without exposing credentials.

---

## 1. Database Setup (MongoDB Atlas)

To run the application in production, you need a hosted MongoDB database. We recommend **MongoDB Atlas** (Free Tier):

1. Sign up/log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Create a new project and build a database (select the free Shared tier).
3. Under **Security -> Database Access**, create a user with read/write access (write down the username and password).
4. Under **Security -> Network Access**, click **Add IP Address** and choose **Allow Access from Anywhere** (`0.0.0.0/0`) so that serverless hosting platforms can connect to it.
5. In the Database deployment dashboard, click **Connect** -> **Drivers** -> Copy the **Connection String** (URI).
   * It looks like: `mongodb+srv://<username>:<password>@cluster0.xxxx.mongodb.net/advanced-nagar-rakshak?retryWrites=true&w=majority`
   * Replace `<username>` and `<password>` with your database user credentials.

---

## 2. Environment Variables & Security

> [!IMPORTANT]
> Do NOT commit `.env` or `.env.local` files to Git. The repository is configured to ignore them.
> You must set these environment variables directly on your hosting provider's dashboard.

Here are the required environment variables for each service:

### Backend Variables
* `NODE_ENV`: Set to `production`.
* `PORT`: Set to `5000` (or let the hosting provider set it dynamically).
* `MONGODB_URI`: The MongoDB Atlas connection string obtained in Step 1.
* `JWT_SECRET`: A long, random string used to sign JWT tokens (e.g., `a_very_secure_random_string_1298419`).
* `JWT_EXPIRES_IN`: Set to `7d` (or desired expiration length).
* `FRONTEND_URL`: The URL of your deployed frontend (e.g., `https://your-app.vercel.app`). You can also include multiple origins separated by commas (e.g., `http://localhost:3000,https://your-app.vercel.app`).

### Frontend Variables
* `NEXT_PUBLIC_API_URL`: The URL of your deployed backend server API endpoint (e.g., `https://your-backend.onrender.com/api`).

---

## 3. Deploying the Backend (API Server)

We recommend deploying the Node.js backend using **Render** or **Railway**:

### Option A: Render (Free Tier available)
1. Log in to [Render](https://render.com).
2. Click **New +** -> **Web Service**.
3. Connect your GitHub repository.
4. Set the following details:
   * **Language**: `Node`
   * **Branch**: `main`
   * **Root Directory**: `backend`
   * **Build Command**: `npm install && npm run build`
   * **Start Command**: `npm start`
5. Under **Environment Variables**, add all the **Backend Variables** listed in Section 2.
6. Click **Deploy Web Service**. Render will build the TypeScript files and start the Express server. Note down your backend URL (e.g., `https://your-backend.onrender.com`).

### Option B: Railway
1. Log in to [Railway](https://railway.app).
2. Click **New Project** -> **Deploy from GitHub repo**.
3. Select your repository.
4. Set **Root Directory** to `backend`.
5. Under **Variables**, add all the **Backend Variables** listed in Section 2.
6. Railway will auto-detect the Node start/build commands and deploy the service.

---

## 4. Deploying the Frontend (Next.js)

We recommend deploying the Next.js frontend using **Vercel** (the creators of Next.js):

1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Connect your GitHub repository.
4. Find the **Root Directory** setting, click Edit, and select the `frontend` folder.
5. Vercel will automatically detect the **Next.js** framework and configure the build settings.
6. Expand the **Environment Variables** section and add:
   * `NEXT_PUBLIC_API_URL` = `https://<your-backend-url>/api` (e.g., `https://your-backend.onrender.com/api`).
7. Click **Deploy**. Vercel will build the frontend, optimize static routes, and publish the site.

---

## 5. Connecting Both Services (Final Step)

Once both backend and frontend are deployed:
1. Copy the URL of your deployed frontend (e.g. `https://advanced-nagar-rakshak.vercel.app`).
2. Go back to your backend deployment settings (Render/Railway).
3. Update the `FRONTEND_URL` environment variable in the backend to match the deployed frontend URL:
   * `FRONTEND_URL` = `https://advanced-nagar-rakshak.vercel.app`
4. Redeploy/Restart the backend service. This updates the CORS policy to allow cross-origin requests from your frontend.
