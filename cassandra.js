const cassandra = require('cassandra-driver');

const cassandraDb = global.cassandraClient || createCassandraClient();

if (process.env.NODE_ENV == "production") {
  global.cassandraClient = cassandraDb;
}

module.exports = cassandraDb;

function createCassandraClient() {
  const newClient = new cassandra.Client({
    cloud: {
      secureConnectBundle: './secure-connect.zip'
    },
    credentials: {
      username: process.env.CASSANDRA_CLIENT_ID,
      password: process.env.CASSANDRA_CLIENT_SECRET
    },
    keyspace: process.env.CASSANDRA_KEYSPACE
  });

  connectCassandra(newClient);

  return newClient;
}

function connectCassandra(client) {
  if (client.hosts.length) {
    client.connect()
      .then(() => console.log("[SERVER] Connected to AstraDB"))
      .catch((err) => console.log(`[SERVER] AstraDB connection FAILURE - ${err.message}`));
  } else {
    console.log("[SERVER] Already connected to AstraDB");
  }
}

connectCassandra(cassandraDb);
