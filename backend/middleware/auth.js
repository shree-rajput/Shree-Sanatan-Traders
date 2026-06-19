// const jwt = require("jsonwebtoken");

// module.exports = (req, res, next) => {
//   try {
//     const authHeader = req.headers.authorization;

//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return res.status(401).json({ message: "No token provided. Please login." });
//     }

//     const token = authHeader.split(" ")[1];

//     if (!token) {
//       return res.status(401).json({ message: "Token missing" });
//     }

//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     req.user = decoded;
//     next();

    
//   } catch (err) {
//     if (err.name === "TokenExpiredError") {
//       return res.status(401).json({ message: "Session expired. Please login again." });
//     }
//     return res.status(401).json({ message: "Invalid token. Please login again." });
//   }
// };


const jwt = require("jsonwebtoken");
const User = require("../models/User.model");

module.exports= async (req, res, next) => {

try {


let token = req.headers.authorization;

if (!token || !token.startsWith("Bearer")) {
  return res.status(401).json({
    message: "Not authorized"
  });
}

token = token.split(" ")[1];

const decoded = jwt.verify(
  token,
  process.env.JWT_SECRET
);

// ✅ Fetch full user from DB
const user = await User.findById(decoded.id);

if (!user) {
  return res.status(404).json({
    message: "User not found"
  });
}

// ✅ Full user available now
req.user = user;

next();


} catch (error) {


console.log(error);

res.status(401).json({
  message: "Invalid token"
});}};
