import dbClient from '../database';
import { Order, OrderStore } from '../models/order';
import { Item, ItemStore } from '../models/order_item';
import { Product, ProductStore } from '../models/product';
import { User, UserStore } from '../models/user';
import {
    itemMock,
    orderMock,
    productMock,
    firstUserMock,
} from '../test/models/mocks';

const createUserInDB = async (): Promise<User> =>
    await new UserStore(dbClient).create(firstUserMock);

const createProductInDB = async (): Promise<Product> =>
    await new ProductStore(dbClient).create(productMock);

const createOrderInDB = async (): Promise<Order> =>
    await new OrderStore(dbClient).create(orderMock);

const createItemInDB = async (): Promise<Item> =>
    await new ItemStore(dbClient).create(itemMock);

export { createUserInDB, createProductInDB, createOrderInDB, createItemInDB };
