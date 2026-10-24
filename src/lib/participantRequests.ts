import type { SupabaseClient } from '@supabase/supabase-js';

/** Keep the same participant identity; never replace a failed session with a new team. */
export function createParticipantRequests(client: SupabaseClient, clock = () => performance.now()) {
  let preparing: Promise<void> | null = null;
  let renewing: Promise<void> | null = null;
  let userId: string | null = null;
  let checkedAt: number | null = null;
  const renew = () => {
    if (!renewing) renewing = (async () => {
      const { data, error } = await client.auth.refreshSession();
      if (error) throw error;
      if (!data.session || (userId && data.session.user.id !== userId)) {
        throw new Error('既存のチームの認証情報を更新できませんでした。');
      }
      userId = data.session.user.id;
      checkedAt = clock();
    })().finally(() => { renewing = null; });
    return renewing;
  };
  const prepare = () => {
    if (!preparing) preparing = (async () => {
      const { data, error } = await client.auth.getSession();
      if (error) throw error;
      let session = data.session;
      if (!session) {
        if (userId) throw new Error('既存のチームの認証情報が見つかりません。');
        const signed = await client.auth.signInAnonymously();
        if (signed.error) throw signed.error;
        session = signed.data.session;
        if (!session) throw new Error('認証情報を取得できませんでした。');
        checkedAt = clock();
      }
      if (userId && session.user.id !== userId) throw new Error('チームの認証情報が変わりました。');
      userId = session.user.id;
      // Refresh on first load and every five minutes using a monotonic clock.
      // This also works when the PC's date/time prevents the SDK's expiry check.
      if (checkedAt === null || clock() - checkedAt >= 5 * 60_000 ||
          (session.expires_at !== undefined && session.expires_at * 1000 <= Date.now() + 60_000)) {
        await renew();
      }
    })().finally(() => { preparing = null; });
    return preparing;
  };
  return async (name: string, args: Record<string, unknown>) => {
    await prepare();
    let response = await client.rpc(name, args);
    if (response.status === 401) {
      await renew();
      response = await client.rpc(name, args);
    }
    return response;
  };
}
