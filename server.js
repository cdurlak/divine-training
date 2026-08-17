import express from 'express';
import sqlite3 from 'sqlite3';
import bcryptjs from 'bcryptjs';
import cors from 'cors';
import bodyParser from 'body-parser';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const db = new sqlite3.Database('./divine.db');

const dbRun = (sql, params = []) => new Promise((resolve, reject) => {
  db.run(sql, params, function(err) { if (err) reject(err); else resolve(this); });
});

const dbGet = (sql, params = []) => new Promise((resolve, reject) => {
  db.get(sql, params, (err, row) => { if (err) reject(err); else resolve(row); });
});

const dbAll = (sql, params = []) => new Promise((resolve, reject) => {
  db.all(sql, params, (err, rows) => { if (err) reject(err); else resolve(rows || []); });
});

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT UNIQUE, password TEXT, role TEXT, name TEXT, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)`);
  db.run(`CREATE TABLE IF NOT EXISTS workouts (id INTEGER PRIMARY KEY, name TEXT, trainer_id INTEGER, created_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(trainer_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS exercises (id INTEGER PRIMARY KEY, workout_id INTEGER, name TEXT, target_sets INTEGER, target_reps_min INTEGER, target_reps_max INTEGER, notes TEXT, exercise_order INTEGER, FOREIGN KEY(workout_id) REFERENCES workouts(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS logged_sets (id INTEGER PRIMARY KEY, exercise_id INTEGER, client_id INTEGER, workout_date DATE, weight_used REAL, reps_completed INTEGER, notes TEXT, logged_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(exercise_id) REFERENCES exercises(id), FOREIGN KEY(client_id) REFERENCES users(id))`);
  db.run(`CREATE TABLE IF NOT EXISTS client_weights (id INTEGER PRIMARY KEY, client_id INTEGER, weight_date DATE, weight_value REAL, notes TEXT, logged_at DATETIME DEFAULT CURRENT_TIMESTAMP, FOREIGN KEY(client_id) REFERENCES users(id))`);
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, role } = req.body;
    const hash = await bcryptjs.hash(password, 10);
    const result = await dbRun('INSERT INTO users (email, password, name, role) VALUES (?, ?, ?, ?)', [email, hash, name, role]);
    res.json({ success: true, userId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await dbGet('SELECT * FROM users WHERE email = ?', [email]);
    if (!user) return res.status(401).json({ error: 'Invalid email or password' });
    const isValid = await bcryptjs.compare(password, user.password);
    if (!isValid) return res.status(401).json({ error: 'Invalid email or password' });
    res.json({ success: true, user: { id: user.id, email: user.email, role: user.role, name: user.name } });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/workouts/:trainerId', async (req, res) => {
  try {
    const workouts = await dbAll('SELECT * FROM workouts WHERE trainer_id = ?', [req.params.trainerId]);
    res.json(workouts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/workouts', async (req, res) => {
  try {
    const { name, trainerId } = req.body;
    const result = await dbRun('INSERT INTO workouts (name, trainer_id) VALUES (?, ?)', [name, trainerId]);
    res.json({ success: true, workoutId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/exercises/:workoutId', async (req, res) => {
  try {
    const exercises = await dbAll('SELECT * FROM exercises WHERE workout_id = ? ORDER BY exercise_order', [req.params.workoutId]);
    res.json(exercises);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/exercises', async (req, res) => {
  try {
    const { workoutId, name, targetSets, targetRepsMin, targetRepsMax, notes, exerciseOrder } = req.body;
    const result = await dbRun('INSERT INTO exercises (workout_id, name, target_sets, target_reps_min, target_reps_max, notes, exercise_order) VALUES (?, ?, ?, ?, ?, ?, ?)', [workoutId, name, targetSets, targetRepsMin, targetRepsMax, notes || '', exerciseOrder]);
    res.json({ success: true, exerciseId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.delete('/api/exercises/:exerciseId', async (req, res) => {
  try {
    await dbRun('DELETE FROM exercises WHERE id = ?', [req.params.exerciseId]);
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/logged-sets', async (req, res) => {
  try {
    const { exerciseId, clientId, workoutDate, weightUsed, repsCompleted, notes } = req.body;
    const result = await dbRun('INSERT INTO logged_sets (exercise_id, client_id, workout_date, weight_used, reps_completed, notes) VALUES (?, ?, ?, ?, ?, ?)', [exerciseId, clientId, workoutDate, weightUsed, repsCompleted, notes || '']);
    res.json({ success: true, setId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/client-history/:clientId', async (req, res) => {
  try {
    const history = await dbAll('SELECT DISTINCT workout_date FROM logged_sets WHERE client_id = ? ORDER BY workout_date DESC LIMIT 20', [req.params.clientId]);
    res.json(history);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/log-weight', async (req, res) => {
  try {
    const { clientId, weightDate, weightValue, notes } = req.body;
    const result = await dbRun('INSERT INTO client_weights (client_id, weight_date, weight_value, notes) VALUES (?, ?, ?, ?)', [clientId, weightDate, weightValue, notes || '']);
    res.json({ success: true, weightId: result.lastID });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/weights/:clientId', async (req, res) => {
  try {
    const weights = await dbAll('SELECT * FROM client_weights WHERE client_id = ? ORDER BY weight_date DESC', [req.params.clientId]);
    res.json(weights);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get('/api/client-workouts/:trainerId', async (req, res) => {
  try {
    const workouts = await dbAll('SELECT * FROM workouts WHERE trainer_id = ? ORDER BY id', [req.params.trainerId]);
    res.json(workouts);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Divine Training app running on port ${PORT}`);
});
