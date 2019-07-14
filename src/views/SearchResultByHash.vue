<template>
  <div class="search-result">
    <h6 class="main-title">
      Details for block hash id:
      <b-badge class="text-wrap text-break text-left" variant="dark">{{ this.$route.params.blockHash }}</b-badge>
    </h6>
    <div>
      <b-card show variant="primary" v-if="!isError">
        <div class="block-info table-responsive">
          <table class="table table-striped">
            <tr>
              <td>
                <strong>Hash:</strong>
              </td>
              <td class="item-val">{{ blockData.id }}</td>
            </tr>
            <tr>
              <td>
                <strong>Height:</strong>
              </td>
              <td class="item-val">{{ blockData.height }}</td>
            </tr>
            <tr>
              <td>
                <strong>Version:</strong>
              </td>
              <td class="item-val">{{ blockData.version }}</td>
            </tr>
            <tr>
              <td>
                <strong>TimeStamp:</strong>
              </td>
              <td class="item-val">{{ blockData.timestamp | formatDate }}</td>
            </tr>
            <tr>
              <td>
                <strong>TxCount:</strong>
              </td>
              <td class="item-val">{{ blockData.tx_count }}</td>
            </tr>
            <tr>
              <td>
                <strong>Size:</strong>
              </td>
              <td class="item-val">{{ blockData.size }}</td>
            </tr>
            <tr>
              <td>
                <strong>Weight:</strong>
              </td>
              <td class="item-val">{{ blockData.weight }}</td>
            </tr>
            <tr>
              <td>
                <strong>Merkle root:</strong>
              </td>
              <td class="item-val">{{ blockData.merkle_root }}</td>
            </tr>
            <tr>
              <td>
                <strong>Previous Block Hash:</strong>
              </td>
              <td class="item-val">
                <b-link
                  :to='{
                    name: "blockSearchByHash",
                    params: { blockHash: blockData.previousblockhash || "00000" }
                  }'
                >{{ blockData.previousblockhash }}</b-link>
              </td>
            </tr>
            <tr>
              <td>
                <strong>Nonce:</strong>
              </td>
              <td class="item-val">{{ blockData.nonce }}</td>
            </tr>
            <tr>
              <td>
                <strong>Bits:</strong>
              </td>
              <td class="item-val">{{ blockData.bits }}</td>
            </tr>
          </table>
          <hr />
          <b-button v-if="!transactions.length" variant="success" @click="listTransactions(blockData.id)">Show Transactions</b-button>
          &nbsp; <b-spinner v-if="!transactions.length && isLoading" variant="success" label="Spinning"></b-spinner>
        </div>
      <b-card v-if="transactions.length">
        <h3>Transactions</h3>
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
            <b-link class="sm" @click="showTransactionDetails(data.value)" variant="success">Show details</b-link>
          </template>
        </b-table>
      </b-card>
      </b-card>
      <b-alert show variant="danger" v-else>
        <p class="text-center">No results were found</p>
      </b-alert>
    </div>
      <b-modal id="detailsModel" hide-footer>
        <template slot="modal-title">
          Transaction Details
        </template>
        <div class="d-block text-center">
          <div class="text-left" v-for="item in transactionItems" :key="item.scriptpubkey_address">
            <p v-if="item.scriptpubkey_type !== 'op_return'" class="border-bottom">
              <strong>Address: </strong><code>{{ item.scriptpubkey_address }}</code><br>
              <strong>Value: </strong><code>{{ item.value }}</code>
            </p>
            <p v-else class="text-danger border-bottom">
              Could not decode vout address 
            </p>
          </div>
        </div>
        <b-button class="mt-3" block @click="$bvModal.hide('detailsModel')">Close</b-button>
      </b-modal>
  </div>
</template>
<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      fields: [{ key: "value", label: "Transaction Id" }],
      blockData: [],
      isError: false,
      transactions: [],
      isLoading: false,
      transactionItems: [],
    };
  },

  async mounted() {
    axios
      .get(`https://blockstream.info/api/block/${this.$route.params.blockHash}`)
      .then(response => {
        if (response.data) {
          this.blockData = response.data
        }
      })
      .catch(error => {
        this.isError = true
        console.log(error)
        return {};
      });
  },
  methods: {
    async listTransactions(hash) {
      this.isLoading = true
      const [transactions] = await Promise.all([
        axios
          .get(`https://blockstream.info/api/block/${hash}/txids`)
          .catch(error => {
            this.isError = true
            console.log(error)
          })
      ]);
      let tempArr = []
      for (let i = 0; i < transactions.data.length; i++) {
        let tempObj = new Object()
        tempObj.id = i
        tempObj.value = transactions.data[i]
        tempArr.push(tempObj)
      }
      this.transactions = tempArr
      this.$root.$emit("bv::refresh::table", "transactionsTable")
    },    
    async showTransactionDetails(txid){
        axios
        .get(`https://blockstream.info/api/tx/${txid}`)
        .then(response => {
          this.transactionItems = response.data.vout
        })
        .catch(error => {
          console.log(error)
        })
      this.$root.$emit("bv::refresh::table", "txnDetailsTable");
      this.$bvModal.show('detailsModel')
    }
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment.unix(value).format("MMM D, YYYY h:mm A")
      }
    }
  }
};
</script>
<style scoped>
.main-title {
  margin-top: 20px;
  margin-bottom: 20px;
  word-wrap: break-word;
}
.block-info table .item-val {
  word-wrap: break-word;
}
</style>
