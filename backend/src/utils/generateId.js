export const generateTicketId = (lastTicketId) => {
  const currentYear = new Date().getFullYear() % 100; // Get last 2 digits
  const prefix = `${process.env.TICKET_PREFIX}${currentYear}`;

  if (!lastTicketId) {
    return `${prefix}0001`; // Start with HF250001
  }

  const lastNumber = parseInt(lastTicketId.ticketId.slice(-4)); // Get last 4 digits
  const newNumber = (lastNumber + 1).toString().padStart(4, '0');

  return `${prefix}${newNumber}`; // e.g., HF250002
};
