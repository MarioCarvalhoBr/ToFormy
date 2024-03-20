<template>
  <div class="pa-4 text-center">
    <v-dialog v-model="dialog.show" max-width="600" persistent>
      <v-card :prepend-icon="dialog.icon" :title="dialog.title">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p>{{ dialog.message }} </p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn :text="dialog.buttons.cancel" class="text-white flex-grow-1 text-none" :color="dialog.color_buttons.cancel" rounded="0" variant="flat"
            @click="closeDialog()">
          </v-btn>

          <v-btn :text="dialog.buttons.confirm" class="text-white flex-grow-1 text-none" :color="dialog.color_buttons.confirm" rounded="0" variant="flat"
            @click="confirmDialog()">
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
  name: 'MyDialogComponent',
  setup(props, { emit }) {
    const dialog = ref({
      show: false,
      title: 'Dialog title',
      message: 'Dialog message',
      color: 'primary',
      icon: 'mdi-information',
      buttons: {
        confirm: 'OK',
        cancel: 'Close',
      },
      color_buttons: {
        confirm: 'grey-darken-4',
        cancel: 'grey',
      },
    });

    const createDialog = (title, message, color, icon, buttons = { confirm: 'OK', cancel: 'Close' }, color_buttons = { confirm: 'grey-darken-4', cancel: 'grey' }) => {
      dialog.value.title = title;
      dialog.value.message = message;
      dialog.value.color = color;
      dialog.value.icon = icon;
      dialog.value.show = true;
      dialog.value.buttons = buttons;
      dialog.value.color_buttons = color_buttons;
    };

    const closeDialog = () => {
      // console.log('Dialog closed');
      dialog.value.show = false;
      emit('close'); // Emitindo um evento chamado 'close'
    };

    const confirmDialog = () => {
      // console.log('Dialog confirmed');
      dialog.value.show = false;
      emit('confirm'); // Emitindo um evento chamado 'confirm'

    };

    return {
      dialog,
      createDialog,
      closeDialog,
      confirmDialog,
    };
  },
  methods: {
  },
};
</script>
