# Image Upload & Camera Capture Components

This document describes the usage of the `ImageUpload.js` and `CameraCapture.js` React components, which are part of Phase 1 for PharmaChat.

## Components

### 1. ImageUpload.js
- Allows users to upload prescription images from their device.
- Displays a preview of the selected image.
- Usage:
  ```jsx
  import ImageUpload from './ImageUpload';
  // ...
  <ImageUpload />
  ```

### 2. CameraCapture.js
- Enables users to capture a prescription image using their device's camera.
- Shows a live video preview and allows capturing a still image.
- Usage:
  ```jsx
  import CameraCapture from './CameraCapture';
  // ...
  <CameraCapture />
  ```

## Notes
- Both components are designed for integration into the main prescription upload workflow.
- Ensure your app has permissions to access the camera for `CameraCapture.js`.
- Images can be further processed or sent to the backend for OCR and AI extraction in subsequent tasks. 