# BitBranch

A lightweight Git + GitHub–like backend CLI built with Node.js.
BitBranch mimics core Git workflows: init, add, commit, branch, checkout, log, push/pull, and more.

✨ **Special Sauce**:

* 🤖 **AI-powered Commit Messages** (Google Gemini integration)
* 🧪 **Real-time Code Quality Scores** (auto linting + scoring every commit)

---

## 🚀 Features

* **Repository Initialization**

  * `init` – initialize a new BitBranch repository.
* **Staging & Committing**

  * `add <file>` – stage a file.
  * `commit [message]` – create a snapshot with parent tracking.

    * If no message is provided, BitBranch can auto-suggest one using **Google Gemini AI** 🎉.
    * Use `--ai` to auto-accept the AI-generated commit message (no confirmation needed).
* **AI-Powered Commits**

  * Gemini suggests **short, professional commit messages**.
  * Works interactively or fully automatic (`--ai`).
* **Real-time Code Quality Score**

  * Each commit triggers linting of staged files using **ESLint**.
  * Shows **errors, warnings, maintainability score (/100)**.
  * Example:

    ```
    Code Quality Report:
    - Errors: 1
    - Warnings: 1
    - Score: 93/100
    ⚠️ Issues:
      - bad.js:1 [warning] 'a' is assigned a value but never used.
      - bad.js:1 [error] Missing semicolon.
    ```
* **Status & Diff**

  * `status` – see staged, unstaged, untracked files (respects `.bitbranchignore`).
  * `diff` – view changes between working directory and last commit.
* **Branching & Checkout**

  * `branch <name>` – create a new branch at current commit.
  * `branch` – list branches (`*` marks the current branch, `(HEAD detached …)` shown if detached).
  * `checkout <branch>` – switch to an existing branch.
  * `checkout <commit>` – enter **detached HEAD** mode at a specific commit.
* **Logging**

  * `log` – show full commit history with branch/detached info.
  * `log --oneline` – short form history.
* **Revert**

  * `revert <commitID>` – restore repository state to a specific commit.
* **Remote Sync**

  * `push` – push commits to S3 storage.
  * `pull` – fetch commits from S3 storage.

---

## 📦 Installation

Clone the repo and install dependencies:

```bash
git clone https://github.com/yourusername/bitbranch.git
cd bitbranch/backend
npm install
```

Create a `.env` file for configuration:

```env
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_REGION=your-region
S3_BUCKET=your-bucket
GEMINI_API_KEY=your-gemini-key
```

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

### Commit with AI-suggested message (interactive)

```bash
node cli.js commit
```

Example flow:

```
🤖 Suggested commit message: "Add feature.js with console log statement"
Use this? (y/n): y
Commit 123e4567 created with message: "Add feature.js with console log statement"
```

### Commit with AI-suggested message (auto-accept)

```bash
node cli.js commit --ai
```

Example:

```
Auto-commit with AI message: "feat: add ai-auto.js"
Commit 456def89 created with message: "feat: add ai-auto.js"
```

---

### Quality Score on Commit

Every commit automatically runs lint checks on staged files:

```bash
node cli.js commit "test quality"
```

Output:

```
Code Quality Report:
- Errors: 1
- Warnings: 1
- Score: 93/100

 Issues:
  - bad.js:1 [warning] 'a' is assigned a value but never used.
  - bad.js:1 [error] Missing semicolon.

Commit abc123 created with message: "test quality"
```

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

---

## Notes

* Commits in **detached HEAD** are valid but **not attached to a branch**.
* `.bitbranchignore` file can be used to exclude files/folders from staging & status.
* Push/Pull uses AWS S3 as remote backend (requires credentials in `.env`).
* AI commit messages require a valid **Google Gemini API key**.
* Code quality scores require **ESLint** (auto-installed via `npm install`).

---

## Roadmap

* [ ] Merge support (fast-forward + 3-way merge)
* [ ] Branch-aware push/pull
* [ ] Conflict resolution
* [ ] Hooks (pre-commit, post-commit)
* [ ] Configurable **Quality Threshold** (block commit if score < 80)
* [ ] AI commit message templates (Conventional Commits, Angular style)

---

## Author

Built by **Aanshu Tanwar** as a mini Git + GitHub–like system for learning and backend practice.