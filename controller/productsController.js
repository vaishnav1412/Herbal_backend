const Product = require("../models/productModel");

const addProducts = async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const stock = req.body.stock;
    const description = req.body.description;
    const img = req.file.filename;
    const image=req.file.mimetype;
    const catogory =req.body.catogory;
    
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
    if (name && price && quantity && stock && description && img) {
      const product = new Product({
        name: name,
        price: price,
        quantity: quantity,
        stock: stock,
        description: description,
        image: img,
        catogory:catogory
      });
      const productData = await product.save();
      res
        .status(200)
        .send({ message: "products added succesfully", success: true });
    } else {
      res
        .status(200)
        .send({ message: "products added failed", success: false });
    }
  }
}
  } catch (error) {
    console.log(error);
  }
};
const fetchProducts = async (req, res) => {
  try {
    const product = await Product.find({});
    if (product) {
      res.status(200).send({ success: true, data: product });
    } else {
      res.status(200).send({ message: "something went worng", success: false });
    }
  } catch (error) {
    console.log(console.error);
  }
};

const block_product = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      res.status(200).send({ message: "something wrong", success: false });
    } else {
      console.log("hellow");
      const user = await Product.findOneAndUpdate(
        { _id: id },
        { $set: { isBlock: 1 } }
      );
      res
        .status(200)
        .send({ message: "Successfully blocked the products", success: true });
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong...", success: false });
  }
};
const unblock_product = async (req, res) => {
  try {
    const id = req.body.id;
    if (!id) {
      res.status(200).send({ message: "something wrong", success: false });
    } else {
      const user = await Product.findOneAndUpdate(
        { _id: id },
        { $set: { isBlock: 0 } }
      );
      res
        .status(200)
        .send({ message: "sucessfully unblocked the product", success: true });
    }
  } catch (error) {
    res.status(500).send({ message: "something wrong...", success: false });
  }
};

const fetchProduct = async (req, res) => {
  try {
    const id = req.body.id;
    if (id) {
      const product = await Product.findOne({ _id: id });
      if (product) {
        res.status(200).send({ success: true, data: product });
      } else {
        res.status(200).send({ message: "something wrong", success: false });
      }
    } else {
      res.status(200).send({ message: "something wrong", success: false });
    }
  } catch (error) {
    console.log(error);
  }
};

const editproducts = async (req, res) => {
  try {
    const name = req.body.name;
    const price = req.body.price;
    const quantity = req.body.quantity;
    const stock = req.body.stock;
    const description = req.body.description;
    const productId = req.body.productId;
    const catogory = req.body.catogory;

    let edit = false;
    if (name !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { name: name } }
      );
      edit = true;
    }
    if (price != 0) {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { price: price } }
      );
      edit = true;
    }
    if (quantity !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { quantity: quantity } }
      );
      edit = true;
    }
    if (stock !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { stock: stock } }
      );
      edit = true;
    }
    if (description !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { description: description } }
      );
      edit = true;
    }
    if (catogory !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { catogory: catogory } }
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

const editproductswithimage = async (req, res) => {
  const name = req.body.name;
  const price = req.body.price;
  const quantity = req.body.quantity;
  const stock = req.body.stock;
  const description = req.body.description;
  const image = req.file.filename;
  const productId = req.body.productId;
  const catogory = req.body.catogory;

  try {
    let edit = false;
    if (name !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { name: name } }
      );
      edit = true;
    }
    if (price !=0) {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { price: price } }
      );
      edit = true;
    }
    if (catogory !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { catogory: catogory } }
      );
      edit = true;
    }
    if (quantity !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { quantity: quantity } }
      );
      edit = true;
    }
    if (stock !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { stock: stock } }
      );
      edit = true;
    }
    if (description !== "") {
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { description: description } }
      );
      edit = true;
    }
    if(image){
      const user = await Product.findOneAndUpdate(
        { _id: productId },
        { $set: { image: image } }
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

const userfetchproducts = async (req, res) => {
  try {
    const product = await Product.find({ isBlock: 0 });
    if (product) {
      res.status(200).send({ success: true, data: product });
    } else {
      res.status(200).send({ message: "something went worng", success: false });
    }
  } catch (error) {
    console.log(console.error);
  }
};

const detailProduct = async(req,res) =>{
try {
  const productId = req.body.productId
  if (productId) {
    const product = await Product.find({_id:productId});
    if (product) {
      res.status(200).send({ success: true, data: product });
    } else {
      res.status(200).send({ message: "something went worng", success: false });
    }
  } else {
    res.status(200).send({ message: "something went worng", success: false });
  }
} catch (error) {
  console.log(error);
}
}

const fetchCatogoryProduct = async (req,res) =>{
  try {
     
      const catogory = req.body.selectedCategory

      if (catogory) {

          if(catogory ==='gain'){
            const product = await Product.find({catogory:1});
            res.status(200).send({ success: true, data: product });
          }else if (catogory ==='lose'){
            const product = await Product.find({catogory:3});
            res.status(200).send({ success: true, data: product });
          }else{
            const product = await Product.find({ });
            res.status(200).send({ success: true, data: product });
          }
        
      } else {
        res.status(200).send({ message: "something wrong", success: false });
      }
   
  } catch (error) {
    console.log(error);
  }
}

const priceSort = async(req,res) =>{
  try {
    const  range = req.body.selectedPrice
    console.log(range);
    const priceRangeMap = {
      '1': { min: 0, max: 500 },
      '2': { min: 500, max: 1000 },
      '3': { min: 1000, max: 2000 },
      '4': { min: 2000, max: 3000 },
      '5': { min: 3000, max: 4000 },
      '6': { min: 4000, max: 5000 },
      '7': { min: 5000, max: 10000 },
    };

    const { min, max } = priceRangeMap[range];
    const products = await Product.find({ price: { $gte: min, $lte: max } });

    if(products){

      res.status(200).send({ success: true, data: products});
    }else{
      res.status(200).send({ message: "something wrong", success: false });

    }
    
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  addProducts,
  fetchProducts,
  block_product,
  unblock_product,
  fetchProduct,
  editproducts,
  userfetchproducts,
  editproductswithimage,
  detailProduct,
  fetchCatogoryProduct,
  priceSort
};
