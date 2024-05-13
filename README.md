# Technical test

## Introdution

This README will help you set up the environment and run the application both in development and production environments.

## Initial configuration

Before getting started, make sure you have Node.js and PostgreSQL installed on your system. Additionally, you'll need to have access to a `.env` file with the necessary environment variables. If you do not have this file yet, make sure to create it before proceeding.

### Dependences instalation

To install the application's dependencies, simply run the following command in the terminal:

```sh
npm i
```

This command will install all the necessary dependencies for the application to function correctly. Make sure the package.json file is present in the root directory of your project so npm can recognize the dependencies.

### Database configuration

Before running the application, you need to ensure the database is properly configured. The app use Prisma as the ORM to interact with the database. To set up the tables in PostgreSQL, run the following command:

```sh
npx prisma db push
```
This command will generate the necessary tables in your database according to the schema defined in Prisma.

### Run

Once you've completed the initial installation and setup, you can run the application in development or production environments.

#### Development
To run the application in a development environment, use the following command:

```sh
npm run dev
```

This command will start the development server, and you can access the application through your browser.

#### Deploy
To run the application in a production environment, you first need to build the production bundle and then start the server. Use the following commands:

```sh
npm run build
npm start
```