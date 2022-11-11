const mongoose = require('mongoose');
require('dotenv').config();
const imageCache = require('./index.js');
const ImageModel = require('./Schemas/ImageModel');

mongoose.connect(process.env.mango, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(async res => {
    console.log("Connected to the database.")

    const data = await ImageModel.find();
    imageCache.set('images', data)
    console.log('cached all images')
})

// mongoose.connect(process.env.mango, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// }, (err) => {
//     if (err) return console.log(err);
//     // app.listen(3000, () => {
//     //     console.log("MongoDB Server listening on 3000");
//     // });
// });