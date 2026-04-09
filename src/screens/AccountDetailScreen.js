import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, Platform
} from 'react-native';
import { colors } from '../theme/colors';
import TransactionItem from '../components/TransactionItem';

export default function AccountDetailScreen({ route, navigation, accounts, onDebit, onCredit }) {
  const { accountId } = route.params;

  // Récupérer le compte depuis la prop accounts (pas les params — pourquoi ?)
  const account = accounts.find(a => a.id === accountId);
  const isSufficiantBalance = account.balance == 0;

  const [amount, setAmount] = useState('');
  const [label, setLabel] = useState('');
  const [mode, setMode] = useState(null); // 'debit' | 'credit' | null

  if (!account) {
    return <Text style={{ padding: 20 }}>Compte introuvable.</Text>;
  }

  const handleOperation = () => {
    const numAmount = parseFloat(amount);

    // Validations
    if (!label.trim()) {
      Alert.alert('Champ manquant', 'Veuillez saisir un libellé.');
      return;
    }
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Montant invalide', 'Veuillez saisir un montant positif.');
      return;
    }

    Alert.alert(
      `Confirmer le ${mode === 'debit' ? 'Débit' : 'Crédit'}`,
      `${numAmount.toLocaleString('fr-FR')} MAD — "${label}"`,
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Confirmer',
          onPress: () => {
            if (mode === 'debit') {
              const success = onDebit(accountId, numAmount, label);
              if (!success) {
                handleInsufficientBalance();
              }
            }
            else onCredit(accountId, numAmount, label);
            setAmount('');
            setLabel('');
            setMode(null);
          },
        },
      ]
    );
  };



  const handleInsufficientBalance = () => {
    Alert.alert(
      'Solde insuffisant',
      `Votre solde est de ${account.balance.toLocaleString('fr-FR')} MAD. Opération rejetée.`
    );
    return;
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        data={account.transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <TransactionItem transaction={item} />}
        ListHeaderComponent={
          <View>
            {/* Solde du compte */}
            <View style={styles.balanceBanner}>
              <Text style={styles.accountName}>{account.label}</Text>
              <Text style={account.balance < 1000 ? styles.dangerBalance  : styles.balance}>
                {account.balance.toLocaleString('fr-FR', { minimumFractionDigits: 2 })} MAD
              </Text>
            </View>

            {/* Boutons d'action */}
            <View style={styles.actionsRow}>
              <TouchableOpacity
                disabled={isSufficiantBalance}
                style={[styles.actionBtn, { backgroundColor: colors.danger, opacity: isSufficiantBalance ? 0.25 : 1 }]}
                onPress={() => setMode(mode === 'debit' ? null : 'debit')}
              >
                <Text style={styles.actionBtnText}>↓ Débit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: colors.success }]}
                onPress={() => setMode(mode === 'credit' ? null : 'credit')}
              >
                <Text style={styles.actionBtnText}>↑ Crédit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isSufficiantBalance}
                style={[styles.actionBtn, { backgroundColor: colors.primary, opacity: isSufficiantBalance ? 0.25 : 1 }]}
                onPress={() => navigation.navigate('Transfer', { fromAccountId: accountId })}
              >
                <Text style={styles.actionBtnText}>↗ Virement</Text>
              </TouchableOpacity>
            </View>

            {/* Formulaire inline débit/crédit */}
            {mode && (
              <View style={styles.form}>
                <Text style={styles.formTitle}>
                  {mode === 'debit' ? '↓ Nouveau Débit' : '↑ Nouveau Crédit'}
                </Text>
                <TextInput
                  style={styles.input}
                  placeholder="Libellé de l'opération"
                  value={label}
                  onChangeText={setLabel}
                  placeholderTextColor={colors.textLight}
                />
                <TextInput
                  style={styles.input}
                  placeholder="Montant en MAD"
                  value={amount}
                  onChangeText={setAmount}
                  keyboardType="decimal-pad"
                  placeholderTextColor={colors.textLight}
                />
                <TouchableOpacity
                  style={[
                    styles.submitBtn,
                    { backgroundColor: mode === 'debit' ? colors.danger : colors.success }
                  ]}
                  onPress={handleOperation}
                >
                  <Text style={styles.submitBtnText}>Valider</Text>
                </TouchableOpacity>
              </View>
            )}

            <Text style={styles.historyTitle}>Historique des opérations</Text>
          </View>
        }
        ListEmptyComponent={
          <Text style={styles.empty}>Aucune opération enregistrée.</Text>
        }
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  balanceBanner: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  accountName: { color: 'rgba(255,255,255,0.75)', fontSize: 14 },
  balance: { color: 'white', fontSize: 34, fontWeight: '800', marginTop: 4 },
  dangerBalance: { color: colors.danger, fontSize: 34, fontWeight: '800', marginTop: 4 },
  actionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    gap: 8,
  },
  actionBtn: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  actionBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  form: {
    backgroundColor: colors.card,
    margin: 16,
    borderRadius: 12,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 12 },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: colors.text,
    marginBottom: 10,
    backgroundColor: colors.background,
  },
  submitBtn: { borderRadius: 8, paddingVertical: 12, alignItems: 'center' },
  submitBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  historyTitle: {
    fontSize: 13,
    color: colors.textLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  empty: { padding: 20, textAlign: 'center', color: colors.textLight },
});