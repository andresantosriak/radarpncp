-- Migration: add `encerrado` boolean flag to oportunidades
-- Marks opportunities whose submission deadline has passed.
-- See: docs/radar-pncp-prd-filtro-prazo.md (CA-4, CA-2)

-- 1. Add column (idempotent)
ALTER TABLE oportunidades ADD COLUMN IF NOT EXISTS encerrado boolean NOT NULL DEFAULT false;

-- 2. Index for frontend filter (.eq('encerrado', false))
CREATE INDEX IF NOT EXISTS idx_oportunidades_encerrado ON oportunidades (encerrado);

-- 3. Preview of affected rows (audit — run manually if desired):
-- SELECT count(*) FROM oportunidades
--   WHERE data_encerramento IS NOT NULL
--     AND data_encerramento::date < CURRENT_DATE;

-- 4. Backfill: mark existing opportunities with past deadline as encerrado
UPDATE oportunidades
   SET encerrado   = true,
       updated_at   = now()
 WHERE data_encerramento IS NOT NULL
   AND data_encerramento::date < CURRENT_DATE
   AND encerrado = false;
