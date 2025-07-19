// Create this file: app/api/test/route.js
import { NextResponse } from "next/server";

export async function GET() {
  try {
    console.log('Test endpoint called');
    
    // Test environment variables
    const envCheck = {
      nodeEnv: process.env.NODE_ENV,
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriLength: process.env.MONGODB_URI?.length || 0,
      timestamp: new Date().toISOString()
    };
    
    console.log('Environment check:', envCheck);
    
    // Test database connection
    let dbStatus = 'not_tested';
    try {
      const { connectToDatabase } = await import("@/lib/db");
      await connectToDatabase();
      dbStatus = 'connected';
      console.log('Database connection successful');
    } catch (dbError) {
      dbStatus = `failed: ${dbError.message}`;
      console.error('Database connection failed:', dbError);
    }
    
    // Test model import
    let modelStatus = 'not_tested';
    try {
      const urlModelModule = await import("@/models/url.model");
      modelStatus = 'imported';
      console.log('Model import successful');
    } catch (modelError) {
      modelStatus = `failed: ${modelError.message}`;
      console.error('Model import failed:', modelError);
    }
    
    return NextResponse.json({
      status: 'ok',
      environment: envCheck,
      database: dbStatus,
      model: modelStatus,
      message: 'Test endpoint working'
    });
    
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json(
      { 
        status: 'error',
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}