const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const session = require('express-session');
const regd_users = express.Router();

let users = [{"username":"user13","password":"pwd13"},
    {"username":"arturo","password":"pwd123"}];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
 let exist = users.filter(user=>user.username==username);
  if(exist.count>0){
    return false;
  }
  return true;
}

const authenticatedUser = (username,password)=>{ //returns boolean
//write code to check if username and password match the one we have in records.

let userExist= users.filter(user=>user.username==username);

if(userExist.count==0)return false;

return userExist[0].password==password;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  //Write your code here

  const { username, password } = req.body;
  
  if(!authenticatedUser(username,password )){
    return res.status(400).json({message: "Invalid credentials"});  
  }
  const token = jwt.sign({username}, "fingerprint_customer");
 
  res.status(200).json({ token });
  //return res.status(300).json({message: "Yet to be implemented"});
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
   let book=books[req.params.isbn];
 
  const token = req.headers['authorization'];
     
     jwt.verify(token, "fingerprint_customer", (err, decoded) => {
     if (err) {
       res.send('Invalid User');
     } else {
        let currentUser= decoded.username;
        // Token is valid, send welcome message with username
        
        if(book==undefined){
            res.status(300).send("ISBN not found");
        } 
        
        let currentReview = book.reviews[currentUser];
        
        console.log("review", req.body.review)
        //const newReview={currentUser:{username,"review": req.body.review};
      
        book.reviews[currentUser]=req.body.review;
        return res.status(200).json({message: "Review posted", updatedBook: book});
    }});      
        
     
      res.status(200).json({message: "Review posted", updatedBook: book});
});


regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
   let book=books[req.params.isbn];
 
  const token = req.headers['authorization'];
     
     jwt.verify(token, "fingerprint_customer", (err, decoded) => {
     if (err) {
       res.send('Invalid User');
     } else {
        let currentUser= decoded.username;
        // Token is valid, send welcome message with username
        
        if(book==undefined){
            res.status(300).send("ISBN not found");
        } 
        
       
       
        //const newReview={currentUser:{username,"review": req.body.review};
      
        delete books[req.params.isbn].reviews[currentUser];
          res.json({message: "Review deleted", updatedBook: book});
    }});    
      });
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
