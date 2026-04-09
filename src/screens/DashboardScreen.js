import { View, FlatList, Text, StyleSheet, Pressable, Alert } from 'react-native';
import { colors } from '../theme/colors';
import AccountCard from '../components/AccountCard';

export default function DashboardScreen({ navigation, accounts, resetAccounts }) {
  // Calcul du solde total
  const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

  return (
    <View style={styles.container}>
      {/* Bandeau solde total */}
      <View style={styles.totalBanner}>
        <Text style={styles.totalLabel}>Patrimoine Total</Text>
        <Text style={styles.totalAmount}>
          {totalBalance.toLocaleString('fr-FR', {
            minimumFractionDigits: 2,
          })} MAD
        </Text>
        <Text style={styles.totalSub}>{accounts.length} compte(s) actif(s)</Text>

        <View style={styles.resetContainer}>
          <Pressable
            onPress={() => {
              Alert.alert(
                "Réinitialisation des données",
                "Êtes-vous sûre de vouloir réinitialiser les données ?",
                [
                  { text: "Annuler", style: "cancel" },
                  { text: "Confirmer", onPress: () => resetAccounts() },
                ]
              );
            }}
            style={({ pressed }) => [
              styles.resetButton,
              pressed && styles.resetButtonPressed,
            ]}
          >
            <Text style={styles.resetButtonText}>Réinitialiser</Text>
          </Pressable>
        </View>
        
      </View>

      {/* Liste des comptes */}
      <FlatList
        data={accounts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AccountCard
            account={item}
            onPress={() =>
              navigation.navigate('AccountDetail', { accountId: item.id })
            }
          />
        )}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <Text style={styles.sectionTitle}>Sélectionnez un compte</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.background },
  totalBanner: {
    backgroundColor: colors.primary,
    padding: 24,
    alignItems: 'center',
  },
  totalLabel: { color: 'rgba(255,255,255,0.75)', fontSize: 13 },
  totalAmount: { color: '#fff', fontSize: 32, fontWeight: '800', marginVertical: 4 },
  totalSub: { color: 'rgba(255,255,255,0.6)', fontSize: 12 },
  list: { paddingBottom: 24 },
  sectionTitle: {
    fontSize: 13,
    color: colors.textLight,
    paddingHorizontal: 16,
    paddingVertical: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
   resetContainer: {
    width: 110,
    marginTop: 24,
    alignSelf: "center",
  },

  resetButton: {
    backgroundColor: colors.danger,
    paddingVertical: 10,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },

  resetButtonPressed: {
    transform: [{ scale: 0.97 }],
    opacity: 0.8,
  },

  resetButtonText: {
    fontSize: 14,
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
  },
});