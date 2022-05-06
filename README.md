# Owner: Osid Abu-Alrub (1183096)

## Documentation commit

https://github.com/OsidAbu-alrub/e-commerce-application/commit/e67e6dd99a8e387d8f2324c5f4075149291074fc

## Design

| HTTP method |           URL path           | HTTP status code |              Description               |
| :---------: | :--------------------------: | :--------------: | :------------------------------------: |
|    POST     |     api/v1/products/add      |       200        |          Create a new product          |
|     GET     |     api/v1/products/all      |       200        |     Get all available<br>products      |
|     GET     |     api/v1/products/:id      |       200        |  Get a specific product<br>via its id  |
|     GET     |     api/v1/products/:id      |       404        |   Get product that can't<br>be found   |
|     GET     |     api/v1/category/all      |       200        |           Get all categories           |
|    POST     |     api/v1/category/add      |       200        |           Add a new category           |
|   DELETE    |     api/v1/category/:id      |       200        |           Delete a category            |
|   DELETE    |     api/v1/category/:id      |       404        |         Can't delete category          |
|    POST     | api/v1/product-category/link |       200        |        Add product to category         |
|    POST     | api/v1/product-category/link |       400        | Product already linked to <br>category |
|     GET     | api/v1/product-category/:id  |       200        |    Get products linked to category     |

## Installation

Must have [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable) OR [npm](https://nodejs.org/en/download/) installed to run the project without issues

```bash
$ yarn install
# OR
$ npm run install
```

## Running the app

```bash
# development
$ yarn dev
# OR
$ npm run dev
```

## TODO

- Add DTOs when needed
