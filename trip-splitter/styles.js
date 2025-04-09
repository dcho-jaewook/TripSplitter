import { StyleSheet } from "react-native";

export const getStyles = (theme) => StyleSheet.create({
    section: {
        marginBottom: 24,
        backgroundColor: '#2A2A2A',
        padding: 16,
        borderRadius: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
    },
    sectionTitle: { 
        fontSize: 20, 
        fontWeight: "600",
        marginBottom: 12,
        marginTop: 0,
        color: '#FFDC00'
    },
    input: { 
        borderWidth: 1, 
        borderColor: "#FFDC00", 
        padding: 12, 
        marginBottom: 12, 
        borderRadius: 8,
        backgroundColor: '#2A2A2A',
        color: '#FFFFFF' 
    },
    label: { 
        fontSize: 16, 
        marginBottom: 8, 
        marginTop: 12,
        color: '#FFDC00' 
    },
    sublabel: {
        fontSize: 14,
        color: '#FFDC00',
        marginBottom: 8,
        opacity: 0.8,
    },
    emptyText: { 
        color: "#FFDC00", 
        fontSize: 16,
        opacity: 0.7 
    },
});