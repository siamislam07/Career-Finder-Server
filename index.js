const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors({
    origin: [
        'http://localhost:5173'
    ],
    credentials: true
}))
app.use(express.json())



//uri
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.amxcsfu.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const homeCardCollection = client.db('dream-jobs').collection('homeCards')

        app.get('/api/homeCards', async(req,res)=>{
            const cursor = await homeCardCollection.find().toArray()
            res.send(cursor)
        })

        app.get('/api/homeCards/:id', async(req, res)=>{
            const id = req.params.id
            const query = {_id: new ObjectId(id)} 
            const result = await homeCardCollection.findOne(query)
            res.send(result)
        })


        app.post('/api/homeCards', async(req, res)=>{
            const homeCard = req.body
            const result = await homeCardCollection.insertOne(homeCard)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Hello World!')
})



app.listen(port, () => {
    console.log(`Server port running on  ${port}`)
})