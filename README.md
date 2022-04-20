# Expressway

An example program that combines async HTTP and AMQP operations

## Installing dependencies

    npm install -g "express@>=5.0.0-beta.1"
    npm install -g rhea

## Running the AMQP server

    node amqpserver.py

## Running the HTTP server

    node httpserver.py

## Calling the API

    curl -X POST http://localhost:3000/api/submit -H 'Content-Type: application/json' -d '{"text": "abc"}'
