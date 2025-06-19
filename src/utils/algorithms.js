export function generateAppointmentId(latestAppointmentId) {
  let nextId = 1;
  if (latestAppointmentId && latestAppointmentId.startsWith('AP')) {
    const latestId = parseInt(latestAppointmentId.substring(2));
    if (!isNaN(latestId)) {
      nextId = latestId + 1;
    }
  }
  return `AP${nextId.toString().padStart(6, '0')}`;
}
