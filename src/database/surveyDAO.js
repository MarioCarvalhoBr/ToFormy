import { v4 as uuid } from 'uuid';
import { db } from './db';

export function getByCodeSurveyDB(survey_code) {
  return db.survey.where('code').equals(survey_code).toArray();
}
// createSurveyDB
export function createSurveyDB(data) {
  let KEY_UUID = uuid();
  return db.survey.add({
    // Identification
    code: KEY_UUID,
    name: "Survey " + KEY_UUID,
    // Temporal
    created: new Date(),
    changed: new Date(),
    active: 1,
    // Model
    data: data
  });
}

export function updateSurveyDB(id, data) {
  return db.survey.update(id, {
    // Temporal
    changed: new Date(),
    // Model
    data: data
  });
}
// deleteSurveyDB
export function deleteSurveyDB(survey) {
  // Remova from database o survey com o id e também todos os forms que tem survey_code igual ao survey.code
  return db.transaction('rw', db.survey, db.form, async () => {
    await db.survey.delete(survey.id);
    await db.form.where('survey_code').equals(survey.code).delete();
  });
}

// readAllSurveysDB
export function readAllSurveysDB() {
  return db.survey.where('active').equals(1).toArray();
}

export function readAllArchivedSurveysDB() {
  return db.survey.where('active').equals(0).toArray();
}

// setActiveSurveyDB
export function setActiveSurveyDB(id) {
  return db.survey.update(id, {
    active: 1,
    changed: new Date(),
  });
}

// setInactiveSurveyDB
export function setInactiveSurveyDB(id) {
  return db.survey.update(id, {
    active: 0,
    changed: new Date(),
  });
}
