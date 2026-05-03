"use client";

import { useEffect, useState } from "react";

interface CalendarProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  minDate?: string;
}

export default function Calendar({
  selectedDate,
  onDateChange,
  minDate,
}: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date(selectedDate));
  const [displayMonth, setDisplayMonth] = useState(
    new Date(selectedDate).getMonth(),
  );
  const [displayYear, setDisplayYear] = useState(
    new Date(selectedDate).getFullYear(),
  );

  const daysInMonth = (month: number, year: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const firstDayOfMonth = (month: number, year: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateDisabled = (day: number): boolean => {
    const date = new Date(displayYear, displayMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date < today) return true;
    if (minDate) {
      const min = new Date(minDate);
      min.setHours(0, 0, 0, 0);
      return date < min;
    }
    return false;
  };

  const formatDate = (day: number): string => {
    const year = displayYear;
    const month = String(displayMonth + 1).padStart(2, "0");
    const date = String(day).padStart(2, "0");
    return `${year}-${month}-${date}`;
  };

  const prevMonth = () => {
    if (displayMonth === 0) {
      setDisplayMonth(11);
      setDisplayYear(displayYear - 1);
    } else {
      setDisplayMonth(displayMonth - 1);
    }
  };

  const nextMonth = () => {
    if (displayMonth === 11) {
      setDisplayMonth(0);
      setDisplayYear(displayYear + 1);
    } else {
      setDisplayMonth(displayMonth + 1);
    }
  };

  const days = [];
  const totalDays = daysInMonth(displayMonth, displayYear);
  const firstDay = firstDayOfMonth(displayMonth, displayYear);

  // Empty cells for days before the first day of the month
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let day = 1; day <= totalDays; day++) {
    days.push(day);
  }

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return (
    <div className="glass" style={{ padding: "1.5rem", borderRadius: "12px" }}>
      {/* Selected Date Display */}
      <div
        style={{
          background: "rgba(59, 130, 246, 0.2)",
          padding: "1rem",
          borderRadius: "8px",
          marginBottom: "1.5rem",
          border: "1px solid rgba(59, 130, 246, 0.4)",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "0.875rem",
            color: "rgba(255, 255, 255, 0.7)",
          }}
        >
          Selected Date:
        </p>
        <p
          style={{
            margin: "0.5rem 0 0 0",
            fontSize: "1.25rem",
            fontWeight: "600",
            color: "white",
          }}
        >
          {new Date(selectedDate + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          })}
        </p>
      </div>

      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        <button
          onClick={prevMonth}
          className="btn-secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
        >
          ← Prev
        </button>
        <h3 className="text-white" style={{ margin: 0 }}>
          {monthNames[displayMonth]} {displayYear}
        </h3>
        <button
          onClick={nextMonth}
          className="btn-secondary"
          style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
        >
          Next →
        </button>
      </div>

      {/* Weekday headers */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        {weekDays.map((day) => (
          <div
            key={day}
            style={{
              textAlign: "center",
              fontWeight: "600",
              fontSize: "0.875rem",
              color: "rgba(255, 255, 255, 0.7)",
              padding: "0.5rem",
            }}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar days */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(7, 1fr)",
          gap: "0.5rem",
        }}
      >
        {days.map((day, index) => {
          if (day === null) {
            return (
              <div
                key={`empty-${index}`}
                style={{
                  aspectRatio: "1",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              />
            );
          }

          const dateStr = formatDate(day);
          const isSelected = dateStr === selectedDate;
          const isDisabled = isDateDisabled(day);

          return (
            <button
              key={day}
              onClick={() => !isDisabled && onDateChange(dateStr)}
              disabled={isDisabled}
              style={{
                aspectRatio: "1",
                padding: "0.5rem",
                borderRadius: "8px",
                border: isSelected
                  ? "2px solid #3b82f6"
                  : "1px solid rgba(255, 255, 255, 0.2)",
                background: isSelected
                  ? "rgba(59, 130, 246, 0.3)"
                  : isDisabled
                    ? "rgba(255, 255, 255, 0.05)"
                    : "transparent",
                color: isDisabled ? "rgba(255, 255, 255, 0.4)" : "white",
                cursor: isDisabled ? "not-allowed" : "pointer",
                fontSize: "0.875rem",
                fontWeight: isSelected ? "600" : "400",
                transition: "all 0.2s",
              }}
              className={isDisabled ? "" : "hover:bg-white/10"}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}
