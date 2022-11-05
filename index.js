require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const mongoose = require('mongoose');
const  Url = require('./models/models');
const router = require('express').Router;
const { v4: uuid }= require('uuid');
const validUrl = require('valid-url');


// Basic Configuration
const port = process.env.PORT || 3000;
const dbUrl = process.env.ATLAS_PORT || 'mongodb://localhost:27017/shorturl'

app.use(cors());
app.use(express.json());
app.use(express.urlencoded());

app.get('/', async (req,res,next)=>{
  await mongoose.connect(dbUrl);
  next();
})
//app.use('/api/shorturl/', require('./routes/api.js'));

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
app.post('/',(req,res)=>{
  // get sent in url
  const {url} = req.body;
  if(!validUrl(url)){
      res.json({error: 'invalid url'});
  }
 //generate url and save into database
 const newUrl = new  Url({
  original_url: url,
  short_url:uuid()
 });
 newUrl.save((error,url)=>{
  if(error)res.json({error: 'invalid url'});
  res.json({original_url:url.original_url,short_url:url.short_url});
 })
  
});
app.get('/<short_url>',(req,res)=>{
  const {short_url} = req.params;
  const original_url = newUrl.findOne({short_url},(error,url)=>{
      if(error)res.json('URL not found in database');
      res.redirect(url.original_url);
  })
})


//app.get('/api/',require('./api.js'))
app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
