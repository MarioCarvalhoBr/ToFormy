<template>
  <div>
    <div class="d-flex align-center">
      <h1 class="flex-grow-1">My Surveys</h1>
      <v-btn color="primary" size="small" @click="openDialogAddSurvey">New Survey</v-btn>
    </div>

    <!-- My Components -->
    <my-alert-component ref="myAlert"></my-alert-component>

    <v-row>
      <v-col v-for="survey in surveys" :key="survey.id" cols="12" md="6" lg="3">
        <v-card class="elevation-8" color="indigo-darken-4" dark>
          <v-card-title>{{ survey.data.name }}</v-card-title>
          <v-card-subtitle>{{ survey.data.description }}</v-card-subtitle>
          <v-card-text>{{ survey.data.city }}, {{ survey.data.state }}, {{ survey.data.country}}</v-card-text>
          <div class="">
            <v-card-subtitle> Updated: {{ new Date(survey.changed).toLocaleDateString("pt-BR") }}</v-card-subtitle>
            <v-card-subtitle> Created: {{ new Date(survey.created).toLocaleDateString("pt-BR") }}</v-card-subtitle>
          </div>
          <br>
          <v-divider></v-divider>
          <v-col cols="12">
            <v-row justify="center">
              <v-btn size="small" class="ma-2" color="blue-darken-4" icon="mdi-eye"
              @click="() => $router.push('/survey/' + survey.code)"></v-btn>
              <v-btn size="small" class="ma-2" color="orange-darken-2" icon="mdi-pencil"
                @click="openDialogEditSurvey(survey)"></v-btn>
              <v-btn size="small" class="ma-2" color="grey" icon="mdi-archive"
                @click="openDialogArchiveSurvey(survey)"></v-btn>
              <v-btn size="small" class="ma-2" color="red-darken-2" icon="mdi-delete"
                @click="openDialogDeleteSurvey(survey)"></v-btn>
            </v-row>
          </v-col>
        </v-card>
      </v-col>
    </v-row>

    <!-- My Components -->
    <my-snackbar-component ref="mySnackbar"></my-snackbar-component>
    <my-dialog-component ref="myDialogDelete" @confirm="confirmDialogDelete"
      @close="closeDialogDelete"></my-dialog-component>
    <my-dialog-component ref="myDialogArchive" @confirm="confirmDialogArchive"
      @close="closeDialogArchive"></my-dialog-component>
    <my-dialog-survey-component ref="myDialogSurvey" @close="closeDialogSurvey"></my-dialog-survey-component>

  </div>

</template>

<script setup>
// Libraries
import { ref, onMounted, defineComponent, onUpdated } from 'vue';

// Extra libraries
import 'survey-core/defaultV2.min.css';
import { Model } from 'survey-core';

// Components
import MySnackbarComponent from '../../components/MySnackbarComponent.vue';
import MyAlertComponent from '../../components/MyAlertComponent.vue';
import MyDialogComponent from '@/components/MyDialogComponent.vue';
import MyDialogSurveyComponent from '@/components/MyDialogSurveyComponent.vue';

// Imports relativos (de outros arquivos do projeto)
import surveyJson from '../../model_survey_survey.json';
import { createSurveyDB, updateSurveyDB, deleteSurveyDB, readAllSurveysDB, setInactiveSurveyDB } from '../../database/surveyDAO';

// SETUP SURVEYJS
// -----------------------------------------------------------------------------
const onCompleteSurveyResults = (sender) => {
  console.log('onCompleteSurveyResults:', JSON.stringify(sender.data, null, 3));
  createOrUpdateSurvey(sender.data);
  getAllSurveys();
}
// Model SurveyJS
const surveyModel = new Model(surveyJson);
surveyModel.onComplete.add(onCompleteSurveyResults);
// -----------------------------------------------------------------------------

// VARIABLES AND ARRAYS
// -----------------------------------------------------------------------------
// Uso de componente
const mySnackbar = ref(defineComponent(MySnackbarComponent));
const myAlert = ref(defineComponent(MyAlertComponent));
const myDialogDelete = ref(defineComponent(MyDialogComponent));
const myDialogArchive = ref(defineComponent(MyDialogComponent));

const myDialogSurvey = ref(defineComponent(MyDialogSurveyComponent));

// VARS
const is_edit_survey_dialog = ref(false)

// Arrays
let surveys = ref([])
const survey_to_edit = ref(null)
const survey_to_delete = ref(null)
// -----------------------------------------------------------------------------

// DIALOG FUNCTIONS
// -----------------------------------------------------------------------------
// DELETE: Functions and methods to utilize the dialog component
const openDialogDeleteSurvey = (survey) => {
  console.log('openDialogDeleteSurvey to survey:', JSON.stringify(survey, null, 3));
  survey_to_delete.value = survey;
  myDialogDelete.value.createDialog('Delete survey', `Are you sure you want to delete this survey? This action cannot be undone.`, 'error', 'mdi-delete', { confirm: 'Delete', cancel: 'Close' }, { confirm: 'red', cancel: 'grey' });
}
const closeDialogDelete = () => {
  console.log('Closed from MyDialogComponent');
};
const confirmDialogDelete = () => {
  console.log('Confirmed from MyDialogComponent');
  deleteSurvey(survey_to_delete).then(() => {
    getAllSurveys();
  });

};
// ARCHIVE: Functions and methods to utilize the dialog component
const openDialogArchiveSurvey = (survey) => {
  console.log('openDialogArchiveSurvey to survey:', JSON.stringify(survey, null, 3));
  survey_to_delete.value = survey;
  myDialogArchive.value.createDialog('Archive survey', `Are you sure you want to archive this survey?  This action can be undone in 'Archived' menu.`, 'warning', 'mdi-archive', { confirm: 'Archive', cancel: 'Close' }, { confirm: 'orange', cancel: 'grey' });
}
const closeDialogArchive = () => {
  console.log('Closed from MyDialogComponent');
};
const confirmDialogArchive = () => {
  console.log('Confirmed from MyDialogComponent');
  moveSurveyToArchive(survey_to_delete);
  getAllSurveys();
};

