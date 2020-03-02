const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : 'lcars-prime',
      database : 'smartbrain'
    }
  });

const app = express();

// To initialise middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, resp) => {
    resp.send(database.users)
});

// Sign in user request
app.post('/sign-in', (req, resp) => {
    db.select('email', 'hash').from('login')
    .where('email', '=', req.body.email)
        .then(data => {
            const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
            if (isValid){
                db.select('*').from('users')
                .where('email', '=', req.body.email)
                .then(user => {
                    resp.json(user[0])
                })
                .catch(err => resp.status(400).json('Unable to get user'))
            } else {
                resp.status(400).json('Incorrect username or password')
            }
        })
        .catch(err => resp.status(400).json('Incorrect username or password'))
});

// Grab user id
// Future profile page?
app.get('/profile/:id', (req, resp) => {
    const { id } = req.params;
    let found = false;
    db.select('*').from('users').where({id})
    .then(user => {
        if (user.length){
            resp.json(user[0])
        } else {
            resp.status(400).json('User not found')
        }
    })
    .catch(err => resp.status(400).json('error getting user'));
    
})

// Image
// Put request as updating user information
app.put('/image', (req, resp) => {
    const { id } = req.body;
    db('users').where('id', '=', id)
    .increment('entries', 1)
    .returning('entries')
    .then(entries => resp.json(entries[0]))
    .catch(err => resp.status(400).json('Error updating entry count'))
})

// New user request
// TODO: remove password response
app.post('/register', (req, resp) => {
    const { email, name, password } = req.body;
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
            .returning('*')
            .insert({
                name: name,
                email: loginEmail[0],
                joined: new Date()
            })
            .then(user => resp.json(user[0]))
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => resp.status(400).json('Unable to register'))
    // Always require response
});


app.listen(3000, () => {
    console.log('App is running on port 3000')
});
