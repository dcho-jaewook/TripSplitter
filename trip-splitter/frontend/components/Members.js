import React, { useState } from "react";
import { getStyles } from "../styles";
import { StyleSheet, TouchableOpacity, Text, TextInput, View } from "react-native";

const Members = ({ toggleSection, theme, expandedSections, addPerson, handleDeletePerson, canDeletePerson, people }) => {
    const [newPerson, setNewPerson] = useState("");
    
    const handleAddPerson = () => {
        let result = addPerson(newPerson);
        if (result)
            setNewPerson("");
      };
    
    const uStyles = getStyles;
    return (
        <View style={[uStyles.section, { backgroundColor: theme.surface }]}>
          <TouchableOpacity 
            style={uStyles.sectionHeader}
            onPress={() => toggleSection('members')}
          >
            <Text style={[uStyles.sectionTitle, { color: theme.primary }]}>Members</Text>
            <Text style={[uStyles.expandButton, { color: theme.primary }]}>
              {expandedSections.members ? '▼' : '▶'}
            </Text>
          </TouchableOpacity>
          
          {expandedSections.members && (
            <>
              <View style={styles.addPersonContainer}>
                <TextInput 
                  placeholder="Enter name"
                  value={newPerson}
                  onChangeText={setNewPerson}
                  style={[
                    uStyles.input, 
                    { 
                      backgroundColor: theme.surface,
                      borderColor: theme.border,
                      color: theme.text 
                    },
                    styles.addPersonInput
                  ]}
                  placeholderTextColor={theme.textSecondary}
                />
                <TouchableOpacity 
                  style={uStyles.addButton}
                  onPress={handleAddPerson}
                >
                  <Text style={uStyles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>
              
              {people.map(person => (
                <View key={person} style={styles.personItemContainer}>
                  <Text style={[styles.personItem, { backgroundColor: theme.surface, borderColor: theme.border, color: theme.text }]}>{person}</Text>
                  <TouchableOpacity 
                    style={[
                      styles.deleteButton,
                      !canDeletePerson(person) && styles.deleteButtonDisabled
                    ]}
                    onPress={() => handleDeletePerson(person)}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </>
          )}
        </View>
    );
};

const styles = StyleSheet.create({
    addPersonContainer: {
        flexDirection: 'row',
        marginBottom: 16,
    },
    addPersonInput: {
        flex: 1,
        marginBottom: 0,
        marginRight: 8,
    },
    personItemContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
    },
    personItem: {
      flex: 1,
      fontSize: 16,
      padding: 8,
      borderRadius: 4,
      marginRight: 8,
      borderWidth: 1,
    },
    deleteButton: {
      backgroundColor: '#ef4444',
      width: 32,
      height: 32,
      borderRadius: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    deleteButtonDisabled: {
      backgroundColor: '#9ca3af',
    },
    deleteButtonText: {
      color: 'white',
      fontSize: 16,
      fontWeight: 'bold',
    },
});

export default Members;