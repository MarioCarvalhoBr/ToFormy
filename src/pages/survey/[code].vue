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

    <my-snackbar-component ref="mySnackbar"></my-snackbar-component>
    <my-alert-component ref="myAlert"></my-alert-component>
    <my-dialog-component ref="myDialogDelete" @confirm="confirmDialogDelete" @close="closeDialogDelete"></my-dialog-component>
    <my-dialog-survey-component ref="myDialogSurvey" @close="closeDialogSurvey"></my-dialog-survey-component>

    <br>
    <v-row>
      <v-col v-for="form in forms" :key="form.id" cols="12" md="6" lg="3">
        <v-card class="elevation-8" color="primary" dark>
          <v-card-title>{{ form.data.first_name }} {{ form.data.last_name }}</v-card-title>
          <v-card-text>{{ form.data.street_address }}, {{ form.data.city }}, {{ form.data.state }}, {{ form.data.zip }}, {{ form.data.country
            }}</v-card-text>
          <div class="">
            <v-card-subtitle> Updated: {{ new Date(form.changed).toLocaleDateString("pt-BR") }}</v-card-subtitle>
            <v-card-subtitle> Created: {{ new Date(form.created).toLocaleDateString("pt-BR") }}</v-card-subtitle>
          </div>
          <br>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-row justify="center">
              <v-btn size="small" class="ma-2" color="blue-darken-4" icon="mdi-eye"
                @click="openDialogViewForm(form)"></v-btn>
              <v-btn size="small" class="ma-2" color="orange-darken-2" icon="mdi-pencil"
                @click="openDialogEditForm(form)"></v-btn>
              <v-btn size="small" class="ma-2" color="red-darken-2" icon="mdi-delete"
                @click="openDialogDeleteForm(form)"></v-btn>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>
  </div>

</template>

