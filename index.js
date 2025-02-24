import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
const bookArray =[{img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri3", author: "mohammad", rating:8, note: "Kheyli AWWWWWWWWWLi bud Kheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" }, {img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri99", author: "mohammad", rating:8, note: "NANE JENDEEEEEEE AWWWWWWWWWLi budKheyli AWWWWWWWjhgjhbbhgvjyhgvjyhghvyjhgvjyhgvyjhgvjythgvjyhgvjyhgvyjhfvcjyWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" }, {img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri3", author: "mohammad", rating:8, note: "Kheyli AWWWWWWWWWLi bud Kheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" },{img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" },{img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" },];
let targetedNote = "";


app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "books",
  password: "dbhoodad",
  port: 5432,
});
db.connect();



app.get("/", (req,res)=>{
  res.render("welcome.ejs");
})

app.get("/books", (req,res)=>{

let chamedun = {sentBookArray : bookArray, 
  modalNote : targetedNote }

  console.log("az back");


  res.render("index.ejs",chamedun );
  
})

app.get("/new", (req,res)=>{
  res.render("new.ejs");
})

app.get("/contact", (req,res)=>{
  res.render("contact.ejs");
})

app.post("/contact", (req,res)=>{

  var messageObj = new Message(req.body.cName, req.body.cEmail, req.body.cMessage);
  // add messageObj to database
 
  res.redirect("/");

})

app.post("/readMore", (req,res)=>{

 targetedNote = req.body.sentNote || "No note provided";
 
  res.redirect("/books");

})

app.post("/resetModal", (req,res)=>{

  targetedNote = req.body.resetModal;
  console.log("clicked");
  
   res.redirect("/books");
 
 })




function Message(name,email,message) {
  this.name = name;
  this.email = email; 
  this.message = message;
  

  console.log("you got an message from: " + this.name + " with email: " + this.email + " and message that says: " + this.message);

  
};


app.listen(port, ()=>{console.log("Server is running on port "+port)})