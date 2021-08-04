const jwt = require('jsonwebtoken');

const checkLogin = (req, res, next) => {
  const { authorization } = req.headers;
  try {
    const token = authorization.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { name, id } = decoded;
    req.name = name;
    req.id = id;
    next();
  } catch {
    res.status(401).json({
      error: "Unauthorized access"
    })
  }
}

module.exports = checkLogin;