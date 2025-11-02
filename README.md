***********Weather App

A Full Stack Weather Application built with React (frontend), Node.js + Express (backend), and Firebase Authentication.
It fetches real-time weather and forecast data using the OpenWeatherMap API, supports Celsius/Fahrenheit toggle, and allows Google login for personalized features like Favorites.

 Live Demo

Frontend (Vercel): https://weather-app-three-rouge-13.vercel.app/

Backend (Render): https://weather-app-x9dy.onrender.com

Features

Real-time weather and 5-day forecast
Search for any city worldwide
 Add/remove favorite cities
 Toggle between °C / °F
 Secure Google Authentication via Firebase
 Responsive UI for all devices
 Backend caching for faster results
 Deployed on Vercel (Frontend) & Render (Backend)

 Tech Stack

Frontend:

React.js (Vite or CRA)

Axios for API calls

React Router DOM

Context API for Auth state

Backend:

Node.js

Express.js

Axios

dotenv

CORS

OpenWeatherMap API

Authentication:

Firebase Auth (Google Sign-In)

Hosting:

Frontend → Vercel

Backend → Render

 Setup Instructions
 Clone the repository
git clone https://github.com/yourusername/weather-app.git
cd weather-app

 Install dependencies

Frontend:

cd frontend
npm install


Backend:

cd backend
npm install

 Create .env file in backend
PORT=5000
OPENWEATHER_API_KEY=your_openweather_api_key

 Start backend
npm start

 Start frontend
npm run dev

 Deployment Details
 Backend (Render)

Hosted on: Render

URL Example: https://weather-app-x9dy.onrender.com

Environment Variables:

OPENWEATHER_API_KEY=your_openweather_api_key
PORT=5000

 Frontend (Vercel)

Hosted on: Vercel

URL Example: https://weather-app-client.vercel.app
Environment Variables:

REACT_APP_API_BASE_URL=https://weather-app-x9dy.onrender.com

 Firebase Setup

Go to Firebase Console

Create a new project → Add a Web App

Enable Google Authentication under Authentication > Sign-in method

Add your domain under Authentication > Settings > Authorized domains

Example: weather-app-client.vercel.app

Use your Firebase config in /src/firebase.js

 Folder Structure
weather-app/
│
├── backend/
│   ├── server.js
│   ├── package.json
│   └── .env
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── firebase.js
│   │   └── App.js
│   ├── public/
│   └── package.json
│
└── README.md

 API Routes
 Current Weather
GET /api/weather/:city?unit=metric|imperial

 Forecast
GET /api/forecast/:city?unit=metric|imperial
 Example API Response
{
  "name": "London",
  "weather": [{ "main": "Clouds", "description": "broken clouds" }],
  "main": { "temp": 15.2, "humidity": 80 },
  "wind": { "speed": 3.4 }
}


Troubleshooting
IssueCauseFix“Weather fetch failed”Invalid or missing API keyCheck .env on Render“Sign in with Google” popup closes instantlyDomain not added in FirebaseAdd your Vercel domain in Firebase Authorized Domains“CORS error”Backend not allowing frontendCheck CORS origin setting in server.js“Loading...” on DashboardAPI not reachableConfirm REACT_APP_API_BASE_URL points to Render backend

👩‍💻 Author
Aakanksha Chaudhari
MCA Student | Aspiring Full Stack Developer
📧 aakankshac773@gmail.com




