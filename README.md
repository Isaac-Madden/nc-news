# Northcoders News API

## Welcome to my News API!

This is a backend service which can be used for accessing news articles and related data. 
Here's a link to the hosted site: https://maddens-news.onrender.com

It's fuctionality incudes a range of API calls, allowing a user to view a filtered list news articles, add comments and delete news data if you wish. 

A full list of the API endpoints available can be found in the endpoints.json file.

It’s built on Node.js with Express, and uses PostgreSQL for managing the data.
The database is stored on ElephantSQL and hosted using Render.

If you wish to clone this repository, please follow this link: https://github.com/Isaac-Madden/nc-news

### To install the dependencies, 'npm install' into the terminal

Node.js : 20.3.0 and Postgres : 8.7.3 arethe minimum versions required.

### If you wish to run this locally, below is a list of dev-dependencies (and how to install them in the terminal):

    1 - jest (npm install jest -D)
    2 - jest extended (npm install jest-extended -D)
    3 - jest sorted (npm install jest-sorted -D)
    4 - PG Format (npm install pg-format -D)
    4 - supertest (npm install supertest -D)

### Make sure to add the following scripts to the package.json: 

    "setup-dbs": "psql -f ./db/setup.sql",
    "seed": "node ./db/seeds/run-seed.js",
    "test": "jest",
    "playground": "psql -f playground.sql > playground.txt",
    "playgroundTest": "psql -f playgroundTest.sql > playgroundTest.txt",
    "start": "node listen.js",
    "seed-prod": "NODE_ENV=production npm run seed"

### Some notes on the scripts:

    npm run setup-dbs - this will setup the databse 
    npm run seed - this will seed the database 
    npm test app.test.js - this will run the testing suit (__tests__/app.test.js)

### Finally, you will also need to connect to the databases:

To do this, add the environment variables by creating two .env files in the root folder:
    .env.test > PGDATABASE=nc_news_test
    .env.development > PGDATABASE=nc_news