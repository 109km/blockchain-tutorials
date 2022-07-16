$(function () {
  const CURRENT_CONTRACT_ADDRESS = '0xF3A93C68ef00Ad267a304071F53aaB72c80012cf'
  const App = {
    web3Provider: null,
    contracts: {},
    owner: '',
    init: async function () {
      await App.initWeb3()
      await App.initContract()
      App.bindEvents()
    },
    initWeb3: async function () {
      const res = await ContractUtils.init('http://localhost:7548')
      App.owner = res.accounts[0]
      App.web3Provider = res.web3Provider
    },
    initContract: async () => {
      const contractData = await $.getJSON('/build/contracts/Purchase.json')

      const contract = TruffleContract(contractData)
      contract.setProvider(App.web3Provider)
      // Get the instance of the contract
      // const instance = await App.contracts.Purchase.deployed()

      App.contracts.Purchase = {
        contract,
      }
    },

    bindEvents: () => {
      $(document).on('click', '#btn-confirm', App.handleConfirm)
      $(document).on('click', '#btn-receive', App.handleReceive)

      $(document).on('click', '#btn-sell', App.handleSell)
      $(document).on('click', '#btn-abort', App.handleAbort)
      $(document).on('click', '#btn-refund', App.handleRefund)
    },
    handleSell: async () => {
      const instance = await App.contracts.Purchase.contract.new({
        from: App.owner,
        value: 1e18,
      })
      App.contracts.Purchase.instance = instance
    },
    handleAbort: async (e) => {
      e.preventDefault()
      const purchaseInstance = await App.contracts.Purchase.contract.at(
        CURRENT_CONTRACT_ADDRESS,
      )
      const tx = await purchaseInstance.abort({ from: App.owner })
      console.log('handleAbort:', tx)
    },
    handleRefund: async (e) => {
      e.preventDefault()
      const purchaseInstance = await App.contracts.Purchase.contract.at(
        CURRENT_CONTRACT_ADDRESS,
      )
      const tx = await purchaseInstance.refundSeller({ from: App.owner })
      console.log('handleRefund:', tx)
    },
    handleConfirm: async (e) => {
      e.preventDefault()
      const purchaseInstance = await App.contracts.Purchase.contract.at(
        CURRENT_CONTRACT_ADDRESS,
      )
      const tx = await purchaseInstance.confirmPurchase({
        from: App.owner,
        value: 2e18,
      })
    },
    handleReceive: async (e) => {
      e.preventDefault()
      const purchaseInstance = await App.contracts.Purchase.contract.at(
        CURRENT_CONTRACT_ADDRESS,
      )
      const tx = await purchaseInstance.confirmReceived({
        from: App.owner,
      })
      console.log('handleReceive:', tx)
    },
  }
  App.init()
})
