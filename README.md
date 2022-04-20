# Expressway

## Setting up

    npm install -g "express@>=5.0.0-beta.1"
    npm install -g rhea

## Testing with Curl

    curl -X POST http://localhost:3000/api/submit -H 'Content-Type: application/json' -d '{"text": "abc"}'

You also need a broker and a job processor.
