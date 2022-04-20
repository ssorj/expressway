# Expressway

An example program that combines async HTTP and AMQP operations

## Installing dependencies

    npm install -g "express@>=5.0.0-beta.1"
    npm install -g rhea

## Running the AMQP server

    node amqpserver.py

## Running the HTTP server

    node httpserver.py

## Calling the HTTP endpoint

    curl -X POST http://localhost:3000/api/submit -H 'Content-Type: application/json' -d '{"text": "abc"}'

## Expected output

AMQP server

    $ node amqpserver.js
    Listening on port 3001
    Received request "abc" (0)
    Sent response "ABC" (0)

HTTP server

    $ node httpserver.js
    Listening on port 3000
    Connected to AMQP server on port 3001
    Sent request "abc" (0)
    Received response "ABC" (0)

Client

    $ curl -X POST http://localhost:3000/api/submit -H 'Content-Type: application/json' -d '{"text": "abc"}'
    ABC
