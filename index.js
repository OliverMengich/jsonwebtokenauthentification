const express = require('express');
const jsonwebtoken = require('jsonwebtoken');
const app = express();

app.get('/', (req, res) => {
    res.json({
        message: "Hello Son"
    })
})
// we are tryna protect this post route to only the users we want
app.post('/mainpage', verifyToken, (req, res) => {
    jsonwebtoken.verify(req.token, 'secretKey', (err, authData) => {
        // if there is an error something like a mismatch
        if (err) {
            res.status(403).json({
                message: " token mismatch Sir",
                err
            })
        } else {
            res.json({
                message: "POST request success",
                authData
            });
        }
    });
})

app.post('/login', (req, res) => {
    // mock user
    const user = {
        id: 1,
        username: "oliver",
        email: "hellooo@me.com"
    }
    jsonwebtoken.sign({ user }, 'secretKey', (err, token) => {
        res.json({
            token
        })
    })
})

//FORMAT OF TOKEN
//Authorization: Bearer <access_token> 

//verify the token
function verifyToken(req, res, next) {
    // Get the auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer is undefined
    if (typeof bearerHeader !== 'undefined') {
        // continues
        // split at the space
        const bearer = bearerHeader.split(' ');
        // get tokem from array
        const bearerToken = bearer[1];
        //set the token
        req.token = bearerToken;
        //next
        next();
    } else {
        // its forbidden
        res.status(403).json({
            message: "FORBIDDEN TO ACCESS"
        })
    }
}
app.listen(3000, () => {
    console.log('App listening on PORT 3000');
})