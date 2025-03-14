import express from "express";
import bodyParser from "body-parser";
import pg from "pg";
import axios from "axios";
import dotenv from 'dotenv';


const app = express();
const port = 3000;

var bookArray =[];
var bookArrayRecency =[];
var bookArrayRating =[];
var bookArrayAlphabet =[];
var topTwo = [];
let targetedNote = "";
let id;
let sortChoice = 2;
let indicator = 0;

dotenv.config();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

const db = new pg.Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
});
db.connect();


db.query("SELECT * FROM public.book", (err,result)=>{
  if(err){
    console.error("sth went wrong", err.stack);
  } else{
  bookArray = result.rows;
  }
})


await ratingSort();


async function fetchBooks(inp) {
//const result = await db.query("SELECT title, author FROM public.book")
console.log(inp);
  // bookArrayBuffer = result.rows;
  let title = inp; ///////////
 
   const coverID = await axios.get(`https://openlibrary.org/search.json?title=${title}`);
   if (coverID.data.numFound == 0) {
    let cover = `https://covers.openlibrary.org/b/id/undefined-M.jpg`;
    return cover;
   } else {
      console.log(coverID.data.docs[0].cover_i);
      let ID = coverID.data.docs[0].cover_i;
      let cover = `https://covers.openlibrary.org/b/id/${ID}-M.jpg`;
      return cover;
   }
      


};







// For Sorting Request by Date
async function dateSort() {
  const result = await db.query("SELECT * FROM public.book ORDER BY date DESC");
    bookArrayRecency = result.rows;
    return bookArrayRecency;
    }
  



// For Sorting Request by rating, and welcome page top two
async function ratingSort() {
const result = await db.query("SELECT * FROM public.book ORDER BY rating DESC");
  bookArrayRating = result.rows;

 return bookArrayRating;
}

// For Sorting Request by Alphabet
async function alphabetSort() {
  const result = await db.query("SELECT * FROM public.book ORDER BY title ASC");
  bookArrayAlphabet = result.rows;
    return bookArrayAlphabet;
}

async function sotring(choice) {
  
sortChoice = choice;

  switch (sortChoice) {
    case 1:
      bookArray =  await ratingSort();
      break;
  
      case 2:
      bookArray = await dateSort();
      break;
  
      case 3:             
      bookArray = await alphabetSort();
      break;
  
      case 4:
        bookArray; // I know its stupid
        break;
  
    default:
      break;
  }



}

app.get("/", async (req,res)=>{
  
 let x = await ratingSort();
  
 

  if (x.length === 1) { // if only there was one book in DB

    // console.log("im in A");
    topTwo.push(x[0]);
  } else if (x.length > 1){
    // console.log("im in B");
    topTwo.push(x[0]);
    topTwo.push(x[1]);
  }
  // console.log("top two are:");
  // console.log(topTwo);

  let packWelcome = {sentTopTwo : topTwo} 

  topTwo = [];
  
  res.render("welcome.ejs", packWelcome);
})






app.get("/books",  (req,res)=>{

  

   indicator = 1;   // to change header while at /books




//  console.log(bookArray);
let pack = {sentBookArray : bookArray, 
  modalNote : targetedNote, sentIndicator : indicator}

 // console.log("az back");


  res.render("index.ejs",pack );
  
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

 app.post("/addingBook", async (req, res) => {
  try {
    // Extract form data
    const title = req.body.title;
    const author = req.body.author;
    const rating = parseInt(req.body.rate, 10); // Convert from string to integer
    const note = req.body.note;

    console.log(typeof rating);

    // Fetch the book cover asynchronously
    const coverURL = await fetchBooks(title); //  Wait for fetchBooks to complete

    // Insert into database and wait for it to complete
    await db.query("INSERT INTO book (title, author, rating, note, coverurl) VALUES($1, $2, $3, $4, $5)", 
      [title, author, rating, note, coverURL]);

    // Fetch updated books list and wait for it to complete
    const result = await db.query("SELECT * FROM public.book");

    // Store the updated book array
     bookArray = result.rows;
    // console.log("Updated book array:", bookArray);
    sortChoice =4;
    
    res.redirect("/books");
  } catch (err) {
    console.error("Something went wrong:", err.stack);
    res.status(500).send("Internal Server Error");
  }
});





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
   // console.log(bookArray);
    }
  })
  
  sotring(1);
  
   res.redirect("/books");
 
 })




 app.get("/ratingSort", (req,res)=>{
  sotring(1);
  res.redirect("books");
})
app.get("/dateSort", (req,res)=>{
  sotring(2);
  res.redirect("books");
})
app.get("/alphaSort", (req,res)=>{
  sotring(3);
  res.redirect("books");
})
 
  


function Message(name,email,message) {
  this.name = name;
  this.email = email; 
  this.message = message;
  

  console.log("you got an message from: " + this.name + " with email: " + this.email + " and message that says: " + this.message);

  
};


app.listen(port, ()=>{console.log("Server is running on port "+port)})