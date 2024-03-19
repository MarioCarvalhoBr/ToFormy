<template>


  <div>
    <div class="d-flex align-center">
      <h1 class="flex-grow-1">My Trash</h1>
    </div>

    <div v-if="surveys.length === 0" class="text-center">
      <br>
      <v-divider></v-divider>
      <br>
      <h4>No surveys found in the trash</h4>
    </div>

    <v-row>
      <v-col v-for="survey in surveys" :key="survey.id" cols="12" md="6" lg="4">
        <v-card class="elevation-4" color="secondary" dark>
          <v-card-title>{{ survey.name }}</v-card-title>
          <v-card-text>{{ survey.description }}</v-card-text>


          <div class="">
            <v-card-subtitle> Updated: {{ new Date(survey.changed).toLocaleDateString() }}</v-card-subtitle>
            <v-card-subtitle> Created: {{ new Date(survey.created).toLocaleDateString() }}</v-card-subtitle>
          </div>

          <v-card-actions>
            <v-btn text @click="() => $router.push('/survey/' + survey.code)">View</v-btn>
            <v-btn text @click="openDialogRecoverySurvey(survey)">Recovery</v-btn>
            <v-btn text @click="openDialogDeleteSurvey(survey)">Delete</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="dialogDelete" max-width="600" persistent>
      <v-card prepend-icon="mdi-form-select" title="Delete survey">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <!--<p>Are you sure you want to delete the survey '{survey_delete?.name}'?</p>-->
              <p>Are you sure you want to delete the survey '{{ survey_delete ? survey_delete.name : '' }}'? <strong>This action cannot be undone.</strong></p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
          <v-btn color="error" text="Delete" variant="tonal" @click="deleteSurveyDB()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>


  <div class="pa-4 text-center">
    <v-dialog v-model="dialogRecovery" max-width="600" persistent>
      <v-card prepend-icon="mdi-form-select" title="Recovey survey">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <p>Are you sure you want to recovery the survey '{{ survey_recovery ? survey_recovery.name : '' }}'?</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
          <v-btn color="primary" text="Recovery" variant="tonal" @click="recoverySurveyDB()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { db } from '../../db';

import { ref, onMounted } from 'vue'

const dialogDelete = ref(false)
const dialogRecovery = ref(false)
const survey_recovery = ref(null)
const survey_delete = ref(null)

// Array de surveys:
let surveys = ref([])


const openDialogRecoverySurvey = (survey) => {
  console.log('Recovery survey', survey);
  dialogRecovery.value = true;
  survey_recovery.value = survey;

}

// openDialogDeleteSurvey(survey)
const openDialogDeleteSurvey = (survey) => {

  console.log('Delete survey', survey);
  survey_recovery.value = survey;
  dialogDelete.value = true;
  survey_delete.value = survey;

}

const closeDialog = () => {
  resetForm();
  dialogRecovery.value = false;
  dialogDelete.value = false;

}

const surveyNameError = ref('');
const surveyDescriptionError = ref('');


// Reset form
const resetForm = () => {
  surveyNameError.value = '';
  surveyDescriptionError.value = '';
  survey_delete.value = null;

}

// Delete survey (active to false)
const deleteSurveyDB = async () => {
  try {
    // DELETE:
    await db.survey.delete(survey_delete.value.id);
    //console.log(`Survey ${survey_delete.value.name} successfully deleted`);

    // Delete all form that survey_code == survey_delete.value.code
    await db.form.where('survey_code').equals(survey_delete.value.code).delete();

    // Reset data and close dialog
    resetForm();

    closeDialog();

    // Reload surveys
    loadSurveys();


  } catch (error) {
    console.log(`Failed to delete ${survey_delete.value.name}: ${error}`);
  }
}

// recoverySurveyDB
const recoverySurveyDB = async () => {
  console.log('Recovery survey in DB', survey_recovery.value);
  try {
    // SET ACTIVE
    await db.survey.update(survey_recovery.value.id, {
      active: 1,
      changed: new Date(),
    });

    console.log(`Survey ${survey_recovery.value.name} successfully recovery`);

    // Reset data and close dialog
    resetForm();

    closeDialog();

    // Reload surveys
    loadSurveys();
  } catch (error) {
    console.log(`Failed to recovery ${survey_recovery.value.name}: ${error}`);
  }
}

// Método onMounted
const loadSurveys = async () => {
  try {
    // Where active is true
    surveys.value = await db.survey.where('active').equals(0).toArray();
    // ERRO:  DataError: Failed to execute 'bound' on 'IDBKeyRange': The parameter is not a valid key.
    console.log(`Loaded ${surveys.value.length} surveys`);
  } catch (error) {
    console.log(`Failed to load surveys: ${error}`);
  }
}

// lifecycle hooks
onMounted(() => {
  // Carregar os surveys
  loadSurveys();
})
</script>

<style></style>
