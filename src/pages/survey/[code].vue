<template>
  <div>
    <div class="d-flex align-center">
      <h1 class="flex-grow-1">My Forms</h1>
      <v-btn color="primary" size="small" @click="openDialogAddForm">New Form</v-btn>
    </div>

    <div v-if="forms.length === 0" class="text-center">
      <br>
      <v-divider></v-divider>
      <br>
      <h4>No forms found</h4>
      <p>Click on the 'New Form' button to create a new form</p>
    </div>

    <div class="text-center">
      <v-snackbar v-model="snackbar.show" :timeout="snackbar.timeout" :color="snackbar.color"
        :elevation="snackbar.elevation">
        {{ snackbar.text }}

        <template v-slot:actions>
          <v-btn color="white" variant="text" @click="snackbar.show = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </template>
      </v-snackbar>
    </div>

    <v-alert v-if="alert.show" closable :type="alert.type" dismissible transition="scale-transition" :icon="alert.icon">
      <strong>{{ alert.title }}</strong>
      <br>{{ alert.message }}
    </v-alert>
    <br>
    <v-row>
      <v-col v-for="form in forms" :key="form.id" cols="12" md="6" lg="3">
        <v-card class="elevation-8" color="primary" dark>
          <v-card-title>{{ form.first_name }} {{ form.last_name }}</v-card-title>
          <v-card-text>{{ form.street_address }}, {{ form.city }}, {{ form.state }}, {{ form.zip }}, {{ form.country
            }}</v-card-text>


          <div class="">
            <v-card-subtitle> Updated: {{ new Date(form.changed).toLocaleDateString("pt-BR") }}</v-card-subtitle>
            <v-card-subtitle> Created: {{ new Date(form.created).toLocaleDateString("pt-BR") }}</v-card-subtitle>

          </div>

          <br>

          <v-divider></v-divider>


          <v-col cols="12">
            <v-row justify="center">
              <v-btn size="small" class="ma-2" color="blue-darken-4" icon="mdi-eye" @click="() => $router.push('/form/' + form.code)"></v-btn>
              <v-btn size="small" class="ma-2" color="orange-darken-2" icon="mdi-pencil" @click="openDialogEditForm(form)"></v-btn>
              <v-btn size="small" class="ma-2" color="red-darken-2" icon="mdi-delete" @click="openDialogDeleteForm(form)"></v-btn>
            </v-row>
          </v-col>



        </v-card>
      </v-col>
    </v-row>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="dialog" max-width="600" persistent>
      <v-card prepend-icon="mdi-form-select" :title="form_title">
        <v-card-text>
          <v-row dense>

            <v-col cols="12">
              <SurveyComponent :model="survey" />
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="dialogDelete" max-width="600" persistent>
      <v-card prepend-icon="mdi-form-select" title="Delete form">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <!--<p>Are you sure you want to delete the form '{form_delete?.name}'?</p>-->
              <p>Are you sure you want to delete the form '{{ form_delete ? form_delete.first_name : '' }}'? <strong>This action cannot be undone.</strong></p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
          <v-btn color="error" text="Delete" variant="tonal" @click="deleteFormDB()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';

import { v4 as uuid } from 'uuid';
import { db } from '../../db';

import { useRoute, useRouter } from 'vue-router';
const router = useRouter();
const route = useRoute();

const surveyJson = {
  "locale": "en",
  "completedHtml": {
    "default": '<h5>Thank you for completing the form!</h5>'
  },
  "pages": [
    {
      "name": "info",
      "elements": [
        {
          "defaultValue": "John",
          "type": "text",
          "name": "first_name",
          "title": "What is your first name?",
          "isRequired": true
        },
        {
          "defaultValue": "Doe",
          "type": "text",
          "name": "last_name",
          "title": "What is your last name?",
          "isRequired": true
        },
        {
          "defaultValue": "25-34",
          "type": "dropdown",
          "name": "age_range",
          "title": "Select your age range",
          "isRequired": true,
          "choices": ["18-24", "25-34", "35-44", "45-54", "55-64", "65+"]
        }
      ],
      "title": "Info"
    },
    {
      "name": "address",
      "elements": [
        {
          "defaultValue": "123 Main St",
          "type": "text",
          "name": "street_address",
          "title": "What is your street address?",
          "isRequired": true
        },
        {
          "defaultValue": "Anytown",
          "type": "text",
          "name": "city",
          "title": "What city do you live in?",
          "isRequired": true
        },
        {
          "defaultValue": "State 1",
          "type": "dropdown",
          "name": "state",
          "title": "Select your state",
          "isRequired": true,
          "choices": ["State 1", "State 2", "State 3", "State 4", "State 5"] // Replace with actual state names
        },
        {
          "defaultValue": "12345",
          "type": "text",
          "name": "zip",
          "title": "What is your zip code?",
          "isRequired": true
        },
        {
          "defaultValue": "Country 1",
          "type": "dropdown",
          "name": "country",
          "title": "Select your country",
          "isRequired": true,
          "choices": ["Country 1", "Country 2", "Country 3", "Country 4", "Country 5"] // Replace with actual country names
        }
      ],
      "title": "Address"
    },
    {
      "name": "contact",
      "elements": [
        {
          "defaultValue": "john@doe.com",
          "type": "text",
          "name": "email",
          "title": "What is your email address?",
          "isRequired": true,
          "validators": [
            {
              "type": "email"
            }
          ]
        },
        {
          "defaultValue": "123-456-7890",
          "type": "text",
          "name": "phone",
          "title": "What is your phone number?",
          "isRequired": true,
          "inputType": "tel"
        }
      ],
      "title": "Contact"
    }
  ],
  "showPageNumbers": true,
  "showQuestionNumbers": "on",
  "showProgressBar": "bottom",
  "progressBarType": "pages",
  "mode": "edit"
};

