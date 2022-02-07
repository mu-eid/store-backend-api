import { Request, Response, NextFunction } from 'express';
import { Item } from '../../models/order_item';

const checkItemEntity = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  const { order_id, product_id, quantity } = req.body as Item;

  let reason: string = '';

  if (!order_id) {
    reason = 'Order ID was not provided.';
  }

  if (!product_id) {
    reason = 'Product ID was not provided.';
  }

  if (!quantity) {
    reason = 'Quantity value was not provided.';
  }

  if (reason) {
    resp.status(422).json({
      error: {
        reason: reason,
        recieved: {
          order_id: order_id,
          product_id: product_id,
          quantity: quantity,
        },
      },
    });
    return;
  }
  next();
};

export { checkItemEntity };
