// const express = require('express');
// const app = express();
// const { readFile } = require('fs').promises;

// app.get('/', async (request, response) => {

//     response.send( await readFile('./home.html', 'utf8') );

// });

// app.listen(process.env.PORT || 3000, () => console.log(`App available on http://localhost:3000`))

// const express = require("express");
// const mongoose = require("mongoose");
// const app = express()
// mongoose.connect("mongodb://localhost:27017/latestdb",{
//     useNewUrlParser:true,useUnifiedTopology:true
// },(err)=>{
//     if(err)
//     {
//         console.log(err)
//     }else{
//         console.log("successfully connected")
//     }
// })

// app.listen(3000,()=>{
//     console.log("on port 3000")
// })

const { MongoClient } = require('mongodb');

async function main() {

    const uri = "mongodb+srv://holbenhe:mongoholbendbhe@cluster0.0zti5om.mongodb.net/?retryWrites=true&w=majority"

    const client = new MongoClient(uri);

    try {
        await client.connect();

        // await createListing(client, {
        //     name: "Amazon",
        //     review: "My book was on this website!"
        // })

        // await createMultipleListings(client, [{
        //     name: "AbeBooks",
        //     review: "Cool name"
        // },
        // {
        //     name: "BarnesAndNoble",
        //     review: "epic"
        // },
        // {
        //     name: "BigWords",
        //     review: "indeed large words"
        // },
        // {
        //     name: "BigWords",
        //     review: "indeed large words"
        // },
        // {
        //     name: "BooksRun",
        //     review: "they ran"
        // },
        // {
        //     name: "CampusBooks",
        //     review: "sweet"
        // },
        // {
        //     name: "CheapestTextBooks",
        //     review: "mid"
        // },
        // {
        //     name: "Chegg",
        //     review: "indeed large words"
        // },
        // {
        //     name: "ECampus",
        //     review: "swag"
        // }]);

        await findOneWebsiteByName(client, "AbeBooks");

        await findWebsitesWithMinimumReviews(client, {
            minimumNumberOfReviews: 1
        });

        await updateWebsiteByName(client, "Amazon", {review: 'i dont like bezos'});

    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

main().catch(console.error);

async function createListing(client, newListing) {
    const result = await client.db("Websites").collection("Reviews").insertOne(newListing);

    console.log("New listing created with the following id: ${result.insertedId}");
}

async function listDatabases(client) {
    const databasesList = await client.db().admin().listDatabases();

    console.log("Databases:");
    databasesList.databases.forEach(db => {
        console.log('- ${db.name}');
    })
}

async function createMultipleListings(client, newListings){
    const result = await client.db("Websites").collection("Reviews").insertMany
    (newListings);

    console.log('created');
}

async function findOneWebsiteByName(client, nameOfWebsite){
    const result = await client.db("Websites").collection("Reviews").findOne({name: nameOfWebsite});

    if(result) {
        console.log('found a listing in the collection with the name of' + nameOfWebsite);
        console.log(result);
    } else {
        console.log('No listings found with the name of' + nameOfWebsite);
    }
}

async function findWebsitesWithMinimumReviews(client, {
    minimumNumberOfReviews = 0,
    maximumNumberOfResults = Number.MAX_SAFE_INTEGER
} = {}){

    const cursor = client.db("Websites").collection("Reviews").find({
        reviews: {$gte: minimumNumberOfReviews}
    })

   const results = await cursor.toArray();
}

async function updateWebsiteByName(client, nameOfWebsite, Review) {
    const result = await client.db("Websites").collection("Reviews").updateOne({ name: 
    nameOfWebsite }, { $set: Review });

    console.log(result.matchedCount + 'document(s) matched the query criteria');
    console.log(result.modifiedCount + 'documents was/were updated');

}