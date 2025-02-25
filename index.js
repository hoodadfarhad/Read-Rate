import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";

const app = express();
const port = 3000;
//const bookArray =[{img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri3", author: "mohammad", rating:8, note: "Kheyli AWWWWWWWWWLi bud Kheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" }, {img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri99", author: "mohammad", rating:8, note: "NANE JENDEEEEEEE AWWWWWWWWWLi budKheyli AWWWWWWWjhgjhbbhgvjyhgvjyhghvyjhgvjyhgvyjhgvjythgvjyhgvjyhgvyjhfvcjyWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" }, {img:'bookCover.jpg', title: "kir1", author: "ahmad", rating:6, note: "Kheyli foqolade bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kiri3", author: "mohammad", rating:8, note: "Kheyli AWWWWWWWWWLi bud Kheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi budKheyli AWWWWWWWWWLi bud" },{img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" },{img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" }, {img:'bookCover.jpg', title: "kir2", author: "ali", rating:2, note: "Kheyli bad bud" },];
var bookArray =[];
let targetedNote = "";
let title = "";
let author = "";
let rating;
let note = "";
let id;


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

db.query("SELECT * FROM public.book", (err,result)=>{
  if(err){
    console.error("sth went wrong", err.stack);
  } else{
  bookArray = result.rows;
  
  
  }
})

app.get("/", (req,res)=>{
  res.render("welcome.ejs");
})

app.get("/books", (req,res)=>{
  console.log(bookArray);
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

 app.post("/addingBook", (req,res)=>{



  title = req.body.title;
  author = req.body.author;
  rating =  parseInt(req.body.rate, 10); // Convert from string to integer (base 10)
  note = req.body.note;

  console.log(typeof(rating));

  db.query("INSERT INTO book (title,author,rating,note) VALUES($1,$2,$3,$4)", [title,author,rating,note]);

  db.query("SELECT * FROM public.book", (err,result)=>{
    if(err){
      console.error("sth went wrong", err.stack);
    } else{
    bookArray = result.rows;
    console.log("mohtaviate araye jadid az dakhele addingBook:");
    console.log(bookArray);
    }
  })
  
  
   res.redirect("/books");
 
 })




 app.post("/deleteNote", (req,res)=>{



  id = req.body.dlReqNote;
  console.log(id);
  console.log(typeof(id));

  db.query("DELETE FROM book WHERE id = $1", [id], (err, result) => {
    if (err) {
        console.error("Deletion failed:", err.stack);
    } else {
        console.log("Book deleted successfully");
    }
});


  db.query("SELECT * FROM public.book", (err,result)=>{
    if(err){
      console.error("sth went wrong", err.stack);
    } else{
    bookArray = result.rows;
    console.log("mohtaviate araye jadid az dakhele addingBook:");
    console.log(bookArray);
    }
  })
  
  
   res.redirect("/books");
 
 })

 


function Message(name,email,message) {
  this.name = name;
  this.email = email; 
  this.message = message;
  

  console.log("you got an message from: " + this.name + " with email: " + this.email + " and message that says: " + this.message);

  
};


app.listen(port, ()=>{console.log("Server is running on port "+port)})