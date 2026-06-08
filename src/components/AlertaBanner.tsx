import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Alerta } from "../interfaces/missao";
import { CORES } from "../utils/tema";
import { formatarTimestamp } from "../utils/formatadores";

type AlertaBannerProps = {
  alerta: Alerta;
  onResolver?: (id: string) => void;
};

export default function AlertaBanner({ alerta, onResolver }: AlertaBannerProps) {
  const corFundo = alerta.ativo
    ? "rgba(218, 5, 5, 0.12)"
    : "rgba(0, 230, 50, 0.08)";
  const corBorda = alerta.ativo ? CORES.critico : CORES.ok;
  const corTexto = alerta.ativo ? CORES.critico : CORES.ok;

  return (
    <View style={[styles.banner, { backgroundColor: corFundo, borderColor: corBorda }]}>
      {/* Indicador + mensagem */}
      <View style={styles.conteudo}>
        <Text style={styles.indicador}>{alerta.ativo ? "🔴" : "✅"}</Text>
        <View style={styles.textos}>
          <Text style={[styles.mensagem, { color: corTexto }]}>
            {alerta.mensagem}
          </Text>
          <Text style={styles.timestamp}>
            {formatarTimestamp(alerta.timestamp)}
          </Text>
        </View>
      </View>

      {/* Botão resolver (só para alertas ativos) */}
      {alerta.ativo && onResolver && (
        <TouchableOpacity
          style={styles.btnResolver}
          onPress={() => onResolver(alerta.id)}
          activeOpacity={0.7}
        >
          <Text style={styles.btnTexto}>Resolver</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  banner: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 10,
  },
  conteudo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  indicador: {
    fontSize: 18,
    marginTop: 2,
  },
  textos: {
    flex: 1,
    gap: 4,
  },
  mensagem: {
    fontSize: 13,
    fontWeight: "700",
    lineHeight: 18,
  },
  timestamp: {
    fontSize: 11,
    color: CORES.textoSecundario,
  },
  btnResolver: {
    backgroundColor: CORES.primaria,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  btnTexto: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
  },
});
