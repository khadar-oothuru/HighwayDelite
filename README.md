# HighwayDelite

A full-stack web application for note management, built with a React + Vite frontend and a Node.js (TypeScript) backend.

---


## Demo Links

- **Frontend Demo:** [https://highway-delite-iota.vercel.app](https://highway-delite-iota.vercel.app)
- **Backend Demo:** [https://highway-delite-backend.vercel.app](https://highway-delite-backend.vercel.app)

---

## Project Structure

```
HighwayDelite/
├── frontend/   # React + Vite frontend
└── server/     # Node.js (TypeScript) backend
```

---

## Frontend Setup (`frontend/`)

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn

### Installation
```bash
cd frontend
npm install
# or
yarn install
```

### Environment Variables
Create a `.env` file in the `frontend/` directory:
```
VITE_API_BASE_URL=https://highway-delite-backend.vercel.app/api
```

### Running Locally
```bash
npm run dev
# or
yarn dev
```

The app will be available at [http://localhost:5173](http://localhost:5173) by default.

---

## Backend Setup (`server/`)

### Prerequisites
- Node.js (v16+ recommended)
- npm or yarn
- MongoDB (local or cloud, e.g., MongoDB Atlas)

### Installation
```bash
cd server
npm install
# or
yarn install
```


### Environment Variables
Create a `.env` file in the `server/` directory with the following:
```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
SMTP_HOST=your_smtp_host
SMTP_PORT=your_smtp_port
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SMTP_FROM=your_email_address
CLIENT_URL=https://highway-delite-iota.vercel.app
```

### Running Locally
```bash
npx ts-node server.ts
# or
npm run dev
# or
yarn dev
```

The backend will run at [http://localhost:5000/api](http://localhost:5000/api) by default.

---

## Features
- User authentication (OTP-based signup/login)
- Note creation, update, deletion
- Secure API with JWT authentication
- Responsive UI

---

## License
MIT
