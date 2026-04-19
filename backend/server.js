const express = require('express');
const db = require('./db.js');

const app = express();
app.use(express.json());

const port = 3000;

app.get('/', (req, res) => {
    res.send('API is running');
});


app.get('/resource', async (req, res) => {
    const [rows] = await db.query('SELECT * FROM resources');
    res.json(rows);
});


app.post('/resource', async (req, res) => {
    const { name, type, capacity } = req.body;

    const [result] = await db.query(
        'INSERT INTO resources (name, type, capacity) VALUES (?, ?, ?)',
        [name, type, capacity]
    );

    res.status(201).json({
        message: 'Successfully added new resource',
        id: result.insertId
    });
});


app.get('/resource/:id', async (req, res) => {
    const { id } = req.params;

    const [rows] = await db.query(
        'SELECT * FROM resources WHERE id = ?',
        [id]
    );

    res.json(rows[0] || {});
});


app.put('/resource/:id', async (req, res) => {
    const { id } = req.params;
    const { name, type, capacity } = req.body;

    await db.query(
        'UPDATE resources SET name = ?, type = ?, capacity = ? WHERE id = ?',
        [name, type, capacity, id]
    );

    res.send(`Resource ${id} updated successfully`);
});


app.delete('/resource/:id', async (req, res) => {
    const { id } = req.params;

    await db.query(
        'DELETE FROM resources WHERE id = ?',
        [id]
    );

    res.send(`Resource id ${id} deleted successfully`);
});


app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});