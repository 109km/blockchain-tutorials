$(function () {
  const App = {
    web3Provider: null,
    contracts: {},
    owner: '',
    init: async function () {
      await App.initWeb3()
    },
    initWeb3: async function () {
      const res = await ContractUtils.init('http://localhost:7548')
      console.log(res)
      App.owner = res.accounts[0]
      App.web3Provider = res.web3Provider
      App.initContract()
    },
    initContract: function () {
      $.getJSON('/build/contracts/Purchase.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var artifact = data
        App.contracts.Purchase = TruffleContract(artifact)

        // Set the provider for our contract
        App.contracts.Purchase.setProvider(App.web3Provider)
      })
      return App.bindEvents()
    },

    bindEvents: function () {
      $(document).on('click', '#btn-bid', App.handleBid)
      $(document).on('click', '#btn-withdraw', App.handleWithdraw)
      $(document).on('click', '#btn-auction', App.handleEndAuction)
      $(document).on('click', '#btn-get-highest', App.handleHighestAuction)
    },

    handleHighestAuction: function (event) {
      event.preventDefault()
      web3.eth.getAccounts(async function (error, accounts) {
        if (error) {
          console.log(error)
        }
        var account = accounts[0]

        const instance = await App.contracts.SimpileAuction.deployed()
        console.log(await instance.auctionEndTime())
        console.log(await instance.highestBidder())

        const num = await instance.getHighestBid({ from: account })
        console.log(num)
      })
    },
    handleEndAuction: function (event) {
      event.preventDefault()
      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error)
        }
        var account = accounts[0]
        App.contracts.SimpileAuction.deployed()
          .then(function (instance) {
            // Execute adopt as a transaction by sending account
            return instance.auctionEnd({ from: account })
          })
          .then(function (result) {
            console.log(result)
          })
          .catch(function (err) {
            console.log(err.message)
          })
      })
    },
    handleWithdraw: function (event) {
      event.preventDefault()

      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error)
        }
        var account = accounts[0]
        App.contracts.SimpileAuction.deployed()
          .then(function (instance) {
            // Execute adopt as a transaction by sending account
            return instance.withdraw({ from: account })
          })
          .then(function (result) {
            console.log(result)
          })
          .catch(function (err) {
            console.log(err.message)
          })
      })
    },

    handleBid: function (event) {
      event.preventDefault()

      var price = $('#price').val() * 1

      web3.eth.getAccounts(function (error, accounts) {
        if (error) {
          console.log(error)
        }

        var account = accounts[0]
        App.contracts.SimpileAuction.deployed()
          .then(function (instance) {
            // Execute adopt as a transaction by sending account
            return instance.bid({ from: account, value: price * 1e18 })
          })
          .then(function (result) {
            console.log(result)
            // return App.markAdopted()
          })
          .catch(function (err) {
            console.log(err.message)
          })
      })
    },
  }
  App.init()
})
