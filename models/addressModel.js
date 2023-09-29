const mongoose = require('mongoose')

const addressSchema = new mongoose.Schema({
    userId:{
        type:String,
        required:true
    },
    addresses:[{
        pin:{
            type:Number,
            required:true
        },
        name:{
            type:String,
            required:true
        },
        place:{
            type:String,
            required:true
        },
        district:{
            type:String,
            required:true
        }
    }]
})



const addressModel = mongoose.model('address',addressSchema)

module.exports=addressModel