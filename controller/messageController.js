const User = require("../models/userModel");
const Chat = require("../models/chatModel")
const saveChat = async (data) =>{
  
    try {
        const { room, auther, message, time } = data;
          const roomexist=await Chat.findOne({chatRoom:room})
  if(roomexist){
  const chat=  await Chat.findOne(({chatRoom:room}))
    const id=chat._id
    const chatUpdate = await Chat.findByIdAndUpdate(
      id, 
      {
        $push: {
          chathistory: {
            author: auther,
            message: message,
            time: new Date(),
          },
        },
      },
      { new: true }
    );
    
  }
  else{
    const savechat=new Chat({
      chatRoom:room,
      chathistory:[
        {
          author:auther,
          message:message,
          time:new Date()
        }
      ]
    })
    await savechat.save()

  }

    } catch (error) {
        console.log(error);
    }
}

const ChatLogs = async(req,res) =>{
  try {
    const id = req.body.id
    if(id){
      const chat = await Chat.findOne({ chatRoom:id})
      if(chat){
        res
        .status(200)
        .send({ message: "something went wrong", success: true , data:chat });

      }else{
        res
        .status(200)
        .send({ message: "something went wrong my mistake", success: false });
      }

    }else{
      res
      .status(200)
      .send({ message: "something went wrong", success: false });
    }
    
  } catch (error) {

    console.log(error);

  }
}

const adminChatData = async(req,res) =>{
  try {
    const id = req.body.id
    if(id){
      const chat = await Chat.findOne({ chatRoom:id})
      if(chat){
        res
        .status(200)
        .send({ message: "something went wrong", success: true , data:chat });

      }else{
        res
        .status(200)
        .send({ message: "something went wrong", success: false });
      }

    }else{
      res
      .status(200)
      .send({ message: "something went wrong", success: false });
    }
    
  } catch (error) {

    console.log(error);

  }
} 

module.exports ={
    saveChat,
    ChatLogs,
    adminChatData
}