const onCompleteSurveyResults = (sender) => {
  const results = JSON.stringify(sender.data);
  console.log('Survey results:', results);
  createOrUpdateFormDB(results);
}

const survey = new Model(surveyJson);
survey.onComplete.add(onCompleteSurveyResults);

const dialog = ref(false)
const dialogDelete = ref(false)
const form_title = ref('Create a new form')
const is_edit = ref(false)
const form_edit = ref(null)
const form_delete = ref(null)
const formName = ref('')
const formDescription = ref('')
const survey_code = ref(route.params.code);

const alert = ref({
  show: false,
  message: '',
  type: 'success',
  title: 'Alert title',
  icon: 'mdi-check-circle'
})

const snackbar = ref({
  show: false,
  text: 'Text snackbar',
  color: 'success',
  timeout: 3000,
  elevation: 24
})

// Arrays
let forms = ref([])

const openDialogAddForm = () => {
  dialog.value = true
  form_title.value = 'Create a new form'
}

const openDialogEditForm = (form) => {
  dialog.value = true
  // Change form title
  form_title.value = 'Edit form'
  is_edit.value = true
  form_edit.value = form

  formName.value = form.name
  formDescription.value = form.description

}

// openDialogDeleteForm(form)
const openDialogDeleteForm = (form) => {
  console.log('Delete form: ', form);
  dialogDelete.value = true;
  form_delete.value = form;

}

const closeDialog = () => {

  // Resetar o survey
  survey.clear();

  dialog.value = false;
  dialogDelete.value = false;

  loadForms();
}

const createOrUpdateFormDB = async (data) => {
  // Convert string to JSON
  data = JSON.parse(data);
  /*
  Model:
  {
    "id": 0,
    "survey_code": 0,
    "code": 0,
    "name": "Form",

    "first_name": "John",
    "last_name": "Doe",
    "age_range": 0,

    "street_address": "123 Main St",
    "city": "Anytown",
    "state": "CA",
    "zip": "12345",
    "country": "USA",

    "email": "",
    "phone": "123-456-7890",

    "created": "2017-01-01",
    "changed": "2017-01-01",
    "active": true
  }
  */
  try {
    if (is_edit.value) {
      // Update the form
      await db.form.update(form_edit.value.id, {

        name: data.first_name + ' ' + data.last_name,

        first_name: data.first_name,
        last_name: data.last_name,
        age_range: data.age_range,

        street_address: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,

        email: data.email,
        phone: data.phone,

        changed: new Date(),
      });

      console.log(`Form ${formName.value} successfully updated`);
    } else {
      // Add the new form:   form: '++id, survey_code, code, name, created, changed, active' + model
      const id = await db.form.add({
        survey_code: survey_code.value,
        code: uuid(),
        name: data.first_name + ' ' + data.last_name,

        first_name: data.first_name,
        last_name: data.last_name,
        age_range: data.age_range,

        street_address: data.street_address,
        city: data.city,
        state: data.state,
        zip: data.zip,
        country: data.country,

        email: data.email,
        phone: data.phone,

        created: new Date(),
        changed: new Date(),
        active: 1,
      });

      console.log(`Form ${formName.value} successfully added. Got id ${id}`);
    }

    // Show alert
    let message = `Form ${formName.value} successfully ${is_edit.value ? 'updated' : 'added'}`;
    createSnackbar(message, 'green', 3000);

    // Reload forms
    loadForms();
  } catch (error) {
    let text = `Failed to add ${formName.value}: ${error}`;
    createAlert(text, 'error', 'Error', 'mdi-alert');
    console.log(text);
  }
}
// createAlert
const createAlert = (message, type, title, icon = 'mdi-alert') => {
  alert.value.message = message;
  alert.value.type = type;
  alert.value.title = title;
  alert.value.icon = icon;
  alert.value.show = true;

  setTimeout(() => {
    alert.value.show = false;
  }, 5000);
}

//createSnackbar
const createSnackbar = (text, color = 'green', timeout = 3000) => {
  snackbar.value.text = text;
  snackbar.value.color = color;
  snackbar.value.timeout = timeout;
  snackbar.value.show = true;
}
// Delete form
const deleteFormDB = async () => {
  try {
    await db.form.delete(form_delete.value.id);
    console.log(`Form ${form_delete.value.name} successfully deleted`);

    // Create snackbar
    createSnackbar(`Form ${form_delete.value.name} successfully deleted`, 'red', 3000);

  } catch (error) {
    let text = `Failed to delete ${form_delete.value.name}: ${error}`;
    createAlert(text, 'error', 'Error', 'mdi-alert');
    console.log(text);
  }

  closeDialog();
}

// Método onMounted
const loadForms = async () => {
  try {
    // Busca todos os forms que tem o survey_code and active = true
    forms.value = await db.form.where('survey_code').equals(survey_code.value).and(form => form.active === 1).toArray();
    console.log(`Loaded ${forms.value.length} forms`);
    console.log('Forms:', forms.value[0]);
  } catch (error) {
    console.log(`Failed to load forms: ${error}`);
  }
}

// Function verify if survey_code exists in IndexedDB
const verifySurveyId = async () => {
  console.log('Survey id:', survey_code.value);
  // Busca o survey pelo id
  const survey_search = await db.survey.where('code').equals(survey_code.value).toArray();
  if (survey_search.length === 0) {
    console.log('Survey not found');
    router.push('/');
  } else {
    console.log('Survey found:', survey_search[0]);
    loadForms();
  }
}

// lifecycle hooks
onMounted(async () => {
  console.log('onMounted');
  verifySurveyId();

})

</script>

<style></style>
