import { useLocation } from "react-router-dom";
import moment from "moment";

//! Ant Imports

import message from "antd/lib/message";
import notification from "antd/lib/notification";

//! User Files

import { defaultDateFormat, REGEX } from "./constants";

export function useRouteQuery() {
  return new URLSearchParams(useLocation().search);
}

export const toast = (
  { message: content, type, duration = 3 },
  destroy = true
) => {
  if (destroy) {
    message.destroy();
  }
  switch (type) {
    case "info":
      message.info(content, duration);
      break;
    case "success":
      message.success(content, duration);
      break;
    case "warning":
      message.warning(content, duration);
      break;
    case "error":
      message.error(content, duration);
      break;
    default:
      break;
  }
};

export const notificationToast = ({ message, description = "" }) => {
  notification.open({
    message,
    description,
    duration: 10,
  });
};

export const validateEmail = (email) => {
  const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
};

export const generateRandomColor = (theme) => {
  let color = "#";
  switch (theme) {
    case "dark":
      for (let i = 0; i < 3; i++)
        color += (
          "0" + Math.floor((Math.random() * Math.pow(16, 2)) / 2).toString(16)
        ).slice(-2);
      return color;
    case "light":
    default:
      for (let i = 0; i < 3; i++)
        color += (
          "0" +
          Math.floor(((1 + Math.random()) * Math.pow(16, 2)) / 2).toString(16)
        ).slice(-2);
      return color;
  }
};

export const refreshGrid = () => {
  // eslint-disable-next-line no-undef
  window.dispatchEvent(new Event("refresh-grid"));
};

export const formatDate = (
  datetime,
  format = `${defaultDateFormat} hh:mm A`
) => {
  if (datetime && moment && format) {
    return moment(datetime).format(format);
  }

  return datetime;
};

export const formValidatorRules = {
  required: {
    required: true,
    message: "Required",
  },
  email: {
    type: "email",
    message: "The input is not valid E-mail!",
  },
  number: () => ({
    validator(rule, value) {
      if (!value) {
        return Promise.resolve();
      }
      if (!Number(value) || !REGEX.NUMBER.test(Number(value))) {
        // eslint-disable-next-line prefer-promise-reject-errors
        return Promise.reject("Should be a valid Number");
      }
      return Promise.resolve();
    },
  }),
};

export const combineDateTimeAndGetISOString = (date, time) => {
  const timeObj = new Date(time);
  const dateObj = new Date(date);

  let formattedDateTime = dateObj.setUTCHours(timeObj.getUTCHours());
  formattedDateTime = new Date(formattedDateTime).setUTCMinutes(
    timeObj.getUTCMinutes()
  );
  formattedDateTime = new Date(formattedDateTime).toISOString();

  return formattedDateTime;
};

export const formatPhoneNumber = (str) => {
  // Filter only numbers from the input
  const cleaned = `${str}`.replace(/\D/g, "");

  // Check if the input is of correct length
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return null;
};

export const formatPrice = (price) => {
  const formatedPrice = price || 0;

  return Number(formatedPrice).toLocaleString("en", {
    style: "currency",
    currency: "USD",
  });
};

export const formItemProps = { normalize: (value) => value.trim() };
