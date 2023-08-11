const PORT = process.env.PORT ?? 8000;
const express = require("express");
const { v4: uuidv4 } = require("uuid");
const app = express();
const dotenv = require("dotenv");
dotenv.config();
const itemsPool = require("./dbConfig");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

app.get("/", (req, res) => {
  res.send("hello");
});
app.use(cors());
app.use(express.json());

//GET

app.get("/todos/:userEmail", async (req, res) => {
  console.log(req);
  const { userEmail } = req.params;
  try {
    const todos = await itemsPool.query(
      "SELECT * FROM todos WHERE user_email = $1",
      [userEmail]
    );
    res.json(todos.rows);
  } catch (err) {
    console.error(err);
  }
});

// CREATE

app.post("/todos", async (req, res) => {
  const { user_email, title, progress, date } = req.body;
  console.log(user_email, title, progress, date);
  console.log(req.body);

  const id = uuidv4();

  try {
    const newToDo = await itemsPool.query(
      "INSERT INTO todos(id, user_email, title, progress, date) VALUES($1, $2, $3, $4, $5)",
      [id, user_email, title, progress, date]
    );
    res.json(newToDo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while creating the todo" });
  }
});

// EDIT

app.put("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { user_email, title, progress, date } = req.body;
  try {
    const editToDo = await itemsPool.query(
      "UPDATE todos SET user_email = $1, title = $2, progress = $3, date = $4 WHERE id = $5;",
      [user_email, title, progress, date, id]
    );
    res.json(editToDo);
  } catch (error) {
    console.error(error);
  }
});

// DELETE

app.delete("/todos/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const deleteToDo = await itemsPool.query(
      "DELETE FROM todos WHERE id = $1;",
      [id]
    );
    res.json(deleteToDo);
  } catch (error) {
    console.error(error);
  }
});

// SignUp

app.post("/signup", async (req, res) => {
  const { email, password } = req.body;
  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  try {
    const signUp = await itemsPool.query(
      `INSERT INTO users (email, hashed_password) VALUES ($1, $2)`,
      [email, hashedPassword]
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });

    res.json({ email, token });
  } catch (error) {
    console.error(error);
    if (error) {
      res.json({ detail: error.detail });
    }
  }
});

// Login

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const users = await itemsPool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );

    if (!users.rows.length) return res.json({ detail: "user does not exist!" });

    const success = await bcrypt.compare(
      password,
      users.rows[0].hashed_password
    );

    const token = jwt.sign({ email }, "secret", { expiresIn: "1hr" });
    if (success) {
      res.json({ email: users.rows[0].email, token });
    } else {
      res.json({ detail: "Login failed" });
    }
  } catch (error) {
    console.error(error);
  }
});

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`));
