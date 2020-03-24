<template>
  <b-container fluid>
    <b-row>
      <!-- Filters Column -->
      <b-col cols="12" md="4" class="p-4">
        <!-- Introduction component -->
        <Introduction/>
        
        <!-- Filters component -->
        <Filters/>
      </b-col>

      <!-- Map column -->
      <b-col cols="12" md="8" class="p-4">
        <!-- Mapbox component -->
        <Mapbox/>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>

// Import components
import Introduction from '@/components/Introduction.vue'
import Filters from '@/components/Filters.vue'
import Mapbox from '@/components/Mapbox.vue'

export default {
  name: 'App',

  // Components needed for Mapbox
  components: {
    Introduction,
    Filters,
    Mapbox,
  },
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
