// Require express package
const express = require('express');
// // Initialize app variable by setting it to the value of express()
const app = express();
// Require file system
const fs = require('fs');
const { title } = require('process');
// Require the JSON file and assign it to a variable called `dataBase`
const dataBase = require('./db/db.json');
// Helper method for generating unique ids
const uuid = require('./helpers/uuid');

const PORT = process.env.PROCESS || 3000;

let notesArr = [];

// Express middleware 
app.use(express.json());
app.unsubscribe(express.urlencoded({ extended: true }));
app.use(express.static('public'));

// GET method route for notes.html
app.get("/notes", (req, res) => {
    // `res.sendFile` is Express' way of sending a file
    // `__dirname` is a variable that returns the directory that the server is running in
    res.sendFile(path.join(__dirname, '/public/notes.html'));
});

// GET method route for index.html
app.get('/*/', (req, res) => {
    // res.json(`${req.method} request received to get index.html`)
    // console.log(`${req.method} request received to get index.html`);
    
    res.sendFile(__dirname + '/public/index.html');
});

// GET request for /api/notes
app.get('/api/notes', (req, res) => {
    // let results = dataBase;
    // if (req.query) {
    //     results = 
    // }
    fs.readFile('db/db.json', 'utf8', function(err, data) {
        // Display the file content
        console.log(data);

        notesArr = [].concat(JSON.parse(data));
        res.json(JSON.parse(data));
    });
    // should read the db.json file and return all saved notes as JSON.
});

// POST method route for /api/notes (post to homepage)
app.post('/api/notes', (req, res) => {
    // confirm POST request received
    console.info(`${req.method} request for notes`);

    if (title && text) {
        //should receive a new note to save on the request body, 
        const newNote = {
            title,
            text,
            review_id: uuid(),
        };

        const response = {
            status: 'success',
            body: newNote,
        };
        fs.writeFile('db/db.json', 'utf8', function(err, data) {
            //add it to the db.json file,
            console.log(response);
            res.json(response); 
        });
    } else {
        res.json('Error in posting note');
    }
//     //and then return the new note to the client. 
//     //You'll need to find a way to give each note a unique id when it's saved 
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