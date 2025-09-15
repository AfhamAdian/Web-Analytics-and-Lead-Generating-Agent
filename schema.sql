

-- Analytics Database Schema
-- PostgreSQL Implementation

-- Enable UUID extension for generating UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Owners table - must be created first due to foreign key dependencies
CREATE TABLE owners (
    owner_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(50),
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sites table
CREATE TABLE sites (
    site_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    site_name VARCHAR(255) NOT NULL,
    domain_name VARCHAR(255) UNIQUE NOT NULL,
    owner_id UUID NOT NULL REFERENCES owners(owner_id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Visitors table
CREATE TABLE visitors (
    uid UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_seen TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    region VARCHAR(100),
    country VARCHAR(100),
    page_views INTEGER DEFAULT 0,
    total_sessions INTEGER DEFAULT 0,
    lead_status VARCHAR(50) DEFAULT 'unknown',
    lead_name VARCHAR(255),
    lead_email VARCHAR(255),
    lead_phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE sessions (
    session_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID NOT NULL REFERENCES visitors(uid) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    ended_at TIMESTAMP WITH TIME ZONE,
    cookie_consent_accepted BOOLEAN DEFAULT FALSE,
    browser VARCHAR(100),
    duration INTEGER, -- duration in seconds
    os VARCHAR(100),
    device VARCHAR(100),
    landing_page TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Events table
CREATE TABLE events (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    uid UUID NOT NULL REFERENCES visitors(uid) ON DELETE CASCADE,
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    site_id UUID NOT NULL REFERENCES sites(site_id) ON DELETE CASCADE,
    event_type VARCHAR(100) NOT NULL,
    event_name VARCHAR(255) NOT NULL,
    element_id VARCHAR(255),
    element_class VARCHAR(255),
    properties JSONB, -- Using JSONB for flexible event properties
    event_timestamp TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create session_recordings table
CREATE TABLE session_recordings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id UUID NOT NULL REFERENCES sessions(session_id) ON DELETE CASCADE,
    events JSONB NOT NULL, -- rrweb events array
    metadata JSONB, -- Additional metadata (viewport, user agent, etc.)
    file_size INTEGER, -- Size of events JSON in bytes
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);