import React from "react";
import { getStyles } from "../styles";
import { StyleSheet, TouchableOpacity, Text, View } from "react-native";

const Expenses = ({expenses, theme, toggleSection, expandedSections, getPersonExpenses, people}) => {
    const uStyles = getStyles;
    return (
        <View style={[uStyles.section, { backgroundColor: theme.surface }]}>
          {expenses.length === 0 ? (
            <Text style={[uStyles.emptyText, { color: theme.textSecondary }]}>No expenses yet.</Text>
          ) : (
            <>
              <TouchableOpacity 
                style={uStyles.sectionHeader}
                onPress={() => toggleSection('allExpenses')}
              >
                <Text style={[styles.expenseSubtitle, { color: theme.primary }]}>All Expenses</Text>
                <Text style={[uStyles.expandButton, { color: theme.primary }]}>
                  {expandedSections.allExpenses ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {expandedSections.allExpenses && (
                expenses.map((exp) => (
                  <Text key={exp.id} style={[styles.expenseItem, { color: theme.text }]}>
                    <Text style={{fontWeight: "bold", color: theme.text}}>{exp.description}</Text>: {exp.amount} yen{"\n"}
                    {"\n"}Paid by:{" "}
                    {Object.entries(exp.paidBy).map(([person, amount], i, arr) => 
                      `${person} (${amount})${i < arr.length - 1 ? ', ' : ''}`
                    )}{"\n"}
                    {"\n"}Split shares:{" "}
                    {Object.entries(exp.splitShares).map(([person, share], i, arr) => 
                      `${person} (${share})${i < arr.length - 1 ? ', ' : ''}`
                    )}
                  </Text>
                ))
              )}

              <TouchableOpacity 
                style={[uStyles.sectionHeader, styles.secondaryHeader]}
                onPress={() => toggleSection('expensesByPerson')}
              >
                <Text style={[styles.expenseSubtitle, { color: theme.primary }]}>Expenses by Person</Text>
                <Text style={[uStyles.expandButton, { color: theme.primary }]}>
                  {expandedSections.expensesByPerson ? '▼' : '▶'}
                </Text>
              </TouchableOpacity>
              
              {expandedSections.expensesByPerson && (
                people.map(person => {
                  const personExpenses = getPersonExpenses(person);
                  return (
                    <View key={person} style={[styles.personExpenseContainer, { backgroundColor: theme.surface, borderColor: theme.border }]}>
                      <Text style={[styles.personExpenseTitle, { color: theme.primary }]}>{person}</Text>
                      
                      <Text style={[styles.expenseSubheader, { color: theme.textSecondary }]}>Paid for:</Text>
                      {personExpenses.paid.length === 0 ? (
                        <Text style={[uStyles.emptyText, { color: theme.textSecondary }]}>No payments made</Text>
                      ) : (
                        personExpenses.paid.map(exp => (
                          <Text key={exp.id} style={[styles.personExpenseItem, { color: theme.text }]}>
                            • {exp.description}: {exp.amountPaid} yen
                          </Text>
                        ))
                      )}

                      <Text style={[styles.expenseSubheader, { color: theme.textSecondary }]}>Consumed in:</Text>
                      {personExpenses.consumed.length === 0 ? (
                        <Text style={[uStyles.emptyText, { color: theme.textSecondary }]}>No items consumed</Text>
                      ) : (
                        personExpenses.consumed.map(exp => (
                          <Text key={exp.id} style={[styles.personExpenseItem, { color: theme.text }]}>
                            • {exp.description}: {exp.amountConsumed} yen
                          </Text>
                        ))
                      )}
                    </View>
                  );
                })
              )}
            </>
          )}
        </View>
    );
};

const styles = StyleSheet.create({
    expenseSubtitle: {
        fontSize: 18,
        fontWeight: '600',
        marginTop: 16,
        marginBottom: 8,
        color: '#FFDC00',
    },
    expenseItem: { 
        fontSize: 16, 
        marginBottom: 8,
        color: '#FFFFFF' 
    },
    secondaryHeader: {
      marginTop: 16,
    },
    personExpenseContainer: {
      marginTop: 12,
      padding: 12,
      backgroundColor: '#2A2A2A',
      borderRadius: 8,
      marginBottom: 8,
      borderColor: '#FFDC00',
      borderWidth: 1,
    },
    personExpenseTitle: {
      fontSize: 16,
      fontWeight: '600',
      marginBottom: 8,
      color: '#FFDC00',
    },
    expenseSubheader: {
      fontSize: 14,
      fontWeight: '500',
      marginTop: 8,
      marginBottom: 4,
      color: '#4b5563',
    },
    personExpenseItem: {
      fontSize: 14,
      marginLeft: 8,
      marginBottom: 4,
      color: '#FFFFFF',
    },
    
});

export default Expenses;