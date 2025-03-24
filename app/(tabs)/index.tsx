import React from "react";
import { SafeAreaView } from "react-native";
import MyApp from "../../components/MyApp";
import { db } from "../../config/firebaseConfig";

const App = () => {
  return(
    <SafeAreaView style={{ flex: 1, backgroundColor: "blue" }}>
      <MyApp/>
    </SafeAreaView>
  );
};

export default App;