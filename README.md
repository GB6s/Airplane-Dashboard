# Airplane.gg
A dashboard for Airplane.gg, a startup specialized in performance oriented gaming software.
<img src="https://i.imgur.com/l4XQNFN.png" height="300">

## How it works

### Full Stack React Framework

**Blitz.js** is a full stack react framework. This means that there is no need for a seperate back-end. The same codebase for the front and back-end. It uses a a variant on JWT to handle authentication, Prisma to interact with the SQL database and Typescript as its language of choice.

### Payment Service Provider

**Stripe** was used as the PSP for this project. Using Stripe clients are able to setup their subscription and pay their invoices.
<img src="https://i.imgur.com/l0Zce88.png" height="300">

### Real Time Analytics

To provide our clients with real time analytics concerning their servers we use **InfluxDB**. An API endpoint allows our product to send data back to our back-end for analytic purposes. This data is then processed and stored in our TSDB. The data stored is then queried upon request and served to our clients in a easy to use graph.

<img src="https://i.imgur.com/x6WUvlV.png" height="300">

## Dockerized

Everything listed above is dockerized by docker-compose and therefore easily distributed onto the production server.
