import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { useMissao } from "../context/MissaoContext";
import { AlertaBanner } from "../components";
import { CORES } from "../utils/tema";

export default function AlertasScreen() {
  const { missao, resolverAlerta, limparHistoricoAlertas } = useMissao();

  const alertasAtivos = useMemo(
    () => missao.alertas.filter((a) => a.ativo).reverse(),
    [missao.alertas]
  );
  const historico = useMemo(
    () => missao.alertas.filter((a) => !a.ativo).reverse(),
    [missao.alertas]
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.scroll}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Resumo ── */}
      <View style={styles.resumo}>
        <View style={styles.resumoItem}>
          <Text style={[styles.resumoNumero, { color: CORES.critico }]}>
            {alertasAtivos.length}
          </Text>
          <Text style={styles.resumoLabel}>Ativos</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.resumoItem}>
          <Text style={[styles.resumoNumero, { color: CORES.ok }]}>
            {historico.length}
          </Text>
          <Text style={styles.resumoLabel}>Resolvidos</Text>
        </View>
        <View style={styles.divisor} />
        <View style={styles.resumoItem}>
          <Text style={[styles.resumoNumero, { color: CORES.primaria }]}>
            {missao.alertas.length}
          </Text>
          <Text style={styles.resumoLabel}>Total</Text>
        </View>
      </View>

      {/* ── Alertas ativos ── */}
      <Text style={styles.secaoTitulo}>🔴 ALERTAS ATIVOS</Text>

      {alertasAtivos.length === 0 ? (
        <View style={styles.vazio}>
          <Text style={styles.vazioIcone}>✅</Text>
          <Text style={styles.vazioTexto}>
            Todos os sistemas operando normalmente.
          </Text>
        </View>
      ) : (
        alertasAtivos.map((alerta) => (
          <AlertaBanner
            key={alerta.id}
            alerta={alerta}
            onResolver={resolverAlerta}
          />
        ))
      )}

      {/* ── Histórico ── */}
      {historico.length > 0 && (
        <>
          <View style={styles.secaoHeader}>
            <Text style={styles.secaoTitulo}>📋 HISTÓRICO</Text>
            <TouchableOpacity
              onPress={limparHistoricoAlertas}
              style={styles.btnLimpar}
            >
              <Text style={styles.btnLimparTexto}>Limpar</Text>
            </TouchableOpacity>
          </View>

          {historico.map((alerta) => (
            <AlertaBanner key={alerta.id} alerta={alerta} />
          ))}
        </>
      )}

      {/* Estado vazio total */}
      {missao.alertas.length === 0 && (
        <View style={styles.vazioTotal}>
          <Text style={styles.vazioIcone}>🚀</Text>
          <Text style={styles.vazioTexto}>
            Nenhum alerta registrado ainda.{"\n"}O sistema monitorará
            automaticamente os sensores.
          </Text>
        </View>
      )}
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
  resumo: {
    flexDirection: "row",
    backgroundColor: CORES.fundoCard,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: CORES.borda,
    padding: 16,
    marginBottom: 20,
    justifyContent: "space-around",
    alignItems: "center",
  },
  resumoItem: {
    alignItems: "center",
    gap: 4,
  },
  resumoNumero: {
    fontSize: 28,
    fontWeight: "900",
  },
  resumoLabel: {
    fontSize: 11,
    color: CORES.textoSecundario,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  divisor: {
    width: 1,
    height: 40,
    backgroundColor: CORES.borda,
    opacity: 0.5,
  },
  secaoHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES.textoSecundario,
    letterSpacing: 2,
    marginBottom: 12,
  },
  btnLimpar: {
    backgroundColor: "rgba(218,5,5,0.15)",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: CORES.critico,
    marginBottom: 12,
  },
  btnLimparTexto: {
    color: CORES.critico,
    fontSize: 12,
    fontWeight: "700",
  },
  vazio: {
    alignItems: "center",
    padding: 32,
    backgroundColor: "rgba(0,230,50,0.06)",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(0,230,50,0.2)",
    marginBottom: 20,
    gap: 12,
  },
  vazioTotal: {
    alignItems: "center",
    padding: 48,
    gap: 12,
  },
  vazioIcone: {
    fontSize: 48,
  },
  vazioTexto: {
    fontSize: 14,
    color: CORES.textoSecundario,
    textAlign: "center",
    lineHeight: 22,
  },
});
