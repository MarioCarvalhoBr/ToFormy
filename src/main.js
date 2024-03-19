/**
 * main.js
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import { registerPlugins } from "@/plugins";

// Components
import App from "./App.vue";

// Composables
import { createApp } from "vue";
import { surveyPlugin } from "survey-vue3-ui";
const app = createApp(App);
app.use(surveyPlugin);

registerPlugins(app);

app.mount("#app");
