import React from "react";
import { getStyles } from "../styles";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const Settlement = ({showSettlement, settlement, expenses, handleSettle, theme}) => {
    const uStyles = getStyles;
    return (
        <View style={[uStyles.section, { backgroundColor: theme.surface }]}>
          {showSettlement ? (
            <>
              {settlement
                .filter(person => Math.abs(person.net) > 0.01)
                .map((person) => (
                  <Text key={person.name} style={[styles.settlementItem, { color: theme.text }]}>
                    <Text style={[styles.personName, { color: theme.text }]}>{person.name}</Text>: {" "}
                    <Text style={person.net >= 0 ? styles.positiveAmount : styles.negativeAmount}>
                      {person.net >= 0 ? "is owed" : "owes"} {Math.abs(person.net.toFixed(2))} yen
                    </Text>
                  </Text>
                ))}
              {settlement.every(person => Math.abs(person.net) <= 0.01) && (
                <Text style={[uStyles.emptyText, { color: theme.textSecondary }]}>All balances are settled!</Text>
              )}
              {expenses.length > 0 && (
                <TouchableOpacity 
                  style={[styles.settleButton, { backgroundColor: theme.primary }]}
                  onPress={handleSettle}
                >
                  <Text style={[styles.settleButtonText, { color: theme.background }]}>Settle All Expenses</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={[styles.settledMessage, { color: theme.text }]}>All expenses have been settled! 🎉</Text>
          )}
        </View>
    );
};

const styles = StyleSheet.create({
    settlementItem: { fontSize: 16, marginBottom: 8 },
    personName: {
      fontWeight: '600',
    },
    positiveAmount: {
      color: '#11A31D',
    },
    negativeAmount: {
      color: '#FF3F34',
      opacity: 0.7,
    },
    settleButton: {
      backgroundColor: '#FFDC00',
      padding: 16,
      borderRadius: 8,
      alignItems: 'center',
      marginTop: 16,
    },
    settleButtonText: {
      color: '#1E1E1E',
      fontWeight: 'bold',
      fontSize: 16,
    },
    settledMessage: {
        color: '#10b981',
        fontSize: 16,
        textAlign: 'center',
        fontWeight: '500',
        padding: 12,
    },
});

export default Settlement;