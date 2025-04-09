import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Checkbox from "expo-checkbox";
import CameraApp from "./components/Camera.js";
import { getStyles } from "./styles.js";
import ThemeToggle from "./components/ThemeToggle.js";
import Members from "./components/Members.js";

const themes = {
  light: {
    background: '#FFFFFF',
    surface: '#F3F4F6',
    primary: '#1E1E1E',
    text: '#1E1E1E',
    textSecondary: '#4B5563',
    border: '#1E1E1E',
  },
  dark: {
    background: '#1E1E1E',
    surface: '#2A2A2A',
    primary: '#FFDC00',
    text: '#FFFFFF',
    textSecondary: '#A3A3A3',
    border: '#FFDC00',
  }
};

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const theme = isDarkMode ? themes.dark : themes.light;
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState({});
  const [splitAmong, setSplitAmong] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showSettlement, setShowSettlement] = useState(true);
  const [splitShares, setSplitShares] = useState({});
  const [expandedSections, setExpandedSections] = useState({
    members: true,
    allExpenses: true,
    expensesByPerson: true
  });


  const uStyles = getStyles;

  const addPerson = (newHuman) => {
    if (!newHuman.trim() || people.includes(newHuman.trim())) return false;
    setPeople([...people, newHuman.trim()]);
    return true;
  };

  const getTotalPaidAmount = () => {
    return Object.values(paidBy).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
  };

  const resetItemForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy({});
    setSplitShares({});
    setShowAddItemForm(false);
  };

  const addExpense = () => {
    if (!description || !amount || Object.keys(splitShares).length === 0 || Object.keys(paidBy).length === 0) return;
    
    const totalPaid = getTotalPaidAmount();
    if (Math.abs(totalPaid - parseFloat(amount)) > 0.01) {
      alert("The sum of paid amounts must equal the total amount");
      return;
    }
  
    const totalSplit = Object.values(splitShares).reduce((sum, share) => sum + parseFloat(share), 0);
    if (Math.abs(totalSplit - parseFloat(amount)) > 0.01) {
      alert("The sum of split shares must equal the total amount");
      return;
    }
  
    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      paidBy: {...paidBy},
      splitShares: {...splitShares}
    };
    setExpenses([...expenses, newExpense]);
    resetItemForm();
  };

  const calculateSplit = () => {
    const totals = {};
    people.forEach((person) => (totals[person] = { spent: 0, owes: 0 }));
    
    expenses.forEach((expense) => {
      // Add what each person paid
      Object.entries(expense.paidBy).forEach(([person, amount]) => {
        totals[person].spent += parseFloat(amount);
      });
      
      // Add what each person owes based on their share
      Object.entries(expense.splitShares).forEach(([person, share]) => {
        totals[person].owes += parseFloat(share);
      });
    });
    
    return people.map((person) => ({
      name: person,
      net: totals[person].spent - totals[person].owes
    }));
  };

  const handlePaidByChange = (person, value) => {
    const newPaidBy = { ...paidBy };
    if (value === "" || isNaN(value)) {
      delete newPaidBy[person];
    } else {
      newPaidBy[person] = value;
    }
    setPaidBy(newPaidBy);
  };

  const handleSplitShareChange = (person, value) => {
    const newSplitShares = { ...splitShares };
    if (value === "" || isNaN(value)) {
      delete newSplitShares[person];
    } else {
      newSplitShares[person] = parseFloat(value);
    }
    setSplitShares(newSplitShares);
  };

  const handleEvenSplit = () => {
    if (!amount || isNaN(amount)) {
      Alert.alert("Invalid Amount", "Please enter a valid total amount first");
      return;
    }

    Alert.alert(
      "Even Split",
      "This will evenly split the total amount among all members. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Split",
          onPress: () => {
            const totalAmount = parseFloat(amount);
            const evenShare = (totalAmount / people.length).toFixed(2);
            const newSplitShares = {};
            people.forEach(person => {
              newSplitShares[person] = evenShare;
            });
            setSplitShares(newSplitShares);
          }
        }
      ]
    );
  };

  const settlement = calculateSplit();

  const handleSettle = () => {
    if (expenses.length === 0) {
      Alert.alert("No Expenses", "There are no expenses to settle!");
      return;
    }

    Alert.alert(
      "Confirm Settlement",
      "Are you sure? This will clear all the settlement records.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Settle", 
          style: "destructive",
          onPress: () => {
            setExpenses([]);
            setShowSettlement(false);
            setTimeout(() => setShowSettlement(true), 2000);
          }
        }
      ]
    );
  };

  const canDeletePerson = (personName) => {
    const personSettlement = settlement.find(s => s.name === personName);
    return !personSettlement || Math.abs(personSettlement.net) < 0.01;
  };

  const handleDeletePerson = (personName) => {
    if (!canDeletePerson(personName)) {
      Alert.alert(
        "Cannot Delete",
        `${personName} has pending settlements that need to be cleared first.`
      );
      return;
    }

    Alert.alert(
      "Confirm Delete",
      `Are you sure you want to remove ${personName}?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPeople(people.filter(p => p !== personName));
            
            const newPaidBy = { ...paidBy };
            delete newPaidBy[personName];
            setPaidBy(newPaidBy);
            setSplitAmong(splitAmong.filter(p => p !== personName));
            
            setExpenses(expenses.filter(exp => {
              const involvedPeople = new Set([
                ...Object.keys(exp.paidBy),
                ...exp.splitAmong
              ]);
              return involvedPeople.size > 1 || !involvedPeople.has(personName);
            }));
          }
        }
      ]
    );
  };

  const getPersonExpenses = (personName) => {
    const paid = expenses.filter(exp => personName in exp.paidBy);
    const consumed = expenses.filter(exp => personName in exp.splitShares);
    
    return {
      paid: paid.map(exp => ({
        ...exp,
        amountPaid: parseFloat(exp.paidBy[personName])
      })),
      consumed: consumed.map(exp => ({
        ...exp,
        amountConsumed: parseFloat(exp.splitShares[personName])
      }))
    };
  };

  const toggleSection = (sectionName) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionName]: !prev[sectionName]
    }));
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.innerContainer}>
        <View style={styles.headerContainer}>
          <Text style={[styles.title, styles.headerContainerTitle, { color: theme.primary }]}>Trip Splitter</Text>
          <ThemeToggle isDarkMode={isDarkMode} toggleTheme={() => setIsDarkMode(!isDarkMode)} theme={theme} />
        </View>
        <Members toggleSection={toggleSection} theme={theme} expandedSections={expandedSections} addPerson={addPerson} handleDeletePerson={handleDeletePerson} canDeletePerson={canDeletePerson} people={people}/>

        {!showAddItemForm && (
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={() => setShowAddItemForm(true)}
          >
            <Text style={[uStyles.addButtonText, { color: theme.primary }]}>Add Item</Text>
          </TouchableOpacity>
        )}

        {showAddItemForm && (
          <View style={[uStyles.section, { backgroundColor: theme.surface }]}>
            <View style={styles.formHeader}>
              <Text style={[uStyles.sectionTitle, { color: theme.primary }]}>Add Item</Text>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={resetItemForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TextInput placeholder="Description (e.g., Sushi)" placeholderTextColor={theme.textSecondary} value={description} onChangeText={setDescription} style={[uStyles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} />
            <TextInput placeholder="Total Amount (e.g., 3000)" placeholderTextColor={theme.textSecondary} value={amount} onChangeText={setAmount} keyboardType="numeric" style={[uStyles.input, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]} />
            <Text style={[uStyles.label, { color: theme.primary }]}>Paid by:</Text>
            <Text style={[uStyles.sublabel, { color: theme.textSecondary }]}>Enter amount paid by each person (total: {getTotalPaidAmount()})</Text>
            {people.map((person) => (
              <View key={person} style={styles.paidByContainer}>
                <Text style={[styles.paidByText, { color: theme.text }]}>{person}</Text>
                <TextInput
                  style={[
                    styles.paidByInput,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.text 
                    }
                  ]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={paidBy[person] || ""}
                  onChangeText={(value) => handlePaidByChange(person, value)}
                  keyboardType="numeric"
                />
              </View>
            ))}
            <View style={styles.splitHeader}>
              <Text style={[uStyles.label, { color: theme.primary }]}>Split shares:</Text>
              <View style={styles.splitButtonContainer}>
                <Button title="Reset" onPress={() => setSplitShares({})} />
                <TouchableOpacity 
                  style={styles.evenSplitButton}
                  onPress={handleEvenSplit}
                >
                  <Text style={[styles.evenSplitText, uStyles.addButtonText]}>Even Split</Text>
                </TouchableOpacity>
              </View>
            </View>

            <Text style={[uStyles.sublabel, { color: theme.textSecondary }]}>
              Enter how much each person consumed (total: {
                Object.values(splitShares).reduce((sum, share) => sum + (parseFloat(share) || 0), 0)
              })
            </Text>

            {/* Paid by Section */}
            <View style={styles.paidByHeader}>
              <Text style={[uStyles.label, { color: theme.primary }]}>Paid by:</Text>
              <Button title="Reset" onPress={() => setPaidBy({})} />
            </View>

            {people.map((person) => (
              <View key={person} style={styles.paidByContainer}>
                <Text style={[styles.paidByText, { color: theme.text }]}>{person}</Text>
                <TextInput
                  style={[
                    styles.paidByInput,
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.text 
                    }
                  ]}
                  placeholder="0"
                  placeholderTextColor={theme.textSecondary}
                  value={splitShares[person] || ""}
                  onChangeText={(value) => handleSplitShareChange(person, value)}
                  keyboardType="numeric"
                />
              </View>
            ))}
            <Button title="Add Item" onPress={addExpense} />
          </View>
        )}
        <Text style={[uStyles.sectionTitle, { color: theme.primary }]}>Expenses</Text>
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
        <Text style={[uStyles.sectionTitle, { color: theme.primary }]}>Settlement</Text>
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
        <CameraApp/>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  innerContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: { 
    fontSize: 24, 
    fontWeight: "bold", 
    marginBottom: 20,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemButton: {
    backgroundColor: theme => theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#FF3F34',
    fontSize: 16,
    fontWeight: '500',
  },
  radioOption: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#374151", marginRight: 8 },
  radioSelected: { backgroundColor: "#3b82f6" },
  radioText: { fontSize: 16 },
  checkboxOption: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkboxText: { marginLeft: 8, fontSize: 16 },
  
  expenseItem: { 
    fontSize: 16, 
    marginBottom: 8,
    color: '#FFFFFF' 
  },
  settlementItem: { fontSize: 16, marginBottom: 8 },
  paidByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paidByText: {
    flex: 1,
    fontSize: 16,
    color: '#FFFFFF'
  },
  paidByInput: {
    borderWidth: 1,
    borderColor: "#FFDC00",
    padding: 8,
    borderRadius: 8,
    width: 120,
    marginLeft: 8,
    backgroundColor: '#2A2A2A',
    color: '#FFFFFF'
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
  splitHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 8,
  },
  evenSplitButton: {
    backgroundColor: '#FFDC00',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  evenSplitText: {
    color: '#1E1E1E',
    fontSize: 14,
    fontWeight: '500',
  },
  expenseSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
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
  personExpenseItem: {
    fontSize: 14,
    marginLeft: 8,
    marginBottom: 4,
    color: '#FFFFFF',
  },
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
  secondaryHeader: {
    marginTop: 16,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  headerContainerTitle: {
    marginTop: 20,
    paddingLeft: 5,
  }
});