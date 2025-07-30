# Deploy to Render.com

## Step 1: Prepare Your Repository

1. Make sure your code is pushed to GitHub
2. Ensure you have the following files in your repository:
   - `Dockerfile` ✅
   - `pom.xml` ✅
   - `src/main/resources/application-production.properties` ✅

## Step 2: Deploy to Render.com

1. Go to [render.com](https://render.com) and sign up/login
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure the service:
   - **Name**: `asana-backend-api`
   - **Environment**: `Docker`
   - **Region**: Choose closest to you
   - **Branch**: `main` (or your default branch)
   - **Root Directory**: Leave empty (if your Spring Boot app is in the root)

## Step 3: Add Environment Variables

Add these environment variables in Render:

```
SPRING_PROFILES_ACTIVE=production
JWT_SECRET=your-secret-key-here
BASE_URL=https://your-app-name.onrender.com
```

## Step 4: Create PostgreSQL Database

1. In Render dashboard, click "New +" and select "PostgreSQL"
2. Configure:
   - **Name**: `asana-postgres`
   - **Database**: `asana_db`
   - **User**: `asanauser`
   - **Plan**: Free

## Step 5: Link Database to Web Service

1. Go to your web service settings
2. Add these environment variables (Render will auto-populate them):
   - `SPRING_DATASOURCE_URL` (from database)
   - `SPRING_DATASOURCE_USERNAME` (from database)
   - `SPRING_DATASOURCE_PASSWORD` (from database)

## Step 6: Deploy

1. Click "Create Web Service"
2. Render will build and deploy your application
3. Wait for deployment to complete
4. Your API will be available at: `https://your-app-name.onrender.com`

## Step 7: Update Mobile App

Once deployed, update your mobile app's API URL:

```typescript
// In asana-mobile/src/services/api.ts
const API_BASE_URL = 'https://your-app-name.onrender.com/api';
```

## Benefits of This Approach

✅ **No more tunnel issues** - Your backend is always accessible  
✅ **No more 503 errors** - Stable, hosted backend  
✅ **Production ready** - Proper hosting infrastructure  
✅ **Free tier available** - Render.com offers free hosting  
✅ **Automatic scaling** - Handles traffic spikes  

## Troubleshooting

- If build fails, check the logs in Render dashboard
- Make sure all environment variables are set correctly
- Verify database connection is working
- Check that your JWT secret is properly set 