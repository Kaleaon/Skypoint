import React, { useEffect, useRef } from 'react'
import { Scene3D } from './components/Scene3D'
import { ProtocolDemo } from './components/ProtocolDemo'
import { AssetManager } from './components/AssetManager'
import './App.css'

function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Skypoint WebApp</h1>
        <p>React conversion investigation for Second Life Viewer</p>
      </header>
      
      <main className="app-main">
        <div className="demo-section">
          <h2>3D Rendering Demo (Three.js)</h2>
          <Scene3D />
        </div>
        
        <div className="demo-section">
          <h2>Protocol Layer Demo</h2>
          <ProtocolDemo />
        </div>
        
        <div className="demo-section">
          <h2>Asset Management Demo</h2>
          <AssetManager />
        </div>
        
        <div className="analysis-section">
          <h2>Conversion Analysis</h2>
          <div className="analysis-grid">
            <div className="analysis-card feasible">
              <h3>✅ Feasible</h3>
              <ul>
                <li>UI Components (React)</li>
                <li>Business Logic</li>
                <li>Basic 3D Rendering (WebGL)</li>
                <li>Asset Caching (Browser APIs)</li>
              </ul>
            </div>
            
            <div className="analysis-card challenging">
              <h3>⚠️ Challenging</h3>
              <ul>
                <li>Performance Parity</li>
                <li>Advanced Graphics Features</li>
                <li>Memory Management</li>
                <li>Threading Model</li>
              </ul>
            </div>
            
            <div className="analysis-card difficult">
              <h3>❌ Difficult</h3>
              <ul>
                <li>UDP Protocol Support</li>
                <li>Direct File System Access</li>
                <li>Native OpenGL Performance</li>
                <li>Binary Protocol Handling</li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="app-footer">
        <p>
          This is a proof-of-concept demonstrating React webapp conversion feasibility.
          See <a href="/docs/React_WebApp_Conversion_Analysis.md">detailed analysis</a> for full assessment.
        </p>
      </footer>
    </div>
  )
}

export default App