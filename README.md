# Smart IT Service Desk

A full-stack application for creating and managing IT support tickets, built with React, Spring Boot, and MySQL.

## Features

- Create tickets with a title, description, and priority.
- View tickets stored in MySQL.
- Update ticket status: Open, In Progress, or Resolved.
- Search tickets by title and filter by status.
- Automatically categorize new tickets using keyword rules.
- Validate required fields and allowed priority and status values.

## Technology Stack

- Frontend: React, Vite, CSS
- Backend: Java 21, Spring Boot, Spring Data JPA
- Database: MySQL
- Build tools: Maven Wrapper, npm

## Project Structure

- `demo/` — Spring Boot backend
- `frontend/` — React frontend

## Run Locally

### Prerequisites

- JDK 21
- Node.js and npm compatible with the project's Vite version
- MySQL running locally

### 1. Create the database

Run this in MySQL:

```sql
CREATE DATABASE smart_it_service_desk;
```

### 2. Configure the backend

Copy `demo/src/main/resources/application.properties.example`
to `demo/src/main/resources/application.properties`.

Update the database username and password in the copied file.

The local `application.properties` file is excluded from Git.
Keep your real database password out of the example file.

### 3. Start the backend

From the project root, in Windows Command Prompt:

```cmd
cd demo
mvnw.cmd spring-boot:run
```

The backend runs at http://localhost:8080.

### 4. Start the frontend

Open a separate Command Prompt in the project root:

```cmd
cd frontend
npm install
npm run dev
```

Open the local URL printed by Vite, usually http://localhost:5173.

Keep both terminals running. The Vite development server proxies
`/api` requests to the backend on port 8080.

## API Endpoints

| Method | Endpoint | Purpose |
| --- | --- | --- |
| GET | `/api/tickets` | List all tickets |
| POST | `/api/tickets` | Create a ticket |
| PUT | `/api/tickets/{id}/status?status=IN_PROGRESS` | Update ticket status |

Example request body for creating a ticket:

```json
{
  "title": "Office Wi-Fi down",
  "description": "Unable to connect to the office network",
  "priority": "HIGH"
}
```

## Automatic Categorization

New tickets are categorized as NETWORK, HARDWARE, SOFTWARE,
or OTHER using keywords in the title and description.

This feature uses keyword rules; it does not use a trained AI model.

## Author

Tanvi C P