// utils/notifications.js
import { toast } from "react-toastify";

export const showSuccessNotification = (message) => {
  toast.success(message, { autoClose: 2000 });
};

export const showErrorNotification = (message) => {
  toast.error(message);
};
