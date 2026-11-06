-- Database Schema for madi.hub showcase
CREATE TABLE IF NOT EXISTS tools (
    id UUID PRIMARY KEY DEFAULT gen_random_all(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    url VARCHAR(500) NOT NULL,
    github_url VARCHAR(500),
    category VARCHAR(100) DEFAULT 'Utility',
    tags TEXT[] DEFAULT '{}',
    is_featured BOOLEAN DEFAULT false,
    is_visible BOOLEAN DEFAULT true,
    vercel_project_id VARCHAR(255),
    framework VARCHAR(100),
    status VARCHAR(50) DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexing for fast queries
CREATE INDEX IF NOT EXISTS idx_tools_category ON tools(category);
CREATE INDEX IF NOT EXISTS idx_tools_visible ON tools(is_visible);
CREATE INDEX IF NOT EXISTS idx_tools_featured ON tools(is_featured);

-- Enable Row Level Security (RLS)
ALTER TABLE tools ENABLE ROW LEVEL SECURITY;

-- Allow read access for public
CREATE POLICY "Allow public read access" ON tools
    FOR SELECT USING (is_visible = true);

-- Allow full access for anon/authenticated (managed via app admin PIN verification)
CREATE POLICY "Allow admin operations" ON tools
    FOR ALL USING (true);
