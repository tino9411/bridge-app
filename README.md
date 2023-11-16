# Bridge Backend

## Overview

The backend of Bridge, a global collaboration platform, is responsible for handling user interactions, project management, task assignments, and other core functionalities. It's built with Node.js and Express, using MongoDB as the data store.

## Backend Structure

- `app.js`: The main entry point for the backend server. It sets up the Express application, middleware, and routes.
- `controllers/`: Contains the logic for handling requests for different routes.
  - `authControllers.js`: Handles authentication-related functionalities.
  - `userController.js`: Manages user-related operations such as registration, login, and profile management.
  - `taskController.js`: Handles task-related actions within projects.
  - `projectController.js`: Manages project creation, modification, and deletion.
- `middlewares/`:
  - `auth.js`: Middleware for handling authentication and authorization.
- `models/`: Contains Mongoose models defining the structure of data for MongoDB.
- `routes/`:
  - `authRoutes.js`: Routes for authentication-related endpoints.
  - `userRoutes.js`: Defines routes for user-related operations.
  - `taskRoutes.js`: Routes for managing tasks within projects.
  - `projectRoutes.js`: Routes for project-related actions.

## Getting Started

To get the backend server running locally:

1. Ensure that Node.js, npm, and MongoDB are installed on your machine.
2. Clone the repository and navigate to the backend directory.
3. Install the dependencies:

   ```bash
   npm install
   ```

4. Set up the required environment variables in a `.env` file:

   ```env
   MONGODB_URI=<your_mongodb_uri>
   JWT_SECRET=<your_jwt_secret>
   ```

5. Run the server:

   ```bash
   npm start
   ```

## API Documentation

The backend provides RESTful APIs for user management, project handling, and task operations. Detailed API documentation can be found at [API Documentation Link].

## Testing

Automated tests are written using Mocha and Chai. To run the tests:

```bash
npm test
```

These tests cover various functionalities including user registration, login, project management, and task handling.

## Development

When contributing to the backend, ensure that:

- Code follows the established style guidelines.
- New features are accompanied by tests.
- Changes are well-documented.

For more information, refer to [Contribution Guidelines].

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

---

Bridge Backend, © 2023