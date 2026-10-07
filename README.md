# To test website your self without localhost [[https://pocket-violation-essence-browsing.trycloudflare.com/menu](https://pocket-violation-essence-browsing.trycloudflare.com/)](https://window-folders-kidney-already.trycloudflare.com/menu)

Admin account

test20@test.com
test1234

Kitchen account

kitchentest@test.com
1234

# Running the Project Locally

## Requirements

Before starting, make sure you have installed:

- [Node.js](https://nodejs.org/)
- npm (included with Node.js)
- MariaDB
- Git

---

## 1. Clone the Repository

Open a terminal and run:

```bash
git clone https://github.com/Yukiol22/WEB_PROJECT.git
cd WEB_PROJECT
```

## 2. Install Frontend Dependencies

The React frontend is in the main `WEB_PROJECT` folder. Run:

```bash
npm install
```

## 3. Install Backend Dependencies

From the project root, run:

```bash
cd backend
npm install
cd ..
```

## 4. Create the MariaDB Database

Log in to MariaDB:

```bash
mariadb -u root -p
```

Enter your MariaDB password, then create the database:

```sql
CREATE DATABASE web_project;
```

Exit MariaDB:

```sql
exit;
```

## 5. Import the Database

From the **main `WEB_PROJECT` folder**, import the project's SQL file:

```bash
mariadb -u root -p web_project < sql/db2.sql
```

> If your SQL file has a different name, replace `sql/db4.sql` with its actual path.

To check that the tables were imported:

```bash
mariadb -u root -p web_project
```

```sql
SHOW TABLES;
exit;
```

## 6. Configure the Backend

Create a `.env` file inside `backend/` and add:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=web_project

PORT=3001
JWT_SECRET=your_secret_key
```

Replace `your_password` with your MariaDB password and `your_secret_key` with a secure, randomly generated secret.

## 7. Start the Backend

Open a terminal in the main project folder, then run:

```bash
cd backend
node server.js
```

The backend is expected to run at [http://localhost:3001](http://localhost:3001).

## 8. Start the Frontend

Open a **second terminal** in the main `WEB_PROJECT` folder and run:

```bash
npm run dev
```

Open the local address displayed by Vite, usually [http://localhost:5173](http://localhost:5173).

---

## Quick Start

After installation, start the application in two terminals. Make sure MariaDB is running first.

**Terminal 1 — Backend (from the project root):**

```bash
cd backend
node server.js
```

**Terminal 2 — Frontend (from the project root):** 

```bash
npm run dev
```

Then open [http://localhost:5173](http://localhost:5173).
