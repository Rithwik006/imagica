const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');

// Ensure database directory exists
const dbPath = path.resolve(__dirname, 'database.sqlite');
const db = new Database(dbPath);

// Initialize Database Schema
const initDb = () => {
  // Create users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT,
      google_id TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS images (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      original_url TEXT,
      processed_url TEXT,
      processing_type TEXT,
      is_public INTEGER DEFAULT 0,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Safely add columns to existing databases
  try { db.exec(`ALTER TABLE images ADD COLUMN user_id INTEGER`); } catch (e) { }
  try { db.exec(`ALTER TABLE images ADD COLUMN original_url TEXT`); } catch (e) { }
  try { db.exec(`ALTER TABLE images ADD COLUMN processed_url TEXT`); } catch (e) { }
  try { db.exec(`ALTER TABLE images ADD COLUMN processing_type TEXT`); } catch (e) { }
  try { db.exec(`ALTER TABLE images ADD COLUMN is_public INTEGER DEFAULT 0`); } catch (e) { }

  try { db.exec(`ALTER TABLE users ADD COLUMN name TEXT`); } catch (e) { }
  try { db.exec(`ALTER TABLE users ADD COLUMN username TEXT`); } catch (e) { }

  console.log('Database initialized successfully');
};

initDb();

module.exports = db;
