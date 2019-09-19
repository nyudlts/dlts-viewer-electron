<template>
  <div>
    <b-container fluid>
      <b-row>
        <b-col>
          <b-form-group
            label="Filter"
            label-cols-sm="3"
            label-align-sm="right"
            label-size="sm"
            label-for="filterInput"
            class="mb-0"
          >
            <b-input-group size="sm">
              <b-form-input
                v-model="filter"
                type="search"
                id="filterInput"
                placeholder="Type to Search"
              ></b-form-input>
              <b-input-group-append>
                <b-button :disabled="!filter" @click="filter = ''">Clear</b-button>
              </b-input-group-append>
            </b-input-group>
          </b-form-group>
        </b-col>
      </b-row>
    </b-container>
    <br/>
    <b-table
      id="infoTable"
      show-empty
      sort-icon-left
      primary-key="extension"
      striped
      hover
      :filter="filter"
      :busy.sync="isBusy"
      :items="items"
      :fields="fields"
      :sort-by.sync="sortBy"
    >
      <template v-slot:cell(operations)="data">
        <b-button
          size="sm"
          @click="info(data.item, $event.target)"
          class="mr-1"
          variant="outline-primary"
        >view</b-button>
      </template>
      <template v-slot:cell(lastPlayed)="data">
        <span>{{ data.item.lastPlayed | moment("MMMM Do YYYY, h:mm:ss a") }}</span>
      </template>
      <template v-slot:table-busy>
        <div class="text-center text-danger my-2">
          <b-spinner class="align-middle"></b-spinner>
          <strong>Gatherign your {{type}}...</strong>
        </div>
      </template>
    </b-table>
  </div>
</template>

<script>
export default {
  name: 'Table',
  props: ['type', 'fetchUrl'],
  data() {
    return {
      filter: null,
      sortBy: 'extension',
      isBusy: false,
      items: [],
      fields: [
        { key: 'extension', sortable: true },
        { key: 'message', sortable: true },
        { key: 'lastPlayed', sortable: true },
        { key: 'language', sortable: true },
        { key: 'operations' },
      ],
    };
  },
  created() {
    this.fetchData();
  },
  watch: {
    $route: 'fetchData',
  },
  methods: {
    info(item, button) {
      this.$root.$emit('ninus::populate::modal', {
        item,
        button,
      });
    },
    fetchData() {
      this.isBusy = true;
      fetch(this.fetchUrl)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          data[this.type].extensions.map((extension) => {
            return this.items.push({
              extension: extension.id,
              message: extension.title,
              lastPlayed: extension.lastPlayed,
              language: extension.language,
              available: extension.available,
              favorite: extension.favorite,
              streamPath: extension.streamPath,
            });
          });
        })
        .then(() => {
          this.isBusy = false;
        });
    },
  },
};
</script>