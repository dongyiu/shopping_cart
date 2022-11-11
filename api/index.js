// mongodb://iya:dogiscute@107.152.41.246:27017/images?authSource=admin
const express = require("express");
const bodyParser = require("body-parser");
const multer = require("multer");
const path = require("path");
const fs = require("fs");
const ImageModel = require('./Schemas/ImageModel');
const Orders = require('./Schemas/Orders');
const passwordHash = require('password-hash');
const Cache = require('ttl-cache');
const imageCache = new Cache({ ttl: 2 * 60 * 60 });
const adminCache = new Cache({ ttl: 2 * 60 * 60 });
module.exports = imageCache
require('./database')
require('dotenv').config();

const app = express();
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.post("/uploadPhoto", upload.single("myImage"), async (req, res) => {
    const body = req.query
    const obj = {
        img: {
            data: fs.readFileSync(path.join(__dirname.split(/[/\\]/).filter(a => a != 'api').join('/') + "/uploads/" + req.file.filename)),
            contentType: "image/png",
            id: req.file.filename.split('.')[0]
        }
    }
    const newImage = new ImageModel({
        image: obj.img,
        name: body.name,
        contactNumber: body.contactNumber,
        companyName: body.companyName,
    });
    await newImage.save((err) => {
        if(err) {
            console.log(err)
            return res.json({ error: true })
        }
        else {
            const allData = imageCache.get('images');
            allData.push(newImage);
            imageCache.set('images', allData);
            return res.json({ error: false, id: newImage._id })
        }
    });
    
});

app.get("/uploadPhoto/:id",  async (req, res) => {
    let cachedData = imageCache.get('images')?.find(a => a?.image?.id == req.params.id);
    if(!cachedData) {
        const data = await ImageModel.findOne({ 'image.id' : req.params.id });
        cachedData = data
        const allData = imageCache.get('images');
        allData.push(data)
        imageCache.set('images', allData)
    } 
    if(!cachedData) res.send('Invalid image id')
    var img = Buffer.from(cachedData.image.data, 'base64');

    res.writeHead(200, {
      'Content-Type': 'image/png',
      'Content-Length': img.length
    });
    res.end(img); 
});

app.post("/order",  async (req, res) => {

    const body = req.body

    const newOrder = new Orders({ 
        name: body.name,
        contactNumber: body.contactNumber,
        companyName: body.companyName,
        orders: body.orders
    })

    await newOrder.save((err) => {
        if(err) {
            console.log(err)
            return res.json({ error: true })
        }
        else {
            return res.json({ error: false, orderId: newOrder._id })
        }
    });
});

app.get('/orders', async(req, res) => {
    const orders = await Orders.find();
    return res.json(orders)
})

app.get('/paymentSlip', async(req, res) => {
    // const data = await ImageModel.find();
    const data = imageCache.get('images');
    const list = [];
    data.map(a => list.push({
        _id: a._id,
        name: a.name,
        companyName: a.companyName,
        contactNumber: a.contactNumber,
        __v: a.__v,
        image : {
            id: a.image.id
        }
    }))
    return res.json(list)
})

app.post('/login', async(req, res) => {
    const body = req.body;
    const user = body.user;
    const pass = body.pass;

    if(passwordHash.verify(process.env.user, user) && passwordHash.verify(process.env.pass, pass)) {
        adminCache.set('admin', req.sessionID);
        return res.json({ success: true })
    } else res.json({ success: false })
})

app.get('/isAdmin', async(req, res) => {
    if(adminCache.get('admin') == req.sessionID) return res.json({ admin: true })
    else res.json({ admin: false })
})

module.exports = {
    path: '/api',
    handler: app,
}
