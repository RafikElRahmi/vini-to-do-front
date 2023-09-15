import axiosApi from "../api/axiosapi";

/**
 * Logs a trace error to the backend .
 * @param {string} message - The error message to log.
 */
export default async function logger(message) {
  const traceEntry = `[${new Date().toISOString()}] -- [TRACE] ${message}\n`;
  await axiosApi.post(`/log`, { trace: traceEntry }).then(res=>null);
  return null;
}
