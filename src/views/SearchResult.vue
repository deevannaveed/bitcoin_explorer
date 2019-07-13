<template>
  <div class="search-result">
    <h4 class="main-title">
      Search Result for block height:
      <b-badge variant="dark">{{ this.$route.params.blockHeight }}</b-badge>
    </h4>
    <div>
      <b-card show variant="primary" v-if="!isError">
        <div class="block-info table-responsive" v-for="block in blockData" v-bind:key="block.id">
          <table class="table table-striped">
            <tr>
              <td>
                <strong>Id:</strong>
              </td>
              <td class="item-val">{{ block.id }}</td>
            </tr>
            <tr>
              <td>
                <strong>Height:</strong>
              </td>
              <td class="item-val">{{ block.height }}</td>
            </tr>
            <tr>
              <td>
                <strong>Version:</strong>
              </td>
              <td class="item-val">{{ block.version }}</td>
            </tr>
            <tr>
              <td>
                <strong>TimeStamp:</strong>
              </td>
              <td class="item-val">{{ block.timestamp }}</td>
            </tr>
            <tr>
              <td>
                <strong>TxCount:</strong>
              </td>
              <td class="item-val">{{ block.tx_count }}</td>
            </tr>
            <tr>
              <td>
                <strong>Size:</strong>
              </td>
              <td class="item-val">{{ block.size }}</td>
            </tr>
            <tr>
              <td>
                <strong>Weight:</strong>
              </td>
              <td class="item-val">{{ block.weight }}</td>
            </tr>
            <tr>
              <td>
                <strong>Merkle root:</strong>
              </td>
              <td class="item-val">{{ block.merkle_root }}</td>
            </tr>
            <tr>
              <td>
                <strong>Previous Block Hash:</strong>
              </td>
              <td class="item-val">{{ block.previousblockhash }}</td>
            </tr>
            <tr>
              <td>
                <strong>Nonce:</strong>
              </td>
              <td class="item-val">{{ block.nonce }}</td>
            </tr>
            <tr>
              <td>
                <strong>Bits:</strong>
              </td>
              <td class="item-val">{{ block.bits }}</td>
            </tr>
          </table>
          <hr>
          <b-button variant="success" @click="listTransactions(block.id)">Show Transactions</b-button>
        </div>
      </b-card>
      <b-alert show variant="danger" v-else>
        <p class="text-center">No results were found</p>
      </b-alert>
      <b-card v-if="transactions.length">
        <h3>Transaction Details</h3>
        <b-table responsive id="transactionsTable" striped hover :items="transactions" :fields="fields" >
          <template slot-scope="data">{{ data.value }}</template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>
<script>
import axios from "axios";

export default {
  data() {
    return {
      fields: [{key: 'value', label: 'Transaction Id'}],
      blockData: [{ message: "No data yet. . . " }],
      isError: false,
      transactions: []
    };
  },

  async mounted() {
    const [blockHash] = await Promise.all([
      axios
        .get(
          `https://blockstream.info/api/block-height/${this.$route.params.blockHeight}`
        )
        .catch(error => {
          this.isError = true;
        })
    ]);

    if (blockHash) {
      axios
        .get(`https://blockstream.info/api/block/${blockHash.data}`)
        .then(response => {
          if (response.data) {
            this.blockData = [response.data];
          }
        })
        .catch(error => {
          this.isError = true;
          return {};
        });
    }
  },
  methods: {
    async listTransactions(hash) {
      const [transactions] = await Promise.all([
        axios
          .get(`https://blockstream.info/api/block/${hash}/txids`)
          .catch(error => {
            this.isError = true;
          })
      ]);
      let tempArr = [];
      for (let i = 0; i < transactions.data.length; i++) {
        let tempObj = new Object();
        tempObj.id = i;
        tempObj.value = transactions.data[i];
        tempArr.push(tempObj);
      }
      this.transactions = tempArr;
      this.$root.$emit("bv::refresh::table", "transactionsTable");
    }
  }
};
</script>
<style scoped>
.main-title {
  margin-top: 20px;
}
.block-info table .item-val {
  word-wrap: break-word;
}
</style>
