# PHP MVC REST API – Users List Demo

A lightweight **PHP MVC-based REST API** that serves static GitHub-style user data in JSON format.  
This backend is designed to be consumed by a **Flutter application** and is deployed on **Render using Docker**.

---

## 🚀 Features

- MVC architecture (Controller + Router)
- Clean RESTful endpoints
- No database required (static data)
- JSON API responses
- Apache + PHP 8.2
- Dockerized
- Deployed on Render
- Flutter-friendly (CORS enabled)

---

## 🏗️ Project Architecture
```
php-api/
├── public/
│ ├── index.php # Entry point
│ └── .htaccess # Apache rewrite rules
├── app/
│ ├── core/
│ │ └── Router.php # Custom MVC router
│ ├── controllers/
│ │ └── UserController.php
│ └── data/
│ └── users.php # Static user data
├── Dockerfile
└── README.md
```

---

## 🔧 Prerequisites

### Local Development
- PHP >= 8.0
- Apache
- Git

### Deployment
- GitHub account
- Render account (https://render.com)
- Docker (handled by Render)

---

# Clone the Repository (Local)

Open VS Code Terminal or Command Prompt:

git clone https://github.com/dhinadts/Assignment-Tasks.git
cd Assignment-Tasks/titan_groups

You should now see something like:
```
titan_groups/
├── titan-groups-php-api/
│   ├── public/
│   ├── app/
│   ├── Dockerfile
│   └── README.md
```

👉 Backend lives here:
```
titan_groups/titan-groups-php-api
```
🧪 Step 7: Run Locally
cd public
php -S localhost:8000

Test : http://localhost:8000/api/users

## 2️⃣ Move Into Backend Folder
```
cd titan-groups-php-api
```

## Run Backend Locally
```
cd public
php -S localhost:8000
```
Open browser: ```http://localhost:8000/api/users```

## Step 9: Deploy on Render
```
Push code to GitHub
Go to Render Dashboard
Click New → Web Service
Connect GitHub repo
Environment: Docker
Branch: main
Root Directory: (leave empty if Dockerfile is in root)
Click Deploy
```

## Live API Endpoint
``` GET https://your-app-name.onrender.com/api/users ```


## 📱 Flutter Integration Example
```
final response = await http.get(
  Uri.parse('https://your-app-name.onrender.com/api/users'),
);
```