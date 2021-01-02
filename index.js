const express = require('express')
const {spawn} = require('child_process');
const cors = require('cors')
const app = express()
const port = 3000
const fs = require('fs')

// Middleware
app.use(cors())

app.get('/movieProcess', (req, res) => {
 
    // spawn new child process to call the python script
    const python = spawn('python', ['movie_processing.py', req.query.emotion]);
    // collect data from script
    python.stdout.on('data', function (data) {
        if(data.toString() == 'error'){
            res.send('Unable to obtain movies. Try again later')
        }
        else {
            res.send(data.toString());
        }
    });
})

app.get('/songProcess', (req, res) => {
 
    // spawn new child process to call the python script
    const python = spawn('python', ['songs.py', req.query.emotion]);
    // collect data from script
    python.stdout.on('data', function (data) {
        if(data.toString() == 'error'){
            res.send('Unable to obtain songs. Try again later')
        }
        else {
            res.send(data.toString());
        }
    });
})

app.get('/movieRecommendation', (req, res) => {
 
    // spawn new child process to call the python script
    const python = spawn('python', ['movie_recommendation.py', req.query.movie]);
    
    // collect data from script
    python.stdout.on('data', function (data) {
        if(data.toString() == 'error'){
            res.send('Unable to obtain movie list. Try again later')
        }
        else {
            res.send(data.toString());
        }
    });
})


app.get('/emotion', (req, res) => {
 
    // spawn new child process to call the python script
    const python = spawn('python', ['emotion.py', req.query.text]);
    // collect data from script
    python.stdout.on('data', function (data) {
        res.send(data.toString());
    });

})

app.get('/location', (req, res) => {
 
    // spawn new child process to call the python script
    const python = spawn('python', ['location.py', req.query.emotion]);
    
    python.stdout.on('data', function (data) {
        if(data.toString() == 'error'){
            res.send('Unable to obtain locations. Try again later')
        }
        else {
            res.send(data.toString());
        }
    });

})

app.get('/api/test', function (req, res) {

    // do stuff with file 
    // spawn new child process to call the python script
    const python = spawn('python', ['voice.py', req.query.voice]);

    // collect data from script
    python.stdout.on('data', function (data) {
        if(data.toString() == 'error'){
            res.send('Unable to obtain locations. Try again later')
        }
        else {
            res.send(data.toString());
        }
    });
});


app.listen(port, () => console.log(`Example app listening on port ${port}!`))