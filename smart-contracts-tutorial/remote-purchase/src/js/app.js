$(function () {
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
      $(document).on('click', '#btn-sell', App.handleSell)
    },
    handleSell: async () => {
      const instance = await App.contracts.Purchase.contract.new({
        from: App.owner,
        value: 1e18,
      })
      App.contracts.Purchase.instance = instance
    },
    handleConfirm: async (e) => {
      e.preventDefault()
      const purchaseInstance = await App.contracts.Purchase.contract.deployed()

      console.log(purchaseInstance)
      const tx = await purchaseInstance.confirmPurchase({
        from: App.owner,
        value: 2e18,
      })
      console.log(tx)
    },
  }
  App.init()
})
