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
    <my-dialog-component ref="myDialogDelete" @confirm="confirmDialogDelete"
      @close="closeDialogDelete"></my-dialog-component>
    <my-dialog-survey-component ref="myDialogSurvey" @close="closeDialogSurvey"></my-dialog-survey-component>

    <br>
    <v-row>
      <v-col v-for="form in forms" :key="form.id" cols="12" md="6" lg="3">
        <v-card class="elevation-8" color="primary" dark>
          <v-card-title>{{ form.data.first_name }} {{ form.data.last_name }}</v-card-title>
          <v-card-text>{{ form.data.street_address }}, {{ form.data.city }}, {{ form.data.state }}, {{ form.data.zip }},
            {{ form.data.country
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
// Libraries
import { ref, onMounted, defineComponent, onUpdated } from 'vue';
import { useRoute, useRouter } from 'vue-router';

// Extra libraries
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';

// Components
import MySnackbarComponent from '../../components/MySnackbarComponent.vue';
import MyAlertComponent from '../../components/MyAlertComponent.vue';
import MyDialogComponent from '@/components/MyDialogComponent.vue';
import MyDialogSurveyComponent from '@/components/MyDialogSurveyComponent.vue';

// Imports relativos (de outros arquivos do projeto)
import surveyJson from '../../survey.json';
import { createFormDB, updateFormDB, deleteFormDB, readAllFormsDB } from '../../database/formDAO';
import { getByCodeSurveyDB } from '../../database/surveyDAO';

// SETUP SURVEYJS
// -----------------------------------------------------------------------------
const onCompleteSurveyResults = (sender) => {
  console.log('onCompleteSurveyResults:', JSON.stringify(sender.data, null, 3));
  createOrUpdateForm(sender.data);
  getAllForms(survey_code_route.value);
}
// Model SurveyJS
const survey = new Model(surveyJson);
survey.onComplete.add(onCompleteSurveyResults);
// -----------------------------------------------------------------------------

// VARIABLES AND ARRAYS
// -----------------------------------------------------------------------------
// Router and route
const router = useRouter();
const route = useRoute();

// Uso de componente
const mySnackbar = ref(defineComponent(MySnackbarComponent));
const myAlert = ref(defineComponent(MyAlertComponent));
const myDialogDelete = ref(defineComponent(MyDialogComponent));
const myDialogSurvey = ref(defineComponent(MyDialogSurveyComponent));

// VARS
const is_edit_form_dialog = ref(false)
const survey_code_route = ref(route.params.code);

// Arrays
let forms = ref([])
const form_to_edit = ref(null)
const form_to_delete = ref(null)
// -----------------------------------------------------------------------------

// DIALOG FUNCTIONS
// -----------------------------------------------------------------------------
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
  deleteForm(form_to_delete);
  getAllForms(survey_code_route.value);
};
// SURVEY: Functions and methods to utilize the dialog component
const openDialogAddForm = () => {
  // Clear the survey
  survey.clear();
  survey.mode = 'edit';
  survey.showProgressBar = 'bottom';
  // Edit mode
  is_edit_form_dialog.value = false

  myDialogSurvey.value.createDialog('New form', 'New form', 'primary', 'mdi-plus', survey);
}
const openDialogViewForm = (form) => {
  console.log('View form:', form);
  // Setup SurveyJS
  survey.data = form.data;
  survey.showProgressBar = 'none';
  survey.mode = 'display';
  // View mode
  is_edit_form_dialog.value = false

  myDialogSurvey.value.createDialog('View form', 'View form', 'primary', 'mdi-eye', survey);
}
const openDialogEditForm = (form) => {
  console.log('openDialogEditForm to form:', JSON.stringify(form, null, 3));

  // Edit mode
  is_edit_form_dialog.value = true
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
// -----------------------------------------------------------------------------

// FORM DAO OPERATIONS
// -----------------------------------------------------------------------------
const createOrUpdateForm = async (data) => {
  try {
    let color = 'green';

    if (is_edit_form_dialog.value) {
      color = 'blue-darken-4';
      // Update form
      await updateFormDB(form_to_edit.value.id, data);

      console.log(`Form ${data.first_name} successfully updated`);
    } else {
      const id = await createFormDB(survey_code_route.value, data);

      console.log(`Form ${data.first_name} successfully added. Got id ${id}`);
    }
    let message = `Form ${data.first_name} successfully ${is_edit_form_dialog.value ? 'updated' : 'added'}`;
    mySnackbar.value.createSnackbar(message, color, 3000);

  } catch (error) {
    let text = `Failed to add ${data.first_name}: ${error}`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
const deleteForm = async (form) => {
  try {
    await deleteFormDB(form.value.id);

    mySnackbar.value.createSnackbar(`Form ${form.value.name} successfully deleted`, 'red-darken-4', 3000);
    console.log(`Form ${form.value.name} successfully deleted`);
  } catch (error) {
    let text = `Failed to delete ${form.value.name}: ${error}`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
const getAllForms = async (survey_code) => {
  try {
    forms.value = await readAllFormsDB(survey_code);
    forms.value.sort((a, b) => b.id - a.id);

    console.log(`Loaded ${forms.value.length} forms`);
  } catch (error) {
    let text = `Failed to load forms: ${error}`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
// -----------------------------------------------------------------------------

// SURVEY DAO OPERATIONS
// -----------------------------------------------------------------------------
const verifySurveyByCode = async (code) => {
  try {
    const survey_search = await getByCodeSurveyDB(code);

    if (survey_search.length === 0) {
      console.log('Survey not found');
      router.push('/');
    } else {
      console.log('Survey found');
    }
  } catch (error) {
    let text = `Failed to load survey: ${error}`;
    console.log(text);
    router.push('/');
  }

}
// -----------------------------------------------------------------------------

// LIFECYCLE HOOKS
// -----------------------------------------------------------------------------
onMounted(async () => {
  console.log('onMounted');
  verifySurveyByCode(survey_code_route.value);
  getAllForms(survey_code_route.value);
})
onUpdated(() => {
  console.log('onUpdated');
})
// -----------------------------------------------------------------------------

</script>

<style></style>
