import React from 'react';
import { CheckCircle2, Sparkles } from 'lucide-react';

export default function Header() {
  return (
    <header className="app-header">
      <div className="logo-badge">
        <Sparkles />
        <span>TaskFlow Studio</span>
      </div>
      <h1 className="app-title">Focus & Accomplish</h1>
      <p className="app-subtitle">A modern, responsive workspace to organize your daily priorities</p>
    </header>
  );
}
