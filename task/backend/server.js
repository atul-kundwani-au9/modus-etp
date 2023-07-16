const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// File upload configuration using multer
const upload = multer({ dest: 'uploads/' });

// Read CSV file
app.get('/api/data', (req, res) => {
  const results = [];

  fs.createReadStream('data.csv')
    .pipe(csvParser())
    .on('data', (data) => results.push(data))
    .on('end', () => {
      res.json(results);
    });
});

// Create new entry
app.post('/api/data', upload.single('file'), (req, res) => {
  const data = req.body;

  // Process the data received in the request body and store it in the data storage
  const values = Object.values(data);
  const newRow = values.join(',');

  fs.appendFile('data.csv', `\n${newRow}`, (err) => {
    if (err) {
      console.error('Error appending data to the CSV file:', err);
      res.status(500).send('Error appending data to the CSV file');
    } else {
      res.send('Data appended to the CSV file successfully.');
    }
  });
});

// Update entry
app.put('/api/data/:id', (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  const rows = [];
  let updated = false;

  fs.createReadStream('data.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      if (row.id === id) {
        rows.push(newData);
        updated = true;
      } else {
        rows.push(row);
      }
    })
    .on('end', () => {
      if (!updated) {
        res.status(404).send(`Entry with ID ${id} not found.`);
      } else {
        const updatedCsvData = rows.map((row) => Object.values(row).join(','));
        const updatedCsvString = updatedCsvData.join('\n');

        fs.writeFile('data.csv', updatedCsvString, (err) => {
          if (err) {
            console.error('Error updating the CSV file:', err);
            res.status(500).send('Error updating the CSV file');
          } else {
            res.send(`Entry with ID ${id} updated successfully.`);
          }
        });
      }
    });
});

// Delete entry
app.delete('/api/data/:id', (req, res) => {
  const id = req.params.id;

  const rows = [];
  let deleted = false;

  fs.createReadStream('data.csv')
    .pipe(csvParser())
    .on('data', (row) => {
      if (row.id !== id) {
        rows.push(row);
      } else {
        deleted = true;
      }
    })
    .on('end', () => {
      if (!deleted) {
        res.status(404).send(`Entry with ID ${id} not found.`);
      } else {
        const updatedCsvData = rows.map((row) => Object.values(row).join(','));
        const updatedCsvString = updatedCsvData.join('\n');

        fs.writeFile('data.csv', updatedCsvString, (err) => {
          if (err) {
            console.error('Error updating the CSV file:', err);
            res.status(500).send('Error updating the CSV file');
          } else {
            res.send(`Entry with ID ${id} deleted successfully.`);
          }
        });
      }
    });
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});
