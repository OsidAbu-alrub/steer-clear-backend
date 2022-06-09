# Osid Abu-Alrub (1183096)

Second web services project

## Documentation

Under this section, you will find the following:

- Table contains HTTP method, URL path, HTTP status code, and a description for each endpoint
- How to build the application
- How to create and run docker image
- Link to docker hub repo

### Table

### Build & run application

Run the following commands to build and run the application

```bash
$ yarn install
$ yarn build
$ yarn start
```

### Create and run docker image

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

### Link to docker hub image

https://hub.docker.com/r/abualrub/orders-management
