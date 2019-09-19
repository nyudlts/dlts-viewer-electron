<template>
  <div id="page" class="page" v-bind:class="{ pagemetaHidden: !isMetadataInfoPaneVisible }">
    <div id="navbar" class="pane navbar" role="navigation">
      <ul class="navbar navbar-left">
        <li class="navbar-item">
          <a
            @click.stop.prevent="toggleMetadataInfoPane()"
            title="Show/hide metadata"
            class="button metadata"
            v-bind:class="{ on: isMetadataInfoPaneVisible }"
          >
            <span>Metadata</span>
          </a>
        </li>
        <li class="navbar-item">
          <a 
            @click.stop.prevent="togglePageView()"
            title="Toggle between single or double page" 
            class="paging toggle active page-double"
            >
            <span>Toggle between single or double page</span>
          </a>
        </li>
        <li class="navbar-item">
          <a title="Select page" class="button thumbnails off"><span>Pages</span></a>
        </li>
        <li class="navbar-item">
          <a title="Rotate page" class="rotate" @click.stop.prevent="rotateWorld()"><span>Rotate page</span></a>
        </li>
      </ul>
      <ul class="navbar-fullscreen">
        <li class="navbar-item">
          <a @click.stop.prevent="toggleFullscreen()" title="Toggle fullscreen" class="button fullscreen" v-bind:class="{ on: isFullScreen }">
            <span>Toggle fullscreen</span>
          </a>
        </li>
      </ul>
    </div>
    <div role="main" id="main" class="pane main" :dir="languageDir">      
      <div id="pagemeta" class="pane pagemeta" v-bind:class="{ hidden: !isMetadataInfoPaneVisible }">
        <div class="container" data-dir="ltr" data-lang="en">
          <div class="field field-name-title field-type-ds field-label-hidden">
            <div class="field-items">
              <div class="field-item even">
                <h2>{{entity_title}}</h2>
              </div>
            </div>
          </div>
          <div class="field" v-for="(field, propertyName) in metadata" :key="field.identifier">
            <div class="field-label" v-bind:class="`field-${propertyName}`">{{field.label}}:</div>
            <div class="field-items" v-for="(value, index) in field.value" :key="index">
              <div class="field-item" v-bind:class="index">{{value}}</div>
            </div>
          </div>
        </div>
      </div>
      <div role="presentation" aria-hidden="true" id="display" class="pane display">
        <div class="openseadragon" :id="viewer.options.id"></div>
        <a 
        title="Go to previous page" 
        @click.stop.prevent="openPreviousPage()" 
        class="paging previous pager-left"
        v-bind:class="{ active: (sequence > 1), inactive: (sequence <= 1) }"
        >
          <span>Go to previous page</span>
        </a>
        <a 
          title="Go to next page" 
          @click.stop.prevent="openNextPage()" 
          class="paging next pager-right"
          v-bind:class="{ active: (sequence >= sequenceCount), inactive: (sequence >= sequenceCount) }"
          > 
          <span>Go to next page</span>
        </a>
      </div>
    </div>
    <div id="pager" class="pane pager">
      <b-form-input id="slider" v-model="sequence" :min="1" :max="sequenceCount" type="range" aria-label="Page to jump to"></b-form-input>
      <span role="navigation">
        <b-form-input id="slider_value" v-model="sequence" type="number" aria-label="Page to jump to"></b-form-input>
        <span>/</span>
        <span class="sequence_count">{{sequenceCount}}</span>
      </span>
    </div>
    <div role="presentation" id="thumbnails" class="views-g pane thumbnails hidden"></div>
  </div>
</template>

<script>

// Internationalization with vue-i18n
// https://medium.com/vuejoy/internationalization-in-vue-with-vue-i18n-part-1-a1a3c6b47755

import * as OpenSeadragon from 'openseadragon';

export default {
  name: 'Book',
  components: {},
  mounted() {
    this.viewer.options.tileSources = [
      `${this.iiifEndpoint}/${this.type}/${this.identifier}/${this.sequence}/info.json`,
      `${this.iiifEndpoint}/${this.type}/${this.identifier}/${(this.sequence + 1)}/info.json`,
    ];
    this.map = OpenSeadragon(this.viewer.options);
  },
  watch: {
    $route: 'fetchData',
    // sequence: 'changePage',
  },
  created() {
    this.fetchData();
  },
  data() {
    return {
      label: '',
      type: 'books',
      languageDir: 'ltr',
      previousPage: '',
      nextPage: '',
      identifier: 'ifa_frdl_book000002',
      iiifEndpoint: 'http://viewer.test/viewer/iiif/2',
      isBusy: true,
      isFullScreen: false,
      isMetadataInfoPaneVisible: true,
      isSequenceMode: false,
      sequenceCount: 0,
      degree: 0,
      sequence: 1,
      metadataUrl: 'http://viewer.test/viewer/books/ifa_frdl_book000002/json',
      metadata: {},
      map: null,
      entity_title: '',
      viewer: {
        options: {
          id: 'image-viewer',
          preserveViewport: true,
          visibilityRatio: 1,
          minZoomLevel: 1,
          defaultZoomLevel: 1,
          showNavigator: false,
          homeFillsViewer: true,
          preload: false,
          showFullPageControl: false,
          showZoomControl: false,
          showHomeControl: false,
          constrainDuringPan: true,
          useCanvas: true,
          sequenceMode: false,
          collectionMode: true,
          collectionRows: 2,
        },
      },
    };
  },
  methods: {
    fetchData() {
      this.isBusy = true;
      fetch(this.metadataUrl)
        .then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error('Network response was not ok.');
        })
        .then((data) => {
          // set sequence count (move to top level)
          this.sequenceCount = parseInt(data.metadata.sequence_count.value[0], 10);
          this.entity_title = data.entity_title;
          // Object.keys(data.metadata).forEach((key) => {
          //   const item = data.metadata[key];
          //   console.log(item.label);
          //   console.log(item.value);
          // });
          this.metadata = data.metadata;
        });
    },
    changePage() {
      const source1 = `${this.iiifEndpoint}/${this.type}/${this.identifier}/${this.sequence}/info.json`;
      const source2 = `${this.iiifEndpoint}/${this.type}/${this.identifier}/${(this.sequence + 1)}/info.json`;
      this.map.addTiledImage({
        tileSource: [source1, source2],
      });
    },
    toggleMetadataInfoPane() {
      this.isMetadataInfoPaneVisible = !this.isMetadataInfoPaneVisible;
    },
    rotateWorld() {
      this.degree = this.degree + 90;
      this.map.viewport.setRotation(this.degree);
    },
    toggleFullscreen() {
      if (!OpenSeadragon.isFullScreen()) {
        OpenSeadragon.requestFullScreen(document.body);
        this.isFullScreen = true;
      } else {
        OpenSeadragon.exitFullScreen();
        this.isFullScreen = false;
      }
    },
    openPreviousPage() {
      if (this.sequence > 1) {
        this.sequence = parseInt(this.sequence, 10) - 1;
        this.changePage();
      }
    },
    openNextPage() {
      if (this.sequence < this.sequenceCount) {
        this.sequence = parseInt(this.sequence, 10) + 1;
        this.changePage();
      }
    },
    togglePageView() {
      this.isSequenceMode = !this.isSequenceMode;
      console.log('togglePageView', this.isSequenceMode, this.map);
      this.map.sequenceMode = true;
      console.log(this.map.sequenceMode);
    },
  },
};
</script>