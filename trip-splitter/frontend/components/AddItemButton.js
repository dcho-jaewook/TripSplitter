import React from "react";
import { getStyles } from "../styles";
import { StyleSheet, TouchableOpacity, Text } from "react-native";

const AddItemButton = ({ theme, setShowAddItemForm }) => {
    const uStyles = getStyles;
    return (
        <TouchableOpacity 
            style={styles.addItemButton}
            onPress={() => setShowAddItemForm(true)}
        >
            <Text style={[uStyles.addButtonText, { color: theme.primary }]}>Add Item</Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
  addItemButton: {
    backgroundColor: theme => theme.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 24,
  },
});

export default AddItemButton;