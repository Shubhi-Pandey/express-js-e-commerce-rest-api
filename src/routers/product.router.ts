import { Category } from "../entities/category.entity";

const express = require('express');
const { appDataSource } = require('../dataSource');
const { Product } = require('../entities/product.entity');
const multer = require('multer');

const router = express.Router();

router.get('/', async (req, res) => {
    console.log("Welcome to product route");
});

const FILE_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpeg',
    'image/jpg': 'jpg',
};

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('Invalid Image Type');
        if (isValid) {
            uploadError = null;
        }
        cb(uploadError, 'public/uploads');
    },
    filename: function (req, file, cb) {
        const fileName = file.originalname.split('').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`);
    }
});

const upload = multer({ storage: storage });


router.post('/addnewproduct', upload.single('image'), async (req, res) => {
    const getCategory = await appDataSource.getRepository(Category).findOne({
        where: {
           id:req.body.category
        }
    });

    if (!getCategory) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Category does not exist!'
        });
    }
    else{
        const file = req.file;
        if (!file)
            return res.status(400).send('No image in the request')
    
        const fileName = file.filename;
        const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
        
        const createProduct=await appDataSource.getRepository(Product).create({...req.body,image:`${basePath}${fileName}`});
        const addProduct=await appDataSource.getRepository(Product).save(createProduct);
        if(!addProduct){
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Product not created!'
            });
        }
         else{
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Product has been created!'
            });
         }
    }
});

router.post('/productlist',async(req,res)=>{
     const filter={};
     const getProducts=await  appDataSource.getRepository(Product).find();
     if(!getProducts){
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Record not found!'
        });
     }
     return res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Get product list!',
        getProducts
    });
})

router.get('/:id', async (req, res) => {
    const product = await appDataSource.getRepository(Product).findOne({
        where:{
            id:req.params.id
        }
    })

    if (!product) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'The product with the given ID not exists!',
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Product fetched successfully!',
        product
       })
})


router.put('/updateproduct',upload.single('image'),async(req,res)=>{
    const getCategory=await appDataSource.getRepository(Category).findOne({
        where:{
           id: req.body.categoryId
        }
    })
    if(!getCategory){
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Category with given ID not exists!',
           })
    } 
    else{
       // console.log(getCategory);
        const getProduct=await appDataSource.getRepository(Product).findOne({
            where:{
                id:req.params.id
            }
        })
        if(!getProduct){
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Product with given ID not exists !',
               })
        }
        else{        
            getProduct.name=req.body.name
            getProduct.description=req.body.description
            getProduct.richDescription=req.body.richDescription;
            getProduct.brand=req.body.brand
            getProduct.price=req.body.price
            getProduct.category=req.body.categoryId
            getProduct.countInStock=req.body.countInStock
            getProduct.rating=req.body.rating
            getProduct.numReviews=req.body.numReviews
            getProduct.isFeatured=req.body.isFeatured
           
            const updateProduct=await appDataSource.getRepository(Product).save(getProduct);
            if(!updateProduct){
                return res.status(400).json({
                    status: false,
                    statusCode: 400,
                    message: 'Product not updated!',
                   })
            }
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Product has been updated successfully!',
                getProduct
               })
            
        }
    }
})

router.post('/:id',async(req,res)=>{
    const product=await appDataSource.getRepository(Product).findOne({
        where:{
            id:req.params.id
        }
    })
    if(!product){
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Product not found!',
           })
    }
    else{
       if(product.status=="active"){
         product.status="inActive"
         const updateStatus=await appDataSource.getRepository(Product).save(product);
         if(!updateStatus){
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Product not deleted!',
               })
         }
         return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Product deleted successfully!',
           })
       }
       else{
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Product already deleted!',
           })
       }
      
    }
})

router.get('/get/count', async (req, res) => {
    const productCount = await appDataSource.getRepository(Product).count();
    if (!productCount) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'No record found!',
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        productCount
       })
})

router.get('/get/featured/:count', async (req, res) => {
    const count = req.params.count ? req.params.count: 0
    const products = await appDataSource.getRepository(Product).find({ isFeatured: true}).limit(+count);
    if (!products) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'No featured count!',
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        products
       })
})

router.put('/gallery-images/:id', upload.array('images',10), async (req, res) => {

    const getProduct=await appDataSource.getRepository(Product).findOne({
      where:{
        id:req.params.id
      }
    })
    if(!getProduct){
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'Product not found!',
           })
    }
    const files = req.files;
    let imagesPaths = [];
    const basePath = `${req.protocol}://${req.get('host')}/public/uploads/`;
    
    if (files && files.length > 0) {
        files.map(file => {
           // console.log(file.filename); 
           // console.log(file.fileName); 
            if (file.filename) {
                imagesPaths.push(`${basePath}${file.filename}`);
            } else {
                console.error(`File name undefined for file:`, file);
            }
        });
    }
    getProduct.images = imagesPaths;

    try {
        const updatedProduct = await appDataSource.getRepository(Product).save(getProduct);
           if(!updatedProduct){
            return res.status(400).json({
                status: false,
                statusCode: 400,
                
               })
           }
           return res.status(200).json({
            status: true,
            statusCode: 200,
           message:'Product images updated successfully!'
           })
    } catch (error) {
        console.error("Error updating product:", error);
    
    }
   

})


module.exports = router;
