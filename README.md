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

-   Create dev, test databases and a role (user).

```
    $ npm run db:build
```

this npm script will create the next objects in postgres:

    - store_user (ROLE)
    - store_dev_db
    - store_test_db

-   Create a _.env_ file inside **config/** directory then add the next variables:

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

-   Apply database migrations (schema setup)

```
    $ npm run db:setup
```

-   Start the API server

```
    $ npm start
```

-   Visit API status URL

```
    http://127.0.0.1:7001/status
```

**NOTES:**

-   Please refer to [REQUIRMENTS.md](REQUIREMENTS.md) to check the available **API routes** and **database schema**.
-   Although you can use _db-migrate_ command to do database migrations manually, I chose to make it be done **programmatically** using the _db-migrate javascript API_, that way it is more convenient for the application user to start and test the API.

## How to use the API?

-   The database contains the first user as an authorized user example in order to test (token required) routes.

-   Using your favorite HTTP client or API testing tool, we can test the next routes:

    -   Obtain the admin user token

    ```
        $ curl http://127.0.0.1:7001/admin
    ```

    -   response should be:

    ```
        {
          "message": "admin user token",
          "token": [TOKEN]
        }
    ```

-   Now we can use the token to be authorized for using certain routes of the API.

-   Creating another user

```
    $ curl -X POST \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]" \
        --data-raw '{"first_name": "Ryan", "last_name": "Dahl", "password": "Node < Deno"}' \
     http://127.0.0.1:7001/users


```

response should be:

```
    {
      "created": {
        "id": 2,
        "first_name": "Ryan",
        "last_name": "Dahl"
      },
      "token": [USER TOKEN]
    }
```

-   Showing user by id

```
    $ curl -X GET \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]"   \
      http://127.0.0.1:7001/users/2
```

response should be:

```
    {
      "user": {
        "id": 2,
        "first_name": "Ryan",
        "last_name": "Dahl"
      }
    }
```

-   Deleting a user

```
    $ curl -X DELETE \
        -H "Content-Type: application/json" \
        -H "Accept: application/json" \
        -H "Authorization: Bearer [TOKEN HERE]"   \
      http://127.0.0.1:7001/users/2
```

response should be:

```
    {
      "deleted": {
        "user": {
          "id": 2,
          "first_name": "Ryan",
          "last_name": "Dahl"
        }
      }
    }
```
