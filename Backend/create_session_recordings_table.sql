-- Create session_recordings table for storing rrweb session recording data
-- Run this script in your Supabase SQL editor

-- Enable uuid-ossp extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create the session_recordings table
CREATE TABLE IF NOT EXISTS session_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    events JSONB NOT NULL, -- rrweb events array
    metadata JSONB, -- Additional metadata (viewport, user agent, etc.)
    file_size INTEGER, -- Size of events JSON in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_session_recordings_session_id ON session_recordings(session_id);
CREATE INDEX IF NOT EXISTS idx_session_recordings_created_at ON session_recordings(created_at);

-- Create a trigger to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_session_recordings_updated_at 
    BEFORE UPDATE ON session_recordings 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- Add comments for documentation
COMMENT ON TABLE session_recordings IS 'Stores rrweb session recording data with events and metadata';
COMMENT ON COLUMN session_recordings.id IS 'Unique identifier for the recording';
COMMENT ON COLUMN session_recordings.session_id IS 'Foreign key to sessions table';
COMMENT ON COLUMN session_recordings.events IS 'Array of rrweb events in JSONB format';
COMMENT ON COLUMN session_recordings.metadata IS 'Additional metadata like user agent, duration, etc.';
COMMENT ON COLUMN session_recordings.file_size IS 'Size of the events JSON in bytes';
COMMENT ON COLUMN session_recordings.created_at IS 'Timestamp when recording was created';
COMMENT ON COLUMN session_recordings.updated_at IS 'Timestamp when recording was last updated';
