import { config } from "../config";

export const fetchDrivers = async (setDrivers) => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/available-drivers`);
    const data = await res.json();
    setDrivers(data);
  } catch (err) {
    console.error("Drivers not retrieved:", err);
  }
};

export const fetchVehicles = async (setVehicles) => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/available-vehicles`);
    const data = await res.json();
    setVehicles(data);
  } catch (err) {
    console.error("Vehicles not retrieved:", err);
  }
};

export const fetchEngineers = async (setEngineers) => {
  try {
    const res = await fetch(`${config.apiBaseUrl}/available-engineers`);
    const data = await res.json();
    setEngineers(data);
  } catch (err) {
    console.error("Engineers not retrieved:", err);
  }
};
