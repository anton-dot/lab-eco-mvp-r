# Web3 Platform

A production-ready full-stack decentralized application showcasing modern blockchain integration, real-time features, and enterprise-grade architecture patterns.

## Overview

This project demonstrates a comprehensive Web3 platform combining prediction markets, staking mechanisms, and exchange functionality. The platform features seamless external integrations, real-time updates, and a robust RESTful API architecture designed for scalability and maintainability.

## Key Features

- **Prediction Markets**: Bull/Bear prediction system with live price feeds and automated round management
- **Staking Platform**: Multiple staking plans with automated earnings calculation and distribution
- **External Integrations**: Multi-chain support with secure third-party connections and transaction handling
- **Exchange Dashboard**: Real-time market tracking, portfolio management, and analytics
- **Referral System**: Complete referral tracking, rewards calculation, and user hierarchy management
- **Transaction History**: Comprehensive transaction logging with filtering and export capabilities
- **Admin Dashboard**: Full administrative controls for user management, withdrawals, and system monitoring
- **Support System**: Ticket-based customer support with message threading
- **Real-time Notifications**: Live updates and event broadcasting
- **Authentication & Security**: Secure user authentication with session management

## Architecture Highlights

- **Modular Design**: Clean separation of concerns with layered architecture (controllers, services, models)
- **Middleware Pattern**: Authentication, validation, and error handling middleware
- **RESTful API**: Well-structured API routes with versioning and comprehensive error responses
- **Real-time Communication**: Bidirectional communication for live updates
- **Blockchain Integration**: Secure external connections and transaction processing
- **State Management**: Global state management patterns for complex application flows
- **Type Safety**: Strong typing throughout the codebase
- **Error Handling**: Comprehensive error handling and logging strategies

## Getting Started

### Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- **Git** - [Download](https://git-scm.com/)

### Installation

#### 1. Install Frontend Dependencies

```bash
npm install
```

#### 2. Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

**Or use the convenience script:**

```bash
npm run start-all
```

This will install dependencies for both frontend and backend, then start both servers.

## Running the Project

### Option 1: Run Both Servers Together (Recommended)

From the root directory:

```bash
npm start
```

This will:
- Start the backend server on `http://localhost:1357` (with mock data)
- Start the frontend development server on `http://localhost:2468`

**Note**: The backend uses in-memory mock data. All data will reset when you restart the server.

### Option 2: Run Servers Separately

**Terminal 1 - Backend:**
```bash
cd backend
npm start
```

**Terminal 2 - Frontend:**
```bash
npm run client
```

### Access the Application

Once both servers are running:
- **Frontend**: Open [http://localhost:2468](http://localhost:2468) in your browser
- **Backend API**: Available at [http://localhost:1357/api](http://localhost:1357/api)
- **Health Check**: [http://localhost:1357](http://localhost:1357)

## What Makes This Special

This codebase showcases production-ready patterns including:
- Secure authentication flows with token-based sessions
- Real-time bidirectional communication
- Blockchain transaction handling and external integrations
- Responsive design with modern UI/UX principles
- Comprehensive error handling and validation
- Scalable architecture patterns suitable for enterprise deployment
- Clean code organization and maintainable structure

Perfect for evaluating technical depth, code quality, architectural decision-making, and understanding of modern software development practices.

---

*Built with modern best practices and designed for scalability.*
