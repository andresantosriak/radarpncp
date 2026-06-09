-- Radar PNCP — pg_cron job: coletar-querido-diario a cada 12h.
-- Padrao Supabase: pg_cron agenda -> pg_net dispara HTTP POST
-- para a Edge Function com Authorization: Bearer service_role_key.
--
-- IMPORTANTE: A service_role_key deve estar cadastrada no Vault:
--   select vault.create_secret('<key>', 'service_role_key');
-- Verificar: select * from vault.decrypted_secrets where name = 'service_role_key';

-- Remove job anterior se existir (idempotencia)
select cron.unschedule('cron-querido-diario')
where exists (
  select 1 from cron.job where jobname = 'cron-querido-diario'
);

select cron.schedule(
  'cron-querido-diario',
  '0 */12 * * *',
  $$
  select net.http_post(
    url    := 'https://wqoaieuehgnnnpovwhpy.supabase.co/functions/v1/coletar-querido-diario',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || (
        select decrypted_secret
        from vault.decrypted_secrets
        where name = 'service_role_key'
        limit 1
      )
    ),
    body   := '{}'::jsonb
  ) as request_id;
  $$
);
