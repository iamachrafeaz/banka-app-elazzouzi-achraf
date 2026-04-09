import {
    View, Text, FlatList, StyleSheet, TextInput,
    Pressable, KeyboardAvoidingView, Platform, Alert, ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { colors } from '../theme/colors';
import { useState, useMemo } from 'react';

function TransferScreen({ accounts, onTransfer }) {
    const route = useRoute();
    const navigation = useNavigation();
    const { fromAccountId } = route.params;
    const currentAccount = accounts.find(a => a.id == fromAccountId);

    const [amount, setAmount] = useState("");
    const [label, setLabel] = useState("");
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [error, setError] = useState(null);

    const recipientAccounts = useMemo(
        () => accounts.filter(acc => acc.id !== fromAccountId),
        [accounts, fromAccountId]
    );

    const handleSubmit = () => {
        setError(null);

        const numericAmount = parseFloat(amount);

        if (!selectedAccount) {
            setError("Veuillez sélectionner un compte destinataire.");
            return;
        }
        if (!label.trim()) {
            setError("Le libellé de l'opération est requis.");
            return;
        }
        if (isNaN(numericAmount) || numericAmount <= 0) {
            setError("Veuillez saisir un montant valide.");
            return;
        }
        if (numericAmount > currentAccount.balance) {
            setError("Solde insuffisant pour effectuer ce virement.");
            return;
        }

        Alert.alert(
            "Confirmer le virement",
            `Voulez-vous transférer ${numericAmount} MAD vers ${selectedAccount.label} ?`,
            [
                { text: "Annuler", style: "cancel" },
                {
                    text: "Confirmer",
                    onPress: () => {
                        const success = onTransfer(fromAccountId, selectedAccount.id, numericAmount, label);

                        if (success) {
                            setAmount("");
                            setLabel("");
                            setError(null);
                            navigation.goBack(); 
                        } else {
                            setError("Le virement a échoué. Veuillez vérifier votre solde.");
                        }
                    }
                }
            ]
        );
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Nouveau Virement</Text>

                {error && (
                    <View style={styles.errorBanner}>
                        <Text style={styles.errorText}>{error}</Text>
                    </View>
                )}

                <View style={styles.currentAccountContainer}>
                    <Text style={styles.uppercaseText}>Compte source</Text>
                    <Text style={styles.accountLabel}>{currentAccount.label}</Text>
                    <Text>Solde : {currentAccount.balance.toLocaleString('fr-FR')} MAD</Text>
                </View>

                <View style={styles.arrowContainer}>
                    <Text style={styles.arrow}>↓</Text>
                </View>
                <FlatList
                    data={recipientAccounts}
                    keyExtractor={(acc) => acc.id.toString()}
                    ListHeaderComponent={
                        <>

                            <Text style={styles.sectionTitle}>Compte destinataire</Text>
                        </>
                    }
                    renderItem={({ item }) => (
                        <Pressable
                            onPress={() => {
                                setSelectedAccount(item);
                                setError(null); // Clear error when user makes a selection
                            }}
                            style={[
                                styles.accountItem,
                                selectedAccount?.id === item.id && styles.accountItemSelected
                            ]}
                        >
                            <View>
                                <Text style={[
                                    styles.accountItemLabel,
                                    selectedAccount?.id === item.id && styles.accountItemLabelSelected
                                ]}>
                                    {item.label}
                                </Text>
                                <Text style={styles.accountItemBalance}>
                                    {item.balance.toLocaleString('fr-FR')} MAD
                                </Text>
                            </View>
                            <View style={[
                                styles.selectionCircle,
                                selectedAccount?.id === item.id && styles.selectionCircleSelected
                            ]} />
                        </Pressable>
                    )}
                    contentContainerStyle={styles.list}
                />

                <View style={styles.inputContainer}>
                    <TextInput
                        style={[styles.input, error && !label.trim() && styles.inputError]}
                        onChangeText={setLabel}
                        value={label}
                        placeholder="Libellé de l'opération"
                    />

                    <TextInput
                        style={[styles.input, error && (isNaN(parseFloat(amount)) || parseFloat(amount) > currentAccount.balance) && styles.inputError]}
                        onChangeText={setAmount}
                        value={amount}
                        placeholder="Montant en MAD"
                        keyboardType="numeric"
                    />

                    <Pressable
                        style={({ pressed }) => [
                            styles.submitButton,
                            pressed && { opacity: 0.8 }
                        ]}
                        onPress={handleSubmit}
                    >
                        <Text style={styles.submitButtonText}>↗ Valider le virement</Text>
                    </Pressable>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        margin: 20,
        backgroundColor: "#ffff",
        flex: 1,
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: colors.border
    },
    errorBanner: {
        backgroundColor: '#FEE2E2',
        padding: 12,
        borderRadius: 8,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#F87171'
    },
    errorText: {
        color: '#B91C1C',
        fontSize: 14,
        fontWeight: '500'
    },
    inputError: {
        borderColor: '#F87171',
        backgroundColor: '#FFF5F5'
    },
    title: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
    currentAccountContainer: { padding: 16, backgroundColor: "#EAF2FF", borderColor: "#B5D4F4", borderRadius: 12, borderWidth: 1, marginBottom: 15 },
    uppercaseText: { textTransform: 'uppercase', marginBottom: 4 },
    accountLabel: { fontSize: 16, fontWeight: "600", color: "#0B447C", marginBottom: 2 },
    arrowContainer: { paddingVertical: 12 },
    arrow: { textAlign: "center", fontSize: 36 },
    list: { paddingBottom: 24, gap: 12 },
    sectionTitle: { fontSize: 13, color: colors.textLight, textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
    accountItem: { padding: 16, backgroundColor: "#ffffff", borderColor: colors.border, borderRadius: 12, borderWidth: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
    accountItemSelected: { backgroundColor: "#EAF2FF", borderColor: "#B5D4F4" },
    accountItemLabel: { fontSize: 16, fontWeight: "600", color: "#000", marginBottom: 2 },
    accountItemLabelSelected: { color: "#0B447C" },
    accountItemBalance: { color: colors.textLight },
    selectionCircle: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: colors.border, backgroundColor: "#fff" },
    selectionCircleSelected: { backgroundColor: colors.primary, borderWidth: 0 },
    inputContainer: { gap: 12, marginTop: 16 },
    input: { backgroundColor: colors.background, padding: 14, borderRadius: 12, borderWidth: 1, borderColor: colors.border },
    submitButton: { backgroundColor: colors.primary, paddingVertical: 14, paddingHorizontal: 16, borderRadius: 12 },
    submitButtonText: { fontWeight: "bold", color: "white", textAlign: "center" }
});

export default TransferScreen;