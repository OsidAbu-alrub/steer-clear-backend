# Osid Abu-Alrub (1183096)

Second web services project

# Documentation

Under this section, you will find the following:

- Table contains HTTP method, URL path, HTTP status code, and a description for each endpoint
- How to build the application
- How to create and run docker image
- Link to docker hub repo

## Table

- Login
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-----------:|:------------------------------------------:|:----------------:|:---------------------------------------------------------------:|
  | POST | http://localhost:9000/api/v1/auth/login | 200 | Login into system, generate JWT token, and save it in cookies |
  | POST | http://localhost:9000/api/v1/auth/register | 403 | If user is not admin |
  | POST | http://localhost:9000/api/v1/auth/register | 200 | Register into system generate JWT token, and save it in cookies |
  | POST | http://localhost:9000/api/v1/auth/logout | 200 | Logout of system and delete token from cookies |
  | POST | http://localhost:9000/api/v1/auth/login | 400 | User tries to login with invalid credentials |

---

- Customer
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-----------:|:--------------------------------------------------:|:----------------:|:------------------------------------------------------------------------------------:|
  | POST | http://localhost:9000/api/v1/customer/\* | 403 | If user is not admin |
  | POST | http://localhost:9000/api/v1/customer/\* | 401 | If user is not logged in |
  | POST | http://localhost:9000/api/v1/customer/retrieve | 200 | Retrieve customer(s) based on sent attributes |
  | POST | http://localhost:9000/api/v1/customer/create | 201 | Customer created successfully |
  | POST | http://localhost:9000/api/v1/customer/create | 400 | one of the following is missing: first name, last name, <br>date of birth, or userId |
  | POST | http://localhost:9000/api/v1/customer/create | 404 | The user ID that the customer should link to was not found |
  | POST | http://localhost:9000/api/v1/customer/create | 400 | User ID already linked to customer |
  | PUT | http://localhost:9000/api/v1/customer/update | 200 | Update customer information |
  | PUT | http://localhost:9000/api/v1/customer/update | 404 | Try to update a customer that doesn't exist |
  | DELETE | http://localhost:9000/api/v1/customer/{customerId} | 200 | Customer deleted successfully |
  | DELETE | http://localhost:9000/api/v1/customer/{customerId} | 404 | Customer to be deleted was not found |
  | DELETE | http://localhost:9000/api/v1/customer/{customerId} | 400 | Customer ID not provided in the URL |
  | DELETE | http://localhost:9000/api/v1/customer/{customerId} | 400 | Customer ID provided was not a number OR was not provided at all |

---

- Order
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-------------:|:----------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------:|
  | POST | http://localhost:9000/api/v1/order/\* | 403 | If user is not admin |
  | POST | http://localhost:9000/api/v1/order/\* | 401 | If user is not logged in |
  | POST | http://localhost:9000/api/v1/order/retrieve | 200 | Retrieve order(s) based on sent attributes |
  | POST | http://localhost:9000/api/v1/order/create | 201 | Order created successfully |
  | PUT | http://localhost:9000/api/v1/order/update | 200 | order updated successfully |
  | PUT | http://localhost:9000/api/v1/order/update | 404 | customer linked to order id doesn't exist |
  | PUT | http://localhost:9000/api/v1/order/update | 404 | order not found |
  | DELETE | http://localhost:9000/api/v1/order/{orderId} | 200 | order deleted successfully |
  | DELETE | http://localhost:9000/api/v1/order/{orderId} | 404 | order doesn't exist |
  | DELETE | http://localhost:9000/api/v1/customer/{orderId} | 400 | Order ID is not provided or is not an integer |

---

- Product
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-------------:|:----------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------:|
  | POST | http://localhost:9000/api/v1/product/\* | 401 | If user is not logged in |
  | POST | http://localhost:9000/api/v1/product/create | 201 | product created successfully |
  | POST | http://localhost:9000/api/v1/product/create | 403 | if user not admin |
  | POST | http://localhost:9000/api/v1/product/retrieve | 200 | Retrieve product(s) based on sent attributes |
  | PUT | http://localhost:9000/api/v1/product/update | 200 | product updated successfully |
  | PUT | http://localhost:9000/api/v1/product/update | 404 | product ID not found |
  | PUT | http://localhost:9000/api/v1/product/update | 403 | user not admin |
  | DELETE | http://localhost:9000/api/v1/product/{id} | 200 | product deleted successfully |
  | DELETE | http://localhost:9000/api/v1/product/{id} | 404 | product not found |
  | DELETE | http://localhost:9000/api/v1/product/{id} | 400 | product ID must be a number |
  | DELETE | http://localhost:9000/api/v1/product/{id} | 403 | user not an admin |
  | GET | http://localhost:9000/api/v1/product/{id} | 200 | product retrieved successfully |
  | GET | http://localhost:9000/api/v1/product/{id} | 404 | product not found |
  | GET | http://localhost:9000/api/v1/product/{id} | 400 | product ID must be a number |

