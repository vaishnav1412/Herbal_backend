const express = require("express");
const user_route = express.Router();
const { Module } = require("module");
const User = require("../models/userModel");
const upload = require('../config/multer')
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");

const userController = require("../controller/userController");
const authMiddileware = require("../Middilewares/authMiddileware")
const addressController =require("../controller/addressController")
const bannerController =require("../controller/bannerController")
const productController =require("../controller/productsController")
const foodController = require("../controller/foodController")
const premiumController = require("../controller/premiumController")
const notificationController = require("../controller/notificationController")
const workoutController = require("../controller/workoutController")
const contentController = require("../controller/contentController")
const cartController = require("../controller/cartController")
const orderController = require("../controller/orderController")
const chatController = require("../controller/messageController")
const videocallController = require("../controller/videocallController")

const sendOTP = async (email, otp) => {
  
  try {
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "vaishnavvm14@gmail.com",
        pass: "fkbfkidpmmhnholk",
      },
    });

    const mailOptions = {
      from: "vaishnavvm14@gmail.com",
      to: email,
      subject: "Email Verification - Your OTP",
      text: `Your OTP for email verification is: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    console.log("OTP sent to:", email);
  } catch (error) {
    console.error("Error sending OTP:", error);
  }
};

user_route.post("/register", async (req, res) => {
  try {
    const userExist = await User.findOne({ email: req.body.email });
    if (userExist) {
      return res
        .status(200)
        .send({ message: "User alredy exists", success: false });
    } else {
      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      sendOTP(req.body.email, otp);
      const password = req.body.password;
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);
      req.body.password = hashPassword;

      const newuser = new User(req.body);
      newuser.otp = otp;

      await newuser.save();

      res
        .status(200)
        .send({ message: "User created sucessfully.", success: true });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "Error creating user", success: false, error });
  }
});

user_route.post("/otp",async(req,res)=>{
    try {
        const user = await User.findOne({ email: req.body.email });
        
        let otp= req.body.otp
        if(user.otp ===otp){
            const update = await User.findOneAndUpdate(
                { email: req.body.email },
                { $set: { isVarified: 1 } }
              );
              res.status(200).send({ message: "Email has been varified", success: true });
        }else{
            res.status(200).send({ message: "Otp validation failed", success: false});
        }

    } catch (error) {
        res.status(500).send({ message: "something went wrong", success: false });
    }
})

user_route.post('/login',userController.login)
user_route.post('/googlelogin',userController.googleLogin)
user_route.post('/get-user-info-by-id',authMiddileware,userController.verify)
user_route.post('/conformemail',userController.conformemail)
user_route.post('/forgototp',userController.forgototpmatch)
user_route.post('/resetpassword',userController.changePassword)
user_route.post('/profiledetails',authMiddileware,userController.userDetails)
user_route.post('/uploadImage',upload.upload.single('image'),userController.uploadImage)
user_route.post('/addaddress',addressController.addressadd)
user_route.post('/addcheckoutaddress',addressController.checkoutaddressadd)
user_route.post('/bannerlist',bannerController.fetchBanner)
user_route.post('/savebmi',userController.savebmi)

user_route.post('/userprofileeditdata',userController.editUserProfile)
user_route.post('/userprofileaddressedit',addressController.editProfileAddress)
user_route.post('/userfetchproducts',productController.userfetchproducts)

user_route.post('/fetchlose',foodController.fetchlose)
user_route.post('/fetchgain',foodController.fetchgain)
user_route.post('/planlist',premiumController.fetchData)
user_route.post('/purchase',premiumController.purchase)
user_route.post('/verifypayment',premiumController.verifypayment)
user_route.post('/primecheck',premiumController.primecheck)

user_route.post('/plannotification',notificationController.takeStatus)
user_route.post('/videocallnotification',notificationController.liveStatus)
user_route.post('/videolist',workoutController.listVideos)
user_route.post('/contentlist',contentController.fetchData)

user_route.post('/addtocart',cartController.addToCart)
user_route.post('/addtocarts',cartController.addToCart)
user_route.post('/fetchcartdetails',authMiddileware,cartController.fetchCartData)

user_route.post('/increment',cartController.increment)
user_route.post('/decrement',cartController.decrement)
 
user_route.post('/deletecartdata',cartController.deleteCartProduct)
user_route.post('/fetchproduct',productController.detailProduct)
user_route.post('/deleteaddress',addressController.deleteAddress)
user_route.post('/usercheckoutaddressedit',addressController.usercheckoutaddressedit)
user_route.post('/fetchsingleaddress',addressController.fetchsingleaddress)

user_route.post('/productpurchase',orderController.purchaseProduct)
user_route.post('/verifyproductpayment',orderController.verifyProductPayment)
user_route.post('/usercatogoryfetchproducts',productController.fetchCatogoryProduct)
user_route.post('/getadmindata',userController.getAdminData)

user_route.post('/getchatdata',chatController.ChatLogs)

user_route.post('/usersideorderdetails',authMiddileware,orderController.fetchSingleOrders)
 
user_route.post('/roomcheck',videocallController.validateRoomid)
user_route.post('/findroomid',videocallController.fetchRoomId)
user_route.post('/pricesort',productController.priceSort)


user_route.post('/fetchsubscriptionhistory',authMiddileware,premiumController.fetchUserSubscribeHistory)



module.exports = user_route;
