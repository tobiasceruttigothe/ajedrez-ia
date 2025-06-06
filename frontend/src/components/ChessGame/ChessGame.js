import React from 'react';
import { Chessboard } from 'react-chessboard';
import { Chess } from 'chess.js';

const ChessGame = ({ fen, setFen, boardSize, onAnalysis, isAnalyzing }) => {
  // Maneja el caso 'start'
  const game = new Chess(fen === 'start' ? undefined : fen);

  const onDrop = (from, to) => {
    try {
      const move = game.move({ from, to, promotion: 'q' });
      if (!move) return false;
      
      const newFen = game.fen();
      setFen(newFen);
      onAnalysis(newFen);
      return true;
    } catch {
      return false;
    }
  };

  return (
    <div className="relative">
      <Chessboard 
        position={fen === 'start' ? 'start' : fen} 
        onPieceDrop={onDrop} 
        boardWidth={boardSize}
        customBoardStyle={{
          borderRadius: '0.5rem',
          boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)'
        }}
        customDarkSquareStyle={{ backgroundColor: '#779556' }}
        customLightSquareStyle={{ backgroundColor: '#ebecd0' }}
      />
      {isAnalyzing && (
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-lg">
          <div className="text-white text-lg font-medium">Analyzing...</div>
        </div>
      )}
    </div>
  );
};

export default ChessGame;