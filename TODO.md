# PharmaChat Development TODOs: Phase 1

## Phase 1 Goals
- Support image upload or camera capture for prescription documents.
- Extract medication details using OCR and AI.

---

## Task List

1. **Set up project structure and dependencies**
   - Initialize frontend and backend repositories (if not already done)
   - Add required libraries for image handling and OCR

2. **Implement Image Upload & Capture**
   - Design UI for uploading prescription images
   - Integrate camera capture functionality (web/mobile as applicable)
   - Validate and preview uploaded/captured images
   - Add zoom button to enlarg the preview prescreption image.

3. **OCR Integration**
   - Integrate OCR library/service (e.g., Tesseract, Google Vision API)
   - Process uploaded/captured images to extract text
   - Handle common OCR errors and edge cases

4. **AI Extraction of Medication Details**
   - Parse OCR output to identify medication names, dosages, and instructions
   - Implement basic AI/NLP logic for entity extraction
   - Integrate the AI module(e.g., OpenAI)

5. **Testing & Validation**
   - Test with sample prescription images
   - Validate accuracy of OCR and AI extraction
   - Collect feedback and iterate

6. **Documentation**
   - Document setup, usage, and known issues for Phase 1 features

---

## Notes
- Focus on robust image handling and accurate extraction in this phase.
- Ensure privacy and security of uploaded images and extracted data.

---

## Colleague's Message

The files `ImageUpload.js`, `CameraCapture.js`, and `App.js` have been restored in your `frontend/src` directory.

You can now start your React application again by running the following commands in your terminal:

```sh
cd frontend
npm start
```

This will launch your PharmaChat app at http://localhost:3000. If you encounter any issues or need further assistance, let me know!