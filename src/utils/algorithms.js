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

export const generateSlug = (firstName, lastName) => {
  if (!firstName && !lastName) {
    return null;
  }
  
  const fullName = `${firstName || ''} ${lastName || ''}`.trim();
  return fullName
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
};
