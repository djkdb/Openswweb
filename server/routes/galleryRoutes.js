import express from 'express';
import { pool } from '../db.js';
import { auth, adminOnly } from '../auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, title, tag, image_url AS imageUrl, gradient, icon,
            DATE_FORMAT(taken_date, '%Y-%m-%d') AS date
     FROM gallery ORDER BY taken_date DESC, id DESC`
  );
  res.json(rows);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const { title, tag, imageUrl, gradient, icon, date } = req.body || {};
  const [r] = await pool.query(
    `INSERT INTO gallery (title, tag, image_url, gradient, icon, taken_date)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [title, tag || 'Match', imageUrl || null, gradient || null, icon || null, date || null]
  );
  res.json({ id: r.insertId });
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM gallery WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
