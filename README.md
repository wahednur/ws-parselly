# 📦 WS-Parselly - Parcel Delivery System API

WS-Parselly is a secure, role-based backend API for managing parcel deliveries, inspired by Pathao Courier and Sundarban. The system supports sender/receiver registration, parcel tracking, delivery status updates, and admin features.

## 🔧 Tech Stack

- **Backend:** Node.js, Express.js, TypeScript
- **Database:** MongoDB with Mongoose
- **Authentication:** JWT (JSON Web Tokens)
- **Validation:** Zod
- **Authorization:** Role-based middleware
- **Error Handling:** Centralized global error handler

---

## 📌 Features

### ✅ Authentication & User Management

- User registration with role: `sender`, `receiver`, `admin`
- JWT-based secure login
- Google & credentials-based login
- Block/Unblock users by admin
- Password hashing and sensitive data protection

### 📦 Parcel Management

- CRUD operations for parcels
- Parcel tracking with `trackingEvents[]`
- Status update: Pending, Approved, Dispatched, Delivered, Canceled
- Assign deliveryman to parcel
- Calculate delivery charges based on weight & distance

### 🛡️ Roles & Access Control

- **Sender:** Can create and track parcels
- **Receiver:** Can view parcel details
- **Admin:** Can approve, assign, and manage parcels and users

---

## 🧪 API Endpoints

### Auth Routes

```http
POST /api/auth/register         # Register user
POST /api/auth/login            # Login
```

### User Routes

```
GET /api/users/me               # Get current user
PATCH /api/admin/users/block/:id   # Block/unblock user

```

### Parcel Routes

```
POST   /api/parcels             # Create a parcel
GET    /api/parcels             # Get all parcels (filter by role)
GET    /api/parcels/:id         # Parcel details
PATCH  /api/admin/parcels/status/:id  # Update parcel status
PATCH  /api/admin/parcels/assign/:id  # Assign deliveryman

```

### 🗂️ Database Models

```
{
  name: string;
  email: string;
  password?: string;
  phone?: string;
  role: 'admin' | 'sender' | 'receiver';
  isActive: 'active' | 'inactive' | 'blocked';
  auths: [{ provider: 'google' | 'credentials', providerId: string }]
}
```

### Parcel

```
{
  sender: ObjectId;
  receiver: ObjectId;
  status: 'pending' | 'approved' | 'dispatched' | 'delivered' | 'cancelled';
  trackingEvents: [
    {
      status: string;
      timestamp: Date;
      updatedBy: ObjectId;
    }
  ];
  deliveryCharge: number;
  deliveryAddress: string;
}

```

### .env

```
# server port decleration
PORT=5000
# Mongodb Uri
MDB_URI=mongodb+srv:your_mongo_DB_URI
# Project Mode
NODE_ENV=development

#JWT
JWT_SECRET =your_jwt_secret
JWT_EXP_IN=30d
JWT_REFRESH_SECRET=JWT_SECRET
JWT_REFRESH_EXP_IN=30d


#BCRYPT
BCRYPT_SALT=10

# Frontend URL
FRONTEND_URL=http://localhost:5173


# Google Login
GOOGLE_CLIENT_ID=google_client_id
GOOGLE_CLIENT_SECRET=google_client_id_secret
GOOGLE_CALLBACK_URL=google_callback_url
```

## Postman Collection

Click below to download the Postman collection:

👉 [Download postman.json](https://raw.githubusercontent.com/wahednur/ws-parselly/main/postman.json)

## 👨‍💻 Author

**Abdul Wahed Nur**  
MERN Stack Developer
✉️: <wahednur@gmail.com>
📞: +88 01917839303
[Portfolio](https://wahednur.vercel.app) | [LinkedIn](https://www.linkedin.com/in/wahednur/)

---

Let me know if you want to add API documentation (like Swagger/OpenAPI), deployment instructions (e.g., Docker), or frontend-related details .
