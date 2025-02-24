const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://worktrackpro:xjl6SJcA92yLzkyb@cluster0.fjsqv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const db = client.db("workTrackPro");
    const users = db.collection("users");
    const workList = db.collection("workList");

    app.post("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const quary = { email: email };
      const isExists = await users.findOne(quary);
      if (isExists) {
        return res.send(isExists);
      }
      const result = await users.insertOne(user);
      res.send(result);
    });

    //work add in work sheet
    app.post("/workAdd", async (req, res) => {
      const data = req.body;
      const result = await workList.insertOne(data);
      res.send(result);
    });
    // show all work
    app.get("/worklist/:email", async (req, res) => {
      const email = req.params.email;
      const quary = { email: email };
      const result = await workList.find(quary).toArray();
      res.send(result);
    });
    // delete work
    app.delete("/deleteWork/:id", async (req, res) => {
      const id = req.params.id;
      const quary = { _id: new ObjectId(id) };
      const result = await workList.deleteOne(quary);
      res.send(result);
    });
    //update work list
    app.patch("/updateWork/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          workName: req.body.workName,
          time: req.body.time,
          date: req.body.date,
        },
      };
      const result = await workList.updateOne(filter, updateDoc, options);
      res.send(result);
    });

    // all employee
    app.get("/allEmployee", async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    });
    // update varified
    app.patch("/verified/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          verified: req.body.verified,
        },
      };
      const result = await users.updateOne(filter, updateDoc, options);
      res.send(result);
    });
    //user
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const result = await users.findOne(filter);
      res.send(result);
    });
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", async (req, res) => {
  res.send("world");
});

app.listen(port, () => {
  console.log("done");
});
