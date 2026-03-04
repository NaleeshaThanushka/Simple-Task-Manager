const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
require("dotenv").config()
const app = express()

app.use(cors());
app.use(express.json())

mongoose.connect(process.env.MONGO_URL)
    .then(() => console.log('MongoDB Connected..🥰'))
    .catch(err => console.log('Connection Error..😢'+ err));

    app.use('/api/tasks', require('./route/taskRoutes'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server running on port: ${PORT}`);
})