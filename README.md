TaskBoards App
A full-stack TaskBoards application built with Next.js. Users can register, log in, create multiple task boards, and manage their to-dos within each board. Each user has access only to their own boards and tasks.

Features
User registration and login with JWT authentication.

Create, rename, and delete task boards.

Add, update, mark complete, and delete tasks within boards.

Authorization to ensure users access only their own data.

Data is stored in memory (JSON objects), no database required.

Basic responsive UI built with Next.js.

Technologies Used
Next.js (React framework)

JWT for authentication

bcryptjs for password hashing

Node.js filesystem for in-memory data persistence (during runtime)

TypeScript (optional)

Getting Started
Prerequisites
Node.js (v14 or higher)

npm or yarn

Installation
Clone the repository:

Bash

git clone https://github.com/ktan-wolf/applyo_assignment.git
cd applyo_assignment
Install dependencies:

Bash
```
npm install
# or
yarn install

```

Create a .env.local file in the root directory and add your JWT secret:

Code snippet

```
JWT_SECRET=your_jwt_secret_here

```

Running the Development Server
Bash

```
npm run dev
# or
yarn dev

```


Open http://localhost:3000 to view the app in your browser.

Building for Production
Bash

```
npm run build
npm start
# or
yarn build
yarn start

```


API Endpoints
POST /api/auth/register — Register a new user

POST /api/auth/login — Login and receive JWT token (HTTP-only cookie)

GET /api/boards — Get all boards of the authenticated user

POST /api/boards — Create a new board

GET /api/boards/[id] — Get a specific board by ID

PUT /api/boards/[id] — Update board title

DELETE /api/boards/[id] — Delete a board

POST /api/tasks/[boardId] — Create a new task inside a board

PUT /api/tasks/[boardId] — Toggle task completion

PATCH /api/tasks/[boardId] — Update task details

DELETE /api/tasks/[boardId] — Delete a task

Notes
Data is stored in-memory during runtime; data will reset on server restart.

For deployment, the environment variable JWT_SECRET must be set.

This project uses HTTP-only cookies to store JWT for improved security.

Author
Made by Ketan Kumar

License
This project is licensed under the MIT License.