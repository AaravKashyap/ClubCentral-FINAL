import React from "react";
import { StyleSheet, TextInput, View, Pressable } from "react-native";
import { Search, X } from "lucide-react-native";
import Colors from "@/constants/colors";

type SearchBarProps = {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
};

export default function SearchBar({ 
  value, 
  onChangeText, 
  placeholder = "Search clubs..." 
}: SearchBarProps) {
  const handleClear = () => {
    onChangeText("");
  };
  
  return (
    <View style={styles.container}>
      <Search size={20} color={Colors.textSecondary} style={styles.icon} />
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.textSecondary}
        returnKeyType="search"
        clearButtonMode="never" // We'll use our own clear button
      />
      {value.length > 0 && (
        <Pressable onPress={handleClear} style={styles.clearButton}>
          <X size={18} color={Colors.textSecondary} />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.card,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginHorizontal: 16,
    marginVertical: 8,
    height: 44,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: Colors.text,
    height: "100%",
  },
  clearButton: {
    padding: 4,
  },
});