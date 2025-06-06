
package com.ajedrez.stockfishapi;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AjedrezController {

    @PostMapping("/analizar")
    public Map<String, String> analizar(@RequestBody Map<String, String> body) throws IOException {
        String fen = body.get("fen");

        ProcessBuilder pb = new ProcessBuilder("./stockfish.exe");
        Process process = pb.start();

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

        writer.write("uci\n");
        writer.write("isready\n");
        writer.write("position fen " + fen + "\n");
        writer.write("go depth 15\n");
        writer.flush();

        String bestMove = "";
        String evaluation = "";

        String line;
        while ((line = reader.readLine()) != null) {
            if (line.startsWith("info depth") && line.contains("score cp")) {
                evaluation = line;
            }
            if (line.startsWith("bestmove")) {
                bestMove = line;
                break;
            }
        }

        writer.write("quit\n");
        writer.flush();

        Map<String, String> result = new HashMap<>();
        result.put("mejorJugada", bestMove);
        result.put("evaluacion", evaluation);
        return result;
    }
}
