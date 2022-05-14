## Naming Convetions

### Database

|       -       |                                                             |
| :-----------: | :---------------------------------------------------------: |
| database name |        lowercase with words separated by underscores        |
|  table name   | lowercase with words separated by underscores<br>(singular) |
|  properties   |        lowercase with words separated by underscores        |
| foriegn keys  |                   tableName_propertyName                    |

## Description

This is a starter project that you can use as a [NestJS](https://github.com/nestjs/nest) template with [Prisma](https://www.prisma.io/docs/)

## Installation

- Clone the repo

```bash
$ git clone git@github.com:OsidAbu-alrub/nestjs-prisma-template.git
```

- Change origin url to point to your own repo

```bash
$ git remote set-url origin <remote_url>
```

- Install deps

```bash
$ yarn install
```

## Running the app

```bash
# development
$ yarn dev
```

## Resource directory structure

This structure must come under the src directory:

- resource/
  - **resource.contract.ts** => interface that contains methods that should be implemented in the resource.service file
  - **resource.controller.ts**
  - **resource.dto.ts**
  - **resource.module.ts**
  - **resource.service.ts** => must implement IMapper & resource.contract interface

**P.S. You get models from prisma client after generating database**

## Resource generation

you can find how to generate nestjs resources [here](https://docs.nestjs.com/cli/usages#:~:text=nest%20generate%20%3Cschematic%3E%20%3Cname%3E%20%5Boptions%5D)

## Dealing with database

```bash
# Create migrations from your Prisma schema, apply them to the database, generate artifacts (e.g. Prisma Client)
$ npx prisma migrate dev --name init
```

```bash
# Pull the schema from an existing database, updating the Prisma schema
$ npx prisma db pull
```

```bash
# Push the Prisma schema state to the database
$ npx prisma db push
```

## Generate prsima client

```bash
$ npx prisma generate
```

**reload developer window if you are using vscode to access prisma client**

**For more info you could check prisma docs [here](https://www.prisma.io/docs/getting-started/quickstart)**
<br/>

## Testing

Coming Soon!

## TODOS

- Add [global error filtering](https://docs.nestjs.com/exception-filters)
- Add ability to generate folder with contract, controller, dto, module, and service with package.json scripts (use blobs)
- Add documentation for db generation commands
