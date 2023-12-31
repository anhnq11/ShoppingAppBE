const mongoose = require('mongoose');
require('dotenv').config()
const DB_URL = process.env.DB_URL
mongoose.connect(DB_URL)
        .catch((err)=>{
            console.log('Database connection error');
            console.log(err);
        });

module.exports = { mongoose };