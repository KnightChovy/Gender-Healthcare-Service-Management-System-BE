# 🏥 Gender Healthcare Service Management System - Backend

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![Express](https://img.shields.io/badge/Express-4.18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Ready-green)
![License](https://img.shields.io/badge/License-MIT-yellow)

A robust backend system for managing gender healthcare services, built with Express.js and MongoDB.

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [System Architecture](#system-architecture)
- [Project Structure](#project-structure)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Application](#running-the-application)
- [API Documentation](#api-documentation)
- [Development Guidelines](#development-guidelines)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🔍 Overview

The Gender Healthcare Service Management System is designed to provide comprehensive healthcare management specifically focused on gender-related medical services. This backend system supports user management, appointment scheduling, medical records, and various healthcare service operations.

## ✨ Features

- User authentication and authorization
- Patient profile management
- Appointment scheduling and management
- Medical records storage and retrieval
- Healthcare service catalog
- Provider management
- Analytics and reporting

## 🏗️ System Architecture

This application follows a modern MVC architecture:

- **Express.js**: Web application framework
- **MongoDB**: NoSQL database for data storage
- **RESTful API**: Standardized API endpoints
- **JWT Authentication**: Secure user authentication
- **Middleware-based**: Request validation and processing

## 📂 Project Structure

```
gender-healthcare-service-management-system-be/
├── src/                      # Source code
│   ├── config/               # Configuration files
│   ├── controllers/          # Request handlers
│   ├── middlewares/          # Express middlewares
│   ├── models/               # Database models
│   ├── providers/            # External service providers
│   ├── routes/               # API routes (v1, v2)
│   ├── services/             # Business logic
│   ├── sockets/              # WebSocket implementations
│   ├── utils/                # Utility functions
│   ├── validations/          # Request validation
│   └── server.js             # Application entry point
├── .babelrc                  # Babel configuration
├── .env.example              # Example environment variables
├── .eslintrc.cjs             # ESLint configuration
├── .gitignore                # Git ignore file
├── jsconfig.json             # JavaScript configuration
├── package.json              # Project dependencies
└── README.md                 # Project documentation
```

## 🚀 Getting Started

### Prerequisites

- Node.js >= 18.16.0
- npm = v9.8.1 or yarn = v1.22.19
- MongoDB (local or Atlas)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/gender-healthcare-service-management-system-be.git
   cd gender-healthcare-service-management-system-be
   ```

2. Install dependencies:
   ```bash
   npm install
   # or with yarn
   yarn install
   ```

### Configuration

1. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file with your own configuration:
   ```
   MONGODB_URI='your-mongodb-connection-string'
   DATABASE_NAME='your-database-name'
   APP_HOST='localhost'
   APP_PORT=8017
   ```

### Running the Application

#### Development mode

```bash
npm run dev
# or with yarn
yarn dev
```

#### Production mode

```bash
npm run production
# or with yarn
yarn production
```

## 📝 API Documentation

### API Versioning

The API is versioned to ensure backward compatibility:

- V1 API: `/api/v1/`
- V2 API: `/api/v2/`

### Available Endpoints

#### Authentication
- `POST /api/v1/auth/register` - Register a new user
- `POST /api/v1/auth/login` - User login

#### Users
- `GET /api/v1/users` - Get all users
- `GET /api/v1/users/:id` - Get user by ID
- `PATCH /api/v1/users/:id` - Update user
- `DELETE /api/v1/users/:id` - Delete user

#### Healthcare Services
- `GET /api/v1/services` - Get all services
- `POST /api/v1/services` - Create new service
- `GET /api/v1/services/:id` - Get service by ID
- `PATCH /api/v1/services/:id` - Update service
- `DELETE /api/v1/services/:id` - Delete service

#### Appointments
- `GET /api/v1/appointments` - Get all appointments
- `POST /api/v1/appointments` - Create new appointment
- `GET /api/v1/appointments/:id` - Get appointment by ID
- `PATCH /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Delete appointment

## 🛠️ Development Guidelines

### Code Style

This project uses ESLint for code linting. Run the linter with:

```bash
npm run lint
# or with yarn
yarn lint
```

### Branching Strategy

- `main` - Production-ready code
- `develop` - Development branch
- `feature/feature-name` - For new features
- `bugfix/bug-name` - For bug fixes

### Commit Messages

Follow the conventional commits specification:

- `feat:` - A new feature
- `fix:` - A bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, etc.)
- `refactor:` - Code changes that neither fix bugs nor add features
- `test:` - Adding or modifying tests
- `chore:` - Changes to build process or auxiliary tools

## 🚢 Deployment

### Build for Production

```bash
npm run build
# or with yarn
yarn build
```

### Deployment Platforms

The application can be deployed to:
- Heroku
- AWS Elastic Beanstalk
- Digital Ocean
- Any Node.js compatible hosting service

## 👥 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

### 👨‍💻 Developed by

Gender Healthcare Service Management System Team

*"Providing inclusive healthcare services for all"*
