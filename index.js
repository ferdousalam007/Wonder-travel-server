const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const ObjectId = require("mongodb").ObjectId;


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.5b3k9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const port = process.env.PORT || 5000;
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("Hello World!");
});
client.connect((err) => {
  const ServiceCollection = client.db("wonder-travel").collection("services");
  const userCollection = client.db("wonder-travel").collection("user");

  // add Services
  app.post("/addServices", async (req, res) => {
    console.log(req.body);
    const result = await ServiceCollection.insertOne(req.body);
    // console.log(result);
    res.json(result)
  });

  // get all service
  app.get("/services", async (req, res) => {
    const result = await ServiceCollection.find({}).toArray();
    res.send(result);
  });

  //get single service
  app.get("/services/:id", async (req, res) => {
    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const service = await ServiceCollection.findOne(query);
    res.json(service);
  });

  // add all Order
  app.post("/allOrder", async (req, res) => {
    console.log(req.body);
    const result = await userCollection.insertOne(req.body);
    res.send(result);
  });

  // get all orders

  app.get("/orders", async (req, res) => {
    const result = await userCollection.find({}).toArray();
    res.send(result);
    console.log(result);
  });

  // delete all orders
  app.delete("/deleteOrder/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await userCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });
  // my order
  app.get("/myOrder/:email", async (req, res) => {
    const result = await userCollection.find({
      email: req.params.email,
    }).toArray();
    res.send(result);
  });

  // delete my order
  app.delete("/deleteMyOrder/:id", async (req, res) => {
    console.log(req.params.id);
    const result = await userCollection.deleteOne({
      _id: ObjectId(req.params.id),
    });
    res.send(result);
  });

  //update product
  //get single product
  //   app.get("/orders/:id", async (req, res) => {
  //     const id = req.params.id;
  //     const query = { _id: ObjectId(id) };
  //     const orders =await userCollection.findOne(query);
  //     res.json(orders);
  // });
  app.put("approved/:id", async (req, res) => {

    const id = req.params.id;
    const query = { _id: ObjectId(id) };
    const order = {
      $set: {
        status: "Confirm"
      }
    }
    const result = await userCollection.updateOne(query, order);
    res.json(result);
    console.log(result);


  })









});


app.listen(process.env.PORT || port);