//
// Licensed to the Apache Software Foundation (ASF) under one
// or more contributor license agreements.  See the NOTICE file
// distributed with this work for additional information
// regarding copyright ownership.  The ASF licenses this file
// to you under the Apache License, Version 2.0 (the
// "License"); you may not use this file except in compliance
// with the License.  You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing,
// software distributed under the License is distributed on an
// "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
// KIND, either express or implied.  See the License for the
// specific language governing permissions and limitations
// under the License.
//

"use strict"

const express = require("express")
const rhea = require("rhea")
const { once } = require("events")

const http_port = 3000
const amqp_port = 3001

// AMQP

const amqp = rhea.create_container()

let sender
let receiver

amqp.on("connection_open", (event) => {
    console.log(`Connected to AMQP server on port ${amqp_port}`)

    sender = event.connection.open_sender("jobs")
    event.connection.open_receiver({source: {dynamic: true}})
})

amqp.on("receiver_open", (event) => {
    receiver = event.receiver

    process.nextTick(() => {
        amqp.emit("x_receiver_ready")
    })
})

amqp.on("message", (event) => {
    process.nextTick(() => {
        amqp.emit("x_response", event.message)
    })
})

// HTTP

const http = express()

http.use(express.json())

let sequence = 0

http.post("/api/submit", async (req, res) => {
    if (!receiver) {
        await once(amqp, "x_receiver_ready")
    }

    const request = {
        message_id: sequence++,
        reply_to: receiver.source.address,
        body: req.body.text,
    }

    sender.send(request)

    console.log(`Sent request "${request.body}" (${request.message_id})`)

    const [response] = await once(amqp, "x_response")

    console.log(`Received response "${response.body}" (${response.correlation_id})`)

    res.send(response.body)
})

// Let's go

amqp.connect({port: amqp_port})

http.listen(http_port, () => {
    console.log(`Listening on port ${http_port}`)
})
