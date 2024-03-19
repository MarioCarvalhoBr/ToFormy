<template>
  <div>
    <div class="d-flex align-center">
      <h1 class="flex-grow-1">My Surveys</h1>
      <v-btn color="primary" size="small" @click="openDialogAddSurvey">New Survey</v-btn>
    </div>

    <div v-if="surveys.length === 0" class="text-center">
      <br>
      <v-divider></v-divider>
      <br>
      <h4>No surveys found</h4>
      <p>Click on the 'New Survey' button to create a new survey</p>
    </div>

    <v-row>
      <v-col v-for="survey in surveys" :key="survey.id" cols="12" md="6" lg="3">
        <v-card class="elevation-4" color="secondary" dark>
          <v-card-title>{{ survey.name }}</v-card-title>
          <v-card-text>{{ survey.description }}</v-card-text>


          <div class="">
            <v-card-subtitle> Updated: {{ new Date(survey.changed).toLocaleDateString() }}</v-card-subtitle>
            <v-card-subtitle> Created: {{ new Date(survey.created).toLocaleDateString() }}</v-card-subtitle>
          </div>

          <v-card-actions>
            <v-btn text @click="() => $router.push('/survey/' + survey.code)">View</v-btn>
            <v-btn text @click="openDialogEditSurvey(survey)">Edit</v-btn>
            <v-btn text @click="openDialogRemoveSurvey(survey)">Remove</v-btn>
          </v-card-actions>
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
              <v-text-field label="Survey name*" v-model="surveyName" :rules="nameRules"
                :error-messages="surveyNameError" required>
              </v-text-field>
            </v-col>

            <v-col cols="12">
              <v-textarea label="Survey description*" v-model="surveyDescription" :rules="descriptionRules"
                :error-messages="surveyDescriptionError" required>
              </v-textarea>
            </v-col>
          </v-row>

          <small class="text-caption text-medium-emphasis">*indicates required field</small>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
          <v-btn color="primary" text="Save" variant="tonal" @click="validateForm"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>

  <div class="pa-4 text-center">
    <v-dialog v-model="dialogMoveToTrash" max-width="600" persistent>
      <v-card
      prepend-icon="mdi-delete"
       title="Move to trash">
        <v-card-text>
          <v-row dense>
            <v-col cols="12">
              <!--<p>Are you sure you want to delete the survey '{survey_remove?.name}'?</p>-->
              <p>Are you sure you want move to trash the survey '{{ survey_remove ? survey_remove.name : '' }}'?</p>
            </v-col>
          </v-row>
        </v-card-text>
        <v-divider></v-divider>

        <v-card-actions>
          <v-spacer></v-spacer>

          <v-btn text="Close" variant="plain" @click="closeDialog"></v-btn>
          <v-btn color="error" text="Remove" variant="tonal" @click="moveSurveyToTrashDB()"></v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { v4 as uuid } from 'uuid';
import { db } from '../../db';

import { ref, onMounted } from 'vue'

const dialog = ref(false)
const dialogMoveToTrash = ref(false)
const form_title = ref('Create a new survey')
const is_edit = ref(false)
const survey_edit = ref(null)
const survey_remove = ref(null)
const surveyName = ref('')
const surveyDescription = ref('')

// Array de surveys:
let surveys = ref([])

const nameRules = [
  v => !!v || 'Survey name is required',
]
const descriptionRules = [
  v => !!v || 'Survey description is required',
]

const openDialogAddSurvey = () => {
  dialog.value = true
  form_title.value = 'Create a new survey'


}

const openDialogEditSurvey = (survey) => {
  dialog.value = true
  // Change form title
  form_title.value = 'Edit survey'
  is_edit.value = true
  survey_edit.value = survey

  surveyName.value = survey.name
  surveyDescription.value = survey.description

}

// openDialogRemoveSurvey(survey)
const openDialogRemoveSurvey = (survey) => {
  console.log('Move survey to trash', survey);
  dialogMoveToTrash.value = true;
  survey_remove.value = survey;

}

const closeDialog = () => {
  resetForm();
  dialog.value = false;
  dialogMoveToTrash.value = false;

}

const surveyNameError = ref('');
const surveyDescriptionError = ref('');

const validateForm = () => {
  let isValid = true;

  if (!surveyName.value) {
    surveyNameError.value = 'Survey name is required';
    isValid = false;
  } else {
    surveyNameError.value = '';
  }

  if (!surveyDescription.value) {
    surveyDescriptionError.value = 'Survey description is required';
    isValid = false;
  } else {
    surveyDescriptionError.value = '';
  }

  if (isValid) {
    // Prossiga com a lógica de submissão
    console.log('Form is valid');
    dialog.value = false;

    createOrUpdateSurveyDBrveyDB();
  }
}

// Reset form
const resetForm = () => {
  surveyName.value = '';
  surveyDescription.value = '';
  surveyNameError.value = '';
  surveyDescriptionError.value = '';
  is_edit.value = false;
  survey_edit.value = null;
  survey_remove.value = null;

}


const createOrUpdateSurveyDBrveyDB = async () => {
  try {
    if (is_edit.value) {
      // Update the survey
      await db.survey.update(survey_edit.value.id, {
        name: surveyName.value,
        description: surveyDescription.value,
        changed: new Date(),
      });

      console.log(`Survey ${surveyName.value} successfully updated`);
    } else {
      // Add the new survey:   survey: 'code, name, created, changed, active',
      const id = await db.survey.add({
        code: uuid(),
        name: surveyName.value,
        description: surveyDescription.value,
        created: new Date(),
        changed: new Date(),
        active: 1,
      });

      console.log(`Survey ${surveyName.value} successfully added. Got id ${id}`);
    }

    // Reset data and close dialog
    resetForm();

    closeDialog();

    // Reload surveys
    loadSurveys();
  } catch (error) {
    console.log(`Failed to add ${surveyName.value}: ${error}`);
  }
}
// Delete survey (active to false)
const moveSurveyToTrashDB = async () => {
  try {
    // SET INACTIVE
    await db.survey.update(survey_remove.value.id, {
        active: 0,
        changed: new Date(),
      });
    // DELETE: await db.survey.delete(survey_remove.value.id);
    console.log(`Survey ${survey_remove.value.name} successfully deleted`);

    // Reset data and close dialog
    resetForm();

    closeDialog();

    // Reload surveys
    loadSurveys();


  } catch (error) {
    console.log(`Failed to delete ${survey_remove.value.name}: ${error}`);
  }
}

// Método onMounted
const loadSurveys = async () => {
  try {
    // Where active is true
    surveys.value = await db.survey.where('active').equals(1).toArray();
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
