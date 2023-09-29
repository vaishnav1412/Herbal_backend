const User = require("../models/userModel");
const Address = require("../models/addressModel");
const Prime = require("../models/subscriptionModel");

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");

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


const googleLogin = async(req,res) =>{
 try {
  const email = req.body.email
  const name = req.body.name
  const user = await User.findOne({ email: req.body.email });
  if(user){
    if(user.isVarified===1){
      if(user.isBlock===0){
        const token = jwt.sign({ id: user._id ,role:'user'}, process.env.JWT_SECRET, {
          expiresIn: "1d",
        });
        res
          .status(200)
          .send({ message: "Login Successfull", success: true, data: token });
      }else{
        res
        .status(200)
        .send({ message: "Your account is blocked", success: false });
      }
    }else{
      res.status(200).send({
        message: "Kindly complete your varification process",
        success: false,
      });
    }
  }else{
   
    const user = new User({
      name: name,
      email: email,
      password: 123456,
      isVarified: 1,
     
    });
    const userData = await user.save();
if(userData){

  const token = jwt.sign({ id: user._id ,role:'user'}, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
  res
    .status(200)
    .send({ message: "Login Successfull", success: true, data: token });
    
}else{
  res
        .status(200)
        .send({ message: "Login failed", success: false });
}

  }
 } catch (error) {
  console.log(error);
 }
 
}

const login = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.status(200).send({ message: "User does not exists", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch) {
      res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      if (user.isVarified == 0) {
        res.status(200).send({
          message: "Kindly complete your varification process",
          success: false,
        });
      } else {
        if (user.isBlock === 1) {
          res
            .status(200)
            .send({ message: "Your account is blocked", success: false });
        } else {
          const token = jwt.sign({ id: user._id ,role:'user'}, process.env.JWT_SECRET, {
            expiresIn: "1d",
          });
          res
            .status(200)
            .send({ message: "Login Successfull", success: true, data: token });
        }
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "something went wrong", success: false, error });
  }
};

