# Firebase Configuration Guide

This application has been configured to work gracefully without Firebase credentials. Here's how the Firebase integration works:

## How it works

1. **Automatic fallback**: If Firebase environment variables are not provided, the app uses demo/placeholder values
2. **Feature degradation**: When Firebase is not properly configured, related features are disabled rather than causing crashes
3. **User feedback**: Users get clear messages when Firebase features are unavailable

## Firebase Features

The following features require Firebase configuration:
- User authentication (Google Sign-in)
- File upload and storage
- Chat history persistence
- User profile management

## Environment Variables

Set these in your `.env.local` file for full Firebase functionality:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id
```

## Core App Features

These features work without Firebase:
- AI chat functionality (requires OPENAI_API_KEY)
- Search capabilities (requires search API keys)
- Weather widgets (requires weather API keys)
- Stock information (requires stock API keys)

## Implementation Details

The Firebase configuration (`firebaseConfig.ts`) includes:
- Automatic environment variable detection
- Graceful error handling during initialization
- Type-safe exports with proper TypeScript support
- Helper function `isFirebaseInitialized()` to check availability

Components that use Firebase check `isFirebaseInitialized()` before attempting Firebase operations and provide appropriate fallbacks or user messaging when Firebase is not available.
