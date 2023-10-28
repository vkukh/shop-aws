# shop-aws

## The requested URL
Generate url:

https://y9364thup9.execute-api.eu-west-1.amazonaws.com/dev/import?name=test01.csv

Load file:

curl --location --request PUT 'https://generated-url' \
--header 'Content-Type: text/csv' \
--data './test01.csv'


## Create product

  POST - https://6rmvab76cl.execute-api.eu-west-1.amazonaws.com/dev/products

  example request body:
  `
  {
    "description": "New Model of IPhone 22",
    "price": 100,
    "title": "IPhone 22"
  }
  `



  GET - https://6rmvab76cl.execute-api.eu-west-1.amazonaws.com/dev/products

  GET - https://6rmvab76cl.execute-api.eu-west-1.amazonaws.com/dev/products/{id}
  