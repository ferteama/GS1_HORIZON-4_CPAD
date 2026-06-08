import React, { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useMissao } from "../context/MissaoContext";
import { ConfiguracaoMissao } from "../interfaces/missao";
import { CORES } from "../utils/tema";
import { calcularDiasEmOrbita } from "../utils/formatadores";

const FREQUENCIAS = [
  { valor: 5, label: "5s" },
  { valor: 10, label: "10s" },
  { valor: 15, label: "15s (padrão)" },
  { valor: 30, label: "30s" },
  { valor: 60, label: "1 min" },
];

export default function ConfiguracoesScreen() {
  const { missao, config, salvarConfig } = useMissao();

  const [form, setForm] = useState<ConfiguracaoMissao>({ ...config });
  const [erros, setErros] = useState<{ nomeMissao?: string; nomeOperador?: string }>({});
  const [salvando, setSalvando] = useState(false);
  const [salvoOk, setSalvoOk] = useState(false);

  useEffect(() => {
    setForm({ ...config });
  }, [config]);

  function atualizar<K extends keyof ConfiguracaoMissao>(
    campo: K,
    valor: ConfiguracaoMissao[K]
  ) {
    setForm((prev) => ({ ...prev, [campo]: valor }));
    if (erros[campo as keyof typeof erros]) {
      setErros((prev) => ({ ...prev, [campo]: undefined }));
    }
    setSalvoOk(false);
  }

  function validar(): boolean {
    const novosErros: typeof erros = {};
    if (!form.nomeMissao.trim()) novosErros.nomeMissao = "Nome da missão obrigatório.";
    if (!form.nomeOperador.trim()) novosErros.nomeOperador = "Nome do operador obrigatório.";
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  }

  async function salvar() {
    if (!validar()) return;
    setSalvando(true);
    try {
      await salvarConfig(form);
      setSalvoOk(true);
    } finally {
      setSalvando(false);
    }
  }

  const diasOrbita = calcularDiasEmOrbita(missao.dataLancamento);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: CORES.fundoBody }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* ── Info da missão ── */}
        <View style={styles.infoCard}>
          <Text style={styles.infoTitulo}>📊 STATUS DA MISSÃO</Text>
          <View style={styles.infoGrid}>
            <InfoItem label="Missão" valor={missao.nome} />
            <InfoItem label="Dias em órbita" valor={`${diasOrbita}`} />
            <InfoItem
              label="Sensores"
              valor={`${missao.sensores.length}/12`}
            />
            <InfoItem
              label="Alertas ativos"
              valor={`${missao.alertas.filter((a) => a.ativo).length}`}
              cor={
                missao.alertas.filter((a) => a.ativo).length > 0
                  ? CORES.critico
                  : CORES.ok
              }
            />
          </View>
        </View>

        <Text style={styles.secaoTitulo}>⚙️ CONFIGURAÇÕES</Text>

        {/* ── Nome da missão ── */}
        <Campo label="🚀 Nome da Missão *" erro={erros.nomeMissao}>
          <TextInput
            style={[styles.input, erros.nomeMissao && styles.inputErro]}
            placeholder="Ex: HORIZON-4"
            placeholderTextColor={CORES.textoSecundario}
            value={form.nomeMissao}
            onChangeText={(v) => atualizar("nomeMissao", v)}
            autoCapitalize="characters"
          />
        </Campo>

        {/* ── Nome do operador ── */}
        <Campo label="👤 Nome do Operador *" erro={erros.nomeOperador}>
          <TextInput
            style={[styles.input, erros.nomeOperador && styles.inputErro]}
            placeholder="Seu nome completo"
            placeholderTextColor={CORES.textoSecundario}
            value={form.nomeOperador}
            onChangeText={(v) => atualizar("nomeOperador", v)}
            autoCapitalize="words"
          />
        </Campo>

        {/* ── Frequência de atualização ── */}
        <Campo label="⏱️ Frequência de Atualização">
          <View style={styles.grid}>
            {FREQUENCIAS.map((freq) => (
              <TouchableOpacity
                key={freq.valor}
                style={[
                  styles.opcao,
                  form.frequenciaAtualizacao === freq.valor &&
                    styles.opcaoSelecionada,
                ]}
                onPress={() => atualizar("frequenciaAtualizacao", freq.valor)}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.opcaoTexto,
                    form.frequenciaAtualizacao === freq.valor &&
                      styles.opcaoTextoSelecionado,
                  ]}
                >
                  {freq.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Campo>

        {/* ── Toggle: Alerta Sonoro ── */}
        <View style={styles.toggleRow}>
          <View>
            <Text style={styles.toggleLabel}>🔔 Alerta Sonoro</Text>
            <Text style={styles.toggleDesc}>
              Emitir som ao gerar novos alertas
            </Text>
          </View>
          <Switch
            value={form.alertaSonoro}
            onValueChange={(v) => atualizar("alertaSonoro", v)}
            trackColor={{ false: "#333", true: CORES.primaria + "88" }}
            thumbColor={form.alertaSonoro ? CORES.primaria : "#666"}
          />
        </View>

        {/* ── Notas da missão ── */}
        <Campo label="📝 Notas da Missão (opcional)">
          <TextInput
            style={[styles.input, styles.textarea]}
            placeholder="Anotações gerais sobre a missão..."
            placeholderTextColor={CORES.textoSecundario}
            value={form.notasMissao || ""}
            onChangeText={(v) => atualizar("notasMissao", v)}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </Campo>

        {/* ── Botão salvar ── */}
        <TouchableOpacity
          style={[styles.btnSalvar, salvando && styles.btnDesativado]}
          onPress={salvar}
          disabled={salvando}
          activeOpacity={0.8}
        >
          <Text style={styles.btnTexto}>
            {salvando ? "💾 Salvando..." : "💾 Salvar Configurações"}
          </Text>
        </TouchableOpacity>

        {/* Feedback de sucesso */}
        {salvoOk && (
          <View style={styles.bannerSucesso}>
            <Text style={styles.bannerTexto}>
              ✅ Configurações salvas com sucesso!
            </Text>
          </View>
        )}

        <Text style={styles.nota}>
          As configurações são persistidas localmente no dispositivo.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

function Campo({
  label,
  erro,
  children,
}: {
  label: string;
  erro?: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.campo}>
      <Text style={styles.campoLabel}>{label}</Text>
      {children}
      {erro && <Text style={styles.campoErro}>{erro}</Text>}
    </View>
  );
}

function InfoItem({
  label,
  valor,
  cor,
}: {
  label: string;
  valor: string;
  cor?: string;
}) {
  return (
    <View style={styles.infoItem}>
      <Text style={styles.infoItemLabel}>{label}</Text>
      <Text style={[styles.infoItemValor, cor ? { color: cor } : null]}>
        {valor}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: CORES.fundoBody,
  },
  scroll: {
    padding: 16,
    paddingBottom: 40,
  },
  infoCard: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: CORES.borda,
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
    marginTop: 8,
  },
  infoTitulo: {
    fontSize: 11,
    fontWeight: "800",
    color: CORES.primaria,
    letterSpacing: 2,
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  infoItem: {
    flex: 1,
    minWidth: "45%",
    gap: 2,
  },
  infoItemLabel: {
    fontSize: 11,
    color: CORES.textoSecundario,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  infoItemValor: {
    fontSize: 20,
    fontWeight: "800",
    color: CORES.textoPrincipal,
  },
  secaoTitulo: {
    fontSize: 12,
    fontWeight: "800",
    color: CORES.textoSecundario,
    letterSpacing: 2,
    marginBottom: 16,
  },
  campo: {
    marginBottom: 20,
  },
  campoLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: CORES.textoSecundario,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginBottom: 8,
  },
  campoErro: {
    fontSize: 12,
    color: CORES.critico,
    marginTop: 4,
  },
  input: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: "rgba(214,105,40,0.3)",
    borderRadius: 10,
    padding: 12,
    color: CORES.textoPrincipal,
    fontSize: 15,
  },
  inputErro: {
    borderColor: CORES.critico,
  },
  textarea: {
    minHeight: 100,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  opcao: {
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: "rgba(214,105,40,0.25)",
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  opcaoSelecionada: {
    backgroundColor: CORES.primaria + "22",
    borderColor: CORES.primaria,
  },
  opcaoTexto: {
    color: CORES.textoSecundario,
    fontSize: 12,
    fontWeight: "600",
  },
  opcaoTextoSelecionado: {
    color: CORES.primaria,
    fontWeight: "800",
  },
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: CORES.fundoCard,
    borderWidth: 1,
    borderColor: "rgba(214,105,40,0.25)",
    borderRadius: 10,
    padding: 16,
    marginBottom: 20,
  },
  toggleLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: CORES.textoPrincipal,
  },
  toggleDesc: {
    fontSize: 12,
    color: CORES.textoSecundario,
    marginTop: 2,
  },
  btnSalvar: {
    backgroundColor: CORES.primaria,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
    marginBottom: 12,
  },
  btnDesativado: {
    opacity: 0.6,
  },
  btnTexto: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 16,
    letterSpacing: 0.5,
  },
  bannerSucesso: {
    backgroundColor: "rgba(0,230,50,0.1)",
    borderWidth: 1,
    borderColor: CORES.ok,
    borderRadius: 10,
    padding: 14,
    alignItems: "center",
    marginBottom: 12,
  },
  bannerTexto: {
    color: CORES.ok,
    fontWeight: "700",
    fontSize: 14,
  },
  nota: {
    fontSize: 11,
    color: CORES.textoSecundario,
    textAlign: "center",
    opacity: 0.6,
  },
});
