import { User } from '../../models/user';
import { Product } from '../../models/product';
import { Order } from '../../models/order';
import { Item } from '../../models/order_item';

const userMock: User = {
  first_name: 'Martin',
  last_name: 'Odersky',
  password: '$calaR0ck$',
};

const productMock: Product = {
  name: 'Programming Scala, 5th Edition',
  price: 59.99,
};

const orderMock: Order = {
  user_id: 1,
  complete: false,
};

const itemMock: Item = {
  order_id: 1,
  product_id: 1,
  quantity: 1,
};

export { userMock, productMock, orderMock, itemMock };
