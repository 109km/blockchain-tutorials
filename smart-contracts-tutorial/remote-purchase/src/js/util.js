const ContractUtils = {
  init: async (url, options) => {
    let web3Provider
    if (window.ethereum) {
      web3Provider = window.ethereum
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
      web3Provider = window.web3.currentProvider
    }
    // If no injected web3 instance is detected, fall back to Ganache
    else {
      web3Provider = new Web3.providers.HttpProvider(url)
    }

    const web3 = new Web3(web3Provider)
    window.web3 = web3

    const accounts = await web3.eth.getAccounts()

    return {
      web3Provider,
      accounts,
    }
  },
}
