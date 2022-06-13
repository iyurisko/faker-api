# Faker Rest API

## ⚡ How to use

```
1. git clone this repo
2. cd fake-rest-api-services
3. npm i
4. npm start
```

After that you will see on terminal

```
running on port 7777
```

on folder db create json file, with empty array inside file, example

```
employee.json
product.json
```

##  🔥 API

### 🔧 CRUD API

```
GET  /<route>
GET  /<route>/:id
POST /<route>
PUT  /<route>/:id
DEL  /<route>/:id
```

### 🔒 AUTH API

## LOGIN -> POST /login

```
email string required
password string required
```

## REGISTER -> POST /register

```
email string required
password string required
```

## DEFAULT ACCOUNT 

```
  "email": "test@dev.com",
  "password": "tes12345"
```

### QUERY PARAMS SORTING

## SORTING

```
ASC  -> /<route>?sorting={fields}-ASC
DESC -> /<route>?sorting={fields}-DESC

example: 

/employee?sorting=name-ASC
/employee?sorting=name-DESC

```

## SEARCH

```
/<route>?search={fields}-{searchVal}

example: /employee?search=name-john
```

## LIMIT AND SKIP

```
/<route>?limit={limit}&skip={skip}

example: /employee?limit=2&skip=4
```

