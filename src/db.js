// db.js
import Dexie from 'dexie';
// Nesse  projeto terei Survey e Form. Cada um terá suas próprias tabelas.
// Um survey terá várias forms. Cada form estará associada a um survey.
export const db = new Dexie('db-toformy');
db.version(3).stores({
  // Crie com created_at e updated_at
  survey: '++id, code, name, created, changed, active',
  form: '++id, survey_id, code, name, created, changed, active',
});

// Primary key and indexed props
