const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://anhnq:Ez54bG4e3L1y6hUT@atlascluster.at4sibr.mongodb.net/MOB403_MD17306?retryWrites=true&w=majority')
        .catch((err)=>{
            console.log('Database connection error');
            console.log(err);
        });

module.exports = { mongoose };