---

- Product Order
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-------------:|:----------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------:|
  | POST | http://localhost:9000/api/v1/product-order/\* | 401 | If user is not logged in |
  | POST | http://localhost:9000/api/v1/product-order/retrieve | 200 | product orders retrieved successfully |
  | POST | http://localhost:9000/api/v1/product-order/create | 200 | Product order created successfully |
  | POST | http://localhost:9000/api/v1/product-order/create | 404 | product order not found |
  | POST | http://localhost:9000/api/v1/product-order/create | 400 | Stock not sufficient |
  | POST | http://localhost:9000/api/v1/product-order/create | 404 | Product doesn't exist or not found |
  | POST | http://localhost:9000/api/v1/product-order/create | 400 | Product ID not given |
  | POST | http://localhost:9000/api/v1/product-order/create | 400 | Order ID not given |
  | POST | http://localhost:9000/api/v1/product-order/create | 400 | Quantity less than 0 |
  | POST | http://localhost:9000/api/v1/product-order/create | 401 | If customer tries to order for another customer |
  | DELETE | http://localhost:9000/api/v1/product-order/delete | 200 | product order deleted successfully |
  | DELETE | http://localhost:9000/api/v1/product-order/delete | 404 | product order not found |
  | DELETE | http://localhost:9000/api/v1/product-order/{delete} | 400 | product ID or order ID not provided |

---

- Stock
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-------------:|:----------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------:|
  | \* | http://localhost:9000/api/v1/stock/\* | 401 | If user is not logged in |
  | \* | http://localhost:9000/api/v1/stock/\* | 403 | If user is not admin |
  | POST | http://localhost:9000/api/v1/stock/retrieve | 200 | stock retrieved successfully |
  | POST | http://localhost:9000/api/v1/stock/create | 200 | stock created successfully |
  | POST | http://localhost:9000/api/v1/stock/create | 404 | product not found |
  | POST | http://localhost:9000/api/v1/stock/create | 400 | product not stockable |
  | PUT | http://localhost:9000/api/v1/stock/update | 200 | stock updated successfully |
  | PUT | http://localhost:9000/api/v1/stock/update | 404 | stock not found |
  | PUT | http://localhost:9000/api/v1/stock/update | 400 | stock ID not provided |
  | PUT | http://localhost:9000/api/v1/stock/update | 400 | product not stockable (can't be updated) |
  | DELETE | http://localhost:9000/api/v1/stock/{stockId} | 200 | delete successfully |
  | DELETE | http://localhost:9000/api/v1/stock/{stockId} | 404 | stock not found |
  | DELETE | http://localhost:9000/api/v1/stock/{stockId} | 400 | stock ID not provided OR is not a number |

---

- User
  | HTTP Method | URL Path | HTTP Status Code | Description |
  |:-------------:|:----------------------------------------------------:|:------------------:|:--------------------------------------------------------------------------------------:|
  | \* | http://localhost:9000/api/v1/user/\* | 401 | If user is not logged in |
  | \* | http://localhost:9000/api/v1/user/\* | 403 | If user is not admin |
  | POST | http://localhost:9000/api/v1/user/retrieve | 200 | user(s) retrieved successfully |
  | POST | http://localhost:9000/api/v1/user/create | 200 | user created successfully |
  | POST | http://localhost:9000/api/v1/user/create | 404 | email/password missing |
  | POST | http://localhost:9000/api/v1/user/create | 400 | email taken |
  | PUT | http://localhost:9000/api/v1/user/update | 200 | user updated successfully |
  | PUT | http://localhost:9000/api/v1/user/update | 404 | user not found |
  | PUT | http://localhost:9000/api/v1/user/update | 400 | user ID not provided |
  | DELETE | http://localhost:9000/api/v1/user/{userId} | 200 | user deleted successfully |
  | DELETE | http://localhost:9000/api/v1/stock/{userId} | 404 | user not found |
  | DELETE | http://localhost:9000/api/v1/stock/{userId} | 400 | user id not provided |

## Build & run application

Run the following commands to build and run the application

```bash
$ yarn install
$ yarn build
$ yarn start
```

## Create and run docker image

**Not that this won't work because database is not configured to run with container**<br/>
First navigate into directory that contains `dockerFile` (root directory). Then run the following command to build the image

```bash
$ # docker build -t <image-name> .
$ docker build -t orders-management .
```

Run this command to check available images

```bash
$ docker images
```

Run this command start up a new container

```bash
$ # docker run --name <container-name> -p <application-port>:<container-port> <image-name>
$ docker run --name orders-management-container -p 127.0.0.1:9000:9000 orders-management
```

Run this command to check running containers

```bash
$ docker ps
```

Run this command to stop running container

```bash
$ # docker stop <container-name>
$ docker stop orders-management-container
```

## Link to docker hub image

https://hub.docker.com/r/abualrub/orders-management
