import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Text } from "react-native";

import { MissaoProvider } from "../context/MissaoContext";
import { CORES } from "../utils/tema";

export default function RootLayout() {
  return (
    <MissaoProvider>
      <StatusBar style="light" backgroundColor={CORES.fundoNav} />

      <Tabs
        screenOptions={{
          tabBarStyle: {
            backgroundColor: CORES.fundoNav,
            borderTopColor: CORES.borda,
            borderTopWidth: 1,
            height: 60,
            paddingBottom: 8,
          },
          tabBarActiveTintColor: CORES.primaria,
          tabBarInactiveTintColor: CORES.textoSecundario,
          tabBarLabelStyle: {
            fontSize: 11,
            fontWeight: "600",
          },
          headerStyle: {
            backgroundColor: CORES.fundoNav,
          },
          headerTintColor: CORES.textoPrincipal,
          headerTitleStyle: {
            fontWeight: "800",
            letterSpacing: 1,
            color: CORES.primaria,
          },
        }}
      >
        {/* ── Tab 1: Dashboard ── */}
        <Tabs.Screen
          name="index"
          options={{
            title: "DASHBOARD",
            tabBarLabel: "Dashboard",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📊</Text>
            ),
          }}
        />

        {/* ── Tab 2: Alertas ── */}
        <Tabs.Screen
          name="alertas"
          options={{
            title: "ALERTAS",
            tabBarLabel: "Alertas",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>🚨</Text>
            ),
          }}
        />

        {/* ── Tab 3: Formulário ── */}
        <Tabs.Screen
          name="formulario"
          options={{
            title: "EVENTO",
            tabBarLabel: "Registrar",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>📋</Text>
            ),
          }}
        />

        {/* ── Tab 4: Configurações ── */}
        <Tabs.Screen
          name="configuracoes"
          options={{
            title: "CONFIGURAÇÕES",
            tabBarLabel: "Config",
            tabBarIcon: ({ color }) => (
              <Text style={{ fontSize: 20, color }}>⚙️</Text>
            ),
          }}
        />
      </Tabs>
    </MissaoProvider>
  );
}
