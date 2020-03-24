<template>
  <div>    
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
  </div>
</template>

<script>
// Import data from the store
import { mapState } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  name: 'Filters',

  computed: {
    // Get data from the store
    ...mapState({ 
      jsonData: state => state.jsonData,
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
}
</script>

<style scoped>

</style>
