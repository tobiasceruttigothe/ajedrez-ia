import React, { useEffect, useState } from "react";
import { Chessboard } from "react-chessboard";
import { Chess } from "chess.js";
import "./App.css";

const game = new Chess();

function App() {
  const [fen, setFen] = useState(game.fen());
  const [boardSize, setBoardSize] = useState(500);

  useEffect(() => {
    const updateSize = () => {
      const margin = 40;
      const size = Math.min(window.innerWidth, window.innerHeight) - margin;
      setBoardSize(size > 300 ? size : 300);
    };

    updateSize();
    window.addEventListener("resize", updateSize);
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  const onDrop = (sourceSquare, targetSquare) => {
  try {
    const move = game.move({
      from: sourceSquare,
      to: targetSquare,
      promotion: "q",
    });

    if (!move) {
      console.warn("Movimiento ilegal");
      return false;
    }

    setFen(game.fen());

    fetch("http://localhost:8080/api/analizar", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fen: game.fen() }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("Mejor jugada:", data.mejorJugada);
        console.log("Evaluación:", data.evaluacion);
      })
      .catch((error) => {
        console.error("Error al llamar al backend:", error);
      });

    return true;
  } catch (error) {
    console.error("Error al mover la pieza:", error);
    return false;
  }
};


  return (
    <div className="container">
      <Chessboard position={fen} onPieceDrop={onDrop} boardWidth={boardSize} />
    </div>
  );
}

export default App;
