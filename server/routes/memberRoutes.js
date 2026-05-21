import express from 'express';
import { pool } from '../db.js';
import { auth, adminOnly } from '../auth.js';

const router = express.Router();

router.get('/', async (req, res) => {
  const [members] = await pool.query(
    `SELECT id, number, name, name_en AS nameEn, position, role, year,
            goals, assists, matches_played AS matches, bio
     FROM members ORDER BY number`
  );

  const [motmRows] = await pool.query(
    `SELECT voted_member_id, match_id, COUNT(*) AS votes
     FROM motm_votes GROUP BY voted_member_id, match_id`
  );

  const motmByMatch = {};
  for (const r of motmRows) {
    if (!motmByMatch[r.match_id]) motmByMatch[r.match_id] = { winner: null, max: 0 };
    if (r.votes > motmByMatch[r.match_id].max) {
      motmByMatch[r.match_id] = { winner: r.voted_member_id, max: r.votes };
    }
  }
  const motmCounts = {};
  for (const mid in motmByMatch) {
    const w = motmByMatch[mid].winner;
    motmCounts[w] = (motmCounts[w] || 0) + 1;
  }

  const enriched = members.map(m => ({ ...m, motm: motmCounts[m.id] || 0 }));
  res.json(enriched);
});

router.get('/:id', async (req, res) => {
  const [rows] = await pool.query(
    `SELECT id, number, name, name_en AS nameEn, position, role, year,
            goals, assists, matches_played AS matches, bio
     FROM members WHERE id = ?`, [req.params.id]
  );
  if (rows.length === 0) return res.status(404).json({ error: 'not found' });
  res.json(rows[0]);
});

router.post('/', auth, adminOnly, async (req, res) => {
  const { number, name, nameEn, position, role, year, bio } = req.body || {};
  const [r] = await pool.query(
    `INSERT INTO members (number, name, name_en, position, role, year, bio)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [number, name, nameEn || null, position, role || 'Member', year || null, bio || null]
  );
  res.json({ id: r.insertId });
});

router.put('/:id', auth, adminOnly, async (req, res) => {
  const fields = ['number', 'name', 'name_en', 'position', 'role', 'year', 'goals', 'assists', 'matches_played', 'bio'];
  const body = req.body || {};
  const map = { name_en: 'nameEn', matches_played: 'matches' };
  const sets = [], values = [];
  for (const f of fields) {
    const key = map[f] || f;
    if (body[key] !== undefined) { sets.push(`${f} = ?`); values.push(body[key]); }
  }
  if (sets.length === 0) return res.status(400).json({ error: 'nothing to update' });
  values.push(req.params.id);
  await pool.query(`UPDATE members SET ${sets.join(', ')} WHERE id = ?`, values);
  res.json({ ok: true });
});

router.delete('/:id', auth, adminOnly, async (req, res) => {
  await pool.query('DELETE FROM members WHERE id = ?', [req.params.id]);
  res.json({ ok: true });
});

export default router;
