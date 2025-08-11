import React, { useEffect, useState } from "react";
import { fetchDrivers, fetchVehicles, fetchEngineers } from "../utils/api";
import styles from "../styles/AddMissionForm.module.css";
import { SnackbarContext } from "../utils/SnackbarContext";
import { useContext } from "react";
import { config } from "../config";

const AddMissionForm = ({ onMissionAdded, onRefreshDropdowns }) => {
  const { showSnackbar } = useContext(SnackbarContext);
  const [drivers, setDrivers] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [engineers, setEngineers] = useState([]);

  const [driverId, setDriverId] = useState("");
  const [vehicleId, setVehicleId] = useState("");
  const [selectedEngineerIds, setSelectedEngineerIds] = useState([]);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  const refreshDropdowns = () => {
    fetchDrivers(setDrivers);
    fetchVehicles(setVehicles);
    fetchEngineers(setEngineers);
  };

  useEffect(() => {
    refreshDropdowns();
  }, []);

  useEffect(() => {
    if (onRefreshDropdowns) {
      onRefreshDropdowns.current = refreshDropdowns;
    }
  }, [onRefreshDropdowns]);

  const handleEngineerSelect = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(parseInt(options[i].value));
      }
    }
    setSelectedEngineerIds(selected);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const start = new Date(startTime);
    const end = new Date(endTime);

    if (start >= end) {
      showSnackbar("Start time must be before end time.", "error");
      return;
    }

    const selectedEngineers = engineers
      .filter((e) => selectedEngineerIds.includes(e.id))
      .map((e) => ({ id: e.id, name: e.name, branch: e.branch }));

    const missionData = {
      driver_id: parseInt(driverId),
      vehicle_id: parseInt(vehicleId),
      engineers: selectedEngineers,
      start_time: startTime,
      end_time: endTime,
    };

    try {
      const res = await fetch(`${config.apiBaseUrl}/missions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(missionData),
      });

      if (res.ok) {
        showSnackbar("Mission successfully added!", "success");

        onMissionAdded();
        refreshDropdowns();

        setDriverId("");
        setVehicleId("");
        setSelectedEngineerIds([]);
        setStartTime("");
        setEndTime("");
      } else {
        const errorData = await res.json();
        showSnackbar(errorData.message || "Error adding mission", "error");
      }
    } catch (error) {
      console.error(error);
      showSnackbar("Could not connect to the server", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2 className={styles.formTitle}>Add Mission</h2>

      <div className={styles.fromGroup}>
        <label className={styles.formLabel}>Driver:</label>
        <select
          className={styles.formSelect}
          value={driverId}
          onChange={(e) => setDriverId(e.target.value)}
          required
        >
          <option value="">Select</option>
          {drivers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((driver) => (
              <option key={driver.id} value={driver.id}>
                {driver.name}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>License Plate:</label>
        <select
          className={styles.formSelect}
          value={vehicleId}
          onChange={(e) => setVehicleId(e.target.value)}
          required
        >
          <option value="">Select</option>
          {vehicles
            .sort((a, b) => a.plate.localeCompare(b.plate))
            .map((vehicle) => (
              <option key={vehicle.id} value={vehicle.id}>
                {vehicle.plate}
              </option>
            ))}
        </select>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Engineers:</label>
        <select
          className={styles.formSelect}
          multiple
          value={selectedEngineerIds.map(String)}
          onChange={handleEngineerSelect}
          required
        >
          {engineers
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((engineer) => (
              <option key={engineer.id} value={engineer.id}>
                {engineer.name} ({engineer.branch})
              </option>
            ))}
        </select>
        <span className={styles.hintText}>Hold CTRL to select multiple</span>
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>Start time:</label>
        <input
          className={styles.formInput}
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label className={styles.formLabel}>End Time:</label>
        <input
          className={styles.formInput}
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          required
        />
      </div>

      <button type="submit" className={styles.formButton}>
        Save Mission
      </button>
    </form>
  );
};

export default AddMissionForm;
