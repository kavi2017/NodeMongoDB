const Express = require("express");
const BodyParser = require("body-parser");
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectID;
const CONNECTION_URL = "mongodb+srv://kavi:w1wsbFiYTsHlAjXv@cluster0-brcoj.mongodb.net/test";
const DATABASE_NAME = "Erp";


var app = Express();
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({ extended: true }));
var database, collection;

app.listen(5000, () => {
    MongoClient.connect(CONNECTION_URL, { useNewUrlParser: true, useUnifiedTopology: true }, (error, client) => {
        if(error) {
            throw error;
        }
        database = client.db(DATABASE_NAME);
        collection = database.collection("authors");
        console.log("Connected to `" + DATABASE_NAME + "`!");
    });
});


app.post("/addAuthor", (request, response) => {
    console.log(request.body)
    collection.insertMany(request.body, (error, result) => {
        if(error) {
            return response.status(500).send(error);
        }
        response.send(result.result);
    });
});

// Task 1 - To fetch authors who have greater than or equal to n awards
app.get("/listAuthors", (request, response) => {
    if(!request.query.n) {
        return response.send({"status":"Missing Param - n"});
    }
    if(request.query.n == parseInt(request.query.n, 10)) {
        collection.find({ Awards: { $gte: parseInt(request.query.n) } }).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    } else {
        response.send({"status":"Please pass the value as integer"});
    }
});

// Task 1 - To fetch authors who have greater than or equal to n awards
app.get("/listAuthors", (request, response) => {
    if(!request.query.n) {
        return response.send({"status":"Missing Param - n"});
    }
    if(request.query.n == parseInt(request.query.n, 10)) {
        collection.find({ Awards: { $gte: parseInt(request.query.n) } }).toArray((error, result) => {
            if(error) {
                return response.status(500).send(error);
            }
            response.send(result);
        });
    } else {
        response.send({"status":"Please pass the value as integer"});
    }
});

// Task 2 - To fetch authors who have won award yearwise
app.get("/awardWonAuthors", (request, response) => {
    if(!request.query.year) {
        return response.send({"status":"Missing Param - year"});
    }
    if(request.query.year == parseInt(request.query.year, 10)) {
        
        collection.aggregate([
            { $lookup:
               {
                 from: 'awardDetails',
                 localField: 'authorID',
                 foreignField: '_id',
                 as: 'orderdetails'
               }
             }
            ]).toArray(function(error, result) {
                console.log(result);
                console.log('-------------');
                if(error) {
                    return response.status(500).send(error);
                }
                response.send(result);

          });

    } else {
        response.send({"status":"Please pass the value as integer"});
    }
});