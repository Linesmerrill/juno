const express = require('express');
const bodyParser= require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const xid = require('xid-js');

var db

let url = "mongodb://" + process.env.MONGODB_USERNAME + ":" + encodeURIComponent(process.env.MONGODB_PASSWORD) + process.env.MONGODB_URL

MongoClient.connect(url, (err, client) => {
  if (err) return console.log(err)
  db = client.db('juno-db')
  app.listen(3000, () => {
    console.log('listening on 3000')
  })
})

app.set('view engine', 'ejs')
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('person').find().toArray((err, result) => {
    if (err) return console.log(err)
    res.render('index.ejs', {person: result})
  })
})

app.post('/person', (req, res) => {
  console.log("Before: " , req.body)
  req.body.ID = xid.next();
  console.log("After: ", req.body)
  db.collection('person').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/person', (req, res) => {
  db.collection('person')
  .findOneAndUpdate({firstName: 'Callie'}, {
    $set: {
      firstName: req.body.firstName,
      lastNme: req.body.lastName,
      birthday: req.body.birthday
    }
  }, {
    sort: {_id: -1},
    upsert: true
  }, (err, result) => {
    if (err) return res.send(err)
    res.send(result)
  })
})

app.delete('/person', (req, res) => {
  db.collection('person').findOneAndDelete({ID: req.body.ID},
  (err, result) => {
    if (err) return res.send(500, err)
    res.send({message: 'A person was deleted', response: res.body})
  })
})
