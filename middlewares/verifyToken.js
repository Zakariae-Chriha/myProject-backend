const jwt = require('jsonwebtoken')
const User = require('../modeles/userSchema')

// middleware to check if user is logged in
const verifyToken = async (req, res, next) => {
  try {
    const token = req.headers.authorization

    if (!token) {
      res.status(401).json({ error: 'Not authorized' })
    } else {
      const decodedUser = jwt.verify(token, process.env.JWT_SECRET)
      req.user = decodedUser

      const foundUser = await User.find({ username: decodedUser.username })
      console.log('foundUser', foundUser)
      if (!foundUser.length) {
        res.status(400).json({ error: 'User does not exist' })
      } else {
        next()
      }
    }
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' })
  }
}

module.exports = { verifyToken }
