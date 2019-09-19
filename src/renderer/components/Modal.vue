<template>
  <div>
    <b-modal :id="infoModal.id" :title="`Extension ${infoModal.extension}`">
      <b-form @reset="onResetUpdate">
        <b-form-group label="Name" label-for="update-tune">
          <b-form-input v-model="infoModal.title" type="text" required></b-form-input>
        </b-form-group>
        <b-form-group label="Language">
          <b-form-select :options="infoModal.availableLanguages" v-model="infoModal.language"></b-form-select>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            v-model="infoModal.available"
            name="check-button-available"
            switch
            @change="toggleInfoModalAvailable"
          >Tune will be available to be play? {{ infoModal.available ? 'Yes' : 'No' }}</b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <b-form-checkbox
            v-model="infoModal.favorite"
            name="check-button-favorite"
            switch
            @change="toggleInfoModalFavorite"
          >Mark as favorite? {{ infoModal.favorite ? 'Yes' : 'No' }}</b-form-checkbox>
        </b-form-group>
        <b-form-group>
          <audio controls>
            <source :src="infoModal.streamPath" />
          </audio>
        </b-form-group>
      </b-form>
      <template v-slot:modal-footer>
        <div class="float-right">
          <b-button
            variant="danger"
            size="sm"
            @click.stop.prevent="onInfoModalDelete"
            type="submit"
          >Delete</b-button>
          <b-button
            variant="primary"
            size="sm"
            @click.stop.prevent="onSubmitUpdate"
            type="submit"
          >Submit</b-button>
          <b-button size="sm" @click.stop.prevent="resetInfoModal">Cancel</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'MessageModal',
  mounted() {
    this.$root.$on('ninus::populate::modal', (data) => {
      this.infoModal.available = data.item.available;
      this.infoModal.extension = data.item.extension;
      this.infoModal.favorite = data.item.favorite;
      this.infoModal.language = data.item.language;
      this.infoModal.title = data.item.message;
      this.$bvModal.show(this.infoModal.id);
    });
  },
  data() {
    return {
      infoModal: {
        id: 'info-modal',
        index: 0,
        extension: 0,
        title: '',
        language: '',
        streamPath: '',
        availableLanguages: ['en-US', 'fr-FR', 'es-PR'],
        available: false,
        favorite: false,
      },
    };
  },
  methods: {
    onInfoModalDelete() {
      this.resetInfoModal();
    },
    resetInfoModal() {
      this.$root.$emit('bv::hide::modal', this.infoModal.id);
    },
    toggleInfoModalAvailable() {
      this.infoModal.available = !this.infoModal.available;
    },
    toggleInfoModalFavorite() {
      this.infoModal.favorite = !this.infoModal.favorite;
    },
    onSubmitUpdate() {
    },
    onResetUpdate(evt) {
      evt.preventDefault();
    },
  },
};
</script>
