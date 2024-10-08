const express = require('express');
const multer = require('multer');
const cors = require('cors');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const upload = multer({ dest: 'uploads/' });

let csvData = [];

app.post('/upload', upload.single('file'), (req, res) => {
    const results = [];
    fs.createReadStream(req.file.path)
        .pipe(csv())
        .on('data', (data) => results.push(data))
        .on('end', () => {
            csvData = results;
            fs.unlinkSync(req.file.path); // Remove uploaded file
            res.json({ message: 'File uploaded successfully', data: results });
        });
});

app.get('/data', (req, res) => {
    res.json(csvData);
});

app.get('/search', (req, res) => {
    const searchTerm = req.query.q.toLowerCase();
    const filteredData = csvData.filter(item => 
        Object.values(item).some(value => value.toLowerCase().includes(searchTerm))
    );
    res.json(filteredData);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
