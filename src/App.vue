<template>
  <div id="app">
    <div>
      <div>
        <b-navbar class="fixed-top" toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="/">BitCoin Explorer</b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-form @submit="submitForm" class="mt-2 mb-1">
                <b-form-input
                  size="sm"
                  v-model="searchValue"
                  @keypress="isDigit($event)"
                  class="mr-sm-2"
                  placeholder="Search block by height"
                  required
                ></b-form-input>
                <b-form-select
                  id="search-type"
                  size="sm"
                  class="my-2 p2"
                  v-model="selectedSearchType"
                  :options="searchType"
                  required
                ></b-form-select>
                <b-button size="sm" class="my-2 ml-1 btn btn-default" type="submit">Search</b-button>
              </b-nav-form>
            </b-navbar-nav>
          </b-collapse>
        </b-navbar>
      </div>
    </div>
    <b-container fluid class="bv-example-row">
      <router-view :key="$route.fullPath" />
    </b-container>
  </div>
</template>
<script>
export default {
  data() {
    return {
      searchValue: "",
      searchType: [{ text: 'height', value: 'height', }, 'hash'],
      selectedSearchType: 'height',
    };
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();
      if (this.searchValue && !isNaN(this.searchValue) && this.selectedSearchType === 'height') {
        this.$router.push({
          name: "blockSearch",
          params: { blockHeight: this.searchValue }
        });
      } else if(this.searchValue && this.selectedSearchType === 'hash'){
        this.$router.push({
          name: "blockSearchByHash",
          params: { blockHash: this.searchValue }
        });
      }
    },
    isDigit: function(evt) {
      if(this.selectedSearchType === 'hash'){
        return true
      }
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault()
      } else {
        return true
      }
    }
  }
};
</script>
