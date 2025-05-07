# Deployment Manual for CS691 Spring 2025 Team 2 Project

## Prerequisites

Ensure you have the following installed:

* **Node.js** (v18+)
* **npm** or **yarn**
* **MongoDB** (local or cloud instance like MongoDB Atlas)
* **Git**
* **Docker** (Optional, for containerized deployment)

## 1. Clone the Repository

```bash
# Clone the repository from GitHub
git clone https://github.com/Kaleemunnisa/CS691-Spring2025-Team2.git
cd CS691-Spring2025-Team2
```

## 2. Setup Backend

### Install Dependencies

```bash
cd backend
npm install
```

### Environment Variables

Create a `.env` file in the **backend/** directory with the following content:

```
PORT=5000
MONGODB_URI=<Your MongoDB Connection String>
JWT_SECRET=<Your JWT Secret>
AI_API_KEY=<Your AI API Key>
UPLOAD_DIR=uploads
```

* Replace `<Your MongoDB Connection String>` with your MongoDB URI.
* Replace `<Your JWT Secret>` with a secure JWT secret.
* Replace `<Your AI API Key>` with the required AI service key if needed.

### Run Backend Server

```bash
npm start
```

The backend server should now be running at **[http://localhost:5000](http://localhost:5000)**.

## 3. Setup Frontend (if available)

### Install Dependencies

```bash
cd ../frontend
npm install
```

### Environment Variables

Create a `.env` file in the **frontend/** directory with the following content:

```
REACT_APP_BACKEND_URL=http://localhost:5000
```

### Run Frontend Server

```bash
npm start
```

The frontend server should now be running at **[http://localhost:3000](http://localhost:3000)**.

## 4. Database Setup (MongoDB)

Ensure your MongoDB database is running and accessible via the URI provided in the backend `.env` file. Use MongoDB Atlas for a cloud setup or a local instance if preferred.

## 5. Testing

Run the following command to test the backend functionality:

```bash
npm test
```

## 6. Docker (Optional)

To run the application in Docker:

### Build Docker Image

```bash
docker-compose build
```

### Run Docker Container

```bash
docker-compose up
```

## 7. Deployment

For production deployment, consider using platforms like **AWS**, **Heroku**, or **Vercel** for the frontend. Ensure you adjust your environment variables accordingly.

## 8. Troubleshooting

* Ensure all environment variables are correctly set.
* Check MongoDB connection if facing database errors.
* Verify API keys for AI integration if applicable.

## 9. Future Improvements

* Implement CI/CD pipelines.
* Set up logging and monitoring for production.
* Add automated tests for controllers and models.

## 10. Additional Resources

* [Node.js Documentation](https://nodejs.org/en/docs/)
* [MongoDB Documentation](https://docs.mongodb.com/)
* [React Documentation](https://reactjs.org/docs/getting-started.html)
