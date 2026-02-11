/**
 * Formats error messages to be user-friendly
 */
export const getErrorMessage = (error) => {
  if (!error) return "Something went wrong. Please try again.";

  if (typeof error === "string") return error;

  // Handle ApiError instances
  if (error.message) {
    return error.message;
  }

  // Fallback message
  return "An unexpected error occurred. Please try again.";
};

/**
 * Displays a network connection error
 */
export const getNetworkError = () => {
  return "Unable to connect to the server. Please check your internet connection and try again.";
};

/**
 * Displays an authentication error
 */
export const getAuthError = () => {
  return "Your session has expired. Please log in again.";
};

/**
 * Displays a validation error
 */
export const getValidationError = (field) => {
  return `Please check your ${field} and try again.`;
};

/**
 * Displays a server error
 */
export const getServerError = () => {
  return "The server encountered an error. Please try again later.";
};

/**
 * Displays a 404 error
 */
export const getNotFoundError = (item = "item") => {
  return `The ${item} you're looking for was not found.`;
};
