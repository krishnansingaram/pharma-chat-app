import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import ImageUpload from './ImageUpload';
import CameraCapture from './CameraCapture';
import ChatInterface from './ChatInterface';

function App() {
  return (
    <div className="app-container">
      <nav className="navbar navbar-expand-lg navbar-light">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">PharmaChat</a>
        </div>
      </nav>

      <header className="hero-section">
        <div className="container">
          <h1>Welcome to PharmaChat</h1>
          <p>Your AI-powered assistant for prescriptions and medication.</p>
        </div>
      </header>

      <main className="content-section">
        <div className="container">
          <div className="row">
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4">Upload Prescription</h5>
                  <ImageUpload />
                </div>
              </div>
            </div>
            <div className="col-md-6 mb-4">
              <div className="card">
                <div className="card-body">
                  <h5 className="card-title text-center mb-4">Capture with Camera</h5>
                  <CameraCapture />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <ChatInterface />
      <footer className="footer">
        <div className="container">
          <span>&copy; {new Date().getFullYear()} PharmaChat. All Rights Reserved.</span>
        </div>
      </footer>
    </div>
  );
}

export default App;
