# Deploying Frontend to Vercel (Free Tier)

## 1. Push Your Code to GitHub
- Make sure your frontend code is in a GitHub repository.

## 2. Create a Vercel Account
- Go to https://vercel.com/ and sign up (use GitHub for easy integration).

## 3. Create a New Project
- Click "New Project" and import your frontend repo from GitHub.

## 4. Configure Environment Variables
- In the Vercel dashboard, go to your project settings → "Environment Variables".
- Add:
  - **Name:** `VITE_API_URL`
  - **Value:** `https://your-backend.onrender.com/api`
  - (Replace with your actual Render backend URL after deployment.)

## 5. Deploy
- Click "Deploy" to build and deploy your frontend.
- Vercel will give you a public URL (e.g., `https://your-frontend.vercel.app`).

## 6. Update Google OAuth
- In the Google Cloud Console, add your Vercel frontend URL to "Authorized JavaScript origins":
  ```
  https://your-frontend.vercel.app
  ```

## 7. Test
- Visit your Vercel frontend URL and test the login flow and app functionality!
