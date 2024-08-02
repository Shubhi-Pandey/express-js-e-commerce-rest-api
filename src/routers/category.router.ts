import express from "express"
import { Category } from "../entities/category.entity";
import { appDataSource } from "../dataSource";
import { And } from "typeorm";
const router=express.Router();

router.get('/',(req,res)=>{
    console.log('Welcome in category route!');
})

router.post('/addnewcategory',async(req,res)=>{
    if(req.body.name==undefined || req.body.name==null || req.body.name==''){
       return res.status(401).json({
            status: false,
            statusCode: 401,
            message: "Name should be valid or not blank!",
          });
    }
    const getCategoryName=await appDataSource.getRepository(Category).findOne({
        where:{
            name:req.body.name
        }
    })
    if(getCategoryName){
      return  res.status(400).json({
            status: false,
            statusCode: 400,
            message: "Category name already exist!",
          });
    }
   else{
    const productData=await appDataSource.getRepository(Category).create(req.body);
    const productRawaData=await appDataSource.getRepository(Category).save(productData);
    if(productRawaData){
      return  res.status(200).json({
            status: true,
            statusCode: 200,
            message: "Category has been created successfully!",
          });
    }
   return res.status(400).json({
        status: false,
        statusCode: 400,
        message: "Category not created!",
      });
   }
})


router.get('/allcategory', async (req, res) => {
    const categoryList = await appDataSource.getRepository(Category).find();

    if (!categoryList) {
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'No category found!',
        
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Categories fetched successfully!',
       categoryList
       })
   
})

router.get('/:id', async (req, res) => {
    const category = await appDataSource.getRepository(Category).findOne({
        where:{
            id:req.params.id
        }
    })

    if (!category) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
            message: 'The category with the given ID not exists!',
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
        message: 'Category fetched successfully!',
        category
       })
})

router.put('/:id', async (req, res) => {
    const categoryId = req.params.id;

    try {
        // Find the existing category
        const categoryRepository = appDataSource.getRepository(Category);
        const category = await categoryRepository.findOneBy({ id: categoryId });

        if (!category) {
            return res.status(401).json({
                  status: false,
                  statusCode: 401,
                  message: 'Category not found'
                 });
                }

        // Update the category properties
        category.name = req.body.name;
        category.icon = req.body.icon;
        category.color = req.body.color;

        // Save the updated category
        const updatedCategory = await categoryRepository.save(category);
          return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Category updated successfully',
            updatedCategory
           })
    } catch (error) {
        console.error(error);
        return res.status(400).json({ status:false,statusCode:400,message: 'Not updated the category!' });
    }
});

router.post('/:id',async(req,res)=>{
    const getCategory=await appDataSource.getRepository(Category).findOne({
        where:{
            id:req.params.id 
        }  
     })

    if(!getCategory){
        return res.status(404).json({
            status: false,
            statusCode: 401,
            message: 'Category not found'
        });
    }
    else{
        if(getCategory.status=="active"){
            getCategory.status="inActive";
            const updateStatus=await appDataSource.getRepository(Category).save(getCategory);
            if(!updateStatus){
                return res.status(400).json({
                    status: false,
                    statusCode: 400,
                    message: 'Category not deleted!'
                })
            }
            return res.status(200).json({
                status: true,
                statusCode: 200,
                message: 'Category  deleted successfully!'
            })
        }
        else{
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Category already deleted!'
            })
        }
    }
})

module.exports=router;