import { v4 as uuid } from 'uuid';
import { db } from './db';

export function getByCodeSurveyDB(survey_code) {
  return db.survey.where('code').equals(survey_code).toArray();
}
// createSurveyDB
export function createSurveyDB(data) {
  return db.survey.add({
    // Identification
    code: uuid(),
    name: data.name,
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
    // Identification
    name: data.name,
    // Temporal
    changed: new Date(),
    // Model
    data: data
  });
}
// deleteSurveyDB
export function deleteSurveyDB(id) {
  return db.survey.delete(id);
}
// readAllSurveysDB
export function readAllSurveysDB() {
  return db.survey.where('active').equals(1).toArray();
}
