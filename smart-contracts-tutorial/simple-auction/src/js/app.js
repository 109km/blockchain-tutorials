$(function () {
  const App = {
    web3Provider: null,
    contracts: {},
    owner: '',
    init: async function () {
      // Load pets.
      // $.getJSON('../pets.json', function (data) {
      //   var petsRow = $('#petsRow')
      //   var petTemplate = $('#petTemplate')

      //   for (i = 0; i < data.length; i++) {
      //     petTemplate.find('.panel-title').text(data[i].name)
      //     petTemplate.find('img').attr('src', data[i].picture)
      //     petTemplate.find('.pet-breed').text(data[i].breed)
      //     petTemplate.find('.pet-age').text(data[i].age)
      //     petTemplate.find('.pet-location').text(data[i].location)
      //     petTemplate.find('.btn-adopt').attr('data-id', data[i].id)

      //     petsRow.append(petTemplate.html())
      //   }
      // })

      await App.initWeb3()
    },

    initWeb3: async function () {
      // Modern dapp browsers...
      if (window.ethereum) {
        App.web3Provider = window.ethereum
        try {
          // Request account access
          await window.ethereum.enable()
        } catch (error) {
          // User denied account access...
          console.error('User denied account access')
        }
      }
      // Legacy dapp browsers...
      else if (window.web3) {
        App.web3Provider = window.web3.currentProvider
      }
      // If no injected web3 instance is detected, fall back to Ganache
      else {
        App.web3Provider = new Web3.providers.HttpProvider(
          'http://localhost:7548',
        )
      }
      web3 = new Web3(App.web3Provider)
      web3.eth.getAccounts(function (e, accounts) {
        App.owner = accounts[0]
      })
      return App.initContract()
    },

    initContract: function () {
      $.getJSON('/build/contracts/SimpleAuction.json', function (data) {
        // Get the necessary contract artifact file and instantiate it with @truffle/contract
        var SimpileAuctionArtifact = data
        App.contracts.SimpileAuction = TruffleContract(SimpileAuctionArtifact)

        // Set the provider for our contract
        App.contracts.SimpileAuction.setProvider(App.web3Provider)

        // Use our contract to retrieve and mark the adopted pets
        // return App.markAdopted()
      })

      return App.bindEvents()
    },

    bindEvents: function () {
      $(document).on('click', '#btn-bid', App.handleBid)
    },

    handleBid: function (event) {
      event.preventDefault()

      var price = parseInt($('#price').val())

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
