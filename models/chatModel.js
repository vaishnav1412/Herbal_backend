const mongoose=require('mongoose')
const chatSchema=mongoose.Schema({
    chatRoom:{
        type:String,
        required:true
    },
    chathistory:[
           {
            author:{
                type:String
            },
            message:{
                type:String
            },
            time:{
                type:Date

            }
           }
    ]
},{
    timstamps:true
})

const chatModel=mongoose.model('chatHistory',chatSchema)
module.exports=chatModel