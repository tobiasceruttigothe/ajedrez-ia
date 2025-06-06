import React, { useState } from 'react';

const AnalysisPanel = ({ analysis, isAnalyzing }) => {
  const [activeTab, setActiveTab] = useState('overview');

  const formatEvaluation = (evalData) => {
    if (!evalData) return 'N/A';
    
    if (evalData.tipoEvaluacion === 'mate') {
      const mateIn = evalData.mateEn;
      return mateIn > 0 ? `Mate en ${mateIn}` : `Mate en ${Math.abs(mateIn)} (Negro)`;
    } else if (evalData.evaluacionPeones !== undefined) {
      const peones = evalData.evaluacionPeones;
      return peones > 0 ? `+${peones.toFixed(2)}` : `${peones.toFixed(2)}`;
    }
    return 'N/A';
  };

  const getPositionAssessment = (evalData) => {
    if (!evalData) return { text: 'Unknown', color: 'gray', icon: '❓' };
    
    if (evalData.tipoEvaluacion === 'mate') {
      const mateIn = evalData.mateEn;
      return mateIn > 0 
        ? { text: `White mates in ${mateIn}`, color: 'green', icon: '👑' }
        : { text: `Black mates in ${Math.abs(mateIn)}`, color: 'red', icon: '👑' };
    }
    
    const peones = evalData.evaluacionPeones || 0;
    if (peones > 2) return { text: 'White winning', color: 'green', icon: '⚪' };
    if (peones > 0.5) return { text: 'White better', color: 'green', icon: '⚪' };
    if (peones > -0.5) return { text: 'Equal position', color: 'gray', icon: '⚖️' };
    if (peones > -2) return { text: 'Black better', color: 'red', icon: '⚫' };
    return { text: 'Black winning', color: 'red', icon: '⚫' };
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || 'N/A';
  };

  const mainEval = analysis?.evaluacion || {};
  const variations = analysis?.variaciones || [];
  const posAssessment = getPositionAssessment(mainEval);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 shadow-sm">
        <h2 className="text-xl font-bold">Chess Analysis</h2>
        <p className="text-blue-100 text-sm mt-1">Stockfish Engine + AI Insights</p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-gray-200 bg-white">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'overview' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('overview')}
        >
          Overview
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'variations' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('variations')}
        >
          Variations
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'technical' 
              ? 'border-b-2 border-blue-500 text-blue-600' 
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('technical')}
        >
          Technical
        </button>
      </div>
      
      {/* Content */}
      <div className="flex-1 p-4 overflow-y-auto">
        {isAnalyzing ? (
          <div className="flex flex-col items-center justify-center h-40">
            <div className="flex space-x-2 mb-4">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce"></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <p className="text-gray-600 text-sm">Analyzing position...</p>
            <p className="text-gray-400 text-xs mt-1">Depth: Calculating...</p>
          </div>
        ) : analysis ? (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-4">
                {/* Best Move */}
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg border border-green-200">
                  <h3 className="font-semibold text-green-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Best Move
                  </h3>
                  <div className="text-2xl font-bold text-green-900 font-mono">
                    {analysis.mejorJugada || 'N/A'}
                  </div>
                  {mainEval.lineaPrincipal && (
                    <div className="mt-2 text-sm text-green-700">
                      <span className="font-medium">Main line: </span>
                      {mainEval.lineaPrincipal.slice(0, 5).join(' ')}
                      {mainEval.lineaPrincipal.length > 5 && '...'}
                    </div>
                  )}
                </div>
                
                {/* Evaluation */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
                  <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                    Evaluation
                  </h3>
                  <div className="text-2xl font-bold text-blue-900 font-mono">
                    {formatEvaluation(mainEval)}
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    Depth: {mainEval.depth || 'N/A'}
                  </div>
                </div>
                
                {/* Position Assessment */}
                <div className={`bg-gradient-to-r p-4 rounded-lg border ${
                  posAssessment.color === 'green' ? 'from-green-50 to-emerald-50 border-green-200' :
                  posAssessment.color === 'red' ? 'from-red-50 to-rose-50 border-red-200' :
                  'from-gray-50 to-slate-50 border-gray-200'
                }`}>
                  <h3 className={`font-semibold mb-2 flex items-center ${
                    posAssessment.color === 'green' ? 'text-green-800' :
                    posAssessment.color === 'red' ? 'text-red-800' : 'text-gray-800'
                  }`}>
                    <span className={`w-2 h-2 rounded-full mr-2 ${
                      posAssessment.color === 'green' ? 'bg-green-500' :
                      posAssessment.color === 'red' ? 'bg-red-500' : 'bg-gray-500'
                    }`}></span>
                    Position Assessment
                  </h3>
                  <div className="flex items-center">
                    <span className="text-2xl mr-2">{posAssessment.icon}</span>
                    <span className={`font-semibold ${
                      posAssessment.color === 'green' ? 'text-green-900' :
                      posAssessment.color === 'red' ? 'text-red-900' : 'text-gray-900'
                    }`}>
                      {posAssessment.text}
                    </span>
                  </div>
                </div>

                {/* AI Interpretation */}
                {analysis.interpretacionIA && (
                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 p-4 rounded-lg border border-purple-200">
                    <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                      <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                      AI Insights
                    </h3>
                    <div className="text-sm text-purple-700 whitespace-pre-wrap">
                      {analysis.interpretacionIA}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Variations Tab */}
            {activeTab === 'variations' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 mb-3">Alternative Lines</h3>
                {variations.map((variation, index) => (
                  <div key={index} className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-gray-700">#{index + 1}</span>
                      <span className="text-sm font-mono text-gray-600">
                        {formatEvaluation(variation)}
                      </span>
                    </div>
                    <div className="text-sm text-gray-800 font-mono">
                      {variation.primerJugada || 'N/A'}
                    </div>
                    {variation.lineaPrincipal && (
                      <div className="text-xs text-gray-600 mt-1">
                        {variation.lineaPrincipal.slice(0, 8).join(' ')}
                        {variation.lineaPrincipal.length > 8 && '...'}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Technical Tab */}
            {activeTab === 'technical' && (
              <div className="space-y-3">
                <h3 className="font-semibold text-gray-800 mb-3">Engine Data</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Depth</div>
                    <div className="text-gray-900">{mainEval.depth || 'N/A'}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Nodes</div>
                    <div className="text-gray-900">{formatNumber(mainEval.nodos)}</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Time</div>
                    <div className="text-gray-900">{mainEval.tiempo || 'N/A'}ms</div>
                  </div>
                  <div className="bg-gray-50 p-3 rounded">
                    <div className="font-medium text-gray-700">Speed</div>
                    <div className="text-gray-900">{formatNumber(mainEval.nps)} nps</div>
                  </div>
                </div>
                
                {mainEval.evaluacionCp && (
                  <div className="bg-blue-50 p-3 rounded-lg">
                    <div className="font-medium text-blue-800 mb-1">Raw Evaluation</div>
                    <div className="text-blue-900 font-mono">{mainEval.evaluacionCp} centipawns</div>
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <div className="text-6xl mb-4">♟️</div>
            <p className="text-gray-500 italic">Make a move to see analysis</p>
            <p className="text-gray-400 text-sm mt-2">Advanced engine evaluation with AI insights</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnalysisPanel;