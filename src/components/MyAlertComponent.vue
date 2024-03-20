<template>
    <v-alert v-if="alert.show" closable :type="alert.type" dismissible transition="scale-transition" :icon="alert.icon"
    :color="alert.color" :elevation="alert.elevation" outlined dense>
      <strong>{{ alert.title }}</strong>
      <br>{{ alert.message }}
    </v-alert>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MyAlertComponent',
  setup() {
    const alert = ref({
      show: false,
      title: 'Dialog title',
      message: 'Dialog message',
      color: 'primary',
      icon: 'mdi-information',
      elevation: 2,
    });

    // Create alert function
    const createAlert = (title, message, color = 'primary', icon = 'mdi-information', elevation = 2) => {
      alert.value.title = title;
      alert.value.message = message;
      alert.value.color = color;
      alert.value.icon = icon;
      alert.value.elevation = elevation;
      alert.value.show = true;
    };

    return { alert, createAlert };
  },
};
</script>
