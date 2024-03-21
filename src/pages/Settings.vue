<template>
  <div>
    <div class="d-flex align-center">
      <h1 class="flex-grow-1">Settings</h1>
    </div>

    <v-card class="elevation-2" outlined>
      <v-card-text>
        <v-list>

          <v-list-item>
            <v-list-item-title>Select Material Design Theme</v-list-item-title>
            <v-list-item-subtitle>
              <v-select v-model="settings.blueprint.selected" :items="settings.blueprint.items"
                label="Select Material Design Theme"></v-select>
            </v-list-item-subtitle>
          </v-list-item>

          <v-list-item>
            <v-list-item-title>Set Dark Mode Theme</v-list-item-title>
            <v-list-item-subtitle>
              <v-switch v-model="settings.darkmode" label="Dark mode"></v-switch>
            </v-list-item-subtitle>
          </v-list-item>

          <v-btn @click="saveSettings()" color="primary" dark large outlined>
            Save Settings
          </v-btn>

        </v-list>
      </v-card-text>
    </v-card>
  </div>

</template>


<script setup>
// ref
import { ref } from 'vue'
import { useTheme } from 'vuetify'

// VARS
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

// METHODS
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
