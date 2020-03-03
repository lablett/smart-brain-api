const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      connectionString : process.env.DATABASE_URL,
      ssl: true
    }
  });

const app = express();

// To initialise middleware
app.use(bodyParser.json());
app.use(cors());

app.get('/', (req, resp) => { resp.send(
  //database.users)
  'it is working!')
});

// Sign in user request
app.post('/sign-in', (req, resp) => { signin.handleSignIn(req, resp, db, bcrypt) });
    
// Grab user id
// Future profile page?
app.get('/profile/:id', (req, resp) => { profile.handleProfileGet(req, resp, db) });

// Image
// Put request as updating user information
app.put('/image', (req, resp) => { image.handleImage(req, resp, db) });
app.post('/imageURL', (req, resp) => { image.handleAPICall(req, resp) });
// New user request
app.post('/register', (req, resp) => { register.handleRegister(req, resp, db, bcrypt) }); // Dependency injection

app.listen(process.env.PORT || 3000, () => {
    console.log(`App is running on port ${process.env.PORT}`)
});
