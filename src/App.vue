<template>
  <b-container fluid>
    <b-row>
      <!-- Filters Column -->
      <b-col cols="12" md="4" class="p-4">
        <!-- Intro -->
        <div class="mt-3 mb-4"> 
          <h6>Cedric Amoyal - Vuex</h6> 
          <p>Coding challenge for Sr Software Engineer</p>
        </div>
        <hr class="mt-4 mb-4">

        <!-- Dynamic search input - Bootstrap Vue -->
        <b-form-input :value="filters.Title" @input="updateTitle" placeholder="Enter the Title" class="mt-3 mb-3"></b-form-input>

        <!-- Dropdown select - Bootstrap Vue -->
        <b-form-select :value="filters.Stage" @change="updateStage" :options="stageList" class="mt-3 mb-3"></b-form-select>

        <!-- Autocomplete - Ant Design -->
        <a-auto-complete
          :dataSource="categoryList"
          class="mt-3 mb-3 categoryAutocomplete"
          :filterOption="filterOptionAutocompleteCategory"
          placeholder="Enter the Category"
          @change="onChangeAutocompleteCategory"
        />

        <!-- Range Slider - Ant Design -->
        <p class="mt-3">
          Value 
          <span v-if="filters.Value"> 
            - [ ${{ filters.Value[0]/1000 }}K, ${{ filters.Value[1]/1000 }}K ] 
            </span>
        </p>
        <a-slider
          v-if="valueRange"
          range
          :step="1000"
          :min="valueRange[0]"
          :max="valueRange[1]"
          :defaultValue="valueRange"
          @afterChange="afterChangeSliderValue"
        />
        <div class="mb-3">
          <p class="alignleft">Min: ${{ valueRange[0] }}</p>
          <p class="alignright">Max: ${{ valueRange[1]/1000 }}K</p>
          <div style="clear: both;"></div>
        </div>

        <!-- Switch - Ant Design -->
        <p class="mt-3">
          Show only <strong> Private </strong> Ownership
        </p>
        <a-switch @change="onChangeSwitchOwnership" />


      </b-col>

      <!-- Map column -->
      <b-col cols="12" md="8" class="p-4">

        <!-- Map -->
        <MglMap 
          v-if="jsonData"
          :accessToken="mapboxData.accessToken" 
          :mapStyle="mapboxData.mapStyle" 
          :zoom="mapboxData.zoom"
          :center="mapboxData.coordinates"
          class="mglMap">
            <!-- Control Items -->
            <!-- TODO:: Fix issues with Icons  -->
            <MglNavigationControl position="top-right"/>
            <MglGeolocateControl position="top-right" />

            <!-- Markers -->
            <MglMarker 
              v-for="item in filteredData" :key="item.id"
              :coordinates="item.geometry.coordinates" 
              color="blue">
                <!-- Markers popup on click -->
                <MglPopup>
                  <div>
                    {{ item.properties.project.Title }} <br> 
                    Value: ${{ item.properties.project.Value / 1000 }}K <br>
                    Ownership: {{ item.properties.project.Ownership }} <br>
                    Stage: {{ item.properties.project.Stage }} <br>
                    Category: {{ item.properties.project.Category }} <br>
                  </div>
                </MglPopup>
            </MglMarker> 
        </MglMap>

      </b-col>
    </b-row>
  </b-container>
</template>

<script>
// Import data from the store
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

// Import Mapbox
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl, MglGeolocateControl, MglMarker, MglPopup } from "vue-mapbox";

export default {
  name: 'App',

  // Components needed for Mapbox
  components: {
    MglMap,
    MglNavigationControl,
    MglGeolocateControl, 
    MglMarker,
    MglPopup
  },

  data() {
    return {
      
    };
  },

  computed: {
    // Get data from the store
    ...mapState({ 
      jsonData: state => state.jsonData,
      mapboxData: state => state.mapboxData,   
      filters: state => state.filters,   
    }),
    ...mapGetters([
      'stageList',
      'categoryList',
      'valueRange',
      'filteredData',
    ]), 
  },
  methods: {
    // Update the value of Title in the store
    updateTitle (value) {
      this.$store.dispatch('updateTitleAction', value)
    },
    // Update the value of Stage in the store
    updateStage (value) {
      this.$store.dispatch('updateStageAction', value)
    },
    // Update the value of Value in the store
    afterChangeSliderValue (value) {
      this.$store.dispatch('updateValueAction', value)
    },
    // Make the Autocomplete non-case-sensitive - See https://www.antdv.com/components/auto-complete/
    filterOptionAutocompleteCategory (input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      );
    },
    // Update the value of Category in the store
    onChangeAutocompleteCategory (value) {
      this.$store.dispatch('updateCategoryAction', value)
    },
    // Update the value of ShowOnlyPrivateOwnership in the store
    onChangeSwitchOwnership (value) {
      this.$store.dispatch('updateShowOnlyPrivateOwnershipAction', value)
    }
  },
  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
}
</script>

<style>
.mglMap {
  min-height: 550px;
}
.alignleft {
	float: left;
}
.alignright {
	float: right;
}
.categoryAutocomplete{
  width: 100%;
}
</style>
