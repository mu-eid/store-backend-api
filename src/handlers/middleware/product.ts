import { Request, Response, NextFunction } from 'express';

const checkProductPayload = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  const { name, price } = req.body;

  let reason: string = ''; // error message

  if (!name) {
    reason = 'Product name was not provided.';
  }

  if (!price) {
    reason = 'Price was not provided.';
  }

  const priceValue = parseFloat(price);

  if (!priceValue || priceValue < 0) {
    reason = 'Price needs to be a positive real number';
  }

  if (reason) {
    resp.status(422).json({
      error: {
        reason: reason,
        recieved: {
          name: name,
          price: price,
        },
      },
    });
    return;
  }
  next();
};

const checkProductID = (
  req: Request,
  resp: Response,
  next: NextFunction
): void => {
  const param = req.params['id'];
  const id = parseInt(param, 10);

  if (!id) {
    resp.status(400).json({
      error: {
        reason: `User ID needs to be a positive integer greater than 0`,
        recieved: `${param}`,
      },
    });
    return;
  }
  next();
};

export { checkProductPayload, checkProductID };
