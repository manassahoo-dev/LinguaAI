import React from "react";
import { useStore } from "./store/useStore";
import { Onboarding } from "./components/Onboarding";
import { Dashboard } from "./components/Dashboard";
import VocabularyBuilder from "./components/VocabularyBuilder";

function App() {
  const userProfile = useStore((state) => state.userProfile);

  return userProfile ? <Dashboard /> : <Onboarding />;
}

export default App;
