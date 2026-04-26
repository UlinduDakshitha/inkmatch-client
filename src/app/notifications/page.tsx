"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import "../artists/shared.css";
import "./page.css";
import {
  APP_DATA_UPDATED_EVENT,
  clearReadNotifications,
  deleteNotification,
  ensureWelcomeNotification,
  getCurrentUser,
  getNotificationsByUser,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/utils/appData";

type NotificationView = {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  category: "SYSTEM" | "BOOKING" | "PROMOTION";
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<NotificationView[]>([]);
  const [ready, setReady] = useState(false);
  const user = getCurrentUser();

  useEffect(() => {
    function loadNotifications() {
      const currentUser = getCurrentUser();
      if (!currentUser?.email) {
        setNotifications([]);
        setReady(true);
        return;
      }

      ensureWelcomeNotification(currentUser);
      const items = getNotificationsByUser(currentUser.email);
      setNotifications(items);
      setReady(true);
    }

    loadNotifications();
    window.addEventListener("storage", loadNotifications);
    window.addEventListener(APP_DATA_UPDATED_EVENT, loadNotifications);

    return () => {
      window.removeEventListener("storage", loadNotifications);
      window.removeEventListener(APP_DATA_UPDATED_EVENT, loadNotifications);
    };
  }, []);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.isRead).length,
    [notifications],
  );

  const canManage = Boolean(user?.email);

  const handleMarkAllRead = () => {
    if (!user?.email) {
      return;
    }
    markAllNotificationsAsRead(user.email);
  };

  const handleClearRead = () => {
    if (!user?.email) {
      return;
    }
    clearReadNotifications(user.email);
  };

  return (
    <div className="notifications-page container">
      <div className="notifications-header">
        <h1 className="heading-2">
          My <span className="text-gradient">Notifications</span>
        </h1>
        <p className="text-secondary notifications-subtitle">
          Track alerts, mark items as read, and keep your inbox clean.
        </p>
      </div>

      {!canManage ? (
        <div className="glass-card notifications-empty">
          <p className="text-secondary">
            Please log in to access your notifications.
          </p>
          <div className="notifications-empty-actions">
            <Link href="/login" className="btn-secondary">
              Go to Login
            </Link>
          </div>
        </div>
      ) : (
        <>
          <div className="glass-card notifications-toolbar">
            <p className="notifications-count">
              {unreadCount} unread of {notifications.length} total notifications
            </p>
            <div className="notifications-toolbar-actions">
              <button
                type="button"
                className="btn-secondary"
                onClick={handleMarkAllRead}
                disabled={notifications.length === 0 || unreadCount === 0}
              >
                Mark all as read
              </button>
              <button
                type="button"
                className="btn-secondary"
                onClick={handleClearRead}
                disabled={notifications.length === 0}
              >
                Clear read
              </button>
            </div>
          </div>

          {!ready || notifications.length === 0 ? (
            <div className="glass-card notifications-empty">
              <p className="text-secondary">
                {ready
                  ? "No notifications yet. New updates will show here."
                  : "Loading notifications..."}
              </p>
            </div>
          ) : (
            <div className="notifications-list">
              {notifications.map((item) => (
                <article
                  key={item.id}
                  className={`glass-card notifications-item ${item.isRead ? "is-read" : "is-unread"}`}
                >
                  <div className="notifications-item-top">
                    <span className="notifications-category">
                      {item.category}
                    </span>
                    <time className="notifications-time">
                      {new Date(item.createdAt).toLocaleString()}
                    </time>
                  </div>
                  <h3 className="notifications-title">{item.title}</h3>
                  <p className="text-secondary notifications-message">
                    {item.message}
                  </p>
                  <div className="notifications-item-actions">
                    {!item.isRead && (
                      <button
                        type="button"
                        className="btn-secondary"
                        onClick={() =>
                          user?.email &&
                          markNotificationAsRead(user.email, item.id)
                        }
                      >
                        Mark as read
                      </button>
                    )}
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() =>
                        user?.email && deleteNotification(user.email, item.id)
                      }
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
