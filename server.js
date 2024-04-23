// const express = require("express");
import express from "express"
const app = express();
const PORT = process.env.PORT || 5000;
// const cors = require('cors');
import cors from 'cors'
// const bodyParser = require('body-parser');
import bodyParser from "body-parser"

// const mongoose = require("mongoose");
import mongoose from "mongoose";
mongoose.connect("mongodb+srv://databaseparking:champ1234@cluster0.5fheemo.mongodb.net/parkingsystem");

//   app.use = express.json();
app.use(cors());
app.use(bodyParser.json());

var shopInfoSchema = mongoose.Schema(
    {},
    {
      collection: "shopInfo",
      strict: false,
      timestamps: true,
    }
  );

  var loginInfoSchema = mongoose.Schema(
    {},
    {
      collection: "loginInfo",
      strict: false,
      timestamps: true,
    }
  );

  var vehicalInfoSchema = mongoose.Schema(
    {},
    {
      collection: "vehicalInfo",
      strict: false,
      timestamps: true,
    }
  );




  const ShopInfo = mongoose.model('shopInfo', shopInfoSchema);
  const LoginInfo =  mongoose.model('loginInfo', loginInfoSchema)
  const VehicalInfo =  mongoose.model('vehicalInfo', vehicalInfoSchema)

  app.get('/api/shopInfo', async (req, res) => {
    try {
        const dataget = await LoginInfo.find()
         res.json(dataget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/login', async (req, res) => {
    const {email, password} = req.body;
    try {
        const dataget = await LoginInfo.find({email, password})
         res.json(dataget);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/addUser', async (req, res) => {
    const { email} = req.body 
    try {
        const datafind = await LoginInfo.find({email})
        if(datafind.length > 0){
            res.status(600).json({ message: "User Already Exist" });
        }else{
            const newUser = new LoginInfo(req.body);
        const saveUser = await newUser.save();
         res.json();
        }
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });

  app.post('/api/addvehical', async (req, res)=>{
    const {vno, vname, shopno} = req.body;
    try{
      const datafind = await VehicalInfo.find({vno})
      const totalvehical = await VehicalInfo.find({shopno})
      if(totalvehical.length < 2){
        if(datafind.length > 0){
          res.status(600).json({ message: "Vehical Already Exist" });
      }else{
          const newUser = new VehicalInfo(req.body);
          const saveUser = await newUser.save();
       res.json();
      }
      }else{
        res.status(400).json({ message: "Limit exceeded" });
      }

    }catch(error){
        res.json(500).json({message: 'Please CHeck again'})
    }
  })    

  app.post('/api/getVehicalbyshop', async (req, res)=>{
    const {vno} = req.body;
    console.log(vno, "data");
    try{
      const datafind = await VehicalInfo.find({shopno : vno})
      if(datafind){
        console.log(datafind, "all data")
          res.json(datafind);
      }
    }catch(error){
        res.json(500).json({message: 'Please CHeck again'})
    }
  })    

  app.post('/api/removeVehical', async (req, res)=>{
    console.log(req.body, "data");
    const {vno, shopno} = req.body
    try{
      const datafind = await VehicalInfo.find({shopno : shopno, vno: vno})
      if(datafind){
        console.log(datafind, "Data Removed")
        const newone = await VehicalInfo.findOneAndDelete({shopno : shopno, vno: vno})
        res.json();
      }else{
        res.json(600).json({message:'No vehical found'})
      }
    }catch(error){
        res.json(500).json({message: 'Please CHeck again'})
    }
  }) 

  app.post('/api/searchVehical', async (req, res)=>{
    const {vno} = req.body
    console.log(vno, "search Vehical");
    try{
      const datafind = await VehicalInfo.find({ vno: vno})
      console.log(datafind, "Here is data");
      res.json(datafind);
    }catch(error){
        res.json(500).json({message: 'Please CHeck again'})
    }
  }) 

  app.post('/api/deleteUser', async (req, res)=>{
    const {shopno} = req.body
    console.log(shopno, "shopno user to delte");
    try{
      const delteVehicals = await VehicalInfo.deleteMany({shopno : shopno});
      const deleteUser = await LoginInfo.findOneAndDelete({shopno : shopno});
      console.log(delteVehicals, deleteUser,"deleted")
      res.json();
    }catch(error){
        res.json(500).json({message: 'Please CHeck again'})
    }
  }) 

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));