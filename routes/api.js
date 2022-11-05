const  Url = require('../models/models');
const router = require('express').Router;
const { v4: uuid }= require('uuid');
const validUrl = require('valid-url');

router.post('/',(req,res)=>{
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
router.get('/<short_url>',(req,res)=>{
    const {short_url} = req.params;
    const original_url = newUrl.findOne({short_url},(error,url)=>{
        if(error)res.json('URL not found in database');
        res.redirect(url.original_url);
    })
})