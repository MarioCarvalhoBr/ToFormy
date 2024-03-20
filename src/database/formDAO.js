import { v4 as uuid } from 'uuid';
import { db } from './db';

export function createFormDB(survey_code, data) {
  return db.form.add({
    // Identification
    survey_code: survey_code,
    code: uuid(),
    name: data.first_name + ' ' + data.last_name,
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
    // Identification
    name: data.first_name + ' ' + data.last_name,
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
