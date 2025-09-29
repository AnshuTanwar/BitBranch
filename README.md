# 🚀 BitBranch

![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)
![React](https://img.shields.io/badge/React-18+-blue?logo=react)
![Vite](https://img.shields.io/badge/Vite-frontend-purple?logo=vite)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.x-38B2AC?logo=tailwind-css)
![Docker](https://img.shields.io/badge/Docker-ready-2496ED?logo=docker)
![License](https://img.shields.io/badge/License-MIT-yellow)

BitBranch is a **full-stack project** with a **Node.js backend (CLI + API + Docker)** and a **modern React + Vite + Tailwind frontend**.  
It provides both a **web interface** and a **command-line tool** for managing branches, commits, and version control operations in a streamlined way.
It allows developers to manage repositories, commits, branches, issues, and sync with S3 — with **AI-powered commit messages** and **code quality scoring**.

---

✨ **Special Highlights**:
- **AI-powered Commit Messages** (Google Gemini integration)  
- **Real-time Code Quality Scores** (auto linting + scoring every commit)

---

## Features

###  Core Backend Features
- **User Authentication**
  - JWT-based signup/login
  - Profile management
- **Repositories**
  - Create / Update / Delete repos
  - Fetch repos (all, by ID, by name, by user)
  - Toggle repo visibility
- **Issues**
  - Create / Update / Delete issues
  - Track issue status (`open`, `in-progress`, `closed`)
  - Assign issues, add labels
- **User Social Features**
  - Follow/Unfollow users
  - View followers/following
  - Star/Unstar repositories
  - View starred repositories
- **Comments**
  - Add comments to issues
  - Fetch comments for issues

### 🖥️ CLI Features (Git-like)
- `init` – Initialize repo
- `add` – Stage files
- `commit` – Commit with manual or **AI-suggested message**
- `status` – Check working tree status
- `diff` – Show unstaged changes
- `log` – Show commit history (`--oneline` option available)
- `branch` – Create/List branches
- `checkout` – Switch branch or commit (detached HEAD support)
- `revert` – Restore repo to specific commit
- `push` / `pull` – Sync with **AWS S3**

### AI Commit Messages
- Gemini suggests **short, professional commit messages**.
- Works interactively or fully automatic (`--ai`).
- Example:

```bash
node cli.js commit
# Suggested commit message: "Fix login bug in auth controller"
````

### Code Quality Score on Commit

* Each commit triggers linting using **ESLint**.
* Shows **errors, warnings, maintainability score (/100)**.
* Example output:

```
Code Quality Report:
- Errors: 1
- Warnings: 1
- Score: 93/100

 Issues:
  - bad.js:1 [warning] 'a' is assigned a value but never used.
  - bad.js:1 [error] Missing semicolon.
```

---

## Installation

Clone the repo:

```bash
git clone https://github.com/AnshuTanwar/BitBranch.git
cd bitbranch/backend
npm install
```

### Setup Environment Variables

Create a `.env` file in `backend/`:

```env
PORT=5050
MONGODB_URI=mongodb+srv://...
JWT_SECRET_KEY=your-secret
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=your-region
S3_BUCKET=your-bucket
GEMINI_API_KEY=your-gemini-api-key
```

---

## ▶️ Running the Project

### Local

```bash
npm run dev
```

### With Docker

```bash
docker-compose up --build
```

---

## API Routes

### User

* `POST /users/signup` → Register
* `POST /users/login` → Login
* `GET /users/` → Get all users (auth required)
* `GET /users/:id` → Get user profile
* `PUT /users/:id` → Update profile
* `DELETE /users/:id` → Delete profile
* `POST /users/:id/follow` → Follow user
* `DELETE /users/:id/follow` → Unfollow user
* `GET /users/:id/followers` → Get followers
* `GET /users/:id/following` → Get following
* `GET /users/me/starred` → Get starred repos

### Repository

* `POST /repos` → Create repo
* `GET /repos` → Get all repos
* `GET /repos/:id` → Get repo by ID
* `GET /repos/name/:name` → Get repo by name
* `GET /repos/my` → Get repos of logged-in user
* `PUT /repos/:id` → Update repo
* `PATCH /repos/:id/visibility` → Toggle visibility
* `DELETE /repos/:id` → Delete repo
* `POST /repos/:id/star` → Star repo
* `DELETE /repos/:id/star` → Unstar repo
* `GET /repos/:id/contributors` → Get contributors
* `POST /repos/:id/contributors` → Add contributor
* `GET /repos/:id/stats` → Repo statistics

### Issues

* `POST /issues/create/:repoId` → Create issue
* `PUT /issues/update/:id` → Update issue
* `DELETE /issues/delete/:id` → Delete issue
* `GET /issues/repo/:repoId` → Get issues of repo
* `GET /issues/:id` → Get issue by ID
* `PUT /issues/:id/status` → Change issue status
* `PUT /issues/:id/assign` → Assign issue to user
* `POST /issues/:id/comments` → Add comment
* `GET /issues/:id/comments` → Get comments

---

## Custom CLI Commands (Git-like)

Run commands from the project root:

```bash
node cli.js <command> [options]
```

| Command             | Description                  | Example                                                        |
| ------------------- | ---------------------------- | -------------------------------------------------------------- |
| `init`              | Initialize new repository    | `node cli.js init`                                             |
| `add <file>`        | Stage file for commit        | `node cli.js add index.js`                                     |
| `commit [message]`  | Commit staged files          | `node cli.js commit "Fix bug"`                                 |
| `commit --ai`       | Commit with **AI message**   | `node cli.js commit --ai`                                      |
| `status`            | Show working tree status     | `node cli.js status`                                           |
| `diff`              | Show changes vs last commit  | `node cli.js diff`                                             |
| `log`               | Show commit history          | `node cli.js log` <br> `node cli.js log --oneline`             |
| `branch [name]`     | List branches OR create one  | `node cli.js branch` <br> `node cli.js branch feature-login`   |
| `checkout <name>`   | Switch to a branch or commit | `node cli.js checkout main` <br> `node cli.js checkout 123abc` |
| `revert <commitID>` | Revert to specific commit    | `node cli.js revert 123abc`                                    |
| `push`              | Push commits to S3           | `node cli.js push`                                             |
| `pull`              | Pull commits from S3         | `node cli.js pull`                                             |

---

## Example Workflow

```bash
# Initialize
node cli.js init

# Stage files
node cli.js add server.js
node cli.js add package.json

# Commit with AI message
node cli.js commit --ai

# Push to cloud (S3)
node cli.js push

# View logs
node cli.js log --oneline
```

---

## Tech Stack

* **Frontend**: React, JavaScript, Vite
* **Backend**: Node.js, Express
* **Database**: MongoDB + Mongoose
* **Auth**: JWT
* **Cloud Storage**: AWS S3
* **Linting & Quality**: ESLint (auto-run on commits)
* **AI Commit Messages**: Google Gemini
* **Real-time**: Socket.io
* **Containerization**: Docker & Docker Compose

---

## Author

**Aanshu Tanwar**
A final-year engineer exploring **backend systems, cloud, and DevOps** 

```
