const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database'); 

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

// Get all todos
app.get('/api/todos', async (req, res) => {
  try {
    const results = await db.query('SELECT * FROM todos');
    res.json(results.rows);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).send('Server Error');
  }
});

// Create a new todo
app.post('/api/todos', async (req, res) => {
  try {
    const { title } = req.body;
    const result = await db.query('INSERT INTO todos (title) VALUES ($1) RETURNING *', [title]);
    res.status(201).json(result.rows[0]); 
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).send('Server Error');
  }
});

// Delete a todo
app.delete('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM todos WHERE id = $1', [id]);
    res.sendStatus(204); 
  } catch (error) {
    console.error('Error deleting todo:', error);
    res.status(500).send('Server Error');
  }
});

// Get a single todo
app.get('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM todos WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).send('Todo not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching todo:', error);
    res.status(500).send('Server Error');
  }
});

// Update a todo (you can implement PUT or PATCH as needed)
// Example with PUT:
app.put('/api/todos/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { title, completed } = req.body;
    const result = await db.query(
      'UPDATE todos SET title = $1, completed = $2 WHERE id = $3 RETURNING *',
      [title, completed, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).send('Todo not found');
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating todo:', error);
    res.status(500).send('Server Error');
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});