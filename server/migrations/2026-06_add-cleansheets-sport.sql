-- 기존 DB 에 새 컬럼 추가 (이미 schema.sql 로 새로 만들었으면 실행 X)
-- 실행: mysql -u classfc_app -p classfc < migrations/2026-06_add-cleansheets-sport.sql

ALTER TABLE members
  ADD COLUMN clean_sheets INT DEFAULT 0 AFTER assists;

ALTER TABLE matches
  ADD COLUMN sport ENUM('football', 'futsal') DEFAULT 'football' AFTER match_type,
  ADD INDEX idx_sport (sport);
