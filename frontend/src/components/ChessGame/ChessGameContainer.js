import React, { useState, useEffect } from 'react';
import ChessGame from './ChessGame';
import AnalysisPanel from './AnalysisPanel';

const ChessGameContainer = () => {
  const [fen, setFen] = useState('start');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [boardSize, setBoardSize] = useState(500);
  const [analysisPanelWidth, setAnalysisPanelWidth] = useState(350); // Ancho inicial del panel
  const [isResizing, setIsResizing] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const margin = 40;
      const availableWidth = window.innerWidth - analysisPanelWidth - 100; // Espacio disponible para el tablero
      const availableHeight = window.innerHeight - margin;
      const size = Math.min(availableWidth, availableHeight) - margin;
      setBoardSize(size > 300 ? size : 300);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [analysisPanelWidth]);

  const handleAnalysis = async (fen) => {
    setIsAnalyzing(true);
    try {
      const response = await fetch('http://localhost:8080/api/analizar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fen })
      });
      const data = await response.json();
      setAnalysis(data);
    } catch (error) {
      console.error('Analysis error:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleMouseDown = (e) => {
    setIsResizing(true);
    e.preventDefault();
  };

  const handleMouseMove = (e) => {
    if (!isResizing) return;
    
    const newWidth = window.innerWidth - e.clientX;
    if (newWidth >= 250 && newWidth <= 600) { // Límites del panel
      setAnalysisPanelWidth(newWidth);
    }
  };

  const handleMouseUp = () => {
    setIsResizing(false);
  };

  useEffect(() => {
    if (isResizing) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      <div className="flex h-screen">
        {/* Área principal del tablero */}
        <div className="flex-1 flex items-center justify-center p-8">
          <div className="flex flex-col items-center space-y-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Chess Analysis
            </h1>
            <ChessGame 
              fen={fen} 
              setFen={setFen} 
              boardSize={boardSize} 
              onAnalysis={handleAnalysis}
              isAnalyzing={isAnalyzing}
            />
          </div>
        </div>

        {/* Divisor redimensionable */}
        <div 
          className={`w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize transition-colors duration-200 ${
            isResizing ? 'bg-blue-500' : ''
          }`}
          onMouseDown={handleMouseDown}
        />

        {/* Panel de análisis redimensionable */}
        <div 
          className="bg-white shadow-xl border-l border-gray-200 overflow-hidden flex flex-col"
          style={{ width: `${analysisPanelWidth}px` }}
        >
          <AnalysisPanel 
            analysis={analysis} 
            isAnalyzing={isAnalyzing}
          />
        </div>
      </div>
    </div>
  );
};

export default ChessGameContainer;