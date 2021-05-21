module.exports = {
  // See <http://truffleframework.com/docs/advanced/configuration>
  // for more about customizing your Truffle configuration!
  networks: {
    development: {
      host: '127.0.0.1',
      port: 7547,
      network_id: '5779', // Match any network id
    },
    develop: {
      port: 8547,
    },
  },
}
