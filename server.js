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
    next();
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
// Get a list of the collection using the collection name used in the url
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

    const port = process.env.PORT || 3000;
    app.listen(port, ()=> {
        console.log("Express server is running at localhost:3000.")
    })


    /* TO DO LIST 
• MongoDB (4%):
– Have a MongoDB collection for lesson information - minimal fields: topic, price, location, and space (2%);
– Have a MongoDB collection for order information (2%) - minimal fields: name, phone number, lesson ID, and number of space.

• Node (2%)
– Include all the required modules in package.json
– Include the correct start script in package.json
– Exclude node modules from the back end Git repository

• Middleware (4%)
– Create a ‘logger’ middleware that output all requests to the server console (2%)
– Create a static file middleware that returns lesson images or an error message if the image file does not exist. (2%)

• REST API (10%):
– Connect to MongoDB with native Node.js driver for MongoDB (Mongoose or similar library is not allowed) (2%);
– A GET route that returns all the lessons (2%);
– A P OST route that saves a new order to the ‘order’ collection (2%);
– A P UT route that updates the number of available spaces in the ‘lesson’ collection after an order is submitted (2%).
– At least one Postman request is created for each routing (2%).

• Fetch (5%)
– A fetch that retrieves all the lessons with GET (1%).
– A fetch that saves a new order with POST after it is submitted (2%).
– A fetch that updates the available lesson space with PUT after an order is submitted (2%). */