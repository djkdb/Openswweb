-- 출장 자동 카운팅 플래그
-- 실행: mysql -u classfc_app -p classfc < migrations/2026-06_add-appearance-counted.sql

ALTER TABLE matches
  ADD COLUMN appearance_counted BOOLEAN DEFAULT FALSE AFTER score_theirs;
