/**
 * Aanvulling op de gegenereerde bindings (worker-configuration.d.ts).
 * Geheimen worden met `wrangler secret put` gezet en staan dus niet in
 * wrangler.jsonc of in de repo.
 */
interface Env {
  RESEND_API_KEY?: string
  MAIL_TEST_NAAR?: string
  /** Lara Translate: access key id + secret, voor de automatische vertalingen. */
  LARA_ID?: string
  LARA_SECRET?: string
}
