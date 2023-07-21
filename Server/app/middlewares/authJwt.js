const jwt = require("jsonwebtoken");
require("dotenv/config");
const config = require("../config/auth.config.js");

verifyToken = (req, res, next) => {
  let token = req.headers.authorization;
  token = token?.split(" ")[1];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }

  if (token === process.env.API_ACCESS_TOKEN) return next();

  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      console.log(err);
      return res.status(401).send({ message: "Unauthorized!" });
    }
    req.userId = decoded.id;
    next();
  });
};

const authJwt = {
  verifyToken,
};
module.exports = authJwt;
