# 🚀 SecureBoard - Modern Project Management Platform

![Laravel](https://img.shields.io/badge/Laravel-FF2D20?style=for-the-badge&logo=laravel&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![MySQL](https://img.shields.io/badge/MySQL-005C84?style=for-the-badge&logo=mysql&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-DC382D?style=for-the-badge&logo=redis&logoColor=white)

**SecureBoard** est une application moderne de gestion de projets et d'utilisateurs, conçue pour optimiser les workflows d'équipe avec une architecture performante et sécurisée.

## ✨ Features

### 🔐 Authentication & Security
- **Multi-role authentication** (User, Manager, Admin)
- **JWT Token-based security** with Laravel Sanctum
- **Role-based access control** with Laratrust
- **Policies & Gates** for fine-grained permissions
- **Secure password management** with Breeze

### 📊 Project Management
- **Full CRUD operations** for projects
- **Project assignment system** with user tracking
- **Real-time status updates** (Pending, In Progress, Completed)
- **Advanced filtering** by status and assignment
- **Ownership-based permissions**

### 👥 User Management
- **Admin user management** (Create, Read, Update, Delete)
- **Role assignment system**
- **Profile management** for all users
- **Dashboard analytics** based on user role

### ⚡ Performance Optimization
- **Queue system** for asynchronous notifications
- **Event-driven architecture** for better scalability
- **Redis caching** for improved performance
- **Optimized database queries** with eager loading

## 🛠 Tech Stack

### Backend
- **Laravel 10** - PHP Framework
- **Laravel Breeze** - Authentication scaffolding
- **Laravel Sanctum** - API Authentication
- **Laratrust** - Roles & Permissions management
- **Redis** - Queue and Cache driver
- **MySQL** - Database

### Frontend
- **React 18** - User Interface
- **Axios** - HTTP Client
- **React Router** - Navigation
- **Context API** - State management

## 📦 Installation

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 16+
- MySQL 8.0+
- Redis Server

### Backend Setup
```bash
# Clone the repository
git clone https://github.com/yourusername/secureboard.git
cd secureboard

# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
DB_DATABASE=secureboard
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Configure Redis for queues
REDIS_CLIENT=predis
QUEUE_CONNECTION=redis

# Run migrations and seeding
php artisan migrate --seed

# Generate Laravel Sanctum keys
php artisan sanctum:install

# Link storage
php artisan storage:link

# Start queue worker (in separate terminal)
php artisan queue:work

# Serve application
php artisan serve
