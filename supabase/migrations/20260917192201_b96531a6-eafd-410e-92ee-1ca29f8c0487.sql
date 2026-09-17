CREATE TABLE public.recommendation_votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recommendation_id uuid NOT NULL REFERENCES public.recommendations(id) ON DELETE CASCADE,
  voter_key text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (recommendation_id, voter_key)
);

CREATE INDEX recommendation_votes_rec_idx ON public.recommendation_votes(recommendation_id);

GRANT SELECT, INSERT ON public.recommendation_votes TO anon;
GRANT SELECT, INSERT ON public.recommendation_votes TO authenticated;
GRANT ALL ON public.recommendation_votes TO service_role;

ALTER TABLE public.recommendation_votes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read votes"
  ON public.recommendation_votes FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can cast a vote"
  ON public.recommendation_votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (char_length(voter_key) BETWEEN 8 AND 64);