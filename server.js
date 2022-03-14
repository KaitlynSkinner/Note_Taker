// Require express package
const express = require('express');
// Require file system
const fs = require('fs');
// Require path module - handle and transform file path
const path = require('path');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PROCESS || 3000;
// Initialize app variable by setting it to the value of express()
const app = express();

//const { title } = require('process');
// Require the JSON file and assign it to a variable called `dataBase`
//const dataBase = require('./db/db.json');

let notesArr = [];

// Express middleware 
// parse incoming string or array data
app.use(express.urlencoded({ extended: true }));
// parse incoming JSON
app.use(express.json());
// serve static files 
app.use(express.static('public'));

// GET method route for notes.html
app.get("/notes", (req, res) => {
    // `res.sendFile` is Express' way of sending a file
    // `__dirname` is a variable that returns the directory that the server is running in
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET method route for index.html
app.get('/*/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

// GET request for /api/notes - server requesting clinet to accept data
app.get('/api/notes', (req, res) => {
    fs.readFile('db/db.json', 'utf8', function(err, data) {
        // Display the file content
        console.log(data);

        //Concatenate note to array
        notesArr = [].concat(JSON.parse(data));
        res.json(JSON.parse(data));
    });
    // should read the db.json file and return all saved notes as JSON.
});

// POST method route for /api/notes (post to homepage) - client requesting the server to accept data
app.post('/api/notes', (req, res) => {

    // Destructuring assignment for the items in req.body
    const { title, text } = req.body;

    // If all the required properties are present..
    if (title && text) {
        // Variable to receive a new note - to save on the request body, 
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        // Obtain exisiting notes
        fs.readFile('db/db.json', notesArr, function(err, data) {
            if(err) {
                console.error(err);
            } else {

            // Add a new note
            notesArr.push(newNote);

            // Write updates notes back to the file
            fs.writeFile(
                './db/db.json',
                JSON.stringify(notesArr, null, 4),
                (writeErr) =>
                  writeErr
                    ? console.error(writeErr)
                    : console.info('Successfully added note!')
              );
            }
        });

        const response = {
            status: 'success',
            body: newNote,
        };

        console.log(response);
        res.send(response);
    } else {
        res.json('Error in posting note');
    }
});

//BONUS
// app.delete("/api/notes/:id", (req, res) => {
//     should receive a query parameter containing the id of a note to delete. 
//     actions.remove(req.params.id);
//     return res.send();

//     In order to delete a note you'll need to:
//     * read all notes from the db.json file, 
//     * remove the note with the given id property, 
//     * and then rewrite the notes to the db.json file.
// });

app.listen(PORT, () => {
    console.log(`API server now on port ${PORT}!`);
});