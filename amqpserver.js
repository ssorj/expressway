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

const rhea = require("rhea")

const amqp_port = 3001

const server = rhea.create_container()

server.on("message", (event) => {
    const request = event.message;

    console.log(`Received request ${JSON.stringify(request.body)} (${request.message_id})`);

    const response = {
        to: request.reply_to,
        correlation_id: request.message_id,
        body: {
            text: request.body.text.toUpperCase(),
        }
    };

    event.connection.send(response);

    console.log(`Sent response ${JSON.stringify(response.body)} (${response.correlation_id})`);
})

server.listen({port: amqp_port})

console.log(`Listening on port ${amqp_port}`)
