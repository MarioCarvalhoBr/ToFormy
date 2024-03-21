import { v4 as uuid } from 'uuid';
import { db } from './db';

export function createFormDB(survey_code, data) {
  let KEY_UUID = uuid();
  return db.form.add({
    // Identification
    survey_code: survey_code,
    code: KEY_UUID,
    name: "Form " + KEY_UUID,
    // Temporal
    created: new Date(),
    changed: new Date(),
    active: 1,
    // Model
    data: data
  });
}

export function updateFormDB(id, data) {
  return db.form.update(id, {
    // Temporal
    changed: new Date(),
    // Model
    data: data
  });
}

export function deleteFormDB(id) {
  return db.form.delete(id);
}

export function readAllFormsDB(survey_code) {
  return db.form.where('survey_code').equals(survey_code).and(form => form.active === 1).toArray();
}
