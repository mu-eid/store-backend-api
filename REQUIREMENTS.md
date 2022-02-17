# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Users

| Action  | HTTP   | URI        |  Token   |
| :------ | :----- | :--------- | :------: |
| Index   | GET    | /users     | Required |
| Show    | GET    | /users/:id | Required |
| Create  | POST   | /users     | Required |
| Destroy | DELETE | /users/:id | Required |

### Products

| Action  | HTTP   | URI           |  Token   |
| :------ | :----- | :------------ | :------: |
| Index   | GET    | /products     |   None   |
| Show    | GET    | /products/:id |   None   |
| Create  | POST   | /products     | Required |
| Destroy | DELETE | /products/:id | Required |

### Orders

| Action         | HTTP   | URI               |  Token   |
| :------------- | :----- | :---------------- | :------: |
| Index          | GET    | /orders           | Required |
| Show           | GET    | /orders/:id       | Required |
| Show (user_id) | GET    | /orders/users/:id | Required |
| Create         | POST   | /orders           | Required |
| Destroy        | DELETE | /orders/:id       | Required |

### Order_Items

| Action            | HTTP   | URI                |  Token   |
| :---------------- | :----- | :----------------- | :------: |
| Index             | GET    | /items             | Required |
| Show (order_id)   | GET    | /items/order/:id   | Required |
| Show (product_id) | GET    | /items/product/:id | Required |
| Create            | POST   | /items             | Required |
| Destroy           | DELETE | /items/:id         | Required |

**NOTE**: Every _item_ in an _order_ reflects a product from _products_ table.

## Database Schema

### Users

|    Name    |    Type     | Constraint |
| :--------: | :---------: | :--------: |
|     id     |   INTEGER   |     PK     |
| first_name | VARCHAR(32) |  NOT NULL  |
| last_name  | VARCHAR(32) |  NOT NULL  |
|  password  |  CHAR(60)   |  NOT NULL  |

### Products

| Name  |       Type       | Constraint |
| :---: | :--------------: | :--------: |
|  id   |     INTEGER      |     PK     |
| name  |   VARCHAR(64)    |  NOT NULL  |
| price | DOUBLE PRECISION |  NOT NULL  |

### Orders

|   Name    |  Type   |  Constraint   |
| :-------: | :-----: | :-----------: |
|    id     | INTEGER |      PK       |
|  user_id  | INTEGER |      FK       |
| compelete | BOOLEAN | DEFAULT FALSE |

### Order_Items

|    Name    |  Type   |    Constraint    |
| :--------: | :-----: | :--------------: |
|  order_id  | INTEGER |      FK, PK      |
| product_id | INTEGER |      FK, PK      |
|  quantity  | INTEGER | min_max_quantity |

**NOTE**: tuple _(order_id, product_id)_ is the **Primary Key** in this relation.
