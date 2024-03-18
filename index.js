const express = require("express");
const bodyparser = require("body-parser");
const mongoose = require('mongoose');

const app = express();

app.use(bodyparser.json());
app.use(express.static('public'));
app.use(bodyparser.urlencoded({extended:true}));

mongoose.connect('mongodb://127.0.0.1:27017/loans', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

var db = mongoose.connection;

app.get('/',(req,res) => {
  res.sendFile(__dirname+"/index.html");
})

app.post('/',(req,res) => {
   let principal = Number(req.body.principal);
   let interestRate = Number(req.body.interestRate) / 100 / 12;
   let months = Number(req.body.months);

   let emi = principal * interestRate * Math.pow(1 + interestRate, months) / (Math.pow(1 + interestRate, months)-1);
   let Tamount = emi * months;
   let Tinterest = Tamount - principal;
   res.send('<p>Monthly EMI will be of   Rs.'+emi.toFixed(2)+'</p><p>Total Amount will be of   Rs.'
   +Tamount.toFixed(2)+'</p><p>Total Interest will be of   Rs.'+Tinterest.toFixed(2)+'</p>');

   var data = {
    "EMI":emi,
    "Total_Amount":Tamount,
    "Total_Interest":Tinterest
  }

  db.collection('users').insertOne(data,(err,collection) => {
    if(err){
      throw err;
    }
    console.log("Data Stored successfully!!!");
  });

  return res.redirect('index.html');

});

app.listen(3000,() => {
  console.log("Server is ready at port 3000");
})