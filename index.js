require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 5000;
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_ID}:${process.env.DB_PASS}@cluster0.s7kzw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // await client.connect();

    const database = client.db("touristsDB");
    const users = database.collection("tourists");

    app.get("/tourists", async (req, res) => {
      const result = await users.find().toArray();
      res.send(result);
    });
    app.get("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const result = await users.findOne({ _id: new ObjectId(id) });
      res.send(result);
    });
    app.post("/tourists", async (req, res) => {
      const userData = req.body;
      const result = await users.insertOne(userData);
      res.send(result);
    });
    app.patch("/tourists/:id", async (req, res) => {
      const userData = req.body;
      const id = req.params.id;
      const result = await users.updateOne(
        { _id: new ObjectId(id) },
        { $set: userData }
      );
      res.send(result);
    });
    app.delete("/tourists/:id", async (req, res) => {
      const id = req.params.id;
      const result = await users.deleteOne({ _id: new ObjectId(id) });
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (err) {
    console.log(err);
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("connected");
});
