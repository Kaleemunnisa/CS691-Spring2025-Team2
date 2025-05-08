# Deployment Manual for CS691 Spring 2025 Team 2 Project – VogueMind

This deployment manual provides developers with detailed instructions to deploy and set up the application in a production environment. 

---

## 1. Prerequisites

Ensure the following software is installed:

- **Node.js** (v18 or later)
- **npm** (Node Package Manager)
- **MongoDB Atlas** account (or a local MongoDB instance)
- **Git**
- **AWS account with S3 and IAM access**
- **Google Cloud account with Vision API enabled**

---

## 2. Clone the Repository

```bash
git clone https://github.com/Kaleemunnisa/CS691-Spring2025-Team2.git
cd CS691-Spring2025-Team2
```

---

## 3. Backend Setup

### 3.1 Install Backend Dependencies

```bash
cd backend
npm install
```

---

### 3.2 Configure Environment Variables

Create a `.env` file inside the `backend/` directory with the following content:

```env
MONGO_URI=your_mongodb_url
PORT=8000
WEATHER_API_KEY=your_weather_api_key
GOOGLE_APPLICATION_CREDENTIALS=your_path_to_google_cloud_json
JWT_SECRET=your_super_secret_key
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```
---

### 3.3 Google Cloud Vision API Setup

1. In **Google Cloud Console**:
   - Enable **Cloud Vision API**.
   - Create a **service account key** with access to Vision API.
   - Download the credentials JSON file.

2. Save the credentials JSON as `google_cloud_api.json` inside the `backend/` directory.

3. Confirm that `.env` points to this file:

```env
GOOGLE_APPLICATION_CREDENTIALS=google_cloud_api.json
```
---

### 3.4 AWS S3 Configuration

1. Create an S3 bucket named `vougemind-images` in the region `us-east-1`.

2. Create an **IAM user** with programmatic access and assign permissions:
   - `s3:PutObject`
   - `s3:GetObject`
   - `s3:ListBucket`

3. Add the AWS credentials to `.env`:

```env
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_BUCKET_NAME=your_bucket_name
AWS_REGION=your_region
```
---

### 3.5 Run Backend Server

```bash
npm start
```

Backend will run at: [http://localhost:8000](http://localhost:8000)

---

## 4. Frontend Setup

### 4.1 Install Frontend Dependencies

```bash
cd ../frontend
npm install
```

---

### 4.2 Configure Frontend Environment Variables

Create a `.env` file inside the `frontend/` directory:

```env
REACT_APP_BACKEND_URL=http://localhost:8000
```

---

### 4.3 Run Frontend Server

```bash
npm start
```

Frontend will be available at: [http://localhost:3000](http://localhost:3000)

---

## 5. Database Setup (MongoDB Atlas)

The app uses **MongoDB Atlas** with the URI specified in `MONGO_URI`.  
No manual schema creation is required; collections will auto-generate.

---

## 6. Troubleshooting

| Issue                       | Solution                                      |
|----------------------------|----------------------------------------------|
| Backend can't access MongoDB | Check MongoDB Atlas IP whitelist             |
| S3 upload fails             | Verify IAM permissions, bucket name, region  |
| Vision API errors           | Check credentials JSON + file path           |
| CORS errors                 | Update backend CORS settings for frontend domain |
| Images not visible          | Check S3 object permissions / make public    |

---

## 7. Additional References

- [Node.js Documentation](https://nodejs.org/en/docs/)
- [MongoDB Atlas Documentation](https://www.mongodb.com/docs/atlas/)
- [React Documentation](https://react.dev/learn)
- [AWS S3 Documentation](https://docs.aws.amazon.com/s3/index.html)
- [Google Cloud Vision API Docs](https://cloud.google.com/vision/docs)

---
