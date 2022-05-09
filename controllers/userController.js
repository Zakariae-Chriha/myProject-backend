const bcrypt = require('bcrypt')
const User = require('../modeles/userSchema')
const jwt = require('jsonwebtoken')

const register = async (req, res) => {
  const { username, password, isAdmin } = req.body

  const foundUser = await User.find({ username: username })

  if (foundUser.length > 0) {
    res.status(400).send('Username already exists')
  } else {
    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await User.create({
      username: username,
      password: hashedPassword,
      isAdmin: isAdmin,
    })

    const token = jwt.sign(
      { username: username, isAdmin: isAdmin },
      process.env.JWT_SECRET
    )

    res.status(200).json({ token })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body

  const foundUser = await User.find({ username: username })

  if (foundUser.length < 1) {
    res.status(400).send('Username does not exist')
  } else {
    const match = await bcrypt.compare(password, foundUser[0].password)
    if (!match) {
      res.status(400).send('Password is incorrect')
    } else {
      const token = jwt.sign(
        {
          username: foundUser[0].username,
          isAdmin: foundUser[0].isAdmin,
          _id: foundUser[0]._id,
        },
        process.env.JWT_SECRET
      )

      res.status(200).json({ token })
    }
  }
}

const approveSession = async (req, res) => {
  res.json({ success: 'valid token' })
}

const getUserInfo = async (req, res) => {
  res.send(req.user)
}

module.exports = { login, register, getUserInfo, approveSession }
