import { Request, Response } from 'express';
import express from "express";
import { User } from '../entities/user.entity'; // Adjust path as per your project structure
import { Orders } from '../entities/order.entity'; // Adjust path as per your project structure
 // Adjust path as per your project structure
import { appDataSource } from '../dataSource';
import { orderItems } from '../entities/orderItems.entity';
const router=express.Router();


router.post('/createorder', async (req: Request, res: Response) => {
    try {
        const orderItemsData = req.body.orderitems; // Assuming req.body.orderItems is an array of order items
        const orderItemRepository = appDataSource.getRepository(Orders);
        // Create and save order items
        const createdOrderItems = await Promise.all(orderItemsData.map(async (orderItemData) => {
            const newOrderItem = orderItemRepository.create({
                quantity: orderItemData.quantity,
                product: orderItemData.product // Assuming product is properly defined in your entity
            });
                  const  newOrderItemAdded=await orderItemRepository.save(newOrderItem)
                  return newOrderItemAdded.id;
          //  return await orderItemRepository.save(newOrderItem);
        }));

        const orderItemsIdsResolved=await createdOrderItems
        // Fetch total prices for each order item asynchronously
        const totalPrices:number [] = await Promise.all(orderItemsIdsResolved.map(async (orderItemId) => {
            const totalPriceQuery = await orderItemRepository
                .createQueryBuilder('orderItem')
                .leftJoin('orderItem.product', 'product')
                .addSelect('SUM(product.price * orderItem.quantity)', 'totalPrice')
                .where('orderItem.id = :id', { id: orderItemId })
                .getRawOne();

            return totalPriceQuery.totalPrice || 0; // Ensure totalPrice is defined
        }));
              
       
       
        console.log('Total Prices:', totalPrices);
        const totalPric: number = totalPrices.reduce((accumulator, currentValue) => accumulator + currentValue, 0);

        const order = new orderItems();
        order.orderItems = orderItemsIdsResolved; // Assign order items IDs array or entities as per your setup
        order.shippingAddress1 = req.body.shippingAddress1;
        order.shippingAddress2 =req.body.shippingAddress2;
        order.city = req.body.city;
        order.zip = req.body.zip;
        order.country = req.body.country;
        order.phone = req.body.phone;
        order.status = req.body.status;
        order.totalPrice =totalPric; 
        order.user = req.body.user;

      //  Save order to database
        const savedOrder = await appDataSource.getRepository(orderItems).save(order);
         console.log(savedOrder);
         
        if (!savedOrder) {
            return res.status(400).json({
                status: false,
                statusCode: 400,
                message: 'Order cannot be created!',
               })
        }
        return res.status(200).json({
            status: true,
            statusCode: 200,
            message: 'Order created!',
            order: savedOrder
           })
        
    } catch (error) {
        console.error('Error creating order items:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



router.get('/', async (req: Request, res: Response) => {
    try {
        const orderItemList = await appDataSource.getRepository(orderItems)
            
            .find();

        res.send(orderItemList);
    } catch (error) {
        console.error('Error fetching order list:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});

router.get('/:id', async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id, 10); // Assuming orderId is numeric

        const order = await appDataSource.getRepository(orderItems)
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.user', 'user') // Join user relation
            .where('order.id = :id', { id: orderId })
            .select(['order', 'user.name']) // Select order and user's name
            .getOne();

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        res.send(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ success: false, error: 'Internal server error' });
    }
});


router.put('/:id', async (req: Request, res: Response) => {
    try {
        const orderId = parseInt(req.params.id, 10); // Assuming orderId is numeric

        const orderRepository = await appDataSource.getRepository(orderItems);
        const order = await orderRepository.findOne({where:{id:orderId}});

        if (!order) {
            return res.status(404).send('Order not found');
        }

        order.status = req.body.status;
        const updatedOrder = await orderRepository.save(order);

        res.send(updatedOrder);
    } catch (error) {
        console.error('Error updating order:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', async(req, res) => {
    try {
        const orderId = parseInt(req.params.id, 10); // Assuming orderId is numeric

        const orderRepository = await appDataSource.getRepository(orderItems);
        const order = await orderRepository.findOne( {where:{id:orderId}});

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Delete associated order items
        const orderItemRepository = await appDataSource.getRepository(orderItems);
        await Promise.all(order.orderItems.map(async (orderItem) => {
            await orderItemRepository.delete(orderItem.id);
        }));

        // Delete the order itself
        await orderRepository.delete(orderId);

        return res.status(200).json({ success: true, message: 'Order deleted successfully' });
    } catch (error) {
        console.error('Error deleting order:', error);
        return res.status(500).json({ success: false, error: 'Internal server error' });
    }
})


router.get('/get/count', async (req, res) => {
    const orderCount = await await appDataSource.getRepository(orderItems).count();
    if (!orderCount) {
        return res.status(400).json({
            status: false,
            statusCode: 400,
           message:'No record available!'
           })
    }
    return res.status(200).json({
        status: true,
        statusCode: 200,
       orderCount
       })
})

module.exports=router;