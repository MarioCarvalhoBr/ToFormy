<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog.show" max-width="600" persistent>
      <v-card :prepend-icon="dialog.icon" :title="dialog.title">
        <v-card-text>
          <v-row dense>

            <v-col cols="12">
              <SurveyComponent :model="dialog.survey" />
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn class="text-white flex-grow-1 text-none" color="grey-darken-4" rounded="0" variant="flat"
            @click="closeDialog">
            Close
          </v-btn>
          <br>

        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'MyDialogSurveyComponent',
  setup(props, { emit }) {
    const dialog = ref({
      show: false,
      title: 'Dialog title',
      message: 'Dialog message',
      color: 'primary',
      icon: 'mdi-information',
      survey: null,
    });

    const createDialog = (title, message, color = "primary", icon, survey) => {
      dialog.value.title = title;
      dialog.value.message = message;
      dialog.value.color = color;
      dialog.value.icon = icon;
      dialog.value.survey = survey;
      dialog.value.show = true;

    };

    const closeDialog = () => {
      // console.log('Dialog closed');
      dialog.value.show = false;
      emit('close'); // Emitindo um evento chamado 'close'
    };

    return {
      dialog,
      createDialog,
      closeDialog,
    };
  },
  methods: {
  },
};
</script>
