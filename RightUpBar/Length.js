// Length.js
import React from "react";
import { Text, View, StyleSheet, Platform, StatusBar } from "react-native";

const Length = ({ length }) => {
  return (
    <View style={styles.container}>
    <View style={styles.metadataContainer}>
      <Text style={styles.metadataText}>
        <Text style={styles.boldText}>{length}</Text> : Item{length > 1 ? "s" : ""}
      </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "skyblue",
    padding: 10,
    right: 0,
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
    top: Platform.OS === "android" ? StatusBar.currentHeight : 50,
  },
  metadataContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",  // 좌우로 정렬 변경
  },
  metadataText: {
    color: "black",
    fontSize: 12,
  },
  boldText: {
    fontWeight: "bold",
    fontSize: 13,
  },
});

export default Length;