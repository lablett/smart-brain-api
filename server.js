const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');

const app = express();

// To initialise middleware
app.use(bodyParser.json());
app.use(cors());

// Temporary 'database'
const database = {
    users: [
        {
            id: '123',
            name: 'John',
            email: 'john@gmail.com',
            password: 'daffodil',
            entries: 0,
            joined: new Date()
        },
        {
            id: '143',
            name: 'Maisy',
            email: 'maisy@gmail.com',
            password: 'pudding',
            entries: 0,
            joined: new Date()
        },
        {
            id: '13',
            name: 'Delilah',
            email: 'delilah@gmail.com',
            password: 'ditzy',
            entries: 0,
            joined: new Date()
        }
    ],
    login: [
        {
            id: '978',
            has: '',
            email: 'john@gmail.com'
        }
    ]
}

app.get('/', (req, resp) => {
    resp.send(database.users)
});

// Sign in user request
app.post('/sign-in', (req, resp) => {
        // JSON response string
    // Check against database
    // Use body-parser to access info
    if (req.body.email === database.users[0].email &&
        req.body.password === database.users[0].password){
        resp.json(database.users[0])
    } else {
        resp.status(400).json('Error signing in')
    }
});

// Grab user id
app.get('/profile/:id', (req, resp) => {
    const { id } = req.params;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            return resp.json(user);
        } 
    })

    if (!found){
        resp.status(404).json('user not found');
    }
})

// Image
// Put request as updating user information
app.put('/image', (req, resp) => {
    const { id } = req.body;
    let found = false;
    database.users.forEach(user => {
        if (user.id === id){
            found = true;
            user.entries++;
            return resp.json(user.entries);
        } 
    })

    if (!found){
        resp.status(404).json('user not found');
    }
})

// New user request
// TODO: remove password response
app.post('/register', (req, resp) => {
    const { email, name, password } = req.body;

    database.users.push({
        id: '124',
        name: name,
        email: email,
        password: password,
        entries: 0,
        joined: new Date()
    });
    // Always require response
    resp.json(database.users[database.users.length-1])
});


// bcrypt.hash(password, null, null, function(err, hash) {
    //     console.log(hash);
    // });
// Load hash from your password DB.
// bcrypt.compare("bacon", hash, function(err, res) {
//     // res == true
// });
// bcrypt.compare("veggies", hash, function(err, res) {
//     // res = false
// });


app.listen(3000, () => {
    console.log('App is running on port 3000')
});
