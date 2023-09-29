const express = require("express");
const admin_route = express.Router();
const upload = require('../config/multer')


const userController = require("../controller/userController");
const admin_auth = require("../Middilewares/adminAuth")
const bannerController = require("../controller/bannerController")
const productController = require("../controller/productsController")
const foodController = require("../controller/foodController")
const premiumController = require("../controller/premiumController")
const workoutController = require("../controller/workoutController")
const contentController = require("../controller/contentController")
const dashboardController = require("../controller/dashboardController")
const chatController = require("../controller/messageController")
const orderController = require("../controller/orderController")
const videocallController = require("../controller/videocallController")

admin_route.post('/login',userController.admin_login)
admin_route.post('/get-admin-info-by-id',userController.admin_verify)
admin_route.post('/userlist',userController.list_user)
admin_route.post('/blockuser',userController.block_user)
admin_route.post('/unblockuser',userController.unblock_user)

admin_route.post('/blockproducts',productController.block_product)
admin_route.post('/unblockproducts',productController.unblock_product)

admin_route.post('/addbanner', upload.upload.single('image'),bannerController.addBanner)
admin_route.post('/bannerlist',bannerController.fetchBanner)
admin_route.post('/deletebanner',bannerController.deleteBanner)
admin_route.post('/addproducts',upload.upload.single('image'),productController.addProducts)
admin_route.post('/editproducts',productController.editproducts)
admin_route.post('/editproductswithimage',upload.upload.single('image'),productController.editproductswithimage)


admin_route.post('/fetchproducts',productController.fetchProducts)
admin_route.post('/fetchproduct',productController.fetchProduct)
admin_route.post('/profiledetails',admin_auth,userController.adminProfileDetails)
admin_route.post('/uploadImage',upload.upload.single('image'),userController.uploadImages)
admin_route.post('/adminprofiledata',userController.addprofiledetails)
admin_route.post('/fetchdetails',userController.fetchdetails)
admin_route.post('/adminprofileeditdata',userController.adminprofileeditdata)
admin_route.post('/savefood',foodController.addFood)

admin_route.post('/fetchfood',foodController.fetchfood)
admin_route.post('/deletefood',foodController.deletefood)

admin_route.post('/fetchidfood',foodController.fetchidfood)
admin_route.post('/editfood',foodController.editfood)


admin_route.post('/addplans',premiumController.addPlan)
admin_route.post('/planlist',premiumController.fetchData)
admin_route.post('/deleteplan',premiumController.deletePlan)

admin_route.post('/videolist',workoutController.listVideos)
admin_route.post('/addvideos',workoutController.addVideos)
admin_route.post('/deletevideo',workoutController.deleteVideo)


admin_route.post('/addcontent',upload.upload.single('image'),contentController.addContent)
admin_route.post('/contentlist',contentController.fetchData)
admin_route.post('/deletecontent',contentController.deleteContent)

admin_route.post('/dashboarddetails',dashboardController.dashboardData)
admin_route.post('/getprimeuserdata',userController.getPrimeUserDetails)
admin_route.post('/fetchsingledata',userController.fetchSingleData)
admin_route.post('/getchatdata',chatController.adminChatData)
admin_route.post('/displayorders',orderController.displayOrders)
admin_route.post('/dashboarddisplayorders',orderController.dashboarddisplayOrders)
admin_route.post('/fetchsingleorder',orderController.fetchProductFromOrder)
admin_route.post('/changestatus',orderController.changeStatus)
admin_route.post('/addroomid',videocallController.addRoomId)
admin_route.post('/findroomid',videocallController.fetchRoomId)
admin_route.post('/deleteroom',videocallController.deleteRoom)
admin_route.post('/roomcheck',videocallController.validateRoomid)
admin_route.post('/primeusersdetails',premiumController.primiumCoustomers)

module.exports = admin_route;