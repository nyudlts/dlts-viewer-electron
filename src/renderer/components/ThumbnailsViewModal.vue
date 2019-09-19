<template>
  <div>
    <b-modal :id="infoModal.id" :title="infoModal.entity_title" only-cancel>
      <b-form @reset="resetInfoModal">
      </b-form>
      <template v-slot:modal-footer>
        <div class="float-right">
          <b-button size="sm" @click.stop.prevent="resetInfoModal">Cancel</b-button>
        </div>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ThumbnailsViewModal',
  mounted() {
    this.$root.$on('tv::open::modal', (data) => {
      console.log(data);
      this.infoModal.entity_title = data.entity_title;
      this.$bvModal.show(this.infoModal.id);
    });
  },
  data() {
    return {
      infoModal: {
        id: 'info-modal',
        entity_title: '',
      },
    };
  },
  methods: {
    resetInfoModal() {
      this.$bvModal.hide(this.infoModal.id);
      this.$root.$emit('tv::hide::modal', this.infoModal.id);
      this.entity_title = '';
    },
  },
};
</script>
