<template>
  <v-container class="pa-1">
    <v-row justify="center">
      <v-col cols="12" sm="12" md="12">
        <v-card class="elevation-12" outlined>
          <v-card-title class="justify-center">Sobre o <strong>{{ appName }}</strong></v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title><strong>{{ appName }}</strong></v-list-item-title>
                 <p>
                  {{ appDescription }}
                  </p>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Versão</v-list-item-title>
                  <v-list-item-subtitle>{{ version }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Autor</v-list-item-title>
                  <v-list-item-subtitle>{{ author }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Email de Contato</v-list-item-title>
                  <v-list-item-subtitle>{{ email }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Licença</v-list-item-title>
                  <v-list-item-subtitle>{{ license }}</v-list-item-subtitle>
                </v-list-item-content>
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
      appDescription: 'O aplicativo ToFormy é uma solução inovadora e robusta, projetada para atender às necessidades de coleta e gerenciamento de dados em diversos contextos. Ideal para organizações, pesquisadores e profissionais que necessitam de uma ferramenta eficaz para coletar informações, ToFormy oferece uma plataforma intuitiva e flexível, permitindo a criação de formulários personalizados adaptados a qualquer necessidade específica de coleta de dados.',
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
