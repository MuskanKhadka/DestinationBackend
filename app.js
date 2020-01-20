const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const cors = require('cors');
const multer = require('multer');


var app = express();
require('./Database/DB');
const User=require('./Model/User');
const Auth=require('./Middleware/auth')

app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(cors());

//--------------------------------------------------------------------------------------------------
app.post('/Register', (req, res) => {

  User.findOne({ username: req.body.username }).then(function (user) {
      if (user) {
      res.json({message:"User already exist"});
      } else {
        var users = new User(req.body);
        users.save().then(function(val){

          res.json({message:"Register complete"});
        });
  
      }
    })
  });
 //--------------------------------------------------------------------------------- 
app.post('/login', async function (req, res) {
    console.log(req.body)
    const Users = await User.checkCrediantialsDb(req.body.username, req.body.password);
  if (Users) {
    const token = await Users.generateAuthToken();
    res.send({
      token: token,
      userdata: Users
    });
   } else {
    res.json({
      message: "Invalid login"
    })
  }

});
  
const PORT = 5000;
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`));
