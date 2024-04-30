const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 5000;

// middleware

// app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@practice.acya2n0.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    const tourCollection = client.db("tourDB").collection("tour");

    app.get("/tour", async (req, res) => {
      const cursor = tourCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/my-tour-list/:email", async (req, res) => {
      const email = req.params.email;
      const result = await tourCollection.find({ userEmail: email }).toArray();
      res.send(result);
    });

    app.get("/tourDetails/:id", async (req, res) => {
      const result = await tourCollection.findOne({
        _id: new ObjectId(req.params.id),
      });
      res.send(result);
    });

    app.put("/updateDetails/:id", async (req, res) => {
      const query = { _id: new ObjectId(req.params.id) };
      const data = {
        $set: {
          image: req.body.image,
          touristSpotName: req.body.touristSpotName,
          countryName: req.body.countryName,
          location: req.body.location,
          averageCost: req.body.averageCost,
          seasonality: req.body.seasonality,
          travelTime: req.body.travelTime,
          totalVisitorsPerYear: req.body.totalVisitorsPerYear,
          description: req.body.description,
        },
      };

      const result = await tourCollection.updateOne(query, data);
      res.send(result);
    });

    app.delete("/delete/:id", async (req, res) => {
      const result = await tourCollection.deleteOne({
        _id: new ObjectId(req.params.id),
      });
      console.log(result);
      res.send(result);
    });

    app.post("/tour", async (req, res) => {
      const newTour = req.body;
      const result = await tourCollection.insertOne(newTour);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    // await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Tour Booking server is running");
});

app.listen(port, () => {
  console.log(`Tour Booking server is running on port: ${port}`);
});
