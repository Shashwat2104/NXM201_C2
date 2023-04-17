const express = require('express')
const { connection } = require('./config/db')
const { userRoute } = require('./routes/user.route')
const { productRoute } = require('./routes/product.route')
const { authentication } = require('./middleware/authentication')
const app = express()
app.use(express.json())
require('dotenv').config()
app.get('/', (req, res) => {
    res.send('GET request to the homepage')
})

app.use("/users", userRoute)
app.use(authentication)
app.use("/Moderator", productRoute)

app.listen(process.env.port, async () => {
    try {
        await connection
        console.log("Port is Connected to 4500");
    } catch (error) {
        console.log("Server Disconnected");
    }
})