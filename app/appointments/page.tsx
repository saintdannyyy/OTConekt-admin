''use client';
import React, { useEffect, useState } from "react";

// Example: Replace with your actual fetch logic (e.g. Supabase, API, etc.)
async function fetchAppointments() {
  // Simulate API call
  return [
    {
      id: 1,
      client: { name: "Jane Doe", email: "jane@example.com" },
      therapist: { name: "Dr. Smith", email: "smith@example.com" },
      scheduled_at: "2025-08-01T10:00:00Z",
      status: "confirmed",
      notes: "Initial assessment",
    },
    // ...more appointments
  ];
}

export default function AdminAppointmentsPage() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAppointments().then((data) => {
      setAppointments(data);
      setLoading(false);
    });
  }, []);

  return (
    <div style={{ padding: 32 }}>
      <h1>All Appointments</h1>
      {loading ? (
        <p>Loading...</p>
      ) : appointments.length === 0 ? (
        <p>No appointments found.</p>
      ) : (
        <table
          style={{ width: "100%", borderCollapse: "collapse", marginTop: 24 }}
        >
          <thead>
            <tr>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: 8,
                }}
              >
                Client
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: 8,
                }}
              >
                Therapist
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: 8,
                }}
              >
                Date/Time
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: 8,
                }}
              >
                Status
              </th>
              <th
                style={{
                  borderBottom: "1px solid #ccc",
                  textAlign: "left",
                  padding: 8,
                }}
              >
                Notes
              </th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt.id}>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {appt.client.name} <br />
                  <small>{appt.client.email}</small>
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {appt.therapist.name} <br />
                  <small>{appt.therapist.email}</small>
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {new Date(appt.scheduled_at).toLocaleString()}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {appt.status}
                </td>
                <td style={{ borderBottom: "1px solid #eee", padding: 8 }}>
                  {appt.notes}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
