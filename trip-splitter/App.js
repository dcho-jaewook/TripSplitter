import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity, Alert } from "react-native";
import Checkbox from "expo-checkbox";

export default function App() {
  const [people, setPeople] = useState([]);
  const [newPerson, setNewPerson] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState({});
  const [splitAmong, setSplitAmong] = useState([]);
  const [showAddItemForm, setShowAddItemForm] = useState(false);
  const [showSettlement, setShowSettlement] = useState(true);

  const addPerson = () => {
    if (!newPerson.trim() || people.includes(newPerson.trim())) return;
    setPeople([...people, newPerson.trim()]);
    setNewPerson("");
  };

  const getTotalPaidAmount = () => {
    return Object.values(paidBy).reduce((sum, amount) => sum + (parseFloat(amount) || 0), 0);
  };

  const resetItemForm = () => {
    setDescription("");
    setAmount("");
    setPaidBy({});
    setSplitAmong([]);
    setShowAddItemForm(false);
  };

  const addExpense = () => {
    if (!description || !amount || splitAmong.length === 0 || Object.keys(paidBy).length === 0) return;
    
    const totalPaid = getTotalPaidAmount();
    if (Math.abs(totalPaid - parseFloat(amount)) > 0.01) {
      alert("The sum of paid amounts must equal the total amount");
      return;
    }

    const newExpense = {
      id: Date.now(),
      description,
      amount: parseFloat(amount),
      paidBy: {...paidBy},
      splitAmong: [...splitAmong]
    };
    setExpenses([...expenses, newExpense]);
    resetItemForm();
  };

  const calculateSplit = () => {
    const totals = {};
    people.forEach((person) => (totals[person] = { spent: 0, owes: 0 }));
    
    expenses.forEach((expense) => {
      Object.entries(expense.paidBy).forEach(([person, amount]) => {
        totals[person].spent += parseFloat(amount);
      });
      
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach((person) => (totals[person].owes += splitAmount));
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

  return (
    <ScrollView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Trip Splitter</Text>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add Member</Text>
          <View style={styles.addPersonContainer}>
            <TextInput 
              placeholder="Enter name"
              value={newPerson}
              onChangeText={setNewPerson}
              style={[styles.input, styles.addPersonInput]}
            />
            <TouchableOpacity 
              style={styles.addButton}
              onPress={addPerson}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
          
          {people.map(person => (
            <Text key={person} style={styles.personItem}>{person}</Text>
          ))}
        </View>

        {!showAddItemForm && (
          <TouchableOpacity 
            style={styles.addItemButton}
            onPress={() => setShowAddItemForm(true)}
          >
            <Text style={styles.addButtonText}>Add Item</Text>
          </TouchableOpacity>
        )}

        {showAddItemForm && (
          <View style={styles.section}>
            <View style={styles.formHeader}>
              <Text style={styles.sectionTitle}>Add Item</Text>
              <TouchableOpacity 
                style={styles.cancelButton}
                onPress={resetItemForm}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>

            <TextInput placeholder="Description (e.g., Sushi)" value={description} onChangeText={setDescription} style={styles.input} />
            <TextInput placeholder="Total Amount (e.g., 3000)" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
            <Text style={styles.label}>Paid by:</Text>
            <Text style={styles.sublabel}>Enter amount paid by each person (total: {getTotalPaidAmount()})</Text>
            {people.map((person) => (
              <View key={person} style={styles.paidByContainer}>
                <Text style={styles.paidByText}>{person}</Text>
                <TextInput
                  style={styles.paidByInput}
                  placeholder="0"
                  value={paidBy[person] || ""}
                  onChangeText={(value) => handlePaidByChange(person, value)}
                  keyboardType="numeric"
                />
              </View>
            ))}
            <Text style={styles.label}>Split among:</Text>
            {people.map((person) => (
              <View key={person} style={styles.checkboxOption}>
                <Checkbox
                  value={splitAmong.includes(person)}
                  onValueChange={(checked) => {
                    if (checked) setSplitAmong([...splitAmong, person]);
                    else setSplitAmong(splitAmong.filter((p) => p !== person));
                  }}
                  color={splitAmong.includes(person) ? "#3b82f6" : undefined}
                />
                <Text style={styles.checkboxText}>{person}</Text>
              </View>
            ))}
            <Button title="Add Expense" onPress={addExpense} />
          </View>
        )}
        <Text style={styles.sectionTitle}>Expenses</Text>
        <View style={styles.section}>
          {expenses.length === 0 ? (
            <Text style={styles.emptyText}>No expenses yet.</Text>
          ) : (
            expenses.map((exp) => (
              <Text key={exp.id} style={styles.expenseItem}>
                {exp.description}: {exp.amount} yen, paid by (
                {Object.entries(exp.paidBy).map(([person, amount], i, arr) => 
                  `${person}: ${amount}${i < arr.length - 1 ? ', ' : ''}`
                )}), split among {exp.splitAmong.join(", ")}
              </Text>
            ))
          )}
        </View>
        <Text style={styles.sectionTitle}>Settlement</Text>
        <View style={styles.section}>
          {showSettlement ? (
            <>
              {settlement.map((person) => (
                <Text key={person.name} style={styles.settlementItem}>
                  {person.name}: {person.net >= 0 ? "is owed" : "owes"} {Math.abs(person.net.toFixed(2))} yen
                </Text>
              ))}
              {expenses.length > 0 && (
                <TouchableOpacity 
                  style={styles.settleButton}
                  onPress={handleSettle}
                >
                  <Text style={styles.settleButtonText}>Settle All Expenses</Text>
                </TouchableOpacity>
              )}
            </>
          ) : (
            <Text style={styles.settledMessage}>All expenses have been settled! 🎉</Text>
          )}
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
  },
  innerContainer: {
    padding: 20,
    paddingTop: 60,
    paddingBottom: 40,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  section: {
    marginBottom: 24,
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  addItemButton: {
    backgroundColor: '#3b82f6',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
  cancelButton: {
    padding: 8,
  },
  cancelButtonText: {
    color: '#ef4444',
    fontSize: 16,
    fontWeight: '500',
  },
  input: { borderWidth: 1, borderColor: "#d1d5db", padding: 12, marginBottom: 12, borderRadius: 8 },
  label: { fontSize: 16, marginBottom: 8, marginTop: 12 },
  sublabel: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 8,
  },
  radioOption: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  radioCircle: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: "#374151", marginRight: 8 },
  radioSelected: { backgroundColor: "#3b82f6" },
  radioText: { fontSize: 16 },
  checkboxOption: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  checkboxText: { marginLeft: 8, fontSize: 16 },
  sectionTitle: { fontSize: 20, fontWeight: "600", marginBottom: 12, marginTop: 20 },
  emptyText: { color: "#6b7280", fontSize: 16 },
  expenseItem: { fontSize: 16, marginBottom: 8 },
  settlementItem: { fontSize: 16, marginBottom: 8 },
  addPersonContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  addPersonInput: {
    flex: 1,
    marginBottom: 0,
    marginRight: 8,
  },
  addButton: {
    backgroundColor: '#3b82f6',
    padding: 12,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  personItem: {
    fontSize: 16,
    marginBottom: 8,
    padding: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
  },
  paidByContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  paidByText: {
    flex: 1,
    fontSize: 16,
  },
  paidByInput: {
    borderWidth: 1,
    borderColor: "#d1d5db",
    padding: 8,
    borderRadius: 8,
    width: 120,
    marginLeft: 8,
  },
  settleButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 16,
  },
  settleButtonText: {
    color: 'white',
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