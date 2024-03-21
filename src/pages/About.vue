<template>
  <v-container class="pa-1">
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12">
        <v-card class="elevation-12" outlined>
          <v-card-title class="justify-center">About <strong>{{ appName }}</strong></v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                  <v-list-item-title><strong>{{ appName }}</strong></v-list-item-title>
                  <p>
                    {{ appDescription }}
                  </p>
              </v-list-item>

              <v-list-item>

                  <v-list-item-title>Version</v-list-item-title>
                  <v-list-item-subtitle>{{ version }}</v-list-item-subtitle>

              </v-list-item>

              <v-list-item>

                  <v-list-item-title>Author</v-list-item-title>
                  <v-list-item-subtitle><strong>{{ author }}</strong></v-list-item-subtitle>

              </v-list-item>

              <v-list-item>

                  <v-list-item-title>Contact Email</v-list-item-title>
                  <v-list-item-subtitle>
                    <a href="mailto:mariodearaujocarvalho@gmail.com?subject=ToFormy App&body=Hello Mário, I would like to talk to you about the ToFormy application.">{{ email }}</a>
                  </v-list-item-subtitle>

              </v-list-item>

              <v-list-item>

                  <v-list-item-title>License</v-list-item-title>
                  <v-list-item-subtitle><a href="https://opensource.org/licenses/MIT" target="_blank">{{ license }}</a></v-list-item-subtitle>

              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      appName: 'ToFormy',
      appDescription: 'ToFormy is an innovative and robust solution designed to meet the data collection and management needs in various contexts. Ideal for organizations, researchers, and professionals needing an effective tool to gather information, ToFormy offers an intuitive and flexible platform, allowing the creation of custom forms tailored to any specific data collection needs.',
      version: '1.0.0',
      author: 'Mário de Araújo Carvalho',
      email: 'mariodearaujocarvalho@gmail.com',
      license: 'MIT',
      repository: 'https://github.com/MarioCarvalhoBr/ToFormy',
    };
  },
};
</script>

<style scoped>
</style>
