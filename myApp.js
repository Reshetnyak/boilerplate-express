require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({extended: false}));

app.use((req, res, next) => {
    console.log(`${req.method} ${req.path} - ${req.ip}`);
    next();
});

app.use('/public', express.static(__dirname + '/public'));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
});

app.get('/json', (req, res) => {
    let message = 'Hello json';
    if (process.env.MESSAGE_STYLE === 'uppercase') {
        message = message.toUpperCase();
    }
    res.json({message});
});

app.get('/now', 
    (req, res, next) => {
        req.time = new Date().toString();
        next();
    },
    (req, res, next) => {
        res.json({time: req.time});
    }
);

app.get('/:word/echo', (req, res) => {
    res.json({echo: req.params.word});
});

const getNameHandler = (req, res) => {
    const {first, last} = req.query;
    res.json({name: `${first} ${last}`});
};

const postNameHandler = (req, res) => {
    const {first, last} = req.body;
    res.json({name: `${first} ${last}`});
};

app.route('/name')
    .get(getNameHandler)
    .post(postNameHandler);

module.exports = app;
