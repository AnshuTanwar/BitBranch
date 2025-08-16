# 🪵 BitBranch – A GitHub-like but better VCS + Server

BitBranch is a **GitHub-like system** built from scratch.
It provides a **Git-style CLI** (`init`, `add`, `commit`, `push`, `pull`, `revert`, `log`)
and a **server backend** (Express + MongoDB + Socket.IO) to manage repositories and users.

---

## ✨ Features Implemented
- **Local Version Control (CLI)**
  - `init` – initialize a repository (`.bitbranch/`)
  - `add` – stage files
  - `commit` – snapshot staged files (with UUID commit IDs)
  - `log` – view commit history (`--oneline` supported)
  - `revert` – roll back to a specific commit (updates HEAD)
  - `push` – sync commits to S3 (incremental, only new commits uploaded)
  - `pull` – fetch commits from S3 (incremental, only new commits downloaded)

- **Remote Storage**
  - AWS S3 acts as the **remote origin** (like GitHub).
  - Efficient **incremental sync** for commits.

- **Server (future integration)**
  - REST APIs and Socket.IO backend (Express + MongoDB).
  - Planned for users, repos, issues, notifications.

---

## 🛠️ Tech Stack
- **CLI**: Node.js, Yargs, FS, UUID, AWS SDK v3
- **Server**: Express.js, MongoDB (Mongoose), Socket.IO
- **Cloud Storage**: AWS S3

---

## 📂 Repository Structure
```

backend/
├── cli.js                 # CLI entrypoint
├── cli/
│   ├── commands/          # CLI commands
│   │   ├── init.js
│   │   ├── add.js
│   │   ├── commit.js
│   │   ├── log.js
│   │   ├── revert.js
│   │   ├── push.js
│   │   └── pull.js
│   └── constants.js       # Repo path constants
├── config/
│   ├── aws-config.js      # AWS S3 client (SDK v3)
│   ├── db.js              # MongoDB connection
│   └── socket.js          # Socket.IO setup
├── routes/
├── controllers/
└── server.js              # Express server entrypoint

````

---

## ⚡ Setup Instructions

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/bitbranch.git
cd bitbranch/backend
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment

Create a `.env` file:

```ini
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AWS_REGION=ap-south-1      # Example: Mumbai
S3_BUCKET=your-bucket-name
MONGODB_URI=mongodb://localhost:27017/bitbranch
PORT=3000
CLIENT_URL=http://localhost:5173
```

---

## 🚀 Usage (CLI)

### Initialize Repository

```bash
node cli.js init
```

### Add File

```bash
echo "hello" > a.txt
node cli.js add a.txt
```

### Commit

```bash
node cli.js commit "first commit"
```

### View Log

```bash
node cli.js log
node cli.js log --oneline
```

### Revert

```bash
node cli.js revert <commitID>
```

### Push to Remote (S3)

```bash
node cli.js push
```

### Pull from Remote (S3)

```bash
node cli.js pull
```

---

## 🧪 Test Workflow

1. `node cli.js init`
2. Create a file → `node cli.js add file.txt`
3. `node cli.js commit "my commit"`
4. `node cli.js log` (check history)
5. `node cli.js push` (upload to S3)
6. Delete `.bitbranch/commits/` → `node cli.js pull` (restore from S3)
7. `node cli.js revert <commitID>` (roll back HEAD + files)

---

## 📌 Next Milestones

* [ ] Add **branches** (`branch`, `checkout`)
* [ ] Add **status & diff** commands
* [ ] Extend **server APIs** (repos, issues, PRs)
* [ ] Real-time notifications with **Socket.IO**

---

## 👨‍💻 Author

**Aanshu Tanwar** – Full-stack developer | BitBranch creator
