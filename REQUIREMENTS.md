# API Requirements

The company stakeholders want to create an online storefront to showcase their great product ideas. Users need to be able to browse an index of all products, see the specifics of a single product, and add products to an order that they can view in a cart page. You have been tasked with building the API that will support this application, and your coworker is building the frontend.

These are the notes from a meeting with the frontend developer that describe what endpoints the API needs to supply, as well as data shapes the frontend and backend have agreed meet the requirements of the application.

## API Endpoints

#### Products

-   Index
-   Show
-   Create [token required]
-   [OPTIONAL] Top 5 most popular products
-   [OPTIONAL] Products by category (args: product category)

#### Users

-   Index [token required]
-   Show [token required]
-   Create N[token required]

#### Orders

-   Current Order by user (args: user id)[token required]
-   [OPTIONAL] Completed Orders by user (args: user id)[token required]

## Data Shapes

### Products

-   _id_ (PK)
-   _name_
-   _price_

### Users

-   _id_ (PK)
-   _first_name_
-   _last_name_
-   _password_  (Bcrypt hash digest)

### Orders

-   _id_ (PK)
-   _user_id_ (FK)
-   _complete_ 

### Order_Items

-   _order_id_ (FK)
-   _product_id_ (FK)
-   _quantity_ 
-   __NOTE__: tuple _(order_id, product_id)_ is the **Primary Key** in this relation.
