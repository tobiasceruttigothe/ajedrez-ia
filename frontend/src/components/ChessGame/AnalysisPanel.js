import React from 'react';

const AnalysisPanel = ({ analysis, isAnalyzing }) => {
  return (
    <div className="h-full flex flex-col">
      {/* Header del panel */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-sm">
        <h2 className="text-xl font-bold">Analysis</h2>
        <p className="text-blue-100 text-sm mt-1">Engine evaluation</p>
      </div>
      
      {/* Contenido del panel */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-gray-600 text-sm">Analyzing position...</p>
          </div>
        ) : analysis ? (
          <div className="space-y-4">
            {/* Best Move */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Best Move
              </h3>
              <div className="text-2xl font-bold text-green-900 font-mono">
                {analysis.mejorJugada}
              </div>
            </div>
            
            {/* Evaluation */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                Evaluation
              </h3>
              <div className="text-2xl font-bold text-blue-900 font-mono">
                {analysis.evaluacion}
              </div>
            </div>
            
            {/* Position Assessment */}
            <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
              <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                Position
              </h3>
              <div className="text-sm text-purple-700">
                {analysis.evaluacion.includes('+') ? 
                  <span className="flex items-center">
                    <span className="text-green-600 mr-2">⚪</span>
                    White has advantage
                  </span> : 
                 analysis.evaluacion.includes('-') ? 
                  <span className="flex items-center">
                    <span className="text-gray-800 mr-2">⚫</span>
                    Black has advantage
                  </span> : 
                  <span className="flex items-center">
                    <span className="text-gray-600 mr-2">⚖️</span>
                    Position is balanced
                  </span>
                }
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <h3 className="font-semibold text-gray-700 mb-2">Game Status</h3>
              <div className="text-sm text-gray-600">
                <p>Make your next move to continue analysis</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="text-6xl mb-4">♟️</div>
            <p className="text-gray-500 italic">Make a move to see analysis results</p>
            <p className="text-gray-400 text-sm mt-2">The engine will evaluate the position</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;