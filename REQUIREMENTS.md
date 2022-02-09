# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

### Products

| Action  | HTTP   | URI           |  Token   |
| :------ | :----- | :------------ | :------: |
| Index   | GET    | /products     |    -     |
| Show    | GET    | /products/:id |    -     |
| Create  | POST   | /products     | Required |
| Destroy | DELETE | /products/:id | Required |

### Users

| Action  | HTTP   | URI        |  Token   |
| :------ | :----- | :--------- | :------: |
| Index   | GET    | /users     | Required |
| Show    | GET    | /users/:id | Required |
| Create  | POST   | /users     | Required |
| Destroy | DELETE | /users/:id | Required |

### Orders

-   Index [token required]
-   Show [token required]
-   Create [token required]
-   Delete [token required]

-   Current Order by user (args: user id)[token required]
-   [OPTIONAL] Completed Orders by user (args: user id)[token required]

### Order_Items

-   Index
-   IndexByOrderID
-   IndexByProductID

## DATABASE SCHEMA

### Products

| Name  |     Type      | Constraint |
| :---: | :-----------: | :--------: |
|  id   |    INTEGER    |     PK     |
| name  |  VARCHAR(64)  |     -      |
| price | NUMERIC(6, 2) |     -      |

### Users

|    Name    |    Type     | Constraint |
| :--------: | :---------: | :--------: |
|     id     |   INTEGER   |     PK     |
| first_name | VARCHAR(32) |     -      |
| last_name  | VARCHAR(32) |     -      |
|  password  |  CHAR(60)   |     -      |

### Orders

|   Name    |  Type   | Constraint |
| :-------: | :-----: | :--------: |
|    id     | INTEGER |     PK     |
|  user_id  | INTEGER |     FK     |
| compelete | BOOLEAN |     -      |

### Order_Items

|    Name    |  Type   |    Constraint    |
| :--------: | :-----: | :--------------: |
|  order_id  | INTEGER |      FK, PK      |
| product_id | INTEGER |      FK, PK      |
|  quantity  | INTEGER | min_max_quantity |

**NOTE**: tuple _(order_id, product_id)_ is the **Primary Key** in this relation.
