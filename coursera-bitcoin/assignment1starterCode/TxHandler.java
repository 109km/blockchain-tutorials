import java.util.ArrayList;

public class TxHandler {
  /**
   * Creates a public ledger whose current UTXOPool (collection of unspent transaction outputs) is
   * {@code utxoPool}. This should make a copy of utxoPool by using the UTXOPool(UTXOPool uPool)
   * constructor.
   */

  private UTXOPool pool;

  public TxHandler(UTXOPool utxoPool) {
    pool = new UTXOPool(utxoPool);
  }

  /**
   * @return true if:
   * (1) all outputs claimed by {@code tx} are in the current UTXO pool,
   * (2) the signatures on each input of {@code tx} are valid,
   * (3) no UTXO is claimed multiple times by {@code tx},
   * (4) all of {@code tx}s output values are non-negative, and
   * (5) the sum of {@code tx}s input values is greater than or equal to the sum of its output
   *     values; and false otherwise.
   */
  public boolean isValidTx(Transaction tx) {
    ArrayList<UTXO> usedUTXO = new ArrayList<>();

    int numOfInputs = tx.numInputs();
    int numOfOutpus = tx.numOutputs();

    double totalInput = 0;
    double totalOuput = 0;

    for (int i = 0; i < numOfInputs; i++) {
      Transaction.Input input = tx.getInput(i);
      byte[] prevTxHash = input.prevTxHash;
      int outputIndex = input.outputIndex;
      byte[] signature = input.signature;

      UTXO utxo = new UTXO(prevTxHash, outputIndex);

      // Check rule 1
      if (!pool.contains(utxo)) {
        return false;
      }
      // Check rule 2
      Transaction.Output output = pool.getTxOutput(utxo); // Get this input's corresponding output
      byte[] message = tx.getRawDataToSign(i);
      if (!Crypto.verifySignature(output.address, message, signature)) {
        return false;
      }
      // Check rule 3
      if (usedUTXO.contains(utxo)) {
        return false;
      }
      usedUTXO.add(utxo);
      totalInput += output.value;
    }

    // Check rule 4
    for (int i = 0; i < numOfOutpus; i++) {
      Transaction.Output output = tx.getOutput(i);
      if (output.value < 0) {
        return false;
      }
      totalOuput += output.value;
    }

    // Check rule 5
    if (totalInput < totalOuput) {
      return false;
    }

    return true;
  }

  /**
   * Handles each epoch by receiving an unordered array of proposed transactions, checking each
   * transaction for correctness, returning a mutually valid array of accepted transactions, and
   * updating the current UTXO pool as appropriate.
   */
  public Transaction[] handleTxs(Transaction[] possibleTxs) {
    ArrayList<Transaction> validTxs = new ArrayList<>();

    for (Transaction tx : possibleTxs) {
      if (isValidTx(tx)) {
        validTxs.add(tx);

        ArrayList<Transaction.Input> inputs = tx.getInputs();

        // Remove consumed inputs
        for (Transaction.Input input : inputs) {
          UTXO utxo = new UTXO(input.prevTxHash, input.outputIndex);
          pool.removeUTXO(utxo);
        }

        // Add new unspent outputs
        byte[] txHash = tx.getHash();
        for (int i = 0; i < tx.numOutputs(); i++) {
          UTXO utxo = new UTXO(txHash, i);
          pool.addUTXO(utxo, tx.getOutput(i));
        }
      }
    }
    Transaction[] validTxsArr = new Transaction[validTxs.size()];
    validTxsArr = validTxs.toArray(validTxsArr);
    return validTxsArr;
  }
}
