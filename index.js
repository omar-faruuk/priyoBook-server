const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const objectId = require('mongodb').ObjectId
const port = 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

require('dotenv').config()
app.use(cors())
app.use(bodyParser.json())
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.x7xfr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
client.connect(err => {
  const bookCollection = client.db("priyoBook").collection("books");
  const ordersCollection = client.db("priyoBook").collection("orders");

  app.post('/addBook', (req, res) => {
    const bookData = req.body;
    bookCollection.insertOne(bookData)
      .then(result => {
        console.log(result);
        res.send(result.acknowledged)
      })
  })

  app.post('/addOrder', (req, res) => {
    const orderDetails = req.body;
    console.log('orderDetails', orderDetails);
    ordersCollection.insertOne(orderDetails)
      .then(result => {
        console.log(result);
        res.send(result.acknowledged)
      })
  })

  app.get('/books', (req, res) => {
    bookCollection.find({})
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.get('/book/:_id', (req, res) => {
    console.log(req.params._id);
    bookCollection.find({ _id: objectId(req.params._id) })
      .toArray((err, document) => {
        res.send(document[0])
      })
  })

  app.get('/orders', (req, res) => {
    console.log(req.query.email);
    ordersCollection.find({ email: req.query.email })
      .toArray((err, documents) => {
        res.send(documents)
      })
  })

  app.delete('/deleteItem/:id', (req, res) => {
    console.log(req.params.id);
    bookCollection.deleteOne({ _id: objectId(req.params.id) })
      .then(result => {
        console.log(result.deletedCount > 0);
        res.send(result.deletedCount > 0)
      })

  })

  app.delete('/deleteOrder/:id', (req, res) => {
    console.log(req.params.id);
    ordersCollection.deleteOne({ _id: objectId(req.params.id) })
      .then(result => {
        console.log(result.deletedCount > 0);
        res.send(result.deletedCount > 0)
      })
      .catch(err => console.log(err))

  })


});



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})