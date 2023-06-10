const jwt = require('jsonwebtoken')
const User = require('../users/user-modules')
const bcrypt = require('bcryptjs')

const checkUsernameAvailability = async (req, res, next) => {
  const { username } = req.body;
  const existingUser = await User.findBy({ username });
  if (existingUser) {
    return res.status(409).json({ error: 'Username taken' });
  }
  next();
};

const validateRegistrationData = (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password required' });
  }
  next();
};

const checkUsernameExists = async (req, res, next) => {
  try {
    const { username, password } = req.body;
    const user = await User.findBy({ username })

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}




module.exports = {
  checkUsernameAvailability,
  validateRegistrationData,
  checkUsernameExists,
}