import React from 'react'
import ReactDOM from 'react-dom'
import Contract from './contract'

const Index = class Index extends React.Component {
  constructor(props) {
    super(props)

    this.textInput = React.createRef()

    this.contract = new Contract()
    this.value = 0

    this.state = {
      value: 0,
      isValid: false,
      isSending: false,
      tx: null,
      tries: 0,
      balance: 0,
      address: '',
    }
  }

  async componentWillMount() {
    await this.contract.loadContract()
    this.contract.addEventListener('NewValueSet', (v) => {
      this.setState({ value: v._value })
    })

    this.contract.addEventListener('NewValueSetAgain', (v) => {
      this.setState({ value: v._value })
    })
  }

  onChangeHandler(event) {
    this.value = event.target.value
    const isValid = this.value > 0
    this.setState({ isValid })
  }

  async confirmValue() {
    this.setState({ isSending: true })
    try {
      const tx = await this.contract.setValue(this.value)
      const tries = this.state.tries + 1
      this.textInput.current.value = ''
      this.setState({ tx, tries, isValid: false })
    } catch (err) {
      console.error('Ops, some error happen:', err)
    }
    this.setState({ isSending: false })
  }

  async getValue() {
    const val = await this.contract.getValue()
    this.setState({
      balance: val[0],
      address: val[1],
    })
  }

  render() {
    const loomyAlert = (
      <div className="alert alert-warning">
        I dare you to type 47 and press Confirm !
      </div>
    )

    return (
      <div className="container" style={{ marginTop: 10 }}>
        <form
          onSubmit={(e) => {
            e.preventDefault()
          }}
        >
          <div className="form-group">
            <label>Value</label>
            <input
              type="number"
              className="form-control"
              onChange={(event) => this.onChangeHandler(event)}
              ref={this.textInput}
            />
            <small className="form-text text-muted">Set a number</small>
          </div>
          <button
            type="button"
            disabled={!this.state.isValid || this.state.isSending}
            className="btn btn-primary"
            onClick={() => this.confirmValue()}
          >
            {this.state.isSending ? 'Sending' : 'Confirm'}
          </button>

          <button
            type="button"
            className="btn"
            style={{ marginLeft: 10 }}
            onClick={() => this.getValue()}
          >
            Get balance
          </button>
        </form>
        <div className="alert alert-warning">
          Balance is {this.state.balance}, contract address is
          {this.state.address}
        </div>
        <div className="alert alert-success">
          Value set is {this.state.value} (this value only updates if values is
          10 or ...)
        </div>
        {this.state.tries === 3 && loomyAlert}
        <hr />
        <pre>{this.state.tx && JSON.stringify(this.state.tx, null, 2)}</pre>
      </div>
    )
  }
}

ReactDOM.render(<Index />, document.getElementById('root'))
