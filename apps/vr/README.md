# VoxForge VR/AR

WebXR-based immersive development environment.

## Features

- **3D Code Space**: Navigate and edit code in 3D space
- **Voice-First Interface**: Natural voice interaction in VR/AR
- **Multi-Panel Workspace**: Multiple files and views in spatial arrangement
- **Collaborative Spaces**: Code together in shared virtual spaces
- **Hand Tracking**: Direct manipulation of code elements

## Supported Platforms

- Meta Quest (Quest 2, Quest 3, Quest Pro)
- HTC Vive
- Valve Index
- AR via compatible devices (ARKit, ARCore)

## Development

```bash
cd apps/vr
npm install
npm run dev
```

Access the VR interface at `http://localhost:3001` and enter VR mode using your headset.

## Controls

- **Voice**: Primary interaction method
- **Controllers**: Point and select, grab and move panels
- **Hand Tracking**: Direct manipulation (if supported)
- **Gaze**: Alternative selection method

## Technology

- WebXR API
- Three.js for 3D rendering
- Monaco Editor integration
- Spatial audio for feedback
