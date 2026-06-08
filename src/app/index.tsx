import React from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMissao } from "../context/MissaoContext";
import { SensorCard } from "../components";
import { CORES } from "../utils/tema";

export default function DashboardScreen() {
  const { missao, carregando, atualizarTelemetria } = useMissao();

  const alertasAtivos = missao.alertas.filter((a) => a.ativo).length;
  const statusGeral =
    alertasAtivos === 0
      ? "NOMINAL"
      : alertasAtivos <= 2
      ? "ALERTA"
      : "CRÍTICO";

  const corStatusGeral =
    statusGeral === "NOMINAL"
      ? CORES.ok
      : statusGeral === "ALERTA"
      ? CORES.alerta
      : CORES.critico;

  if (carregando) {
    return (
      <View style={styles.centro}>
        <ActivityIndicator size="large" color={CORES.primaria} />
        <Text style={styles.carregandoTexto}>Inicializando sistemas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Cabeçalho ── */}
      <View style={styles.cabecalho}>
        <View>
          <Text style={styles.missaoNome}>🚀 {missao.nome}</Text>
          <Text style={styles.diasTexto}>
            {missao.diasEmOrbita} dias em órbita
          </Text>
        </View>
        {/* Badge status geral */}
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: corStatusGeral + "22", borderColor: corStatusGeral },
          ]}
        >
          <Text style={[styles.statusTexto, { color: corStatusGeral }]}>
            {statusGeral}
          </Text>
          {alertasAtivos > 0 && (
            <Text style={[styles.alertasCount, { color: corStatusGeral }]}>
              {alertasAtivos} alerta{alertasAtivos > 1 ? "s" : ""}
            </Text>
          )}
        </View>
      </View>

      {/* ── Subtítulo ── */}
      <Text style={styles.subtitulo}>
        DADOS OPERACIONAIS EM TEMPO REAL
      </Text>

      {/* ── Grid de sensores ── */}
      {missao.sensores.map((sensor) => (
        <SensorCard key={sensor.id} sensor={sensor} />
      ))}

      {/* ── Botão atualizar ── */}
      <TouchableOpacity
        style={styles.btnAtualizar}
        onPress={atualizarTelemetria}
        activeOpacity={0.8}
      >
        <Text style={styles.btnTexto}>🔄  Atualizar Telemetria</Text>
      </TouchableOpacity>

      {/* ── Rodapé ── */}
      <Text style={styles.rodape}>
        HORIZON-4 Mission Control • Dados Simulados
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoBody,
  },
  scroll: {
    padding: 16,
    paddingBottom: 32,
  },
  centro: {
    flex: 1,
    backgroundColor: CORES.fundoBody,
    alignItems: "center",
    justifyContent: "center",
    gap: 16,
  },
  carregandoTexto: {
    color: CORES.textoSecundario,
    fontSize: 14,
  },
  cabecalho: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 8,
    marginTop: 8,
  },
  missaoNome: {
    fontSize: 24,
    fontWeight: "900",
    color: CORES.primaria,
    letterSpacing: 1,
  },
  diasTexto: {
    fontSize: 13,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  statusBadge: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 6,
    alignItems: "center",
  },
  statusTexto: {
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 1,
  },
  alertasCount: {
    fontSize: 10,
    fontWeight: "600",
    marginTop: 2,
  },
  subtitulo: {
    fontSize: 11,
    color: CORES.textoSecundario,
    letterSpacing: 2,
    marginBottom: 16,
    marginTop: 4,
  },
  btnAtualizar: {
    backgroundColor: CORES.primaria,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 16,
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
    letterSpacing: 0.5,
  },
  rodape: {
    fontSize: 11,
    color: CORES.textoSecundario,
    textAlign: "center",
    opacity: 0.6,
    letterSpacing: 1,
  },
});
