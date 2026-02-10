-- Band Management + Recruit Board - Database Schema
-- Execute this SQL in Supabase SQL Editor

-- 1. band 테이블
CREATE TABLE IF NOT EXISTS band (
  id SERIAL PRIMARY KEY,
  leader_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) >= 2 AND char_length(name) <= 20),
  description TEXT CHECK (char_length(description) <= 500),
  genre TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  level TEXT NOT NULL,
  profile_image TEXT,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. band_member 테이블
CREATE TABLE IF NOT EXISTS band_member (
  id SERIAL PRIMARY KEY,
  band_id INTEGER NOT NULL REFERENCES band(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  pos TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'member' CHECK (role IN ('leader', 'member')),
  is_public BOOLEAN DEFAULT true,
  joined_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(band_id, user_id)
);

-- 3. recruit_post 테이블
CREATE TABLE IF NOT EXISTS recruit_post (
  id SERIAL PRIMARY KEY,
  band_id INTEGER NOT NULL REFERENCES band(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL CHECK (char_length(title) >= 1 AND char_length(title) <= 30),
  body TEXT NOT NULL CHECK (char_length(body) <= 1000),
  positions JSONB NOT NULL DEFAULT '[]',
  genre TEXT[] NOT NULL DEFAULT '{}',
  level TEXT[] NOT NULL DEFAULT '{}',
  location TEXT NOT NULL,
  songs JSONB DEFAULT '[]',
  images TEXT[] DEFAULT '{}',
  video_url TEXT,
  openchat TEXT,
  view_count INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. recruit_comment 테이블
CREATE TABLE IF NOT EXISTS recruit_comment (
  id SERIAL PRIMARY KEY,
  recruit_id INTEGER NOT NULL REFERENCES recruit_post(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  body TEXT NOT NULL CHECK (char_length(body) <= 300),
  applied_pos TEXT NOT NULL,
  is_accepted BOOLEAN DEFAULT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(recruit_id, user_id)
);

-- 인덱스
CREATE INDEX IF NOT EXISTS idx_band_leader_id ON band(leader_id);
CREATE INDEX IF NOT EXISTS idx_band_member_band_id ON band_member(band_id);
CREATE INDEX IF NOT EXISTS idx_band_member_user_id ON band_member(user_id);
CREATE INDEX IF NOT EXISTS idx_recruit_post_band_id ON recruit_post(band_id);
CREATE INDEX IF NOT EXISTS idx_recruit_post_is_active ON recruit_post(is_active) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_recruit_post_created_at ON recruit_post(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_recruit_post_location ON recruit_post(location);
CREATE INDEX IF NOT EXISTS idx_recruit_comment_recruit_id ON recruit_comment(recruit_id);
CREATE INDEX IF NOT EXISTS idx_recruit_comment_user_id ON recruit_comment(user_id);

-- RLS 활성화
ALTER TABLE band ENABLE ROW LEVEL SECURITY;
ALTER TABLE band_member ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruit_post ENABLE ROW LEVEL SECURITY;
ALTER TABLE recruit_comment ENABLE ROW LEVEL SECURITY;

-- RLS 정책: band
CREATE POLICY "band_select" ON band FOR SELECT TO authenticated USING (true);
CREATE POLICY "band_insert" ON band FOR INSERT TO authenticated WITH CHECK (leader_id = auth.uid());
CREATE POLICY "band_update" ON band FOR UPDATE TO authenticated USING (leader_id = auth.uid());
CREATE POLICY "band_delete" ON band FOR DELETE TO authenticated USING (leader_id = auth.uid());

-- RLS 정책: band_member
CREATE POLICY "band_member_select" ON band_member FOR SELECT TO authenticated USING (true);
CREATE POLICY "band_member_insert" ON band_member FOR INSERT TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM band WHERE band.id = band_id AND band.leader_id = auth.uid())
  );
CREATE POLICY "band_member_delete" ON band_member FOR DELETE TO authenticated
  USING (
    user_id = auth.uid()
    OR EXISTS (SELECT 1 FROM band WHERE band.id = band_id AND band.leader_id = auth.uid())
  );

-- RLS 정책: recruit_post
CREATE POLICY "recruit_post_select" ON recruit_post FOR SELECT TO authenticated USING (true);
CREATE POLICY "recruit_post_insert" ON recruit_post FOR INSERT TO authenticated
  WITH CHECK (
    user_id = auth.uid()
    AND EXISTS (SELECT 1 FROM band WHERE band.id = band_id AND band.leader_id = auth.uid())
  );
CREATE POLICY "recruit_post_update" ON recruit_post FOR UPDATE TO authenticated USING (user_id = auth.uid());
CREATE POLICY "recruit_post_delete" ON recruit_post FOR DELETE TO authenticated USING (user_id = auth.uid());

-- RLS 정책: recruit_comment
CREATE POLICY "recruit_comment_select" ON recruit_comment FOR SELECT TO authenticated USING (true);
CREATE POLICY "recruit_comment_insert" ON recruit_comment FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "recruit_comment_update_accept" ON recruit_comment FOR UPDATE TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM recruit_post rp
      JOIN band b ON b.id = rp.band_id
      WHERE rp.id = recruit_id AND b.leader_id = auth.uid()
    )
  );
CREATE POLICY "recruit_comment_delete" ON recruit_comment FOR DELETE TO authenticated USING (user_id = auth.uid());
