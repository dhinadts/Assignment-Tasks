
## **1. Backend Deployment on Render**

### **Step 1: Prepare Your Backend**

Make sure your Node.js backend is ready for deployment:

1.  Ensure `package.json` has:
    
    `"scripts":  {  "start":  "node index.js"  }` 
    
    Replace `index.js` with your main server file.
    
2.  Install dependencies:
    
    `npm install` 
    
3.  Use environment variables for sensitive data:
    
    -   Database URL
       
        
4.  Example `.env`:
    
    `DATABASE_URL=postgres://username:password@hostname:5432/dbname PORT=5000  JWT_SECRET=your_secret_key` 
    

----------

### **Step 2: Create PostgreSQL Database on Render**

1.  Go to [Render](https://render.com).
    
2.  Click **New → PostgreSQL Database**.
    
3.  Choose a name, region, and plan (free tier available).
    
4.  Copy the database credentials (host, database, user, password, port).
    

----------

### **Step 3: Deploy Backend on Render**

1.  Go to **New → Web Service**.
    
2.  Connect your GitHub repo with your backend code.
    
3.  Configure:
    
    -   **Environment**: Node
        
    -   **Build Command**: `npm install`
        
    -   **Start Command**: `npm start`
        
    -   **Environment Variables**: Add variables from `.env`
        
4.  Click **Create Web Service**.
    

✅ Render will automatically build and deploy your backend. You’ll get a public URL like:

`https://your-backend.onrender.com` 

----------

## **2. Frontend Deployment on Vercel**

### **Step 1: Prepare React App**

1.  Ensure your React app uses the **backend URL** from Render.
    
    `// Example: api.js  export  const  API_URL = "https://your-backend.onrender.com";` 
    
2.  Make sure `package.json` has:
    
    `"scripts":  {  "start":  "react-scripts start",  "build":  "react-scripts build"  }` 
    

----------

### **Step 2: Deploy on Vercel**

1.  Go to [Vercel](https://vercel.com/).
    
2.  Click **New Project → Import Git Repository**.
    
3.  Select your React app repository.
    
4.  Configure:
    
    -   **Framework**: React
        
    -   **Build Command**: `npm run build`
        
    -   **Output Directory**: `build`
        
5.  Add environment variable if needed (e.g., `REACT_APP_API_URL` pointing to your Render backend).
    

✅ Vercel will deploy your frontend and give you a URL like:

`https://your-frontend.vercel.app` 

----------

## **3. Connect Frontend & Backend**

-   Make sure all API requests in your React app point to the Render backend URL.
    
-   Example in React with Axios:
    
    ``import axios from  "axios"; import { API_URL } from  "./api"; export  const  fetchTickets = async () => { const response = await axios.get(`${API_URL}/tickets`); return response.data;
    };`` 
    

----------
