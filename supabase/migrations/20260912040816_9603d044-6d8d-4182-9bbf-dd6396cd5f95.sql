CREATE TABLE public.recommendations (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  catalogue_id text,
  title text NOT NULL,
  romaji text,
  cover text,
  year integer,
  studio text,
  genres text[] NOT NULL DEFAULT '{}',
  synopsis text,
  episodes integer,
  recommender text NOT NULL DEFAULT 'Anonymous',
  note text,
  hidden boolean NOT NULL DEFAULT false,
  ip_hash text,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

CREATE INDEX recommendations_created_at_idx ON public.recommendations (created_at DESC);
CREATE INDEX recommendations_ip_hash_idx ON public.recommendations (ip_hash, created_at DESC);

GRANT SELECT, INSERT ON public.recommendations TO anon;
GRANT SELECT, INSERT ON public.recommendations TO authenticated;
GRANT ALL ON public.recommendations TO service_role;

ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible recommendations"
  ON public.recommendations FOR SELECT
  TO anon, authenticated
  USING (hidden = false);

CREATE POLICY "Anyone can add a recommendation"
  ON public.recommendations FOR INSERT
  TO anon, authenticated
  WITH CHECK (hidden = false AND char_length(title) BETWEEN 1 AND 200 AND char_length(coalesce(note, '')) <= 400 AND char_length(recommender) BETWEEN 1 AND 60);