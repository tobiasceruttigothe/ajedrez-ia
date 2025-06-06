package com.ajedrez.stockfishapi;

import org.springframework.web.bind.annotation.*;
import java.io.*;
import java.util.*;
import java.util.regex.Pattern;
import java.util.regex.Matcher;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class AjedrezController {

    @PostMapping("/analizar")
    public Map<String, Object> analizar(@RequestBody Map<String, String> body) throws IOException {
        String fen = body.get("fen");

        ProcessBuilder pb = new ProcessBuilder("./stockfish.exe");
        Process process = pb.start();

        BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(process.getOutputStream()));
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));

        // Configuración inicial
        writer.write("uci\n");
        writer.write("isready\n");
        writer.write("setoption name MultiPV value 3\n"); // Obtener las 3 mejores jugadas
        writer.write("position fen " + fen + "\n");
        writer.write("go depth 20\n"); // Mayor profundidad
        writer.flush();

        String bestMove = "";
        List<Map<String, Object>> variations = new ArrayList<>();
        Map<String, Object> finalEvaluation = new HashMap<>();

        String line;
        while ((line = reader.readLine()) != null) {
            if (line.startsWith("info depth") && line.contains("pv")) {
                Map<String, Object> moveInfo = parseInfoLine(line);
                if (moveInfo != null) {
                    // Solo guardar evaluaciones profundas
                    int depth = (Integer) moveInfo.get("depth");
                    if (depth >= 15) {
                        int multiPv = (Integer) moveInfo.getOrDefault("multipv", 1);

                        // Actualizar o agregar variación
                        while (variations.size() < multiPv) {
                            variations.add(new HashMap<>());
                        }
                        variations.set(multiPv - 1, moveInfo);

                        // La primera variación es la mejor
                        if (multiPv == 1) {
                            finalEvaluation = moveInfo;
                        }
                    }
                }
            }
            if (line.startsWith("bestmove")) {
                bestMove = extractBestMove(line);
                break;
            }
        }

        writer.write("quit\n");
        writer.flush();

        // Preparar resultado completo
        Map<String, Object> result = new HashMap<>();
        result.put("mejorJugada", bestMove);
        result.put("evaluacion", finalEvaluation);
        result.put("variaciones", variations);
        result.put("fen", fen);
        result.put("timestamp", System.currentTimeMillis());

        return result;
    }

    private Map<String, Object> parseInfoLine(String line) {
        Map<String, Object> info = new HashMap<>();

        try {
            // Extraer profundidad
            Pattern depthPattern = Pattern.compile("depth (\\d+)");
            Matcher depthMatcher = depthPattern.matcher(line);
            if (depthMatcher.find()) {
                info.put("depth", Integer.parseInt(depthMatcher.group(1)));
            }

            // Extraer MultiPV
            Pattern multipvPattern = Pattern.compile("multipv (\\d+)");
            Matcher multipvMatcher = multipvPattern.matcher(line);
            if (multipvMatcher.find()) {
                info.put("multipv", Integer.parseInt(multipvMatcher.group(1)));
            }

            // Extraer evaluación (centipawns o mate)
            if (line.contains("score cp")) {
                Pattern cpPattern = Pattern.compile("score cp (-?\\d+)");
                Matcher cpMatcher = cpPattern.matcher(line);
                if (cpMatcher.find()) {
                    int centipawns = Integer.parseInt(cpMatcher.group(1));
                    info.put("evaluacionCp", centipawns);
                    info.put("evaluacionPeones", centipawns / 100.0);
                    info.put("tipoEvaluacion", "centipawns");
                }
            } else if (line.contains("score mate")) {
                Pattern matePattern = Pattern.compile("score mate (-?\\d+)");
                Matcher mateMatcher = matePattern.matcher(line);
                if (mateMatcher.find()) {
                    int mateIn = Integer.parseInt(mateMatcher.group(1));
                    info.put("mateEn", mateIn);
                    info.put("tipoEvaluacion", "mate");
                }
            }

            // Extraer nodos
            Pattern nodesPattern = Pattern.compile("nodes (\\d+)");
            Matcher nodesMatcher = nodesPattern.matcher(line);
            if (nodesMatcher.find()) {
                info.put("nodos", Long.parseLong(nodesMatcher.group(1)));
            }

            // Extraer tiempo
            Pattern timePattern = Pattern.compile("time (\\d+)");
            Matcher timeMatcher = timePattern.matcher(line);
            if (timeMatcher.find()) {
                info.put("tiempo", Integer.parseInt(timeMatcher.group(1)));
            }

            // Extraer velocidad (nps)
            Pattern npsPattern = Pattern.compile("nps (\\d+)");
            Matcher npsMatcher = npsPattern.matcher(line);
            if (npsMatcher.find()) {
                info.put("nps", Long.parseLong(npsMatcher.group(1)));
            }

            // Extraer línea principal (secuencia de jugadas)
            Pattern pvPattern = Pattern.compile("pv (.+)");
            Matcher pvMatcher = pvPattern.matcher(line);
            if (pvMatcher.find()) {
                String pvLine = pvMatcher.group(1);
                String[] moves = pvLine.split(" ");
                info.put("lineaPrincipal", Arrays.asList(moves));
                info.put("primerJugada", moves.length > 0 ? moves[0] : "");
            }

            return info.isEmpty() ? null : info;
        } catch (Exception e) {
            return null;
        }
    }

    private String extractBestMove(String line) {
        String[] parts = line.split(" ");
        return parts.length > 1 ? parts[1] : "";
    }

    // Endpoint adicional para análisis con IA interpretativa
    @PostMapping("/analizar-completo")
    public Map<String, Object> analizarCompleto(@RequestBody Map<String, String> body) throws IOException {
        // Primero obtener análisis de Stockfish
        Map<String, Object> stockfishAnalysis = analizar(body);

        // Aquí integrarías la llamada a tu IA interpretativa
        // Por ejemplo, OpenAI, Claude, o tu propia IA
        String interpretacion = interpretarAnalisisConIA(stockfishAnalysis, body.get("fen"));

        stockfishAnalysis.put("interpretacionIA", interpretacion);
        return stockfishAnalysis;
    }

    private String interpretarAnalisisConIA(Map<String, Object> analysis, String fen) {
        // Aquí integrarías tu IA
        // Por ejemplo, construir un prompt y enviar a OpenAI/Claude

        String prompt = construirPromptParaIA(analysis, fen);
        // return llamadaAIA(prompt);

        // Por ahora retorno un placeholder
        return "Análisis interpretativo pendiente de integración con IA";
    }

    private String construirPromptParaIA(Map<String, Object> analysis, String fen) {
        StringBuilder prompt = new StringBuilder();
        prompt.append("Analiza esta posición de ajedrez y proporciona una explicación detallada:\n\n");
        prompt.append("FEN: ").append(fen).append("\n");
        prompt.append("Análisis de Stockfish: ").append(analysis.toString()).append("\n\n");
        prompt.append("Por favor, explica:\n");
        prompt.append("1. La evaluación de la posición\n");
        prompt.append("2. Las mejores jugadas y por qué\n");
        prompt.append("3. Los planes típicos para ambos bandos\n");
        prompt.append("4. Puntos críticos de la posición\n");
        prompt.append("5. Sugerencias para el jugador\n");

        return prompt.toString();
    }
}