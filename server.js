const express = require('express')
const app = express()
require('dotenv').config()
const port = 8000
const { imageUploader } = require('./middlewares/imageUploader')
const cors = require('cors')
const mongoose = require('mongoose')
const Book = require('./modeles/bookSchema')
const User = require('./modeles/userSchema')
const mg = require('mailgun-js')
const {
  register,
  login,
  approveSession,
  getUserInfo,
} = require('./controllers/userController')
const { verifyToken } = require('./middlewares/verifyToken')
//email
const mailgun = () =>
  mg({
    apiKey: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMIAN,
  })

// Mongo Connection
mongoose
  .connect(
    'mongodb+srv://zakariae:1234@cluster0.ldyog.mongodb.net/books-comunity?retryWrites=true&w=majority'
  )
  .then((result) =>
    app.listen(port, () => {
      console.log(`Example app listening on http://localhost:${port}`)
    })
  )
  .catch((error) => console.log(error))

// Middlewares
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(cors())

// upload userpic
app.post(
  '/upload-profile-pic',
  imageUploader.single('profile_pic'),
  (req, res) => {
    if (!req.file) {
      res.status(400).send('No file selected')
    } else {
      res.send(`http://localhost:8000/images/${req.file.originalname}`)
    }
  }
)

// insert book
app.post('/insert', async (req, res) => {
  const userImage = req.body.userImage
  const title = req.body.title
  const authors = req.body.authors
  const description = req.body.description
  const category = req.body.category
  const preice = req.body.preice
  const preiceType = req.body.preiceType
  const publisher = req.body.publisher

  const books = new Book({
    userImage: userImage,
    title: title,
    authors: authors,
    description: description,
    category: category,
    preice: preice,
    preiceType: preiceType,
    publisher: publisher,
  })

  try {
    await books.save()
    res.send(`yes`)
  } catch (Error) {
    console.log(Error)
  }
})

// get books by category
app.get('/read', async (req, res) => {
  const { category } = req.query

  if (!category) {
    Book.find({}, (error, result) => {
      if (error) {
        res.send(error)
      } else {
        res.send(result)
      }
    })
  } else {
    Book.find({ category: category }, (error, result) => {
      if (error) {
        res.send(error)
      } else {
        res.send(result)
      }
    })
  }
})

// get one book
app.get('/read/:id', async (req, res) => {
  const id = req.params.id
  Book.findById(id, (error, result) => {
    if (error) {
      res.send(error)
    } else {
      res.send(result)
    }
  })
})

// update book
app.put('/update/:id', async (req, res) => {
  const id = req.params.id
  const userImage = req.body.userImage
  const title = req.body.title
  const authors = req.body.authors
  const description = req.body.description
  const category = req.body.category
  const preice = req.body.preice
  const publisher = req.body.publisher
  try {
    const foundUser = await Book.findById(id)
    console.log(foundUser)
    foundUser.userImage = userImage
    foundUser.title = title
    foundUser.authors = authors
    foundUser.description = description
    foundUser.category = category
    foundUser.preice = preice
    foundUser.publisher = publisher
    await foundUser.save()
    res.send('updated data')
  } catch (err) {
    console.log(err)
  }
})

// delete book
app.delete('/delete/:id', async (req, res) => {
  const id = req.params.id
  try {
    await Book.findByIdAndDelete(id).exec()
    res.send('deleted')
  } catch (Error) {
    console.log(Error)
  }
})

//send email

app.post('/api/email', (req, res) => {
  const { email, subject, message } = req.body
  mailgun()
    .messages()
    .send(
      {
        from: 'John Doe <john@mg.yourdomain.com>',
        to: `${email}`,
        subject: `${subject}`,
        html: `<p>${message}</p>`,
      },
      (error, body) => {
        if (error) {
          console.log(error)
          res.status(500).send({ message: 'Error in sending email' })
        } else {
          console.log(body)
          res.send({ message: 'Email sent successfully' })
        }
      }
    )
})
// GET all users, without sending password
app.get('/users', (req, res) => {
  User.aggregate([
    { $group: { _id: '$_id', username: { $first: '$username' } } },
  ])
    .then((users) => {
      res.send(users)
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})
// GET user by id
app.get('/users/:id', (req, res) => {
  User.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(req.params.id) } },
    { $group: { _id: '$_id', username: { $first: '$username' } } },
  ])
    .then((user) => {
      res.send(user[0])
    })
    .catch((err) => {
      res.status(500).send(err)
    })
})

// CREATE new user
app.post('/user/register', register)
// LOGIN user
app.post('/user/login', login)

app.get('/user/me', verifyToken, getUserInfo)
app.get('/user/verify-session', verifyToken, approveSession)

// Handle 404
app.use((req, res) => {
  res.status(404).send('404: Page not found')
})
