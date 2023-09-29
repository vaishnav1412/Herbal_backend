const User = require("../models/userModel"); 
const Workout =require("../models/workoutModel")

const addVideos = async(req,res) =>{

    try {
        const name = req.body.name
        const link = req.body.link
        if(name&&link){
            const newworkout = new Workout(req.body);
            await newworkout.save();
            if(newworkout){
                res.status(200).send({ message: "Video added successfully", success: true });
            }else{
                res.status(200).send({ message: "Video upload failed", success: false });
            }
        }else{
            res.status(200).send({ message:"Something went wrong",success: false });
        }
    } catch (error) {
        console.log(error);
    }

}

const listVideos = async (req,res) =>{
    try {

        const video = await Workout.find({})
  if(video){
    res.status(200).send({ success: true,data:video })
  }else{
    res.status(200).send({message: "fetching details failed" , success: true })
  }
        
    } catch (error) {
        console.log(error);
    }
}

const deleteVideo = async (req,res) =>{
    try {
        const id = req.body.id
      if(id){
       const workout =await Workout.findOneAndDelete({_id:id})
       if(workout){
       res.status(200).send({message: "Delete workout successfully", success: true })
       }else{
        res.status(200).send({message: "something went wrong", success: false })
       }
      }else{
        res.status(200).send({message: "something went wrong", success: false })
      }
      } catch (error) {
        console.log(error);
      }
}


module.exports = {
    addVideos,
    listVideos,
    deleteVideo
}