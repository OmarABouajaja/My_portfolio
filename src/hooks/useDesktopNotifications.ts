import { useEffect, useRef } from "react";

/**
 * A hook to trigger native OS/Browser Desktop Notifications
 * when new items (like unread messages or contacts) appear.
 */
export const useDesktopNotifications = (
  unreadContactsCount: number,
  unreadMessagesCount: number
) => {
  const prevContacts = useRef(unreadContactsCount);
  const prevMessages = useRef(unreadMessagesCount);

  useEffect(() => {
    // Request permission on mount if we haven't asked yet
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (!("Notification" in window) || Notification.permission !== "granted") {
      return;
    }

    // Check if new unread contacts arrived
    if (unreadContactsCount > prevContacts.current) {
      new Notification("Abouajaja_Omar/", {
        body: "You have a new contact form submission!",
        icon: "/favicon.ico", // or a custom icon URL
      });
    }

    // Check if new unread chat messages arrived
    if (unreadMessagesCount > prevMessages.current) {
      new Notification("Abouajaja_Omar/", {
        body: "You have a new client message!",
        icon: "/favicon.ico",
      });
    }

    // Update refs to track changes
    prevContacts.current = unreadContactsCount;
    prevMessages.current = unreadMessagesCount;
  }, [unreadContactsCount, unreadMessagesCount]);
};
