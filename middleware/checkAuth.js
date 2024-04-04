const jwt = require('jsonwebtoken');
require("dotenv").config;

module.exports = async function (req, res, next) {
    try {
        const token = req.cookies.accessToken;
        !token && res.status(403).json({ message: 'Access token is missing or invalid' });
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET) ? next() : res.status(403).json({message: `Authorization Fail!`});
    } catch (error) {
        console.log(error)
        return res.status(500).json({message: "Authorization Fail!"});
    }
}