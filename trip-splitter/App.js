import React, { useState } from "react";
import { View, Text, TextInput, Button, ScrollView, StyleSheet, TouchableOpacity } from "react-native";
import Checkbox from "expo-checkbox";

export default function App() {
  const [people] = useState(["Alpha", "Beta", "Theta"]);
  const [expenses, setExpenses] = useState([]);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState(people[0]);
  const [splitAmong, setSplitAmong] = useState([]);

  const addExpense = () => {
    if (!description || !amount || splitAmong.length === 0) return;
    const newExpense = { id: Date.now(), description, amount: parseFloat(amount), paidBy, splitAmong: [...splitAmong] };
    setExpenses([...expenses, newExpense]);
    setDescription("");
    setAmount("");
    setSplitAmong([]);
  };

  const calculateSplit = () => {
    const totals = {};
    people.forEach((person) => (totals[person] = { spent: 0, owes: 0 }));
    expenses.forEach((expense) => {
      totals[expense.paidBy].spent += expense.amount;
      const splitAmount = expense.amount / expense.splitAmong.length;
      expense.splitAmong.forEach((person) => (totals[person].owes += splitAmount));
    });
    return people.map((person) => ({ name: person, net: totals[person].spent - totals[person].owes }));
  };

  const settlement = calculateSplit();

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Trip Splitter</Text>
      <View style={styles.form}>
        <TextInput placeholder="Description (e.g., Sushi)" value={description} onChangeText={setDescription} style={styles.input} />
        <TextInput placeholder="Amount (e.g., 3000)" value={amount} onChangeText={setAmount} keyboardType="numeric" style={styles.input} />
        <Text style={styles.label}>Paid by:</Text>
        {people.map((person) => (
          <TouchableOpacity key={person} onPress={() => setPaidBy(person)} style={styles.radioOption}>
            <View style={[styles.radioCircle, paidBy === person && styles.radioSelected]} />
            <Text style={styles.radioText}>{person}</Text>
          </TouchableOpacity>
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
      <Text style={styles.sectionTitle}>Expenses</Text>
      {expenses.length === 0 ? (
        <Text style={styles.emptyText}>No expenses yet.</Text>
      ) : (
        expenses.map((exp) => (
          <Text key={exp.id} style={styles.expenseItem}>
            {exp.description}: {exp.amount} yen, paid by {exp.paidBy}, split among {exp.splitAmong.join(", ")}
          </Text>
        ))
      )}
      <Text style={styles.sectionTitle}>Settlement</Text>
      {settlement.map((person) => (
        <Text key={person.name} style={styles.settlementItem}>
          {person.name}: {person.net >= 0 ? "is owed" : "owes"} {Math.abs(person.net.toFixed(2))} yen
        </Text>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: "#f3f4f6" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  form: { marginBottom: 24 },
  input: { borderWidth: 1, borderColor: "#d1d5db", padding: 12, marginBottom: 12, borderRadius: 8 },
  label: { fontSize: 16, marginBottom: 8, marginTop: 12 },
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
});