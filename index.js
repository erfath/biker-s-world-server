const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const port = process.env.PORT || 5000;

const app = express();


//malware
app.use(cors());
app.use(express.json());




const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.btz4c.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
async function run() {
    try {
        await client.connect();
        console.log('db connected')
        const itemCollection = client.db('inventory').collection('item');
       
        app.get('/inventory', async (req, res)=> {
            const query = {};
            const cursor = itemCollection.find(query)
            const items = await cursor.toArray();
            res.send(items)
        });

        app.get('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const item = await itemCollection.findOne(query)
            res.send(item);
        });


        //post

        app.post('/inventory', async (req, res)=>{
            const newItem = req.body;
            const result = await itemCollection.insertOne(newItem);
            res.send(result);

        });

        //delete

        app.delete('/inventory/:id', async (req, res)=>{
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const result = await itemCollection.deleteOne(query)
            res.send(result)

        })

    }
    finally {

    }
}

run().catch(console.dir);



app.get('/', (req, res) => {
    res.send('Bike is Running')
});

app.get('/hero', (req, res)=>{
    res.send('Testing A little')
});

app.listen(port, () => {
    console.log("Listening to port", port);
});