/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import "@mdi/font/css/materialdesignicons.css";
import "vuetify/styles";

// Composables
import { createVuetify } from "vuetify";
import { md1 } from 'vuetify/blueprints'
import { md2 } from 'vuetify/blueprints'
import { md3 } from 'vuetify/blueprints'


const blueprint = localStorage.getItem('blueprint')
let blueprintObj = {}
if (blueprint === "md1") {
  blueprintObj = md1
}else if (blueprint === "md2") {
  blueprintObj = md2
}
else if (blueprint === "md3") {
  blueprintObj = md3
}else{
  blueprintObj = md1
}

// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: 'light',
  },
  blueprint: blueprintObj,

});
