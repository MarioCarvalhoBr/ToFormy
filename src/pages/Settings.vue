<template>
  <v-container class="pa-1">
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12">
        <v-card class="elevation-12" outlined>
          <v-card-title class="justify-center">Settings</v-card-title>
          <v-card-text>
            <v-list>


              <v-list-item>
                <v-list-item-title>Select Material Design Theme</v-list-item-title>
                <v-list-item-subtitle>
                  <v-select
                    v-model="settings.blueprint.selected"
                    :items="settings.blueprint.items"
                    label="Select Material Design Theme"
                  ></v-select>
                </v-list-item-subtitle>
              </v-list-item>

              <v-list-item>
                <v-list-item-title>Set Dark Mode Theme</v-list-item-title>
                <v-list-item-subtitle>
                  <v-switch
                    v-model="settings.darkmode"
                    label="Dark mode"
                  ></v-switch>
                </v-list-item-subtitle>
              </v-list-item>

              <v-btn
                @click="saveSettings()"
                color="primary"
                dark
                large
                outlined
              >
                Save Settings
              </v-btn>


            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>


<script setup>
// ref
import { ref } from 'vue'
import { useTheme } from 'vuetify'




const theme = useTheme()

const settings = ref({
  darkmode: ref(localStorage.getItem('theme') === 'dark' || false),
  blueprint: {
    items: [
      "md1",
      "md2",
      "md3"
    ],
    selected: ref(localStorage.getItem('blueprint') || "md1")
  }
})

// Methods
const saveSettings = () => {
  // Save blueprint theme settings
  console.log("Save blueprint theme settings")
  localStorage.setItem('blueprint', settings.value.blueprint.selected)

  // Save dark mode settings
  console.log("Save dark mode settings")
  // if
  if (settings.value.darkmode === true) {
    theme.global.name.value = 'dark'
    localStorage.setItem('theme', 'dark')
  } else {
    theme.global.name.value = 'light'
    localStorage.setItem('theme', 'light')
  }

  // Reload the page
  location.reload()
}

</script>

<style scoped></style>
