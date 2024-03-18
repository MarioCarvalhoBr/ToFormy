<template>

  <div>



    <v-form v-model="valid">
      <h1>Add form</h1>

      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field v-model="first_name" :counter="10" :rules="nameRules" label="First name" hide-details
              required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="last_name" :counter="10" :rules="nameRules" label="Last name" hide-details
              required></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" hide-details required></v-text-field>
          </v-col>
        </v-row>
        <v-col cols="12" md="4" sm="6">
          <v-btn rounded="xs" @click="addFriend" size="x-large" block>Add user</v-btn>
        </v-col>
        <p>{{ status }}</p>
      </v-container>
    </v-form>


  </div>
</template>

<script>
import { db } from '../../db';
import { v4 as uuid } from 'uuid';

// Leia o arquivo Form.js e Survey.js da pasta contracts e crie um objeto JSON com os dados
// Importando os arquivos JSON
import formData from '../../contracts/Form.json';
import surveyData from '../../contracts/Survey.json';


export default {
  data: () => ({
    survey: [],
    form: [],
    status: '',
    valid: false,
    first_name: '',
    last_name: '',
    nameRules: [
      value => {
        if (value) return true

        return 'Name is required.'
      },
      value => {
        if (value?.length <= 10) return true

        return 'Name must be less than 10 characters.'
      },
    ],
    email: '',
    emailRules: [
      value => {
        if (value) return true

        return 'E-mail is requred.'
      },
      value => {
        if (/.+@.+\..+/.test(value)) return true

        return 'E-mail must be valid.'
      },
    ],
  }),

  mounted() {
    console.log('mounted - Create.vue');
  },

  created() {
    console.log('created - Create.vue');

    // init survey
    this.survey = surveyData;
    this.form = formData;
  },

  methods: {
    async addFriend() {
      try {
        // Add the new friend:   friends: '++id, first_name, last_name, email, created, changed, active',
        const id = await db.form.add({
          code: uuid(),
          first_name: this.first_name,
          last_name: this.last_name,
          email: this.email,
          created: new Date(),
          changed: new Date(),
          active: true,
        });

        this.status = `Friend ${this.first_name} successfully added. Got id ${id}`;

        // Reset form:
        this.first_name = '';
        this.last_name = '';
        this.email = '';
      } catch (error) {
        this.status = `Failed to add ${this.friendName}: ${error}`;
      }
    },
  },
}
</script>
