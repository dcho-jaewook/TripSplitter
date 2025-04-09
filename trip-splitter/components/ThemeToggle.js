import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";

const ThemeToggle = ({ isDarkMode, toggleTheme, theme }) => {
    return (
        <TouchableOpacity 
            style={[styles.themeToggle, { backgroundColor: theme.primary }]}
            onPress={toggleTheme}
        >
            <Text style={[styles.themeToggleText, { color: theme.background }]}>
                {isDarkMode ? '☀️' : '🌙'}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    themeToggle: {
        width: 40,
        height: 40,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center',
        margin: 20,
    },
    themeToggleText: {
        fontSize: 20,
    },
});
  
export default ThemeToggle;