const express = require('express')
const app = express()
const cors = require('cors')
const {MongoClient, ObjectId} = require('mongodb')
require('dotenv').config()
const PORT = 8002

let db,
    dbConnectionStr = process.env.DB_STRING,
    dbName = 'sample_mflix',
    collection

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log('Connected to database')
        db = client.db(dbName)
        collection = db.collection('movies')
    })
//need to enable some middleware (which handles the inbetween the kitchen and the customer ordering)
app.use(express.urlencoded({extended: true}))
app.use(express.json())
app.use(cors())

app.get('/search', async (req, res) => { //function await results
    //send specific object to mongoDB and search it
    try{  //agg those results together (agg means bring them together like bundling)
        let result = await collection.aggregate([
            {
                "$search" : {
                    "autocomplete" : {
                        "query" : `${req.query.query}`,
                        "path": "title",
                        "fuzzy": {
                            "maxEdits": 2, //user can make up to 2 sp errors
                            "prefixLength": 3 //how many chars until it allows auto
                        }
                    }
                }
            }
        ]).toArray()
        res.send(result)
    }catch(error){
        res.status(500).send({message: error.message})
        console.log(error)
    }
})

//the colon : is called the parameter so you can input a template literal
app.get("/get/:id", async (req, res) => {
    try{
        let result = await collection.findOne({
            '_id' : ObjectId(req.params.id)
        })
        res.send(result)
    }catch{
        res.status(500).send({message: error.message})
    }
})


app.listen(process.env.PORT || PORT, () => {
    console.log('Server is running.')
})