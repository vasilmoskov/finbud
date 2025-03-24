# FinBud - Finance Management Application

FinBud is a finance management application built with Hilla and Spring Boot. This project can be used as a starting point to create your own finance management application.
It contains all the necessary configuration and some placeholder files to get you started.

## Prerequisites

Before running the application, you need to set up a MongoDB cluster and configure the application to connect to it.

### Setting up MongoDB

1. Create a MongoDB cluster using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) or any other MongoDB service provider.
2. Obtain the connection URI for your MongoDB cluster.

### Configuring the application

1. Open the `application.properties` file located in `src/main/resources/`.
2. Add the following configuration, replacing `<your-mongodb-uri>` with your actual MongoDB URI:

    ```properties
    data:
      mongodb:
        uri: ${MONGODB_URI}
    ```

3. Alternatively, you can set the `MONGODB_URI` environment variable with your MongoDB URI.

## Running the application

The project is a standard Maven project. To run it from the command line,
type [mvnw](http://_vscodecontentref_/1) (Windows), or [mvnw](http://_vscodecontentref_/2) (Mac & Linux), then open
http://localhost:8080 in your browser.

You can also import the project to your IDE of choice as you would with any Maven project.