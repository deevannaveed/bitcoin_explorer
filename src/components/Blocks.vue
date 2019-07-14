<template>
  <div>
    <b-table
      responsive
      striped
      id="block-table"
      :busy.sync="isBusy"
      :items="blocksProvider"
      :fields="fields"
    >
      <template slot="height" slot-scope="data">
        <b-link
          :to="{
          name: 'blockSearch',
          params: { blockHeight: data.value }
        }"
        >{{ data.value }}</b-link>
      </template>
      <template slot="id" slot-scope="data">
        <b-link
          :to="{
              name: 'blockSearchByHash',
              params: { blockHash: data.value }
            }"
        >{{ data.value }}</b-link>
      </template>
      <template slot="size" slot-scope="data">{{ data.value }} bytes</template>
      <template slot="timestamp" slot-scope="data">{{ data.value | formatDate}}</template>
      <div slot="table-busy" class="text-center text-success my-2">
        <b-spinner class="align-middle" variant="success"></b-spinner>&nbsp;
        <strong class="text-success">Loading...</strong>
      </div>
    </b-table>
  </div>
</template>

<script>
import axios from "axios";
import moment from "moment";

export default {
  data() {
    return {
      fields: [
        "height",
        { key: "id", label: "Hash" },
        "size",
        { key: "timestamp", label: "Mined" }
      ],
      isBusy: false
    };
  },
  methods: {
    blocksProvider() {
      let promise = axios.get("https://blockstream.info/api/blocks");
      this.isBusy = false;
      return promise
        .then(response => {
          const items = response.data;
          return items;
        })
        .catch(error => {
          this.isBusy = false;
          console.log(error);
          return [];
        });
    }
  },
  filters: {
    formatDate: function(value) {
      if (value) {
        return moment.unix(value).format("h:mm A");
      }
    }
  }
};
</script>