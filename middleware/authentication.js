const fs = require('fs')
var jwt = require('jsonwebtoken');
require('dotenv').config()

const authentication = async (req, res, next) => {
    try {
        const token = req.headers.authentication
        if (!token) {
            return res.status(401).send({ msg: 'Please Login Again' })
        }
        const blacklistData = JSON.parse(fs.readFileSync("./blacklist.json", "utf-8"))
        const IsTokenBlacklisted = blacklistData.find((b_token) => b_token == token)

        if (IsTokenBlacklisted) {
            return res.status(401).send({ msg: 'Please Login Once More' })
        }

        const IsTokenValid = await jwt.verify(token, process.env.JWT_SECRET_KEY)

        if (!IsTokenValid) {
            return res.send({ msg: 'Authentication Failed , Please Login Again' })
        }

        req.body.userId = IsTokenValid.userId
        req.body.email = IsTokenValid.email
        req.body.role = IsTokenValid.role
        next()
    } catch (error) {
        res.send(error.message)
    }
}

module.exports = {
    authentication
}