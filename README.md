# Mongo API challenge

A simple node server with a Mongo db that has some API functions.

## How to use

You must have docker-compose installed (preferably the latest version). 
If you do you can use the `run.sh` script to setup, run, or delete the
containers that run the server app.

```bash
# To install run the following
./run.sh setup

# Run the next command to start the server
./run.sh

# You can order the script to clean if needed :P
./run.sh clean
```

## How it's made

The server is made in node using the Express framework and the communications
with the database are made through the mongoose module.

All the API functions return a JSON so as to make the the response data easier to use.

### Description of the functions

The `POST` operation made on the `/transactions/` route checks if the json
has the required keys for the database before adding the content of the json body to the database.
The existence of the keys needs to be checked because the database operation only responds
with an error if the keys contain wrong data types compared with the database
model (in case keys were missing it would stay even though the opperation was not successful).
If the keys are not found a `{status: 'undefined'}` json is sent as a response.

The `GET` operation made on the `/transactions/` route first check for the
existence of the required keys for the mapped operation in the request query. If the
keys are not found a `{status: 'undefined'}` json is sent as a response. If the check
was successful, a query to the database is made with the received parameters and the
response of the query is passed along as response.

The `GET` operation made on the `/balance/` route first check for the
existence of the required keys for the mapped operation in the request query. If the
keys are not found a `{status: 'undefined'}` json is sent as a response.  If the check
was successful, one aggregate operation is made on the database that sums up all transactions
where the given user is the sender, and another one that gets the total of all transactions
where the given user is the receiver. The balance sent back is the difference between the
received amount and the sent amount. The amounts are set to 0 if the queries do not find
matches.

## Workarounds used

During the setup the mongo container is started ahead of time for 10 seconds in order to initialise
the database. This is done during the setup because of a recent error with the mongoose module.
The server crashes on start if it can't connect to the database on the first try, even though
it should have an `autoReconnect` feature enabled. There is an issue on [this](https://github.com/Automattic/mongoose/issues/5169) on github.

## In case of docker issues

Had some issues setting up the docker containers when using a very old version of docker. The one found
in the `apt` lists that came with Ubuntu was `1.x`. The latest docker version definitely works.
