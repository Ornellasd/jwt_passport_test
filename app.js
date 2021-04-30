const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const dotenv = require('dotenv').config();

const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtStrategy = require('./jwt');
passport.use(jwtStrategy);

const app = express();

//middleware
app.use(cors());
app.use(express.json());

const User = require('./user');

// mongoose setup
const mongoDB = 'mongodb://127.0.0.1/blog_api';
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.get('/api/users', (req, res) => {
  User.find({}, (err, users) => {
    if(err) {
      return err;
    } else {
      console.log(users);
      // jwt verify here? 
    }
  });
});

app.post('/api/login', (req, res) => {
  let { username, password } = req.body;

  User.findOne({ username: username }, (err, user) => {
    if(err) {
      console.log('WEEOWEEEOWEE');
      res.json(err);
    }
    if(user && user.password == password) {
      console.log(`${user.username} logged in successfully!`);
      const opts = {};
      opts.expiresIn = 120;
      const secret = process.env.SECRET_KEY;
      const token = jwt.sign({ user }, secret, opts);
      return res.status(200).json({
        message: 'Auth Passed',
        token
      });
    } else {
      console.log('Username or password wrong.');
    }
  });
});

app.get('/api/signup', (req, res) => {
  //console.log('SIGN UP TEST');
  res.json({
    message: 'derp'
  });
});

app.get("/protected", passport.authenticate('jwt', { session: false }), (req, res) => {
  return res.status(200).send("YAY! this is a protected Route")
});

app.get("/unprotected", (req, res) => {
  return res.status(200).send("YAY! this is an unprotected Route")
});


app.listen(3002, () => console.log('Server started on port 3002'));