const Food = require('../models/foodModel')


const addFood = async ( req,res ) =>{
    try {

        const day  = req.body.day
        const type = req.body.type
        const time = req.body.time
        const food = req.body.food
        const catogory = req.body.catogory

        if(day,type,time,food,catogory){

            const newfood = new Food(req.body);
            await newfood.save();
            if(newfood){
                res.status(200).send({ message: "food added successfully", success: true });
            }else{
                res.status(200).send({ message: "something went worng", success: false });
            }
        }else{
            res.status(200).send({ message: "something went worng", success: false });
        }
        
    } catch (error) {
        console.log(error);
    }
}


const fetchfood = async(req,res) =>{
    try {
        const food = await Food.find({})
        if(food){
            res.status(200).send({ message:"welcome...",success: true,data:food});
        }else{
            res.status(200).send({  success: false });
        }
    } catch (error) {
        console.log(error);
    }
}
const deletefood =async (req,res)=>{
    try {
    const id = req.body.id
    if(id){
        const response = await Food.findOneAndRemove({_id:id})
        if(response){
            res.status(200).send({ message: "Food removed sucessfully", success: true });
        }else{
            res.status(200).send({ message: "something went worng", success: false });
        }
    }else{
        res.status(200).send({ message: "something went worng", success: false });
    }

        
    } catch (error) {
        console.log(error);
    }
}
const fetchidfood = async(req,res) =>{
    try {
        const id = req.body.id
        const menu = await Food.findOne({ _id:id })
        if(menu){
            res.status(200).send({  success: true ,data:menu});
        }else{
            res.status(200).send({ message: "something went worng", success: false });
        }
    } catch (error) {
        console.log(error);
    }
}

const editfood = async (req,res) =>{
    try {

        const id = req.body.id
        const day = req.body.day
        const type = req.body.type
        const time = req.body.time
        const foods = req.body.foods
        const catogory =req.body.catogory

        let edit = false

        if (day !== "") {
         let  updated = await Food.findOneAndUpdate(
              { _id: id },
              { $set: {day:day} }
              
            );
            edit = true;
          }
          
          if (type !== "") {
           let  updated = await Food.findOneAndUpdate(
              { _id: id },
              { $set: { type: type } }
              
            );
            edit = true;
          }
          if (time !== "") {
            let  updated = await Food.findOneAndUpdate(
               { _id: id },
               { $set: { time: time } }
               
             );
             edit = true;
           }
          
          if (foods !== "") {
          let  updated = await Food.findOneAndUpdate(
              { _id: id },
              { $set: {foods:foods} }
              
            );
            edit = true;
          }
          
          if (catogory !== "") {
          let  updated = await Food.findOneAndUpdate(
              { _id: id },
              { $set: {catogory:catogory} }
              
            );
            edit = true;
          }
        if (edit) {
          res.status(200).send({ message: "successfully updated", success: true });
        } else {
          res.status(200).send({ message: "you dont make any change", success: false });
        }
        
    } catch (error) {
        console.log(error);
    }
}

const fetchlose = async(req,res) =>{
    try {
        let data = await Food.find({catogory:'lose'})
        if(data){
            res.status(200).send({  success: true,data:data});
        }else{
            res.status(200).send({ message: "No datas present", success: false });
        }
    } catch (error) {
        console.log(error);
    }
}
const fetchgain = async(req,res) =>{
    try {
        let data = await Food.find({catogory:'gain'})
        if(data){
            res.status(200).send({   success: true,data:data});
        }else{
            res.status(200).send({ message: "No datas present", success: false });
        }
    } catch (error) {
        console.log(error);
    }
}


module.exports ={
    addFood,
    fetchfood,
    deletefood,
    fetchidfood,
    editfood,
    fetchlose,
    fetchgain
}