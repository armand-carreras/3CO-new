const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3000;
const DB_PATH = '/usr/src/app/db/ecodatabase.db';

app.use(express.json());
app.use(cors());

const db = new sqlite3.Database(DB_PATH, sqlite3.OPEN_READWRITE, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});

// Get all labels
app.get('/status', (req, res) => {
    res.json({status: 'Ok'});
});

// Get all labels
app.get('/labels', (req, res) => {
    db.all('SELECT * FROM labelsBase64', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get a random label
app.get('/labels/random', (req, res) => {
    db.get('SELECT * FROM labelsBase64 ORDER BY RANDOM() LIMIT 1', [], (err, row) => {
        if (err) {
            console.error(err);
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(row);
    });
});

// Get labels by name
app.get('/labels/search', (req, res) => {
    const name = req.query.name;
    db.all(`SELECT * FROM labelsBase64 WHERE NAME LIKE ? OR "KEY WORDS" LIKE ?`, [`%${name}%`, `%${name}%`], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Get label image by ID
app.get('/labels/image/:id', (req, res) => {
    const id = req.params.id;
    db.get('SELECT LOGO FROM labelsBase64 WHERE ID = ?', [id], (err, row) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (row) {
            res.json({ image: `data:image/png;base64,${row.LOGO.toString('base64')}` });
        } else {
            res.status(404).json({ error: 'Image not found' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});


/**
 * 🔹 Obtener etiquetas filtradas por forma, color y categoría
 */
app.post('/labels/filter-and-search', (req, res) => {
    const { name, selectedShapes, selectedColours, selectedCategories } = req.body;

    let conditions = [];
    let params = [];

    if (name) {
        conditions.push(`NAME LIKE ?`);
        params.push(`%${name}%`);
    }

    if (selectedShapes && selectedShapes.length > 0) {
        const shapeConditions = selectedShapes.map(() => `SHAPE LIKE ?`).join(' OR ');
        conditions.push(`(${shapeConditions})`);
        selectedShapes.forEach(shape => params.push(`%${shape}%`));
    }

    if (selectedColours && selectedColours.length > 0) {
        const colorConditions = selectedColours.map(() => `"MAIN COLOR" LIKE ?`).join(' OR ');
        conditions.push(`(${colorConditions})`);
        selectedColours.forEach(colour => params.push(`%${colour}%`));
    }

    if (selectedCategories && selectedCategories.length > 0) {
        const categoryConditions = selectedCategories.map(() => `CATEGORY LIKE ?`).join(' OR ');
        conditions.push(`(${categoryConditions})`);
        selectedCategories.forEach(category => params.push(`%${category}%`));
    }

    if (conditions.length === 0) {
        return res.status(400).json({ error: 'No search or filter parameters provided' });
    }

    const query = `SELECT * FROM labelsBase64 WHERE ${conditions.join(' AND ')}`;

    db.all(query, params, (err, rows) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});
