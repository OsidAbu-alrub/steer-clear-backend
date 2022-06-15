## Naming Convetions

### Database

|       -       |                                                             |
| :-----------: | :---------------------------------------------------------: |
| database name |        lowercase with words separated by underscores        |
|  table name   | lowercase with words separated by underscores<br>(singular) |
|  properties   |        lowercase with words separated by underscores        |
| foriegn keys  |                   tableName_propertyName                    |

## Description

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

## Link to docker hub image

https://hub.docker.com/r/abualrub/orders-management
