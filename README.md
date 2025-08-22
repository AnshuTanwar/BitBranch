# BitBranch 🪄
A lightweight Git + GitHub–like backend CLI built with Node.js.  
BitBranch mimics core Git workflows: init, add, commit, branch, checkout, log, push/pull, and more.

---

## 🚀 Features
- **Repository Initialization**
  - `init` – initialize a new BitBranch repository.
- **Staging & Committing**
  - `add <file>` – stage a file.
  - `commit [message]` – create a snapshot with parent tracking.
    - If no message is provided, BitBranch can auto-suggest one using **Google Gemini AI** 🎉.
- **Status & Diff**
  - `status` – see staged, unstaged, untracked files (respects `.bitbranchignore`).
  - `diff` – view changes between working directory and last commit.
- **Branching & Checkout**
  - `branch <name>` – create a new branch at current commit.
  - `branch` – list branches (`*` marks the current branch, `(HEAD detached …)` shown if detached).
  - `checkout <branch>` – switch to an existing branch.
  - `checkout <commit>` – enter **detached HEAD** mode at a specific commit.
- **Logging**
  - `log` – show full commit history with branch/detached info.
  - `log --oneline` – short form history.
- **Revert**
  - `revert <commitID>` – restore repository state to a specific commit.
- **Remote Sync**
  - `push` – push commits to S3 storage.
  - `pull` – fetch commits from S3 storage.

---

## 📦 Installation
Clone the repo and install dependencies:
```bash
git clone https://github.com/yourusername/bitbranch.git
cd bitbranch/backend
npm install
````

---

## ⚡ Usage

### Initialize a repo

```bash
node cli.js init
```

### Add & Commit (Manual message)

```bash
echo "hello world" > file.txt
node cli.js add file.txt
node cli.js commit "first commit"
```

### Commit with AI-suggested message

```bash
node cli.js commit
```

Example flow:

```
🤖 Suggested commit message: "Add feature.js with console log statement"
Use this? (y/n): y
✅ Commit 123e4567 created with message: "Add feature.js with console log statement"
```

> Requires `GEMINI_API_KEY` in `.env`.

---

### Branching

```bash
node cli.js branch dev     # create branch dev
node cli.js checkout dev   # switch to dev
```

### Detached HEAD

```bash
node cli.js log --oneline
# Suppose you see commit abc1234
node cli.js checkout abc1234
# Now HEAD is detached at abc1234
```

### Logs

```bash
node cli.js log
```

Output:

```
=== BitBranch Log (branch: dev) ===
commit 3268510f-ab27-4e04-aacc-e65178dc31c8
Date:   2025-08-16T15:21:19.423Z

    dev branch commit

commit fc17fcf0-c98b-4385-b60d-faa2572eb9c5
Date:   2025-08-16T15:17:20.530Z

    first commit
```

---

## 🛡️ Notes

* Commits in **detached HEAD** are valid but **not attached to a branch**.
* `.bitbranchignore` file can be used to exclude files/folders from staging & status.
* Push/Pull uses AWS S3 as remote backend (requires credentials in `.env`).
* AI commit messages require a valid **Google Gemini API key**.

---

## 🔮 Roadmap

* [ ] Merge support (fast-forward + 3-way merge)
* [ ] Branch-aware push/pull
* [ ] Conflict resolution
* [ ] Hooks (pre-commit, post-commit)
* [ ] `--ai` flag for auto-accept AI commit messages (no prompt)

---

## 👨‍💻 Author

Built by **Aanshu Tanwar** as a mini Git + GitHub–like system for learning and backend practice.