# BitBranch

A lightweight Git + GitHub–like backend + CLI built with Node.js + MongoDB.
BitBranch mimics core Git workflows: init, add, commit, branch, checkout, log, push/pull, and more.
It also provides a **REST API** for authentication, repositories, issues, and real-time events.

---

## Features (Backend)

* **User Authentication** – JWT-based login/signup.
* **Repository Management** – Create, update, delete repos with visibility toggle.
* **Issue Tracking** – Per-repository issues with CRUD.
* **Real-time Events** – WebSockets (Socket.IO) for notifications.
* **AI Commit Messages** – via Google Gemini.
* **Code Quality Scoring** – ESLint integration.

---

## ⚡ API Reference

### Authentication

#### **Signup**

`POST /users/signup`

**Body:**

```json
{
  "username": "john_doe",
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "userId": "64fa2c...."
}
```

---

#### **Login**

`POST /users/login`

**Body:**

```json
{
  "email": "john@example.com",
  "password": "securePass123"
}
```

**Response:**

```json
{
  "token": "jwt_token_here",
  "userId": "64fa2c...."
}
```

---

### Users

#### **Get All Users**

`GET /users/`
Headers: `Authorization: Bearer <token>`

**Response:**

```json
[
  {
    "_id": "64fa2c....",
    "username": "john_doe",
    "email": "john@example.com"
  }
]
```

---

#### **Get User Profile**

`GET /users/:id`
Protected

**Response:**

```json
{
  "_id": "64fa2c...",
  "username": "john_doe",
  "email": "john@example.com"
}
```

---

#### **Update Profile**

`PUT /users/:id`
Protected

**Body:**

```json
{
  "email": "new@example.com",
  "password": "newPass"
}
```

---

#### **Delete Profile**

`DELETE /users/:id`
Protected

**Response:**

```json
{
  "message": "User Profile Deleted"
}
```

---

### Repositories

#### **Create Repository**

`POST /repos/create`
Protected

**Body:**

```json
{
  "name": "bitbranch-demo",
  "description": "my test repo",
  "visibility": true,
  "content": []
}
```

**Response:**

```json
{
  "message": "Repository Created!",
  "repositoryID": "6501f2c..."
}
```

---

#### **Get All Repositories**

`GET /repos/all`

Returns all repos with populated owner + issues.

---

#### **Get Repository by ID**

`GET /repos/:id`

---

#### **Get Repository by Name**

`GET /repos/name/:name`

---

#### **Get My Repositories**

`GET /repos/user/me`
Protected

---

#### **Update Repository**

`PUT /repos/update/:id`
Protected

**Body:**

```json
{
  "description": "updated repo desc",
  "content": "new file content"
}
```

---

#### **Toggle Visibility**

`PATCH /repos/toggle/:id`
Protected

Toggles between public/private.

---

#### **Delete Repository**

`DELETE /repos/delete/:id`
Protected

---

### Issues

#### **Create Issue**

`POST /issues/create/:repoId`
Protected

**Body:**

```json
{
  "title": "Bug in login",
  "description": "Login fails with 500"
}
```

**Response:**

```json
{
  "_id": "6502a1...",
  "title": "Bug in login",
  "repository": "6501f2c..."
}
```

---

#### **Update Issue**

`PUT /issues/update/:id`
Protected

**Body:**

```json
{
  "title": "Bug fixed",
  "description": "fixed in commit abc",
  "status": "closed"
}
```

---

#### **Delete Issue**

`DELETE /issues/delete/:id`
Protected

---

#### **Get Issues by Repo**

`GET /issues/repo/:repoId`

---

#### **Get Issue by ID**

`GET /issues/:id`

---

### Real-time (Socket.IO)

* `joinRoom(userId)` – join personal room for notifications.
* Auto logs connection/disconnection.
* Future scope: push repo/issue updates to relevant users.

---

## 🛠 Tech Stack

* **Backend**: Node.js, Express, MongoDB (Mongoose)
* **Auth**: JWT
* **Real-time**: Socket.IO
* **AI**: Google Gemini API
* **Linting/Score**: ESLint
* **Remote Sync**: AWS S3

---

## 📂 Project Structure

```
backend/
│── controllers/      # business logic
│── models/           # mongoose schemas
│── routes/           # user, repo, issue routers
│── middleware/       # auth, error handling
│── config/           # db, socket
│── utils/            # helpers
│── server.js         # entrypoint
```

---

## ⚡ Usage (API + CLI)

* Run server:

  ```bash
  npm run dev
  ```
* Use CLI (init/add/commit):

  ```bash
  node cli.js init
  node cli.js commit --ai
  ```

---

## Next Steps

* Centralized error handling (AppError + global middleware).
* Request validation (express-validator / zod).
* Testing (Jest + Supertest).
* Logging (Winston/Pino).
* Deployment (Docker + CI/CD).

---

## Author

Built with ❤️ by **Aanshu Tanwar**
Frontend Collaborator **Deepak**