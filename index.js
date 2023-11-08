const express = require('express')
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = process.env.PORT || 5000


app.use(cors({
    origin: [
        'http://localhost:5173',
        'https://a11-career-finder.web.app',
        'https://a11-career-finder.firebaseapp.com'
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
        const appliedCollection = client.db('dream-jobs').collection('appliedPersonData')

        app.get('/api/homeCards', async (req, res) => {
            const cursor = await homeCardCollection.find().toArray()
            res.send(cursor)
        })

        app.get('/api/homeCards/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await homeCardCollection.findOne(query)
            res.send(result)
        })

        app.get('/api/applied', async (req, res) => {
            const cursor = await appliedCollection.find().toArray()
            res.send(cursor)
        })

        app.get('/api/users', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await appliedCollection.find(query).toArray()
            res.send(result);
        })

        app.get('/api/user', async (req, res) => {
            console.log(req.query.email);
            let query = {}
            if (req.query?.email) {
                query = { email: req.query.email }
            }
            const result = await homeCardCollection.find(query).toArray()
            res.send(result);
        });


        app.post('/api/homeCards', async (req, res) => {
            const homeCard = req.body
            const result = await homeCardCollection.insertOne(homeCard)
            res.send(result)
        })

        app.post('/api/applied', async (req, res) => {
            const applied = req.body
            const result = await appliedCollection.insertOne(applied)
            res.send(result)
        })

        app.put('/api/homeCards/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const options = { upsert: true }
            const updated = req.body
            const data = {
                $set: {
                    title: updated.title,
                    photoURL: updated.photoURL,
                    email: updated.email,
                    category: updated.category,
                    salary: updated.salary,
                    dates: updated.dates,
                    description: updated.description,
                    applicants: updated.applicants,
                    name: updated.name,
                    BannerUrl: updated.BannerUrl,
                    experienceLevel: updated.experienceLevel,
                    companyLocation: updated.companyLocation
                }
            }
            const result = await homeCardCollection.updateOne(filter, data, options )
            res.send(result)
        })

        app.delete('/api/homeCards/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await homeCardCollection.deleteOne(query)
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
    res.send('Job server is running')
})



app.listen(port, () => {
    console.log(`Server port running on  ${port}`)
})