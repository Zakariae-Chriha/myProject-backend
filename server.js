const express = require("express");
const app = express();
const port = 5000;
const { imageUploader, catUploader } = require("./middlewares/imageUploader");
var bodyParser = require("body-parser");
const cors = require("cors");

// mongoose Connected
const mongoose = require("mongoose");
const Books = require("./modeles/booksSchema");
const { modelName, findByIdAndDelete } = require("./modeles/booksSchema");
mongoose
  .connect(
    "mongodb+srv://zakariae:1234@cluster0.ldyog.mongodb.net/books-comunity?retryWrites=true&w=majority"
  )
  .then((result) =>
    app.listen(port, () => {
      console.log(`Example app listening on localhost://${port}`);
    })
  )
  .catch((error) => console.log(error));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));

// parse application/json
app.use(bodyParser.json());
app.use(cors());
//upload file
app.post("/upload", (req, res) => {
  res.sendFile("upload file");
});
//upload photos
app.post(
  "/upload-profile-pic",
  imageUploader.single("profile_pic"),
  (req, res) => {
    if (!req.file) res.status(400).send("No file selected");
    console.log(req.file);
    res.send("picture upload");
  }
);
//insert books
app.post("/insert", async (req, res) => {
  const userImage = req.body.userImage;
  const title = req.body.title;
  const authors = req.body.authors;
  const description = req.body.description;
  //const Category = req.body.Category;
  const books = new Books({
    userImage: userImage,
    title: title,
    authors: authors,
    description: description,
    //Category: Category,
  });

  try {
    await books.save();
    res.send("inserted data");
  } catch (Error) {
    console.log(Error);
  }
});
//read books
app.get("/read", async (req, res) => {
  Books.find({}, (error, result) => {
    if (error) {
      res.send(error);
    } else {
      res.send(result);
    }
  });
});
app.put("/update", async (req, res) => {
  const newBooks = req.body.newBooks;
  const id = req.body.id;
  try {
    await Books.findById(id, (Error, updateBooks) => {
      updateBooks.authors = newBooks;
      updateBooks.save();
      res.send("update data");
    });
  } catch (Error) {
    console.log(Error);
  }
});
app.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await Books.findByIdAndDelete(id).exec();
    res.send("deleted");
  } catch (Error) {
    console.log(Error);
  }
});
