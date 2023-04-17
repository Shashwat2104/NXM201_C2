const express = require('express')
const fs = require('fs')
const { userModel } = require('../model/user.model')
const bcrypt = require('bcrypt');
const userRoute = express.Router()
var jwt = require('jsonwebtoken');
require('dotenv').config()

userRoute.post("/signup", async (req, res) => {
    try {
        const { name, email, password, role } = req.body
        const IsUserPresent = await userModel.findOne({ email })

        if (IsUserPresent) {
            return res.send({ msg: "Please Login, Already Register" })
        }

        const hash = await bcrypt.hashSync(password, 7)
        const newUser = new userModel({ name, email, password: hash, role })
        await newUser.save()
        res.send({ msg: 'SignUp Successful' })
    } catch (error) {
        res.send(error.message)
    }
})

userRoute.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.send({ msg: 'Wrong creditencal' })
        }

        const IsUserPresent = await userModel.findOne({ email })

        const IsPasswordCorrect = await bcrypt.compareSync(password, IsUserPresent.password)

        if (!IsPasswordCorrect) {
            return res.send({ msg: 'Wrong Password' })
        }

        if (!IsUserPresent) {
            return res.send({ msg: 'User Not present, Please Login' })
        }
        const token = await jwt.sign({ email, userId: IsUserPresent._id, role: IsUserPresent.role },
            process.env.JWT_SECRET_KEY,
            { expiresIn: "1m" }
        )

        const refreshToken = await jwt.sign({ email, userId: IsUserPresent._id },
            process.env.REFRESH_TOKEN,
            { expiresIn: "3m" }
        )

        res.send({ msg: 'Login Successful', token, refreshToken })
    } catch (error) {
        res.send(error.message)
    }
})

userRoute.get("/getToken", async (req, res) => {
    try {
        const refreshToken = req.headers.authorization
        if (!refreshToken) {
            return res.send({ msg: 'Please Login Again' })
        }
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN, (err, decoded) => {
            if (err) {
                return res.send({ msg: "Please Login First" })
            } else {
                const token = jwt.sign({ userId: decoded.userId },
                    process.env.JWT_SECRET_KEY,
                    { expiresIn: "3m" }
                )
                res.send({ msg: 'Login Successful', token })
            }
        })
    } catch (error) {
        res.send(error.message)
    }
})

userRoute.get("/logout", async (req, res) => {
    try {
        const token = req.headers.authorization
        const blacklistData = JSON.parse(
            fs.readFileSync("./blacklist.json", "utf-8")
        )
        blacklistData.push(token)
        fs.writeFileSync("./blacklist.json", JSON.stringify(blacklistData))
        res.send({ msg: 'Logout Successful' })
    } catch (error) {
        res.send(error.message)
    }
})

module.exports = {
    userRoute
}