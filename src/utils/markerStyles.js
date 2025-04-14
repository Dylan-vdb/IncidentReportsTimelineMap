// Utility functions for marker styling and color interpolation

import { Style, Circle, Fill } from 'ol/style';

// Create a function to interpolate color between yellow and red based on severity
export const getColorForSeverity = (severity) => {
  // Ensure severity is a number between 1 and 5
  const validSeverity = Math.max(1, Math.min(5, Number(severity) || 1));
  // Convert severity (1-5) to a value between 0 and 1
  const t = (validSeverity - 1) / 4;
  // RGB values for yellow (255, 255, 0) to red (255, 0, 0)
  const r = 255;
  const g = Math.round(255 * (1 - t));
  const b = 0;
  return `rgb(${r}, ${g}, ${b})`;
};

// Create circle style based on incident severity
export const createCircleStyle = (incident) => {
  return new Style({
    image: new Circle({
      radius: 8, // Fixed size for all incidents
      fill: new Fill({
        color: getColorForSeverity(incident.severity)
      })
    })
  });
};

// Severity text mapping
export const getSeverityText = (severity) => {
  const severityMap = {
    1: 'Low',
    2: 'Moderate',
    3: 'High',
    4: 'Severe',
    5: 'Critical'
  };
  return severityMap[severity] || 'Unknown';
};