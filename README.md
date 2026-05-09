# 🍱 Cloud-Based Food Delivery System
**Cloud Computing Project | Faculty of Computer & Information Sciences (ASU)**

---

## 🚀 Overview
This project is a high-performance, scalable **Microservices-based Food Delivery Platform**. It is designed to handle cloud-native challenges such as service isolation, container orchestration, and high availability using **Docker** and **Kubernetes**.

---

## 👥 Project Team & Roles
| Member | Role | Key Responsibilities |
| :--- | :--- | :--- |
| **Rahma Shaaban** | **Doc Lead & Backend** | Restaurant Service, MongoDB Cloud Integration, Project Documentation. |
| **Nesreen Ahmed** | **Backend Engineer** | User Service, JWT Authentication, Profile Management. |
| **Menna Ibrahim** | **Backend Engineer** | Order Service, Order Lifecycle, Cart Management. |
| **Nesma Ahmed** | **Frontend Engineer** | React/Next.js Dashboards (Customer & Restaurant Interfaces). |
| **Rokia Ahmed** | **DevOps Specialist** | Kubernetes (K8s) Manifests, Service Discovery, Ingress. |
| **Mona Bahaa** | **Infrastructure & DevOps** | Dockerization (Docker Compose), Image Optimization, Payment Logic. |

---

## 🏗️ System Architecture
The system architecture follows the **Database-per-Service** pattern to ensure complete isolation:
- **API Gateway:** The single entry point for all client requests.
- **Service Discovery:** Handled automatically via Kubernetes Services.
- **Load Balancing:** Managed by Kubernetes Ingress to distribute traffic.

---

## 🧩 Microservices Functional Breakdown

### 1. Restaurant Service (Managed by Rahma Shaaban)
- **Functions:** - Manage restaurant profiles (Name, Location, Cuisine).
  - **Admin Menu Control:** Dynamic management of items, prices, and real-time **availability toggling** (Available/Sold Out).
  - **Internal Order Validation:** High-performance API for validating cart items, prices, and stock status for the Order Service.
  - Search and filter restaurants by location or cuisine type.
- **Tech Stack:** Node.js, Express, Mongoose, MongoDB Atlas.
- **Port:** `5001`

### 2. User Service (Managed by Nesreen Ahmed)
- **Functions:** - Secure User Authentication (Sign up / Login).
  - Identity management using **JWT (JSON Web Tokens)**.
  - User profile updates and delivery address management.
- **Port:** `5002`

### 3. Order & Payment Service (Managed by Menna Ibrahim & Mona Bahaa)
- **Functions:** - **Cart Logic:** Adding/Removing items and calculating totals.
  - **Order Workflow:** Tracking status (Pending, Preparing, Out for Delivery, Delivered).
  - **Payment Integration:** Simulating secure payment transactions.
- **Port:** `5003`

### 4. Frontend Application (Rokia Ahmed)
- **Functions:** - Real-time interaction with all microservices.
  - Responsive Customer Dashboard for browsing and ordering.
  - Restaurant Partner Dashboard for menu and order management.
- **Tech Stack:** React.js / CSS Modules.

---

## 🗄️ Database Design
- **Cloud Provider:** MongoDB Atlas (Global Cluster).
- **Strategy:** Each service has its own logical database to prevent tight coupling.
- **Seeding:** Each service includes an automated `seed.js` script to populate initial data for testing.

---

## 🐳 Deployment & Containerization (Managed by Nesma Ahmed & Mona Bahaa)

### Dockerization
- **Dockerfile.dev:** Optimized for local development with hot-reloading.
- **Docker Compose:** Orchestrates all services and databases locally with a single command.

### Kubernetes (K8s)
- **Deployments:** Manages pod replicas and self-healing.
- **Services:** Internal communication between microservices.
- **ConfigMaps/Secrets:** Secure management of environment variables and DB credentials.

---

## 🔗 Key API Endpoints (Restaurant Service)
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| **GET** | `/api/restaurants` | List all restaurants and their menus. |
| **POST** | `/api/restaurants/validate-items` | **(Internal)** Validates order items and calculates total price. |
| **PUT** | `/api/restaurants/:id/menu/:itemId` | **(Admin)** Updates item price or availability status. |

---

## 🛠️ How to Run the Project

### 1. Prerequisites
- Docker Desktop & WSL2 installed.
- Node.js v20+.
- Access to MongoDB Atlas Cluster.

### 2. Setup
Clone the repository and install dependencies for each service:
```bash
git clone [repository-url]
# Setup Restaurant Service
cd restaurant-service && npm install
node scripts/seed.js  # Important: Run this to populate initial restaurants and menus

# Repeat for other services
