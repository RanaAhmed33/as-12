const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const port = process.env.PORT || 5000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.10czk6a.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true, } });

app.use(cors());
app.use(express.json());

app.get('/', (rew, res) => {
    res.send('server is running');
})




async function run() {
    try {
        client.connect();
        console.log('database connected....')
        const database = client.db("drawing_school");
        const classCollection = database.collection("class");
        const usersCollection = database.collection("users");
        const addToCartCollection = database.collection("addtocart");

        // class ...............................................
        app.post('/class', async (req, res) => {
            const myclass = req.body
            const result = await classCollection.insertOne(myclass)
            console.log(result)
            res.send(result)
        })

        app.get('/class/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await classCollection.find(query).toArray()
            res.send(result)
        })

        app.put('/classupdate/:id', async (req, res) => {
            const id = req.params.id
            const feedback = req.body
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    feedback: feedback
                }
            }
            const result = await classCollection.updateOne(query, updateDoc)
            res.send(result)
        })
        app.delete('/deleteclass/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await classCollection.deleteOne(query)
            res.send(result)
        })

        app.put('/dashbord/edit/:id', async (req, res) => {
            const id = req.params.id
            const editInfo = req.body
            console.log(editInfo)
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    ...editInfo
                }
            }
            const result = await classCollection.updateOne(query, updateDoc)
            res.send(result)
        })

        app.get('/singleclass/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const result = await classCollection.findOne(query)
            res.send(result)
        })
        // class ...............................................
        // users ...............................................
        app.put('/users/:email', async (req, res) => {
            const email = req.params.email
            const user = req.body
            const query = { email: email }
            const options = { upsert: true }
            const updateDoc = {
                $set: user
            }
            const result = await usersCollection.updateOne(query, updateDoc, options)
            res.send(result)

        })

        app.get('/users', async (req, res) => {
            const result = await usersCollection.find({}).toArray()
            res.send(result)
        })
        // users ...............................................


        // all Class .............................................
        app.get('/allclass', async (req, res) => {

            const result = await classCollection.find({}).toArray()
            res.send(result)
        })
        // specific data 
        app.get('/allclassapprove', async (req, res) => {
            const query = { status: "approved" }
            const result = await classCollection.find(query).toArray()
            res.send(result)
        })
        app.get('/teachers', async (req, res) => {
            const query = { role: "teacher" }
            const result = await usersCollection.find(query).toArray()
            res.send(result)
        })
        // all Class .............................................
        // role  .............................................

        app.put('/adminrole/teacher/:email', async (req, res) => {
            const email = req.params.email
            const filterData = { email: email }
            const updateDoc = {
                $set: {
                    role: "teacher"
                }
            }
            const result = await usersCollection.updateOne(filterData, updateDoc)
            console.log(result)
            res.send(result)
        })
        app.put('/adminrole/admin/:email', async (req, res) => {
            const email = req.params.email
            const filterData = { email: email }
            const updateDoc = {
                $set: {
                    role: "admin"
                }
            }
            const result = await usersCollection.updateOne(filterData, updateDoc)
            console.log(result)
            res.send(result)
        })

        // role  .............................................

        // denied class 
        app.put('/denied/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: "denied"
                }
            }
            const result = await classCollection.updateOne(query, updateDoc)
            console.log(result)
            res.send(result)
        })
        app.put('/apporved/:id', async (req, res) => {
            const id = req.params.id
            const query = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: "approved"
                }
            }
            const result = await classCollection.updateOne(query, updateDoc)
            console.log(result)
            res.send(result)
        })

        // add to cart 
        app.post('/purchase', async (req, res) => {
            const data = req.body
            const result = await addToCartCollection.insertOne(data)
            console.log(result)
            res.send(result)
        })

        app.get('/purchase/:email', async (req, res) => {
            const email = req.params.email
            const query = { email: email }
            const result = await addToCartCollection.find(query).toArray()
            res.send(result)
        })

        app.get('/user/:email', async (req, res) => {
            const adminUser = req.params.email;
            const query = { email: adminUser };
            const user = await usersCollection.findOne(query)
            let isAdmin = false;

            if (user?.role === 'admin') {
                isAdmin = true
            }
            res.json({ admin: isAdmin })
        })

        app.get('/teacher/:email', async (req, res) => {
            const adminUser = req.params.email;
            const query = { email: adminUser };
            const user = await usersCollection.findOne(query)
            let isTeaacher = false;

            if (user?.role === 'teacher') {
                isTeaacher = true
            }
            res.json({ teacher: isTeaacher })
        })













    } finally {
    }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`server is ok  ${port}`);
})
