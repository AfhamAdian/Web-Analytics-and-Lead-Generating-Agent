import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const sessionData = await request.json();
    
    // Validate session data
    if (!sessionData.sessionId || !sessionData.events || !Array.isArray(sessionData.events)) {
      return NextResponse.json(
        { error: 'Invalid session data' },
        { status: 400 }
      );
    }

    // Create sessions directory if it doesn't exist
    const sessionsDir = path.join(process.cwd(), 'sessions');
    try {
      await fs.access(sessionsDir);
    } catch {
      await fs.mkdir(sessionsDir, { recursive: true });
    }

    // Generate filename with timestamp
    const filename = `${sessionData.sessionId}.json`;
    const filepath = path.join(sessionsDir, filename);

    // Add metadata
    const sessionWithMetadata = {
      ...sessionData,
      savedAt: new Date().toISOString(),
      serverTimestamp: Date.now(),
      ip: request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    };

    // Save session to file
    await fs.writeFile(filepath, JSON.stringify(sessionWithMetadata, null, 2));

    console.log(`Session saved: ${filename} (${sessionData.events.length} events)`);

    return NextResponse.json({
      success: true,
      sessionId: sessionData.sessionId,
      filename,
      eventCount: sessionData.events.length,
      savedAt: sessionWithMetadata.savedAt
    });

  } catch (error) {
    console.error('Error saving session:', error);
    return NextResponse.json(
      { error: 'Failed to save session' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sessionsDir = path.join(process.cwd(), 'sessions');
    
    // Check if sessions directory exists
    try {
      await fs.access(sessionsDir);
    } catch {
      return NextResponse.json([]);
    }

    // Read all session files
    const files = await fs.readdir(sessionsDir);
    const jsonFiles = files.filter(file => file.endsWith('.json'));

    const sessions = await Promise.all(
      jsonFiles.map(async (file) => {
        try {
          const filepath = path.join(sessionsDir, file);
          const content = await fs.readFile(filepath, 'utf-8');
          const sessionData = JSON.parse(content);
          
          // Return summary without events for performance
          return {
            sessionId: sessionData.sessionId,
            filename: file,
            startTime: sessionData.startTime,
            endTime: sessionData.endTime,
            duration: sessionData.duration,
            eventCount: sessionData.eventCount,
            url: sessionData.url,
            timestamp: sessionData.timestamp,
            savedAt: sessionData.savedAt
          };
        } catch (error) {
          console.error(`Error reading session file ${file}:`, error);
          return null;
        }
      })
    );

    // Filter out null values and sort by timestamp
    const validSessions = sessions
      .filter(session => session !== null)
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    return NextResponse.json(validSessions);

  } catch (error) {
    console.error('Error listing sessions:', error);
    return NextResponse.json(
      { error: 'Failed to list sessions' },
      { status: 500 }
    );
  }
}
