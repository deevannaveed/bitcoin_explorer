<template>
  <div id="app">
    <div>
      <div>
        <b-navbar toggleable="lg" type="dark" variant="dark">
          <b-navbar-brand href="/">BitCoin Explorer</b-navbar-brand>
          <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
          <b-collapse id="nav-collapse" is-nav>
            <b-navbar-nav>
              <b-nav-form @submit="submitForm" class="mt-2 mb-1">
                <b-form-input
                  size="sm"
                  v-model="blockHeight"
                  @keypress="isDigit($event)"
                  class="mr-sm-2"
                  placeholder="Search block by height"
                ></b-form-input>
                <b-button size="sm" class="my-2 my-sm-0 btn btn-default" type="submit">Search</b-button>
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
      blockHeight: ""
    };
  },
  methods: {
    submitForm: function(e) {
      e.preventDefault();
      if (this.blockHeight && !isNaN(this.blockHeight)) {
        this.$router.push({
          name: "blockSearch",
          params: { blockHeight: this.blockHeight }
        });
      }
    },
    isDigit: function(evt) {
      evt = evt ? evt : window.event;
      var charCode = evt.which ? evt.which : evt.keyCode;
      if (
        charCode > 31 &&
        (charCode < 48 || charCode > 57) &&
        charCode !== 46
      ) {
        evt.preventDefault();
      } else {
        return true;
      }
    }
  }
};
</script>
