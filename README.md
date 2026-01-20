# Task Manager API

A RESTful API for managing tasks built with Node.js, Express, and TypeScript. This project implements a full suite of CRUD operations using in-memory storage, focusing on clean architecture, input validation, and searchable task lists.

## Features

- CRUD operations for tasks (Create, Read, Update, Delete)
- Search and filtering by title
- Task statistics summary
- Integrated Swagger API documentation
- Bruno collection for endpoint testing

## Technology Stack

- Node.js
- TypeScript
- Express.js
- pnpm
- uuid (ID generation)
- swagger-jsdoc (Documentation)

## Installation and Setup

1. Install dependencies:
   ```bash
   pnpm install
   ```

2. Start the development server:
   ```bash
   pnpm dev
   ```

## API Documentation

Interactive API documentation is available at:
http://localhost:3000/api-docs

## Endpoints

- POST /api/tasks - Create a new task
- GET /api/tasks - List all tasks (supports ?title= query)
- GET /api/tasks/:id - Get task by ID
- PUT /api/tasks/:id - Update task info
- DELETE /api/tasks/:id - Delete a task
- GET /api/stats - Get task statistics
