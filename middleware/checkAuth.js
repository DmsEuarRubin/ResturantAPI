const jwt = require('jsonwebtoken');
require("dotenv").config;

module.exports = async function (req, res, next) {
    try {
        let token = req.headers.authorization;
        token = token.split(" ")[1];
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) ? next() : res.status(403).json({message: `Authorization Fail!`});
    } catch (error) {
        return res.status(500).json({message: "Authorization Fail!"});
    }
}