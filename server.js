const bodyParser = require("body-parser");
const express = require("express");
const app = express();

const mongoClient = require("mongodb").MongoClient;

// Connect to database using the mongo client
let db;
mongoClient.connect("mongodb+srv://AndreiUser:M0ng0Us3r@cluster0.jdmnf.mongodb.net/", (err, client) => {
    // Specify collection name within the database
    db = client.db("webstore");
})

app.use(express.json());

app.use(function(req, res, next) {
     res.header("Access-Control-Allow-Origin", "*");
     res.header("Access-Control-Allow-Headers", "*");
     return next();
    })
// Get collection name from database
app.param("collectionName", (req, res, next,
    collectionName) => {
        req.collection = db.collection
        (collectionName);
        return next();
    })
// Established a response from the connected database collection
    app.get("/", (req, res, next) => {
        res.send("select a collection with/collection/:collectionName")
    })
// Get ROUTE a list of the collection using the collection name used in the url
    app.get("/collection/:collectionName", (req, res, next)=> {
        req.collection.find({}).toArray((e, results) => {
            if (e) return next(e);
            res.send(results);
        })
    })
// Insert a new result within your collection
    app.post("/collection/:collectionName", (req, res, next) => {
        req.collection.insert(req.body, (e, results) => {
            if (e) return next(e)
            res.send(results.ops)
        })
    })
// Display an object using the object ID within the collection
    const ObjectID = require("mongodb").ObjectID;
    app.get("/collection/:collectionName/:id", (req, res, next) => {
    req.collection.findOne({_id: new ObjectID(req.params.id)}, (e, result) => {
        if (e) return next(e)
        res.send(result)
        })
    })
// Update an object's value
    app.put("/collection/:collectionName/:id", (req, res, next) => {
        req.collection.update(
            {_id: new ObjectID(req.params.id)},
            {$set: req.body},
            {safe: true, multi: false},
            (e, result) => {
                if (e) return next(e)
                res.send((result.result.n === 1) ? {msg: "success"} : {msg: "error"})
            })
    })
// Delete an object from the collection using the ID
    app.delete("/collection/:collectionName/:id", (req, res, next) => {
        req.collection.deleteOne(
            {_id: ObjectID(req.params.id)},
            (e, result) => {
                if (e) return next(e)
                res.send((result.result.n === 1) ? {msg: "success"} : {msg: "error"})
            })
    })

    //const port = process.env.PORT || 3000;
    app.listen(3000, ()=> {
        console.log("Express server is running at localhost:3000.")
    })