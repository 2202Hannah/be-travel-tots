# be-travel-tots

This is an app for travelling tots. 

The repo for the front end of the project can be found [here](https://github.com/2202Hannah/travel-tots).

### To clone the repository:

```bash dark
git clone https://github.com/2202Hannah/be-travel-tots
```

### Dependencies:

express version 4.18.2 minimum

```bash dark
npm install express
```

pg version 8.8.0 minimum

```bash dark
npm install pg
```

dotenv version 16.0.3 minimum

```bash dark
npm install dotenv --save
```

### To create the .env files for development and test:

File name: ".env.development"
content: PGDATABASE=travel_tots

File name: ".env.test"
content: PGDATABASE=travel_tots_test

### Include the following in your .gitignore file:

```bash dark
.env.*
```

### To create the local database run:

```bash dark
npm setup-dbs
```

### To seed the local database run:

```bash dark
npm seed
```

### To run tests:

```bash dark
npm test
```