// SURVEY: Functions and methods to utilize the dialog component
const openDialogAddSurvey = () => {
  // Clear the survey
  surveyModel.clear();
  surveyModel.mode = 'edit';
  // Desativar a paginação
  surveyModel.showProgressBar = 'none';
  // Edit mode
  is_edit_survey_dialog.value = false

  myDialogSurvey.value.createDialog('New survey', 'New survey', 'primary', 'mdi-plus', surveyModel);
}
/*
const openDialogViewSurvey = (survey) => {
  console.log('View survey:', survey);
  // Setup SurveyJS
  surveyModel.data = survey.data;
  surveyModel.showProgressBar = 'none';
  surveyModel.mode = 'display';
  // View mode
  is_edit_survey_dialog.value = false

  myDialogSurvey.value.createDialog('View survey', 'View survey', 'primary', 'mdi-eye', surveyModel);
}
*/
const openDialogEditSurvey = (survey) => {
  console.log('openDialogEditSurvey to survey:', JSON.stringify(survey, null, 3));

  // Edit mode
  is_edit_survey_dialog.value = true
  survey_to_edit.value = survey;

  // Setup SurveyJS
  surveyModel.clear();
  surveyModel.data = survey.data;
  surveyModel.mode = 'edit';
  surveyModel.showProgressBar = 'bottom';

  // Create the dialog
  myDialogSurvey.value.createDialog('Edit survey', 'Edit survey', 'primary', 'mdi-pencil', surveyModel);
}
const closeDialogSurvey = () => {
  console.log('Closed from MyDialogSurveyComponent');
  // Clear the survey
  surveyModel.clear();
};
// -----------------------------------------------------------------------------

// SURVEY DAO OPERATIONS
// -----------------------------------------------------------------------------
const createOrUpdateSurvey = async (data) => {
  try {
    let color = 'green';
    let idKey = 0;

    if (is_edit_survey_dialog.value) {
      // Update survey
      color = 'blue-darken-4';
      await updateSurveyDB(survey_to_edit.value.id, data);
      idKey = survey_to_edit.value.id;
    } else {
      // Create survey
      const id = await createSurveyDB(data);
      idKey = id;
    }
    let message = `Survey ${is_edit_survey_dialog.value ? 'updated' : 'created'} successfully.`;

    mySnackbar.value.createSnackbar(message, color, 3000);
    console.log(message + ` Got id ${idKey}. Survey: ${JSON.stringify(data, null, 3)}`);

  } catch (error) {
    let text = `Failed to add survey: ${error}`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
const deleteSurvey = async (survey) => {
  try {
    await deleteSurveyDB(survey.value);
    let message = `Survey deleted successfully.`;

    mySnackbar.value.createSnackbar(message, 'red-darken-4', 3000);
    console.log(message + ` Got id ${survey.value.id}. Survey: ${JSON.stringify(survey, null, 3)}`);
  } catch (error) {
    let text = `Failed to delete survey: ${error}.`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text + ` Got id ${survey.value.id}. Survey: ${JSON.stringify(survey, null, 3)}`);
  }
}
const moveSurveyToArchive = async (survey) => {
  try {
    await setInactiveSurveyDB(survey.value.id);
    let message = `Survey moved to archive successfully.`;
    mySnackbar.value.createSnackbar(message, 'orange-darken-4', 3000);
    console.log(message + ` Got id ${survey.value.id}. Survey: ${JSON.stringify(survey, null, 3)}`);
  } catch (error) {
    let text = `Failed to move to archive survey: ${error}.`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text + ` Got id ${survey.value.id}. Survey: ${JSON.stringify(survey, null, 3)}`);
  }
}
const getAllSurveys = async (survey_code) => {
  try {
    surveys.value = await readAllSurveysDB(survey_code);
    surveys.value.sort((a, b) => b.id - a.id);

    // Verifica se o surveys está vazio
    if (surveys.value.length === 0) {
      myAlert.value.createAlert('No surveys found', 'Click on the "New Survey" button to create a new survey', 'info', 'mdi-information');
    }else{
      myAlert.value.alert.show = false;
    }

    console.log(`Loaded ${surveys.value.length} surveys`);
  } catch (error) {
    let text = `Failed to load surveys: ${error}`;

    myAlert.value.createAlert('Error', text, 'error', 'mdi-alert');
    console.log(text);
  }
}
// -----------------------------------------------------------------------------

// LIFECYCLE HOOKS
// -----------------------------------------------------------------------------
onMounted(async () => {
  console.log('onMounted');
  getAllSurveys();
})
onUpdated(() => {
  console.log('onUpdated');
})
// -----------------------------------------------------------------------------

</script>

<style></style>