<script setup>
// Imports de bibliotecas externas
import { ref, onMounted, defineComponent, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';

import { v4 as uuid } from 'uuid';
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';


// Imports relativos (de outros arquivos do projeto)
import { db } from '../../db';
import surveyJsonRead from '../../survey.json';

// Lógica de inicialização e atribuições
const router = useRouter();
const route = useRoute();
const surveyJson = surveyJsonRead;

const onCompleteSurveyResults = (sender) => {
  console.log('onCompleteSurveyResults:', JSON.stringify(sender.data, null, 3));
  createOrUpdateFormDB(sender.data);
  // Reload forms
  loadFormsDB();
}

// Setup SurveyJS
const survey = new Model(surveyJson);
survey.onComplete.add(onCompleteSurveyResults);

// Components
import MySnackbarComponent from '../../components/MySnackbarComponent.vue';
import MyAlertComponent from '../../components/MyAlertComponent.vue';
import MyDialogComponent from '@/components/MyDialogComponent.vue';
import MyDialogSurveyComponent from '@/components/MyDialogSurveyComponent.vue';


// Uso de componente
const mySnackbar = ref(defineComponent(MySnackbarComponent));
const myAlert = ref(defineComponent(MyAlertComponent));
const myDialogDelete = ref(defineComponent(MyDialogComponent));
const myDialogSurvey = ref(defineComponent(MyDialogSurveyComponent));

// VARS
const is_edit = ref(false)
const survey_code = ref(route.params.code);

// Arrays
let forms = ref([])
const form_to_edit = ref(null)
const form_to_delete = ref(null)

// DELETE: Functions and methods to utilize the dialog component
const openDialogDeleteForm = (form) => {
  console.log('openDialogDeleteForm to form:', JSON.stringify(form, null, 3));
  form_to_delete.value = form;
  myDialogDelete.value.createDialog('Delete form', `Are you sure you want to delete the form '${form.name}'? This action cannot be undone.`, 'error', 'mdi-delete', { confirm: 'Delete', cancel: 'Close' }, { confirm: 'red', cancel: 'black' });
}
const closeDialogDelete = () => {
  console.log('Closed from MyDialogComponent');
};
const confirmDialogDelete = () => {
  console.log('Confirmed from MyDialogComponent');
  deleteFormDB();
  loadFormsDB();
};

// SURVEY: Functions and methods to utilize the dialog component
const openDialogAddForm = () => {
  // Clear the survey
  survey.clear();
  survey.mode = 'edit';
  survey.showProgressBar = 'bottom';
  // Edit mode
  is_edit.value = false

  myDialogSurvey.value.createDialog('New form', 'New form', 'primary', 'mdi-plus', survey);
}
const openDialogViewForm = (form) => {
  console.log('View form:', form);
  // Setup SurveyJS
  survey.data = form.data;
  survey.showProgressBar = 'none';
  survey.mode = 'display';
  // View mode
  is_edit.value = false

  myDialogSurvey.value.createDialog('View form', 'View form', 'primary', 'mdi-eye', survey);
}
const openDialogEditForm = (form) => {
  console.log('openDialogEditForm to form:', JSON.stringify(form, null, 3));

  // Edit mode
  is_edit.value = true
  form_to_edit.value = form;

  // Setup SurveyJS
  survey.clear();
  survey.data = form.data;
  survey.mode = 'edit';
  survey.showProgressBar = 'bottom';

  // Create the dialog
  myDialogSurvey.value.createDialog('Edit form', 'Edit form', 'primary', 'mdi-pencil', survey);
}
const closeDialogSurvey = () => {
  console.log('Closed from MyDialogSurveyComponent');
  // Clear the survey
  survey.clear();
};

// formDAO.js
// Create or update form in IndexedDB
const createOrUpdateFormDB = async (data) => {
  try {
    let color = 'green';
    if (is_edit.value) {
      // Update the form
      await db.form.update(form_to_edit.value.id, {
        // Data identification
        name: data.first_name + ' ' + data.last_name,

        // Data temporal
        changed: new Date(),

        // Data model
        data: data,
      });

      console.log(`Form ${data.first_name} successfully updated`);
      color = 'blue-darken-4';
    } else {
      // Add the new form:   form: '++id, survey_code, code, name, created, changed, active' + model
      const id = await db.form.add({
        // Data identification
        survey_code: survey_code.value,
        code: uuid(),
        name: data.first_name + ' ' + data.last_name,

        // Data temporal
        created: new Date(),
        changed: new Date(),
        active: 1,

        // Data model
        data: data,

      });

      console.log(`Form ${data.first_name} successfully added. Got id ${id}`);
    }
    // Show alert
    let message = `Form ${data.first_name} successfully ${is_edit.value ? 'updated' : 'added'}`;
    mySnackbar.value.createSnackbar(message, color, 3000);

  } catch (error) {
    let text = `Failed to add ${data.first_name}: ${error}`;
    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
// Delete form from IndexedDB
const deleteFormDB = async () => {
  try {
    await db.form.delete(form_to_delete.value.id);
    console.log(`Form ${form_to_delete.value.name} successfully deleted`);

    // Create snackbar
    mySnackbar.value.createSnackbar(`Form ${form_to_delete.value.name} successfully deleted`, 'red-darken-4', 3000);
  } catch (error) {
    let text = `Failed to delete ${form_to_delete.value.name}: ${error}`;
    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
// Load forms from IndexedDB
const loadFormsDB = async () => {
  try {
    // Busca todos os forms que tem o survey_code and active = true
    forms.value = await db.form.where('survey_code').equals(survey_code.value).and(form => form.active === 1).toArray();
    // ORdenar por id decrescente
    forms.value.sort((a, b) => b.id - a.id);
    console.log(`Loaded ${forms.value.length} forms`);
  } catch (error) {
    let text = `Failed to load forms: ${error}`;
    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
// Search survey by id in IndexedDB
const verifySurveyIdDB = async () => {
  console.log('verifySurveyIdDB survey_code:', survey_code.value);
  // Busca o survey pelo id
  const survey_search = await db.survey.where('code').equals(survey_code.value).toArray();
  if (survey_search.length === 0) {
    console.log('Survey not found');
    router.push('/');
  } else {
    console.log('Survey found:', survey_search[0]);
  }
}

// Lifecycle hooks
onMounted(async () => {
  console.log('onMounted');
  verifySurveyIdDB();

  loadFormsDB();

})

onUpdated(() => {
  console.log('onUpdated');
})

</script>

<style></style>