const verify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.userId });
    if (!user) {
      res.status(200).send({ message: "user does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: user.name,
          email: user.email,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting user info", success: false });
  }
};

const admin_verify = async (req, res) => {
  try {
    const admin = await User.findOne({ _id: req.adminId });
    if (!admin) {
      res.status(200).send({ message: "admin does not exist", success: false });
    } else {
      res.status(200).send({
        success: true,
        data: {
          name: admin.name,
          email: admin.email,
        },
      });
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting user info", success: false });
  }
};

const admin_login = async (req, res) => {
  try {
    const admin = await User.findOne({ email: req.body.email });
    if (!admin) {
      res
        .status(200)
        .send({ message: "Admin does not exists", success: false });
    }
    const isMatch = await bcrypt.compare(req.body.password, admin.password);
    if (!isMatch) {
      res
        .status(200)
        .send({ message: "Password is incorrect", success: false });
    } else {
      if (admin.isVarified == 0) {
        res.status(200).send({
          message: "Kindly complete your varification process",
          success: false,
        });
      } else {
        if (admin.isAdmin === 0) {
          res
            .status(200)
            .send({ message: "Your are not an admin", success: false });
        } else {
          const admin_token = jwt.sign(
            { id: admin._id ,role:'admin'},
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
          );
          res.status(200).send({
            message: "Login Successfull",
            success: true,
            data: admin_token,
          });
        }
      }
    }
  } catch (error) {
    res
      .status(500)
      .send({ message: "error getting admin info", success: false });
  }
};

const conformemail = async (req, res) => {
  try {
    const email = req.body.email;
    const user = await User.findOne({ email: email });
    if (!user) {
      res
        .status(200)
        .send({ message: "You are enterd a wrong email", success: false });
    } else {
      const otp = otpGenerator.generate(6, {
        digits: true,
        alphabets: false,
        upperCase: false,
        specialChars: false,
      });
      console.log(otp);
      sendOTP(req.body.email, otp);
      await User.findOneAndUpdate({ email: email }, { $set: { otp: otp } });

      res.status(200).send({ success: true });
    }
  } catch (error) {}
};
const forgototpmatch = async (req, res) => {
  try {
    const otp = req.body.otp;
    const email = req.body.email;
    user = await User.findOne({ email: email });
    if (user.otp !== otp) {
      res
        .status(200)
        .send({ message: "please enter correct otp", success: false });
    } else {
      res.status(200).send({ success: true });
    }
  } catch (error) {
    console.log(error.message);
  }
};

const changePassword = async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;
    if (email && password) {
      const salt = await bcrypt.genSalt(10);
      const hashPassword = await bcrypt.hash(password, salt);

      const user = await User.findOneAndUpdate(
        { email: email },
        { $set: { password: hashPassword } }
      );
      if (user.isAdmin === 1) {
        const hint = "admin";
        res.status(200).send({
          message: "password reset successfully",
          success: true,
          data: hint,
        });
      } else {
        const hint = "user";
        res.status(200).send({
          message: "password reset successfully",
          success: true,
          data: hint,
        });
      }
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong", success: false });
  }
};

const list_user = async (req, res) => {
  try {
    
    const user = await User.find({});
    if (!user) {
      res.status(200).send({ message: "something wrong", success: false });
    } else {
      res.status(200).send({ success: true, data: user });
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong...", success: false });
  }
};

const block_user = async (req, res) => {
  try {
    const email = req.body.email;
   
    if (!email) {
      res.status(200).send({ message: "something wrong", success: false });
    } else {
      const user = await User.findOneAndUpdate(
        { email: email },
        { $set: { isBlock: 1 } }
      );
      res
        .status(200)
        .send({ message: "Successfully blocked the user", success: true });
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong...", success: false });
  }
};
const unblock_user = async (req, res) => {
  try {
    const email = req.body.email;
    if (!email) {
      res.status(200).send({ message: "something wrong", success: false });
    } else {
      const user = await User.findOneAndUpdate(
        { email: email },
        { $set: { isBlock: 0 } }
      );
      res
        .status(200)
        .send({ message: "sucessfully unblocked the user", success: true });
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong...", success: false });
  }
};

const userDetails = async (req, res) => {
  try {
    id = req.userId;
    const user = await User.findOne({ _id: id });
    const address = await Address.findOne({ userId: id });
    if (address) {
      if (user) {
        if (user) {
          res.status(200).send({ success: true, data: user, data2: address });
        } else {
          res.status(200).send({ message: "something wrong", success: false });
        }
      } else {
        res.status(200).send({ message: "something wrong", success: false });
      }
    } else {
      if (user) {
        res.status(200).send({ success: true, data: user });
      } else {
        res.status(200).send({ message: "something wrong", success: false });
      }
    }
  } catch (error) {
    console.log(error);
  }
};
const uploadImage = async (req, res) => {
  try {
    const user = req.body.user;
    const img = req.file.filename;
    const image= req.file.mimetype

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(image)) {
      res
      .status(200)
      .send({ message: "only accept jpeg,png,gif files", success: false });
    } else {
      const maxSizeBytes = 5 * 1024 * 1024;
      if (img.size > maxSizeBytes) {
        res
        .status(200)
        .send({ message: "only accept images upto 5 mb", success: false });
      } else {
        if (user) {
          const data = await User.findOneAndUpdate(
            { _id: user },
            { $set: { image: img } }
          );
          if (data) {
            res
              .status(200)
              .send({ message: "successfully updated", success: true });
          } else {
            res
              .status(200)
              .send({ message: "something wrong", success: false });
          }
        } else {
          res.status(200).send({ message: "something wrong", success: false });
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const uploadImages = async (req, res) => {
  try {
    const admin = req.body.admin;
    const img = req.file.filename;
    const image= req.file.mimetype

    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(image)) {
      res
      .status(200)
      .send({ message: "only accept jpeg,png,gif files", success: false });
    } else {
      const maxSizeBytes = 5 * 1024 * 1024;
      if (img.size > maxSizeBytes) {
        res
        .status(200)
        .send({ message: "only accept images upto 5 mb", success: false });
      } else {

    if (admin) {
      const data = await User.findOneAndUpdate(
        { _id: admin },
        { $set: { image: img } }
      );
      if (data) {
        res
          .status(200)
          .send({ message: "successfully updated", success: true });
      } else {
        res.status(200).send({ message: "something wrong", success: false });
      }
    } else {
      res.status(200).send({ message: "something wrong", success: false });
    }

  }
}

  } catch (error) {
    console.log(error);
  }
};

const adminProfileDetails = async (req, res) => {
  try {
    id = req.adminId;
    const user = await User.findOne({ _id: id });
    if (user) {
      res.status(200).send({ success: true, data: user });
    } else {
      res.status(200).send({ message: "something wrong", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};
const addprofiledetails = async (req, res) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const experience = req.body.experience;
    const qualification = req.body.qualification;
    const user = await User.findOneAndUpdate(
      { _id: id },
      {
        $set: {
          experience: experience,
          qulification: qualification,
          role: role,
        },
      }
    );

    if (user) {
      res.status(200).send({ message: "successfully updated", success: true });
    } else {
      res.status(200).send({ message: "something wrong", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const adminprofileeditdata = async (req, res) => {
  try {
    const id = req.body.id;
    const role = req.body.role;
    const experience = req.body.experience;
    const qualification = req.body.qualification;
    let edit = false;
    if (role !== "") {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { role: role } }
      );
      edit = true;
    }
    if (experience !== 0) {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { experience: experience } }
      );
      edit = true;
    }
    if (qualification !== "") {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { qulification: qualification } }
      );
      edit = true;
    }
    if (edit) {
      res.status(200).send({ message: "successfully updated", success: true });
    } else {
      res
        .status(200)
        .send({ message: "you dont make any change", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const fetchdetails = async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const data = await User.findOne({ _id: id });
      if (data) {
        res.status(200).send({ success: true, data: data });
      } else {
        res
          .status(200)
          .send({ message: "something went wrong", success: false });
      }
    } else {
      res.status(200).send({ message: "something went wrong", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const savebmi = async (req, res) => {
  const bmi = req.body.bmi;
  const id = req.body.id;

  try {
    const responce = await User.findOneAndUpdate(
      { _id: id },
      { $set: { bmi: bmi } }
    );
  } catch (error) {
    console.log(error);
  }
};

const editUserProfile = async (req, res) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    const age = req.body.age;
    const email = req.body.email;
    let edit = false;
    if (name !== "") {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { name: name } }
      );
      edit = true;
    }
    if (age !== 0) {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { age: age } }
      );
      edit = true;
    }
    if (email !== "") {
      const user = await User.findOneAndUpdate(
        { _id: id },
        { $set: { email: email } }
      );
      edit = true;
    }
    if (edit) {
      res.status(200).send({ message: "successfully updated", success: true });
    } else {
      res
        .status(200)
        .send({ message: "you dont make any change", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const getAdminData = async(req,res) =>{
  try {
    const admin = await User.find({isAdmin:1})
   if (!admin) {
    res
    .status(200)
    .send({ message: "something went wrong", success: false });
   } else {
    res
    .status(200)
    .send({ message: "redirected  to appoinment session ", success: true,data:admin });
   }
  
  } catch (error) {
  console.log(error);
 }
}

const getPrimeUserDetails = async(req,res) =>{
  try {

    const user = await User.find({$and:[{isPrime:1},{isAdmin:0}]})
  
    if (!user) {
     res
     .status(200)
     .send({ message: "something went wrong", success: false });
    } else {
     res
     .status(200)
     .send({ success: true,data:user });
    }
    
  } catch (error) {
    console.log(error);
  }
}
const fetchSingleData = async(req,res) =>{
  try {
    const id = req.body.id
   if(id){
    const user = await User.findOne({_id:id})
    const admin = await User.findOne({isAdmin:1})
 
    if (user) {
      res
      .status(200)
      .send({ success: true,data:user,auther:admin });
    } else {
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

module.exports = {
  login,
  verify,
  admin_login,
  admin_verify,
  conformemail,
  forgototpmatch,
  changePassword,
  list_user,
  block_user,
  unblock_user,
  userDetails,
  uploadImage,
  adminProfileDetails,
  uploadImages,
  addprofiledetails,
  fetchdetails,
  adminprofileeditdata,
  savebmi,
  editUserProfile,
  googleLogin,
  getAdminData,
  getPrimeUserDetails,
  fetchSingleData
  
};
