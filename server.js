const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const mongoClient = require("mongodb").MongoClient;

let db;
mongoClient.connect("mongodb+srv://AndreiUser:M0ng0Us3r@cluster0.jdmnf.mongodb.net/webstore?retryWrites=true&w=majority", (err, client) => {
    db = client.db("webstore");
})

app.use(express.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    next();
})

app.param("collectionName", (req, res, next,
    collectionName) => {
        req.collection = db.collection
        (collectionName);
        return next();
    })

    app.get("/", (req, res, next) => {
        res.send("select a collection with/collection/:collectionName")
    })

    app.get("/collection/:collectionName", (req, res, next)=> {
        req.collection.find({}).toArray((e, results) => {
            if (e) return next(e);
            res.send(results);
        })
    })

    app.post("/collection/:collectionName", (req, res, next) => {
        req.collection.insert(req.body, (e, results) => {
            if (e) return next(e)
            res.send(results.ops)
        })
    })

    const ObjectID = require("mongodb").ObjectID;
    app.get("/collection/:collectionName/:id", (req, res, next) => {
    req.collection.findOne({_id: new ObjectID(req.params.id)}, (e, result) => {
        if (e) return next(e)
        res.send(result)
        })
    })

    app.listen(3000, ()=> {
        console.log("Express server is running at localhost:3000.")
    })
