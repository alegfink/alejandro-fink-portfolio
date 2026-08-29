/**
 * Native navigation for the portfolio experience.
 *
 * Sites/Vinext currently fails while running Next''s client-side Link router in
 * production. A real anchor keeps progressive navigation, hash links and
 * language changes working even when JavaScript routing is unavailable.
 */
export const NativeLink = "a";
