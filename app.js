const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const app = express()

mongoose.connect('mongodb://localhost:27017/samples', { useNewUrlParser:true, useUnifiedTopology:true}).then(() => {
  console.log('connected')
}).catch((err) => {
  console.log(err)
});

app.use(bodyParser.urlencoded({extended: false }))
app.use(express.json())

const productshcema = new mongoose.Schema({
  name: String,
  description: String,
  price: Number,
})

const Product = new mongoose.model('Product', productshcema)


app.listen(4500, () => {
   // create product
  app.post('/api/a1/products/new', async (req, res) => {
    const product = await Product.create(req.body);

    res.status(201).json({sucsess: true,product})
  });
 
  // read product
  app.get('/api/v1/products', async (req, res) => {
    const products = await Product.find()

    res.status(200).json({sucsess:true,products})
  });

  //update
  app.put('/api/v1/products/:id', async(req, res)=>{
    let product = await Product.findById(req.params.id)

    
    if(!product){
      return req.status(500).json({
        success: false,
        message: "product not found",
      })
    }

    product = await Product.findByIdAndUpdate(req.params.id, req.body, {new: true, useFindAndModify: false, runValidators: true
    })
    res.status(200).json({
      sucsess: true,
      product
    })
  });

  // delete products
  app.delete('/api/v1/product/:id', async(req, res)=>{
    const product = await Product.findById(req.params.id)

    if(!product){
      return req.status(500).json({
        success: false,
        message: "product not found"
      })
    }

    await product.remove();

    res.status(200).json({
      sucsess: true,
      message: "product deleted successfully",
    })
  })

  console.log('server is listening http://localhost:4500')
});