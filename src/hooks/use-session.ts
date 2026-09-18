import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/**
 * Tracks the current Supabase auth session on the client.
 *
 * Returns `undefined` while the initial session lookup is in flight (this
 * only ever happens client-side — during SSR this hook stays `undefined`
 * since there is no localStorage to read a session from), `null` when there
 * is definitively no signed-in user, and the `Session` once signed in.
 */
export function useSession() {
  const [session, setSession] = useState<Session | null | undefined>(undefined);

  useEffect(() => {
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (active) setSession(data.session);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (active) setSession(newSession);
    });

    return () => {
      active = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return session;
}
