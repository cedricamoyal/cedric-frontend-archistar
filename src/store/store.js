import Vue from "vue";
import Vuex from "vuex";

// Import Data from testBlob.json
import testBlob from '@/testBlob.json'

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        // Use of data from testBlob.json
        jsonData: testBlob.features,

        // Mapbox initial setting
        mapboxData: {
            accessToken: "pk.eyJ1IjoiY2VkcmljYW1veWFsIiwiYSI6ImNrODU2azBqYjAzczgzb3BnN3p0dmk2OGkifQ.oQ8RdH32RpG5p-Qwip2qVQ",
            mapStyle: "mapbox://styles/mapbox/streets-v11",
            coordinates: [151.209900, -33.865143],
            zoom: 12,
        },

        // Data used for the filters: Title, Stage, Category, Value and Ownership
        filters: {
            Title: "",
            Stage: null,
            Category: null,
            Value: "",
            ShowOnlyPrivateOwnership: false,
        }    
    },
    mutations: {
        SET_MAPBOX( state, mapboxData ){
            state.mapboxData = mapboxData
        },
        SET_TITLE( state, Title ){
            state.filters.Title = Title
        },
        SET_STAGE( state, Stage ){
            state.filters.Stage = Stage
        },
        SET_VALUE( state, Value ){
            state.filters.Value = Value
        },
        SET_CATEGORY( state, Category ){
            state.filters.Category = Category
        },
        SET_SHOWONLYPRIVATEOWNERSHIP( state, ShowOnlyPrivateOwnership ){
            state.filters.ShowOnlyPrivateOwnership = ShowOnlyPrivateOwnership
        },
    },
    actions: {
        updateTitleAction( { commit }, data){
            commit( 'SET_TITLE', data )            
        },
        updateStageAction( { commit }, data){
            commit( 'SET_STAGE', data )            
        },
        updateValueAction( { commit }, data){
            commit( 'SET_VALUE', data )            
        },
        updateCategoryAction( { commit }, data){
            commit( 'SET_CATEGORY', data )            
        },
        updateShowOnlyPrivateOwnershipAction( { commit }, data){
            commit( 'SET_SHOWONLYPRIVATEOWNERSHIP', data )            
        },
    },
    getters: {
        // Create list of Stage option for Dropdown select
        stageList (state) {
            let result = [{ value: null, text: 'Please select a stage' }]
            if(state.jsonData){
                state.jsonData.forEach(function(item) {
                let index = result.findIndex(x => x.value === item.properties.project.Stage.toLowerCase())
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
        categoryList (state) {
            let result = []
            if(state.jsonData){
            state.jsonData.forEach(function(item) {
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
        valueRange (state) {
            let array = []
            let result = []
            if(state.jsonData){
            state.jsonData.forEach(function(item) {
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
        },
        // This getter is used to create the binding between filter interactions and map display. 
        // The result (filteredData) is displayed on the map
        filteredData (state) {
            let result = ""
            if(state.jsonData){
                // We start from "jsonData: testBlob.features"
                result =  state.jsonData.filter(function(item) {
                    if (
                        // We use negative statement in order to be able to filter on multiple conditions.
                        // If you miss one of the conditions you are out (return false)
            
                        // filter on Category - Autocomplete
                        (state.filters.Category && item.properties.project.Category.toLowerCase() !== state.filters.Category.toLowerCase()) ||
            
                        // filter on Stage - Dropdown select
                        (state.filters.Stage && item.properties.project.Stage.toLowerCase() !== state.filters.Stage) ||
            
                        // filter on Title - Dynamic search input
                        !item.properties.project.Title.toLowerCase().includes(state.filters.Title.toLowerCase()) ||
            
                        // filter on Value - Range Slider
                        Number(item.properties.project.Value) < state.filters.Value[0] || 
                        Number(item.properties.project.Value) > state.filters.Value[1] ||
            
                        // filter on Show Only Private Ownership - Switch
                        (state.filters.ShowOnlyPrivateOwnership ? item.properties.project.Ownership.toLowerCase() !== "private" : "")
                    ){
                        return false
                    } else {
                        return true
                    }
                })
            }
            return result
        },   
    }
})