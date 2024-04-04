const jwt = require('jsonwebtoken');
require("dotenv").config;

module.exports = function (req, res) {
    try {
        let token = req.cookies.accessToken;

        const accessToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        return accessToken.email;

    } catch (error) {
        return res.status(500).json({message: `UserEmail error: ${error.name}`});
    }
}