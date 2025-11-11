# VoxForge Mobile

React Native mobile application for iOS and Android.

## Features

- **Happy Coder-style remote client**: Control desktop IDE from mobile
- Voice commands on the go
- Code review and editing
- Real-time sync with desktop
- Touch-optimized interface

## Development

```bash
cd apps/mobile
npm install

# iOS
npm run ios

# Android
npm run android
```

## Remote Client Mode

The mobile app can connect to a running desktop instance and provide a remote control interface:

- View and edit files
- Execute voice commands
- Control terminal
- Review code changes
- Monitor build status

## Setup

1. Install dependencies: `npm install`
2. Configure connection settings in `src/config.ts`
3. Run the app on your device or simulator
