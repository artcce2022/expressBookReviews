const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  const { username, password } = req.body;
  console.log(users)
  if(username=="" || username==undefined)
      return res.status(400).json({message: "Must send a valid username"});
  if(password=="" || password==undefined)
      return res.status(400).json({message: "Must send a valid password"});
  let exist = isValid(username);
  if(!exist){
    return res.status(400).json({message: "Username already exist"});
  }
  
  users.push({"username":username, "password":password});
 
  return res.status(200).json({message: "User registered succesfuly"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  new Promise((resolve,reject) => {
        resolve(books);
   }).then((result)=>{
    return res.status(200).json(result);
   }) 
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  //Write your code here 
  new Promise((resolve,reject) => {
    let book=books[req.params.isbn];
    if (book==undefined){
        reject();
    }
    else {resolve(book);}
}).then((result)=>{
    return res.status(200).json(result);
}).catch(()=>{
    return res.status(200).json({message:"ISBN not found"});
}) 
 

 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  new Promise((resolve,reject) => {
    const booksArray = Object.entries(books).map(([id, book]) => ({ id: Number(id), ...book }));
    let book = booksArray.filter(book=> book.author==req.params.author);
    if (book==undefined){
        reject();
    }
    else {resolve(book);}
}).then((result)=>{
    return res.status(200).json(result);
}).catch(()=>{
    return res.status(200).json({message:"AUTHOR NOT FOUND"});
}) 
   
 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  //Write your code here
  new Promise((resolve,reject) => {
    const booksArray = Object.entries(books).map(([id, book]) => ({ id: Number(id), ...book }));
    let book = booksArray.filter(book=> book.title==req.params.title);
  
    if (book==undefined){
        reject();
    }
    else {resolve(book);}
}).then((result)=>{
    return res.status(200).json(result);
}).catch(()=>{
    return res.status(200).json({message:"TITLE NOT FOUND"});
})  
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here

  let book=books[req.params.isbn];
  return res.status(200).json(JSON.stringify(book.reviews));
});

module.exports.general = public_users;
