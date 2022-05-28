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

## Prisma DB

```bash
# Generate models
npx prisma generate
```

## Testing

Coming Soon!

## TODOS

- Add [global error filtering](https://docs.nestjs.com/exception-filters)
- Add ability to generate folder with contract, controller, dto, module, and service with package.json scripts (use blobs)
- Add documentation for db generation commands
