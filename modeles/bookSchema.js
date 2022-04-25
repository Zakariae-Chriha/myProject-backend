const mongoose = require('mongoose')
const Schema = mongoose.Schema

//define schema Article

const bookSchema = new Schema({
  userImage: { type: String, required: true },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String },
})

// create a modele based on this Schema
const Book = mongoose.model('Book', bookSchema)
//modele export

module.exports = Book
