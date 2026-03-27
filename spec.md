# JK Ambi Light

## Current State
New project, no existing code.

## Requested Changes (Diff)

### Add
- Main app interface called "JK Ambi Light"
- LED strip control panel: set number of LEDs (input), on/off toggle button
- Auto on/off scheduling (background service simulation)
- Screen grab/capture feature that reads edge pixel colors and maps them to LED strip
- Sends color data to Arduino Nano via USB (Web Serial API)
- Background color of app UI reflects current strip color
- FPS control: constant 60fps default, adjustable 10-114fps in Settings
- QR code sharing (free share via QR)
- Settings page: FPS slider/input, LED count, USB port configuration
- Arduino wiring info: Vcc→5V, GND→GND, D6→Data
- Works on PC and TV (responsive)

### Modify
N/A

### Remove
N/A

## Implementation Plan
1. Backend: store app settings (LED count, FPS, auto on/off schedule, on/off state)
2. Frontend: Main page with on/off toggle, LED count, screen capture canvas, USB serial connect button
3. Screen capture using getDisplayMedia() API, sampling edge pixels
4. Web Serial API integration to send RGB data to Arduino
5. Settings page: FPS slider (10-114), LED count, schedule
6. QR code component for sharing app URL
7. Dynamic background color reflecting current dominant LED color
8. Responsive layout for PC and TV
