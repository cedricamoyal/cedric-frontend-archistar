<template>
  <div>
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
  </div>
</template>

<script>
// Import data from the store
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

// Import Mapbox
import Mapbox from "mapbox-gl";
import { MglMap, MglNavigationControl, MglGeolocateControl, MglMarker, MglPopup } from "vue-mapbox";

export default {
  name: 'Mapbox',

  // Components needed for Mapbox
  components: {
    MglMap,
    MglNavigationControl,
    MglGeolocateControl, 
    MglMarker,
    MglPopup
  },

  computed: {
    // Get data from the store
    ...mapState({ 
      jsonData: state => state.jsonData,
      mapboxData: state => state.mapboxData, 
    }),
    ...mapGetters([
      'filteredData',
    ]), 
  },

  created() {
    // We need to set mapbox-gl library here in order to use it in template
    this.mapbox = Mapbox;
  }
}
</script>

<style scoped>

</style>
