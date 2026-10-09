import axios, { AxiosError } from "axios";
import Toast from "react-native-toast-message";

export interface ParsedApiError {
  status: number;
  message: string;
  details?: any;
}

/**
 * Extracts a clean, user-friendly error message from any API error (Axios, Network, etc.)
 */
export function parseApiError(error: unknown): ParsedApiError {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<any>;

    if (axiosError.code === "ECONNABORTED" || (axiosError.message && axiosError.message.toLowerCase().includes("timeout"))) {
      return {
        status: 408,
        message: "Request timed out. Please check your internet connection and try again.",
      };
    }

    if (!axiosError.response) {
      return {
        status: 0,
        message: "Unable to connect to server. Please check your internet connection.",
      };
    }

    const status = axiosError.response.status;
    const data = axiosError.response.data;

    let message = "";

    if (typeof data === "string") {
      message = data;
    } else if (data && typeof data === "object") {
      if (Array.isArray(data.message)) {
        message = data.message.join(", ");
      } else if (typeof data.message === "string" && data.message.trim()) {
        message = data.message.trim();
      } else if (typeof data.error === "string" && data.error.trim()) {
        message = data.error.trim();
      } else if (Array.isArray(data.errors)) {
        message = data.errors.map((e: any) => typeof e === "string" ? e : e?.msg || e?.message || JSON.stringify(e)).join(", ");
      } else if (data.errors && typeof data.errors === "object") {
        const errorValues = Object.values(data.errors);
        message = errorValues.map((v: any) => typeof v === "string" ? v : v?.message || JSON.stringify(v)).join(", ");
      }
    }

    // Specific status code overrides if message is generic or empty
    switch (status) {
      case 400:
        if (!message) message = "Invalid request parameters. Please verify your details.";
        if (message.includes("validation failed")) {
          message = message.replace(/^.*validation failed:\s*/i, "");
        }
        break;
      case 401:
        if (message.includes("Multiple login detected")) {
          message = "Multiple login detected. Re-authenticating session...";
        } else {
          message = message || "Session expired or unauthorized. Please log in.";
        }
        break;
      case 403:
        message = message || "Access denied. You do not have permission for this action.";
        break;
      case 404:
        message = message || "The requested item or resource was not found.";
        break;
      case 409:
        message = message || "Item already exists or conflict occurred.";
        break;
      case 500:
      case 502:
      case 503:
        message = message || "Server is temporarily unavailable. Please try again shortly.";
        break;
      default:
        if (!message) {
          message = "An unexpected error occurred. Please try again.";
        }
        break;
    }

    return { status, message, details: data };
  }

  if (error instanceof Error) {
    return { status: -1, message: error.message || "An unexpected error occurred." };
  }

  return { status: -1, message: "An unexpected error occurred. Please try again." };
}

/**
 * Shows an error toast notification with parsed error details.
 */
export function showApiErrorToast(error: unknown, fallbackTitle = "Error") {
  const parsed = parseApiError(error);
  Toast.show({
    type: "error",
    text1: fallbackTitle,
    text2: parsed.message,
    position: "top",
    visibilityTime: 4000,
  });
  return parsed;
}
