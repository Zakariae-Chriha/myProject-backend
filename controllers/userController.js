const bcrypt = require('bcrypt')
const User = require('../modeles/userSchema')

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
    res.status(200).json({ success: 'ok' })
  }
}

const login = async (req, res) => {
  const { username, password } = req.body

  const foundUser = await User.find({ username: username })

  if (foundUser.length == 0) {
    res.status(400).send('Username does not exist')
  } else {
    const match = await bcrypt.compare(password, foundUser[0].password)
    if (!match) {
      res.status(400).send('Password is incorrect')
    } else {
      res.status(200).json({ user: foundUser })
    }
  }
}

module.exports = { register, login }
