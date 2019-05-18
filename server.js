const express = require('express');
const bodyParser = require('body-parser')
const app = express();
const MongoClient = require('mongodb').MongoClient
const xid = require('xid-js');
const moment = require('moment');

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
app.use(bodyParser.urlencoded({
  extended: true
}))
app.use(bodyParser.json())
app.use(express.static('public'))

app.get('/', (req, res) => {
  db.collection('person').find().toArray((err, result) => {
    if (err) return console.log(err)

    newTime = moment().format('L');
    yyyy = moment().format('YYYY');
    mm = moment().format('MM');
    dd = moment().format('DD');
    for (var i = 0; i < result.length; i++) {
      if (mm == result[i].birthday.month && dd == result[i].birthday.day) {
        // Happy Birthday! it is today!
        diffDays = 0
      } else if (mm == result[i].birthday.month) {
        // we are in the same month, lets check if it has passed or not
        if (dd > result[i].birthday.day) {
          // just passed your birthday
          var b = moment(result[i].birthday.month + "/" + result[i].birthday.day + "/" + (parseInt(yyyy) + 1), 'MM/DD/YYYY'); //future
        } else {
          // youve got a couple days left ;)
          var b = moment(result[i].birthday.month + "/" + result[i].birthday.day + "/" + yyyy, 'MM/DD/YYYY'); //future
        }
      } else if (mm > result[i].birthday.month) {
        // b day already happened add 1 to year
        var b = moment(result[i].birthday.month + "/" + result[i].birthday.day + "/" + (parseInt(yyyy) + 1), 'MM/DD/YYYY'); //future

      } else {
        // get days with current year
        var b = moment(result[i].birthday.month + "/" + result[i].birthday.day + "/" + yyyy, 'MM/DD/YYYY'); //future
      }

      var days = b.diff(newTime, 'days');

      result[i].daysToBirthday = days
    }
    result.sort(function (a, b) {
      return a.daysToBirthday - b.daysToBirthday;
    });
    res.render('dashboard.ejs', {
      person: result
    })
  })
})

app.post('/person', (req, res) => {
  req.body.ID = xid.next();
  birthdayYearMonthDay = req.body.birthday.split("-")
  req.body.birthday = {
    "month": birthdayYearMonthDay[1],
    "day": birthdayYearMonthDay[2],
    "year": birthdayYearMonthDay[0]
  }

  db.collection('person').save(req.body, (err, result) => {
    if (err) return console.log(err)

    console.log('saved to database')
    res.redirect('/')
  })
})

app.put('/person', (req, res) => {
  db.collection('person')
    .findOneAndUpdate({
      firstName: 'Callie'
    }, {
      $set: {
        firstName: req.body.firstName,
        lastNme: req.body.lastName,
        birthday: req.body.birthday
      }
    }, {
      sort: {
        _id: -1
      },
      upsert: true
    }, (err, result) => {
      if (err) return res.send(err)
      res.send(result)
    })
})

app.delete('/person', (req, res) => {
  db.collection('person').findOneAndDelete({
      ID: req.body.ID
    },
    (err, result) => {
      if (err) return res.send(500, err)
      res.send({
        message: 'A person was deleted',
        response: res.body
      })
    })
})