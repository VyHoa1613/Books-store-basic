// server.js
// where your node app starts

// we've started you off with Express (https://expressjs.com/)
// but feel free to use whatever libraries or frameworks you'd like through `package.json`.
const express = require('express');
const app = express();
const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
const shortid = require('shortid')

 
const adapter = new FileSync('db.json')
const db = low(adapter)

app.set('view engine', 'pug');
app.set('views','./views');
app.use(express.json()) // for parsing application/json
app.use(express.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded

db.defaults( {books: [] })
  .write()
// https://expressjs.com/en/starter/basic-routing.html
const dreams = [
  "Find and count some sheep",
  "Climb a really tall mountain",
  "Wash the dishes"
];

// make all the files in 'public' available
// https://expressjs.com/en/starter/static-files.html

app.get("/books",(req, res) => {
  res.render("books",{
    books:db.get("books").value()
  })
})
//update book
app.get("/books/:id/update",(req, res) => {
  var id = req.params.id;
  var book = db.get("books").find({id: id}).value();
  res.render("update",{
    books:book
  });
})

app.post("/books/update",(req, res) => {
  var id = req.body.id;
  console.log(req.body);
  db.get("books").find({id:id}).assign({title:req.body.title, descripton:req.body.description}).write();
  res.redirect("/books")
})
//delete book
app.get("/books/:id/delete",(req, res) => {
  var id = req.params.id;
  db.get("books").remove({id:id}).write();
  res.redirect("/books");
})

app.get("/books/create",(req, res) => {
  res.render("create");
})
// add book
app.post("/books/create", (req, res) => {
  req.body.id = shortid.generate();
  db.get("books").push(req.body).write();
  res.redirect("/books");
})

// listen for requests :)
app.listen(process.env.PORT, () => {
  console.log("Server listening on port " + process.env.PORT);
});
