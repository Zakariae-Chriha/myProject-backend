const { default: mongoose } = require("mongoose");
const mangoose = require("mongoose");
const { stringify } = require("nodemon/lib/utils");
const Schema = mongoose.Schema;

//define schema Article

const booksSchema = new Schema({
  userImage: {
    type: String,
    required: true,
    default:
      "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg",
  },
  title: { type: String, required: true },
  authors: { type: String, required: true },
  description: { type: String, required: true },
  //Category: { type: String, required: true },
});

// create a modele based on this Schema
const Books = mongoose.model(" Books ", booksSchema);
//modele export

module.exports = Books;
