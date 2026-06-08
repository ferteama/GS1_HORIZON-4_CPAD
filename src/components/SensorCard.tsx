import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { Sensor } from "../interfaces/sensor";
import { CORES } from "../utils/tema";
import { calcularPercentual, corDoStatus } from "../utils/formatadores";

type SensorCardProps = {
  sensor: Sensor;
};

export default function SensorCard({ sensor }: SensorCardProps) {
  const percentual = calcularPercentual(
    sensor.valor,
    sensor.limiteMin,
    sensor.limiteMax
  );
  const corStatus = corDoStatus(sensor.status);
  const eCritico = sensor.status === "critico";
  const eAlerta = sensor.status === "alerta";

  return (
    <View
      style={[
        styles.card,
        eCritico && styles.cardCritico,
        eAlerta && styles.cardAlerta,
      ]}
    >
      {/* Ícone + nome do sensor */}
      <View style={styles.cabecalho}>
        <Text style={styles.icone}>{sensor.icone}</Text>
        <Text style={styles.nome}>{sensor.nome}</Text>
        {/* Badge de status */}
        <View style={[styles.badge, { backgroundColor: corStatus + "22" }]}>
          <Text style={[styles.badgeTexto, { color: corStatus }]}>
            {sensor.status.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Valor principal */}
      <Text style={styles.valor}>
        {sensor.valor}
        <Text style={styles.unidade}> {sensor.unidade}</Text>
      </Text>

      {/* Barra de progresso */}
      <View style={styles.barraFundo}>
        <View
          style={[
            styles.barraFill,
            {
              width: `${percentual}%` as any,
              backgroundColor: corStatus,
            },
          ]}
        />
      </View>

      {/* Limites */}
      <View style={styles.limites}>
        <Text style={styles.limiteTexto}>
          Min: {sensor.limiteMin}
        </Text>
        <Text style={styles.limiteTexto}>
          Max: {sensor.limiteMax}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.primaria,
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  cardCritico: {
    borderColor: CORES.critico,
    shadowColor: CORES.critico,
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  cardAlerta: {
    borderColor: CORES.alerta,
    shadowColor: CORES.alerta,
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  cabecalho: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    gap: 8,
  },
  icone: {
    fontSize: 20,
  },
  nome: {
    flex: 1,
    fontSize: 13,
    fontWeight: "700",
    color: CORES.textoSecundario,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  badgeTexto: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  valor: {
    fontSize: 24,
    fontWeight: "800",
    color: CORES.textoPrincipal,
    marginBottom: 10,
  },
  unidade: {
    fontSize: 14,
    fontWeight: "400",
    color: CORES.textoSecundario,
  },
  barraFundo: {
    height: 6,
    backgroundColor: "rgba(255,255,255,0.1)",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  barraFill: {
    height: "100%",
    borderRadius: 4,
  },
  limites: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  limiteTexto: {
    fontSize: 11,
    color: CORES.textoSecundario,
    opacity: 0.7,
  },
});
