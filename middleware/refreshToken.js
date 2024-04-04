const jwt = require('jsonwebtoken');
require("dotenv").config;

module.exports = async function (req, res, next) {
    try {    
        const accessToken = req.cookies.accessToken;
        if(!accessToken) {
            return res.status(403).json({ message: 'Access token is missing or invalid' });
        }
        jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, async (err, decodad) => {
            if (err) {
                if (err.name === 'TokenExpiredError') {
                    const refreshToken = req.cookies.refreshToken;
                    if (!refreshToken) return res.status(403).json({ message: 'Refresh token is not found!' });

                    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, async (err, decodad) => {
                        if (err) return res.status(403).json({ message: 'Invalid refresh token!' });
                        const newAccessToken = jwt.sign({ email: decodad.email }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1h' });
                        res.cookie('accessToken', newAccessToken, { httpOnly: true, maxAge: 604800000 });
                        next();
                    });
                } else return res.status(403).json({ message: 'Authorization Failed' });
            } else next();
        });
    } catch (error) { 
        console.log(error)
        return res.status(500).json({ message: 'Server Error' }) 
    }
};