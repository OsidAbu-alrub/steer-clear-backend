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

- resource
  <br/>
  -- resource.contract.ts => interface that contains methods that should be implemented in the resource.service file <br/>
  -- resource.controller.ts <br/>
  -- resource.dto.ts <br/>
  -- resource.module.ts <br/>
  -- resource.service.ts => must implement IMapper & resource.contract interface <br/>

**P.S. You get models from prisma client after generating database**

## Resource generation

you can find how to generate nestjs resources [here](https://docs.nestjs.com/cli/usages#:~:text=nest%20generate%20%3Cschematic%3E%20%3Cname%3E%20%5Boptions%5D)

## Testing

Coming Soon!

## TODOS

- Add [global error filtering](https://docs.nestjs.com/exception-filters)
- Add ability to generate folder with module, service, controller, dto, service contract (interface) on the go
- Add documentation for db generation commands
