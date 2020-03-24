<template>
  <b-container fluid>
    <b-row>
      <!-- Filters Column -->
      <b-col cols="12" md="4" class="p-4">
        <!-- Intro -->
        <h6 class="mt-3 mb-4"> 
          Cedric Amoyal <br> 
          Coding challenge for Sr Software Engineer
        </h6>
        <hr class="mt-4 mb-4">

        <!-- Dynamic search input - Bootstrap Vue -->
        <b-form-input v-model="Title" placeholder="Enter the Title" class="mt-3 mb-3"></b-form-input>

        <!-- Dropdown select - Bootstrap Vue -->
        <b-form-select v-model="Stage" :options="stageList" class="mt-3 mb-3"></b-form-select>

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
          <span v-if="Value"> 
            - [ ${{ Value[0]/1000 }}K, ${{ Value[1]/1000 }}K ] 
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
          :accessToken="accessToken" 
          :mapStyle="mapStyle" 
          :zoom="zoom"
          :center="coordinates"
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
// Import Mapbox
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl, MglGeolocateControl, MglMarker, MglPopup } from "vue-mapbox";

// Import Data from testBlob.json
import testBlob from '@/testBlob.json'

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
      // Mapbox access token (Should not be here)
      accessToken: "pk.eyJ1IjoiY2VkcmljYW1veWFsIiwiYSI6ImNrODU2azBqYjAzczgzb3BnN3p0dmk2OGkifQ.oQ8RdH32RpG5p-Qwip2qVQ",

      // Mapbox initial setting
      mapStyle: "mapbox://styles/mapbox/streets-v11",
      coordinates: [151.209900, -33.865143],
      zoom: 12,

      // Use of data from testBlob.json
      jsonData: testBlob.features,

      // Data used for the filters: Title, Stage, Category, Value and Ownership
      Title: "",
      Stage: null,
      Category: null,
      Value: "",
      ShowOnlyPrivateOwnership: false,
    };
  },

  computed: {
    // This computed is used to create the binding between filter interactions and map display. 
    // The result (filteredData) is displayed on the map
    filteredData () {
      let result = ""
      let v = this
      if(this.jsonData){
        // We start from "jsonData: testBlob.features"
        result =  this.jsonData.filter(function(item) {
          if (
            // We use negative statement in order to be able to filter on multiple conditions.
            // If you miss one of the conditions you are out (return false)

            // filter on Category - Autocomplete
            (v.Category && item.properties.project.Category.toLowerCase() !== v.Category.toLowerCase()) ||

            // filter on Stage - Dropdown select
            (v.Stage && item.properties.project.Stage.toLowerCase() !== v.Stage) ||

            // filter on Title - Dynamic search input
            !item.properties.project.Title.toLowerCase().includes(v.Title.toLowerCase()) ||

            // filter on Value - Range Slider
            Number(item.properties.project.Value) < v.Value[0] || 
            Number(item.properties.project.Value) > v.Value[1] ||

            // filter on Show Only Private Ownership - Switch
            (v.ShowOnlyPrivateOwnership ? item.properties.project.Ownership.toLowerCase() !== "private" : "")
          ){
            return false
          } else {
            return true
          }
        })
      }
      return result
    },
    // Create list of Stage option for Dropdown select
    stageList () {
      let result = [{ value: null, text: 'Please select a stage' }]
      if(this.jsonData){
        this.jsonData.forEach(function(item) {
          var index = result.findIndex(x => x.value === item.properties.project.Stage.toLowerCase())
          if (index === -1){
            result.push(
              { value: item.properties.project.Stage.toLowerCase(), text: item.properties.project.Stage }
            )
          }
        })
      }
      return result
    },
    // Create list of Category option for Autocomplete
    categoryList () {
      let result = []
      if(this.jsonData){
        this.jsonData.forEach(function(item) {
          // Capitalize Category name
          let capitalizeName = item.properties.project.Category.charAt(0).toUpperCase() + item.properties.project.Category.slice(1).toLowerCase()
          let index = result.findIndex(x => x === capitalizeName)
          if (index === -1){
            result.push(
              capitalizeName
            )
          }
        })
      }
      return result
    },
    // Find min and max Value for the Range Slider settings
    valueRange () {
      let array = []
      let result = []
      if(this.jsonData){
        this.jsonData.forEach(function(item) {
          array.push(Number(item.properties.project.Value))
        })
        // Sort numbers in array
        array.sort((a, b) => a - b)
      }
      
      // If the smallest value is less than 1000 make it 0
      if (array[0] < 1000){
        array[0] = 0
      }

      result = [array[0], array[array.length - 1]]
      return result
    }    
  },
  methods: {
    // Update the value of this.Value after slider changes
    afterChangeSliderValue (value) {
      this.Value = value
    },
    // Make the Autocomplete non-case-sensitive - See https://www.antdv.com/components/auto-complete/
    filterOptionAutocompleteCategory (input, option) {
      return (
        option.componentOptions.children[0].text.toUpperCase().indexOf(input.toUpperCase()) >= 0
      );
    },
    // Update the value of this.Category after Autocomplete changes
    onChangeAutocompleteCategory (value) {
      this.Category = value
    },
    // Update the value of this.ShowOnlyPrivateOwnership after switch changes
    onChangeSwitchOwnership (value) {
      this.ShowOnlyPrivateOwnership = value
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
