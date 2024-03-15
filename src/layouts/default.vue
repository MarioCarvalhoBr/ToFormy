<template>
  <v-app id="inspire">

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>

      <v-app-bar-title>ToFormy</v-app-bar-title>
    </v-app-bar>


    <v-navigation-drawer v-model="drawer">

      <v-divider></v-divider>

      <v-list>
        <v-list-item
          v-for="[icon, text, link_url] in links"
          :key="icon"
          :prepend-icon="icon"
          :title="text"
          link
          @click="() => $router.push(link_url)"

        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-main>
      <v-container
        class="py-8 px-6"
        fluid
      >
      <router-view></router-view>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  import { ref } from 'vue'

  const cards = ['Today', 'Yesterday']
  const links = [
    // Home page
    ['mdi-home', 'Home', '/'],
    // My forms
    ['mdi-form-select', 'My Forms', '/forms'],
    // Trash
    ['mdi-delete', 'Trash', '/trash'],
    // About
    ['mdi-information', 'About', '/about'],
  ]

  const drawer = ref(null)
</script>
