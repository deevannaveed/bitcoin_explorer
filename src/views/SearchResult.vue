<template>
  <div class="search-result">
    <h6 class="main-title">
      Details for block height:
      <b-badge class="text-break text-left" variant="dark">{{ this.$route.params.blockHeight }}</b-badge>
    </h6>
    <div>
      <b-card show variant="primary" v-if="!isError">
        <div class="block-info table-responsive" v-for="block in blockData" v-bind:key="block.id">
          <table class="table table-striped">
            <tr>
              <td>
                <strong>Hash:</strong>
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
              <td class="item-val">{{ block.timestamp | formatDate }}</td>
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
              <td class="item-val">
                <b-link
                  :to="{
                    name: 'blockSearchByHash',
                    params: { blockHash: block.previousblockhash }
                  }"
                >{{ block.previousblockhash }}</b-link>
              </td>
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
          <hr />
          <b-button variant="success" @click="listTransactions(block.id)">Show Transactions</b-button>
        </div>
      </b-card>
      <b-alert show variant="danger" v-else>
        <p class="text-center">No results were found</p>
      </b-alert>
      <b-card v-if="transactions.length">
        <h3>Transaction Details</h3>
        <b-table
          responsive
          id="transactionsTable"
          striped
          hover
          :items="transactions"
          :fields="fields"
        >
          <template slot="value" slot-scope="data">
            {{ data.value }} &nbsp;
            <b-link class="sm" variant="success">Show details</b-link>
          </template>
        </b-table>
      </b-card>
    </div>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      fields: [{ key: "value", label: "Transaction Id" }],
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
          console.log(error);
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
          console.log(error);
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
            console.log(error);
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
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment.unix(value).format("MMM D, YYYY h:mm A");
      }
    }
  }
};
</script>
<style scoped>
.main-title {
  margin-top: 20px;
  word-wrap: break-word;
}
.block-info table .item-val {
  word-wrap: break-word;
}
</style>
