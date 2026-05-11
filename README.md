#  Cloud-Based Food Delivery Microservices System
**Cloud Computing Project | Faculty of Computer & Information Sciences (ASU)**

---

##  Overview
This project is a high-performance, scalable **Microservices-based Food Delivery Platform**. It is designed to handle cloud-native challenges such as service isolation, container orchestration, and high availability using **Docker** and **Kubernetes**.

---

##  Cloud Deployment (Linux VM)
The entire system is deployed on a **Linux Virtual Machine (VM)** to ensure a production-grade environment, moving beyond local development (WSL). 
- **OS:** Ubuntu / Linux Backend.
- **Access:** Services are accessible through the VM's Public IP via the configured API Gateway ports.
- **Environment:** Full Linux environment for consistent Docker and Kubernetes orchestration.

---

##  Project Team & Roles (Group 6)
| Member | Role | Key Responsibilities |
| :--- | :--- | :--- |
| **Rahma Shaaban** | **Doc Lead & Integration** | Integration Lead, VM Deployment, API Gateway, Multi-Environment Orchestration (Linux), and K8s Deployment. |
| **Nesreen Ahmed** | **Backend Engineer** | User Service Development, JWT Authentication, and Secure Identity Management. |
| **Menna Ibrahim** | **Backend Engineer** | Order Service Development, Order Lifecycle (Pending to Delivered), and Delivery Assignment Logic. |
| **Nesma Ahmed** | **Frontend Engineer** | React.js Dashboards (Customer & Restaurant Interfaces) and Image Hosting Integration. |
| **Rokia Ahmed** | **DevOps Specialist** | Kubernetes (K8s) Manifests (Deployments/Services), Network Isolation, and Linux System Optimization. |
| **Mona Bahaa** | **Infrastructure & Backend** | Restaurant Service Development, Menu Management Logic, and Payment Mock Service. |

---

##  System Architecture
The system architecture follows the **Database-per-Service** pattern to ensure complete isolation:
- **API Gateway (Centralized):** Single entry point on the VM that routes requests to internal services and handles CORS.
- **Service Discovery:** Handled automatically via Kubernetes ClusterIP Services.
- **Environment Isolation:** Separate Docker Networks for Dev, Test, and Production.

---

##  Microservices Functional Breakdown

### 1. Restaurant Service (Mona Bahaa)
- **Manage Profiles:** Handles restaurant metadata (Name, Cuisine, Location).
- **Admin Menu Control:** Dynamic management of items, prices, and **Availability Toggling**.
- **Owner Dashboard Support:** Fetching specific restaurant data via `ownerId`.

### 2. User Service (Nesreen Ahmed)
- **Secure Authentication:** Sign up/Login with **JWT (JSON Web Tokens)**.
- **Identity Management:** Role-based access control (Customer, Owner, Delivery).

### 3. Order Service (Menna Ibrahim)
- **Order Workflow:** Manages status (Pending -> Ready -> Out for Delivery -> Delivered).
- **Delivery Integration:** Assigning orders to delivery personnel via `deliveryId`.

### 4. API Gateway (Rahma Shaaban)
- **Centralized Proxy:** Routing all traffic via `http-proxy-middleware`.
- **Timeout Protection:** Configured `proxyTimeout` (15s) to prevent 504 errors on the VM.

---

##  Containerization & Environments (Requirement #4)

Running **three fully isolated environments** concurrently on the Linux VM:

| Environment | VM Host Port | Network Name | Compose File |
| :--- | :--- | :--- | :--- |
| **Development** | `8000` | `food_dev_network` | `docker-compose.dev.yml` |
| **Testing** | `8001` | `food_test_network` | `docker-compose.test.yml` |
| **Production** | `8002` | `food_prod_network` | `docker-compose.prod.yml` |

---

##  Kubernetes (K8s)
- **Deployments:** Manages pod replicas and self-healing on the Linux cluster.
- **Services:** Internal `ClusterIP` services for inter-service communication.
- **Scalability:** Configured to handle load balancing across the VM resources.

---

##  How to Run on Linux VM

1. **Clone & Clean up**:
   ```bash
   git clone [repository-url]
   cd Cloud-Project
   docker rm -f $(docker ps -aq) && docker network prune -f
2. **Start Development Environment**:
      ```bash
   docker-compose -f docker-compose.dev.yml up -d 
3. **Verify running containers**:
   Bash
   docker ps
   curl http://localhost:8000/health

2ز 2
