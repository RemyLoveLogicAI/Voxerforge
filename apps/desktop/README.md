# VoxForge Desktop (Tauri)

Native desktop application for VoxForge IDE built with Tauri.

## Features

- Native Windows, macOS, and Linux support
- Direct file system access
- System integration (menu bar, notifications, etc.)
- Optimized performance

## Development

```bash
cd apps/desktop
npm install
npm run dev
```

## Building

```bash
npm run build
```

This will create platform-specific installers in `src-tauri/target/release/bundle/`.

## Configuration

Desktop-specific configuration is in `src-tauri/tauri.conf.json`.
