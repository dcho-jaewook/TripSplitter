// import React from "react";
// import { TouchableOpacity, Text, StyleSheet } from "react-native";

// const ThemeToggle = ({ isDarkMode, toggleTheme, theme }) => {
//     return (
//         <TouchableOpacity 
//             style={[styles.themeToggle, { backgroundColor: theme.primary }]}
//             onPress={toggleTheme}
//         >
//             <Text style={[styles.themeToggleText, { color: theme.background }]}>
//                 {isDarkMode ? '☀️' : '🌙'}
//             </Text>
//         </TouchableOpacity>
//     );
// };

// const styles = StyleSheet.create({
//     themeToggle: {
//         width: 40,
//         height: 40,
//         borderRadius: 20,
//         justifyContent: 'center',
//         alignItems: 'center',
//         marginRight: 5,
//     },
//     themeToggleText: {
//         fontSize: 20,
//     },
// });
  
// export default ThemeToggle;

import React, { useState, useRef, useEffect } from "react";
import { View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/Ionicons"; // Import Ionicons from react-native-vector-icons

const ThemeToggle = ({ isDarkMode, toggleTheme }) => {
  // Local state to track toggle status
  const [isToggled, setIsToggled] = useState(isDarkMode);

  // Animation value for the handle position
  const handlePosition = useRef(new Animated.Value(isDarkMode ? 1 : 0)).current;

  // Animate the handle whenever isDarkMode changes
  useEffect(() => {
    Animated.timing(handlePosition, {
      toValue: isDarkMode ? 1 : 0,
      duration: 500, // Matches the 0.5s transition from CSS
      useNativeDriver: true, // Using transform for smooth animation
    }).start();
  }, [isDarkMode]);

  // Handle toggle press
  const handleToggle = () => {
    setIsToggled(!isToggled);
    toggleTheme(); // Call the parent function to switch the theme
  };

  // Interpolate the handle's translateX (from 2 to 52)
  const handleTranslateX = handlePosition.interpolate({
    inputRange: [0, 1],
    outputRange: [2, 32], // 80 (track width) - 26 (handle width) - 2 (initial offset)
  });

  // Dynamic styles based on theme
  const trackBackground = isDarkMode ? "#242424" : "#d9d9d9";
  const handleBackground = isDarkMode
    ? { backgroundColor: "#3a3a3a" } // Simplified gradient as solid color
    : { backgroundColor: "#f2f2f2" };

  // Icon and color based on theme
  const iconName = isDarkMode ? "moon" : "sunny-sharp";
  const iconColor = isDarkMode ? "#FFDC00" : "#1E1E1E"; // Yellow for dark mode, dark gray for light mode

  return (
    <TouchableOpacity onPress={handleToggle} activeOpacity={0.8}>
      <View
        style={[
          styles.track,
          { backgroundColor: trackBackground },
        ]}
      >
        <Animated.View
          style={[
            styles.handle,
            handleBackground,
            {
              transform: [{ translateX: handleTranslateX }],
            },
          ]}
        >
          {/* Add the icon on top of the handle */}
          <Icon
            name={iconName}
            size={16} // Adjust size to fit within the 26x26 handle
            color={iconColor}
            style={styles.icon}
          />
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
};

// Styles for the toggle switch
const styles = StyleSheet.create({
  track: {
    width: 60,
    height: 30,
    borderRadius: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 3, // For Android shadow
  },
  handle: {
    position: "absolute",
    top: 2,
    left: 0, // Base position, animation handles movement
    height: 26,
    width: 26,
    borderRadius: 13,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 2, // For Android shadow
    justifyContent: "center", // Center the icon vertically
    alignItems: "center", // Center the icon horizontally
  },
  icon: {
    // No additional styles needed since the icon is centered by the handle's justifyContent and alignItems
  },
});

export default ThemeToggle;