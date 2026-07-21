import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const allowedDinosaurs = new Set([
  'spinosaurus', 'tyrannosaurus', 'triceratops', 'parasaurus',
  'pteranodon', 'brachiosaurus', 'ankylosaurus', 'mammoth',
]);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (request) => {
  if (request.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authorization = request.headers.get('Authorization');
    if (!authorization) return Response.json({ error: 'Sign in is required.' }, { status: 401, headers: corsHeaders });

    const url = Deno.env.get('SUPABASE_URL')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const serviceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const authClient = createClient(url, anonKey, { global: { headers: { Authorization: authorization } } });
    const { data: { user }, error: userError } = await authClient.auth.getUser();
    if (userError || !user) return Response.json({ error: 'Your session has expired. Please sign in again.' }, { status: 401, headers: corsHeaders });

    const body = await request.json();
    const serviceClient = createClient(url, serviceRoleKey);

    if (body.action === 'start') {
      const dinosaurId = String(body.dinosaur_id || '');
      const displayName = String(body.display_name || '').trim().replace(/\s+/g, ' ');
      if (!allowedDinosaurs.has(dinosaurId)) return Response.json({ error: 'Unknown dinosaur.' }, { status: 400, headers: corsHeaders });
      if (displayName.length < 2 || displayName.length > 24) return Response.json({ error: 'Use a display name between 2 and 24 characters.' }, { status: 400, headers: corsHeaders });

      const { error: profileError } = await serviceClient
        .from('profiles')
        .upsert({ id: user.id, display_name: displayName }, { onConflict: 'id' });
      if (profileError) throw profileError;
      await serviceClient.from('puzzle_runs').update({ status: 'expired', completed_at: new Date().toISOString() }).eq('user_id', user.id).eq('status', 'playing');
      const { data, error } = await serviceClient.from('puzzle_runs').insert({ user_id: user.id, dinosaur_id: dinosaurId }).select('id, started_at').single();
      if (error) throw error;
      return Response.json({ run: data }, { headers: corsHeaders });
    }

    if (body.action === 'expire') {
      const runId = String(body.run_id || '');
      if (!runId) return Response.json({ error: 'Puzzle run is required.' }, { status: 400, headers: corsHeaders });

      const { error } = await serviceClient
        .from('puzzle_runs')
        .update({ status: 'expired', completed_at: new Date().toISOString() })
        .eq('id', runId)
        .eq('user_id', user.id)
        .eq('status', 'playing');
      if (error) throw error;
      return Response.json({ ok: true }, { headers: corsHeaders });
    }

    if (body.action === 'complete') {
      const runId = String(body.run_id || '');
      const { data: run, error } = await serviceClient.from('puzzle_runs').select('id, started_at, status').eq('id', runId).eq('user_id', user.id).maybeSingle();
      if (error) throw error;
      if (!run || run.status !== 'playing') return Response.json({ error: 'This puzzle run is no longer active.' }, { status: 409, headers: corsHeaders });

      const seconds = Math.max(1, Math.floor((Date.now() - Date.parse(run.started_at)) / 1000));
      if (seconds > 150) {
        await serviceClient.from('puzzle_runs').update({ status: 'expired', completed_at: new Date().toISOString() }).eq('id', run.id);
        return Response.json({ error: 'Time limit reached.' }, { status: 422, headers: corsHeaders });
      }
      const { data, error: completeError } = await serviceClient.from('puzzle_runs').update({ status: 'completed', completed_at: new Date().toISOString(), completion_seconds: seconds }).eq('id', run.id).select('id, dinosaur_id, completion_seconds, completed_at').single();
      if (completeError) throw completeError;
      return Response.json({ run: data }, { headers: corsHeaders });
    }

    return Response.json({ error: 'Unknown action.' }, { status: 400, headers: corsHeaders });
  } catch (error) {
    console.error(error);
    return Response.json({ error: 'Unable to save this puzzle run.' }, { status: 500, headers: corsHeaders });
  }
});
