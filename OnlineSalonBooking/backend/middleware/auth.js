const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).send("Access denied. No token provided.");
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId; // Fixed: was setting req.locals instead of req.userId
    next();
  } catch (error) {
    res.status(401).send("Invalid token.");
  }
};

module.exports = auth;
