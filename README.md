# Storefront Backend API

## Installation Steps

-   Clone the github repo

```
    $ git clone https://github.com/mu-eid/store-backend-api.git

    $ cd store-backend-api
```

-   Install dependencies

```
    $ npm install
```

-   Set up databases.

```
    $ npm run db:setup
```

this npm script will create the next objects in postgres:

    - store_user (ROLE)
    - store_dev_db
    - store_test_db

-   Create a _.env_ file in root directory then add the next variables:

```
# ---------------- NODE ENV --------------
NODE_ENV=dev

# ----------------- SERVER ---------------
PORT=7001
HOST=127.0.0.1

# ------------- PASSWORD SALT ------------
SALT_HASH=$2b$10$GEA5RmSbZNzZGNPuWEcE/O

# ------------- TOKEN SIGNER -------------
SIGN_HASH=cn4Gy0H35fe+BpsueWKQzm5UcrWSzlVXN4n8WNvFrx8=

# --------------- POSTGRESQL -------------
PG_USER=store_user
PG_PASS=2345

# --------------- DB NAMES ---------------
DB_DEV=store_dev_db
DB_TEST=store_test_db
```

-   Apply database migrations

```
    $ npm run db:migrate
```

-   Run tests

```
    $ npm test
```

-   Start API server
    -   Server connection's port: **7001**
    -   Database connection's port: **5432** (_default_)

```
    $ npm start
```

-   Visit API status URL

```
    http://127.0.0.1:7001/status
```

**NOTES:**

-   Please refer to [REQUIRMENTS.md](REQUIREMENTS.md) to check the implemented **API routes** and **database schema**.
-   Every time you run one of npm scripts below:

    -   npm test
    -   npm start
    -   npm run serve

    database migrations are done **programmatically** using the _db-migrate javascript API_, this will _automatically_ pick and apply database migrations.

## API Usage

-   Sign up as a new user

```
    $ curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        --data-raw '{"username":"deno81", "first_name": "Ryan", "last_name": "Dahl", "password": "Node<Deno;)"}' \
     http://127.0.0.1:7001/users/signup
```

server will respond with:

```
{
  "created": {
    "user": {
      "id": 1,
      "username": "deno81",
      "first_name": "Ryan",
      "last_name": "Dahl"
    }
  },
  "token": [TOKEN]
}
```

## API Examples

### User Endpoints

-   Creating a new user (as an authorized user)

```
    $ curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]" \
        --data-raw '{"username": "spacedaddy", "first_name": "Elon", "last_name": "Musk", "password": "Te$laR0ck$"}' \
     http://127.0.0.1:7001/users
```

response should be:

```
    {
      "created": {
        "id": 2,
        "first_name": "Elon",
        "last_name": "Musk"
      },
      "token": [USER TOKEN]
    }
```

-   Showing user by id

```
    $ curl -X GET \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]" \
      http://127.0.0.1:7001/users/2
```

response should be:

```
    {
      "user": {
        "id": 2,
        "first_name": "Elon",
        "last_name": "Musk"
      }
    }
```

-   Deleting a user

```
    $ curl -X DELETE \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]" \
      http://127.0.0.1:7001/users/2
```

response should be:

```
    {
      "deleted": {
        "user": {
          "id": 2,
          "first_name": "Elon",
          "last_name": "Musk"
        }
      }
    }
```

### Products Endpoints

-   Creating a new product

```
    $ curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]" \
        --data-raw '{"name": "Programming Haskell", "price": 37.89}' \
      http://127.0.0.1:7001/products

```

-   Showing product by id

```
    $ curl -X GET \
        -H "Accept: application/json" \
      http://127.0.0.1:7001/products/1
```

response for former and latter requests should be:

```
    {
      "id": 1,
      "name": "Programming Haskell",
      "price": 37.89
    }
```

The rest of the API endpoints can be explored and tested the same way.
