import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Text } from 'react-native';

import { initialAccounts } from './src/data/accounts';
import { colors } from './src/theme/colors';

import DashboardScreen from './src/screens/DashboardScreen';
import AccountDetailScreen from './src/screens/AccountDetailScreen';
import TransferScreen from './src/screens/TransferScreen';
import HistoryScreen from './src/screens/HistoryScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

// Stack imbriqué dans l'onglet "Comptes"
function AccountsStack({ accounts, onDebit, onCredit, onTransfer, resetAccounts }) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.primary },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
      }}
    >
      <Stack.Screen name="Dashboard" options={{ title: 'Mes Comptes' }}>
        {(props) => (
          <DashboardScreen {...props} accounts={accounts} resetAccounts={resetAccounts} />
        )}
      </Stack.Screen>

      <Stack.Screen name="AccountDetail" options={{ title: 'Détail du Compte' }}>
        {(props) => (
          <AccountDetailScreen
            {...props}
            accounts={accounts}
            onDebit={onDebit}
            onCredit={onCredit}
          />
        )}
      </Stack.Screen>

      <Stack.Screen name="Transfer" options={{ title: 'Virement' }}>
        {(props) => (
          <TransferScreen
            {...props}
            accounts={accounts}
            onTransfer={onTransfer}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}

export default function App() {
  // ─── État global des comptes ────────────────────────────────────────────────
  const [accounts, setAccounts] = useState(initialAccounts);

  // ─── Opération : Débit ──────────────────────────────────────────────────────
  const handleDebit = (accountId, amount, label) => {
    const account = accounts.find(a => a.id === accountId);

    if (!account || account.balance < amount) {
      return false;
    }

    setAccounts(prev => prev.map(acc => {
      if (acc.id !== accountId) return acc;

      return {
        ...acc,
        balance: acc.balance - amount,
        transactions: [{
          id: 'T' + Date.now(),
          type: 'debit',
          amount,
          label,
          date: new Date().toLocaleDateString('fr-FR'),
        }, ...acc.transactions],
      };
    }));

    return true;
  };

  // ─── Opération : Crédit ─────────────────────────────────────────────────────
  const handleCredit = (accountId, amount, label) => {

    setAccounts(prev =>
      prev.map(acc => {
        if (acc.id !== accountId) return acc;
        const newTransaction = {
          id: 'T' + Date.now(),
          type: 'credit',
          amount,
          label,
          date: new Date().toLocaleDateString('fr-FR'),
        };
        return {
          ...acc,
          balance: acc.balance + amount,
          transactions: [newTransaction, ...acc.transactions],
        };
      })
    );
  };

  // ─── Opération : Virement ───────────────────────────────────────────────────
  const handleTransfer = (fromId, toId, amount, label) => {
    const account = accounts.find(a => a.id === fromId);

    if (!account || account.balance < amount) {
      return false;
    }

    setAccounts(prev => prev.map(
      acc => {
        if (acc.id == fromId) {

          const newTransaction = {
            id: 'T' + Date.now(),
            type: 'virement_sortant',
            amount,
            label,
            date: new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance: acc.balance - amount,
            transactions: [newTransaction, ...acc.transactions]
          }
        } else if (acc.id == toId) {
          const newTransaction = {
            id: 'T' + Date.now(),
            type: 'virement_entrant',
            amount,
            label,
            date: new Date().toLocaleDateString('fr-FR'),
          };
          return {
            ...acc,
            balance: acc.balance + amount,
            transactions: [newTransaction, ...acc.transactions]
          }
        }
        else {
          return acc
        }
      }
    ))
    return true;
  };

  const resetAccounts = () => {
    setAccounts(initialAccounts)
  }

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.textLight,
          tabBarStyle: {
            borderTopColor: colors.border,
            height: 60,
            paddingBottom: 6,
          },
          headerShown: false,
        }}
      >
        <Tab.Screen
          name="AccountsTab"
          options={{
            tabBarLabel: 'Comptes',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>🏦</Text>,
          }}
        >
          {() => (
            <AccountsStack
              accounts={accounts}
              resetAccounts={resetAccounts}
              onDebit={handleDebit}
              onCredit={handleCredit}
              onTransfer={handleTransfer}
            />
          )}
        </Tab.Screen>

        <Tab.Screen
          name="HistoryTab"
          options={{
            tabBarLabel: 'Historique',
            tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 20 }}>📋</Text>,
            headerShown: true,
            headerStyle: { backgroundColor: colors.primary },
            headerTintColor: '#fff',
            headerTitleStyle: { fontWeight: '700' },
            title: 'Historique',
          }}
        >
          {() => <HistoryScreen accounts={accounts} />}
        </Tab.Screen>
      </Tab.Navigator>
    </NavigationContainer>
  );
}