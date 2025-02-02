const express = require("express");
const app = express();
const path = require("path");

const PORT = 80;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

const todos = [];

app.post("/todo/add", (req, res) => {
    if (!req.body.todo) {
        return res.status(400).json({ error: "Il campo 'todo' è obbligatorio" });
    }

    const todo = {
        id: new Date().getTime().toString(),
        text: req.body.todo,
        done: false
    };

    todos.push(todo);
    res.json({ result: "Ok", todo });
});

app.get("/todo", (req, res) => {
    res.json({ todos });
});

app.put("/todo/complete", (req, res) => {
    const { id } = req.body;
    const todo = todos.find(t => t.id === id);

    if (!todo) {
        return res.status(404).json({ error: "TODO non trovato" });
    }

    todo.done = !todo.done;
    res.json({ result: "Ok", todo });
});

app.delete("/todo/:id", (req, res) => {
    const { id } = req.params;
    const index = todos.findIndex(t => t.id === id);

    if (index === -1) {
        return res.status(404).json({ error: "TODO non trovato" });
    }

    todos.splice(index, 1);
    res.json({ result: "Ok" });
});

app.listen(PORT, () => console.log(`Server in esecuzione su http://localhost:${PORT}`));
