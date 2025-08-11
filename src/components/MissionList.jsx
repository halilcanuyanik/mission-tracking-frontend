import React, { useState, useContext } from "react";
import styles from "../styles/MissionList.module.css";
import { SnackbarContext } from "../utils/SnackbarContext";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

const MissionList = ({ missions, onDelete }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [searchTerm, setSearchTerm] = useState("");

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedMissionId, setSelectedMissionId] = useState(null);

  const filteredMissions = missions.filter((mission) => {
    const driverMatch = mission.driver_name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const plateMatch = mission.vehicle_plate
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const engineerMatch = mission.engineers.some((eng) =>
      eng.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return driverMatch || plateMatch || engineerMatch;
  });

  const confirmDelete = (missionId) => {
    setSelectedMissionId(missionId);
    setOpenDialog(true);
  };

  const handleConfirmedDelete = async () => {
    try {
      await onDelete(selectedMissionId);
      showSnackbar("Mission deleted successfully!", "success");
    } catch (error) {
      console.error("Delete mission error:", error);
      showSnackbar("Failed to delete mission", "error");
    } finally {
      setOpenDialog(false);
      setSelectedMissionId(null);
    }
  };

  // const handleDelete = async (missionId) => {
  //   try {
  //     await onDelete(missionId);
  //     showSnackbar("Mission deleted successfully!", "success");
  //   } catch (error) {
  //     console.error("Delete mission error:", error);
  //     showSnackbar("Failed to delete mission", "error");
  //   }
  // };

  return (
    <div className={styles.missionContainer}>
      <h2 className={styles.missionTitle}>Missions</h2>

      <input
        type="text"
        className={styles.searchInput}
        placeholder="Search by driver, engineer or license plate..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredMissions.length > 0 ? (
        filteredMissions.map((mission) => (
          <div key={mission.id} className={styles.missionCard}>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>Mission ID:</span>{" "}
              {mission.id}
            </p>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>Driver:</span>{" "}
              {mission.driver_name}
            </p>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>Vehicle Plate:</span>{" "}
              {mission.vehicle_plate}
            </p>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>Engineers:</span>
            </p>
            <ul className={styles.engineersList}>
              {mission.engineers.map((eng, index) => (
                <li key={index}>
                  {eng.name} ({eng.branch})
                </li>
              ))}
            </ul>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>Start:</span>{" "}
              {new Date(mission.start_time).toLocaleString()}
            </p>
            <p className={styles.missionDetail}>
              <span className={styles.detailLabel}>End:</span>{" "}
              {new Date(mission.end_time).toLocaleString()}
            </p>
            <button
              className={styles.deleteButton}
              onClick={() => confirmDelete(mission.id)}
              // onClick={() => handleDelete(mission.id)}
              color="error"
            >
              Delete
            </button>
          </div>
        ))
      ) : (
        <div className={styles.noMissions}>
          {missions.length === 0
            ? "No missions available"
            : "No missions match your search"}
        </div>
      )}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Confirm Deletion</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this mission? This action cannot be
          undone.
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={() => setOpenDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmedDelete}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MissionList;
