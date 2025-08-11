import React, { useEffect, useState, useRef } from "react";
import AddMissionForm from "./components/AddMissionForm";
import MissionList from "./components/MissionList";
import { SnackbarProvider } from "./utils/SnackbarContext";
import { config } from "./config";

function App() {
  const [missions, setMissions] = useState([]);
  const dropdownRefreshRef = useRef(null);

  const fetchMissions = async () => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/missions`);
      const data = await res.json();
      setMissions(data);
    } catch (err) {
      console.error("Missions not found:", err);
    }
  };

  useEffect(() => {
    fetchMissions();
  }, []);

  const deleteMission = async (id) => {
    try {
      const res = await fetch(`${config.apiBaseUrl}/missions/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        fetchMissions();
        if (dropdownRefreshRef.current) {
          dropdownRefreshRef.current();
        }
      }
    } catch (err) {
      console.error("Error occured while deleting a mission:", err);
    }
  };

  return (
    <SnackbarProvider>
      <div>
        <AddMissionForm
          onMissionAdded={fetchMissions}
          onRefreshDropdowns={dropdownRefreshRef}
        />
        <MissionList missions={missions} onDelete={deleteMission} />
      </div>
    </SnackbarProvider>
  );
}

export default App;
