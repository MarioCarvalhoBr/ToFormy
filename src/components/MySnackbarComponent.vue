<template>
  <div class="text-center">
    <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color" :elevation="snackbar.elevation">
      {{ snackbar.text }}

      <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
    </v-snackbar>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MySnackbarComponent',
  setup() {
    const snackbar = ref({
      show: false,
      text: '',
      color: 'success',
      timeout: 3000,
      elevation: 6,
    });

    const createSnackbar = (text, color = 'success', timeout = 3000) => {
      snackbar.value.text = text;
      snackbar.value.color = color;
      snackbar.value.timeout = timeout;
      snackbar.value.show = true;
    };

    return { snackbar, createSnackbar };
  },
};
</script>
