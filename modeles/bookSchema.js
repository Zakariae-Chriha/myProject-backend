const mongoose = require("mongoose");
const Schema = mongoose.Schema;

//define schema Article

const bookSchema = new Schema({
  userImage: { type: String },
  title: { type: String },
  authors: { type: String },
  description: { type: String },
  category: { type: String },
  preice: { type: String },
  preiceType: { type: String },
  publisher: { type: String },
});

// create a modele based on this Schema
const Book = mongoose.model("Book", bookSchema);
//modele export

module.exports = Book;
