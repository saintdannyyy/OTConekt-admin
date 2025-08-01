"use client";
import React, { useEffect, useState } from "react";
import { supabaseAdmin } from "../../lib/supabase";
import DashboardLayout from "@/components/DashboardLayout";

// Fetch all appointments with client and therapist details
async function fetchAppointments() {
  const { data, error } = await supabaseAdmin
    .from("appointments")
    .select(
      `id, scheduled_at, status, notes, client:client_id (id, name, email), therapist:therapist_id (id, name, email)`
    )
    .order("scheduled_at", { ascending: false });
  if (error) throw error;
  return data || [];
}

import toast from "react-hot-toast";
import { Suspense } from "react";
export const dynamic = "force-dynamic";

function AppointmentsPageContent() {
  // State for all appointments
  const [appointments, setAppointments] = useState<any[]>([]);
  // State for filtered appointments
  const [filteredAppointments, setFilteredAppointments] = useState<any[]>([]);
  // Loading state
  const [loading, setLoading] = useState(true);
  // Search term for filtering
  const [searchTerm, setSearchTerm] = useState("");
  // Status filter
  const [statusFilter, setStatusFilter] = useState<
    "all" | "booked" | "completed" | "cancelled" | "no_show"
  >("all");

  // Fetch all appointments on mount
  useEffect(() => {
    fetchAll();
  }, []);

  // Filter appointments when dependencies change
  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter]);

  // Fetch all appointments from Supabase
  const fetchAll = async () => {
    try {
      setLoading(true);
      const data = await fetchAppointments();
      setAppointments(data);
    } catch (error) {
      toast.error("Failed to load appointments");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  // Filter appointments by status and search term
  const filterAppointments = () => {
    let filtered = appointments;
    if (statusFilter !== "all") {
      filtered = filtered.filter((appt) => appt.status === statusFilter);
    }
    if (searchTerm) {
      filtered = filtered.filter(
        (appt) =>
          appt.client?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          appt.client?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appt.therapist?.name
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          appt.therapist?.email
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
      );
    }
    setFilteredAppointments(filtered);
  };

  // Count for each status
  const statusCounts = {
    all: appointments.length,
    booked: appointments.filter((a) => a.status === "booked").length,
    completed: appointments.filter((a) => a.status === "completed").length,
    cancelled: appointments.filter((a) => a.status === "cancelled").length,
    no_show: appointments.filter((a) => a.status === "no_show").length,
  };

  return (
    <DashboardLayout>
      <div className="space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              Appointments
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              View and manage all appointments
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex space-x-2 overflow-x-auto pb-2">
            {Object.entries(statusCounts).map(([key, count]) => (
              <button
                key={key}
                onClick={() => setStatusFilter(key as any)}
                className={`px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors whitespace-nowrap ${
                  statusFilter === key
                    ? "bg-primary-100 text-primary-700"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {key.charAt(0).toUpperCase() + key.slice(1).replace("_", " ")} (
                {count})
              </button>
            ))}
          </div>
          <div className="flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search appointments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Appointments Table */}
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No appointments found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border border-gray-200 rounded-lg overflow-hidden">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Client
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Therapist
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Date/Time
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Status
                  </th>
                  <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">
                    Notes
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map((appt) => (
                  <tr
                    key={appt.id}
                    className="border-b last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium text-gray-900">
                        {appt.client?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appt.client?.email || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top">
                      <div className="font-medium text-gray-900">
                        {appt.therapist?.name || "-"}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appt.therapist?.email || "-"}
                      </div>
                    </td>
                    <td className="px-4 py-2 align-top">
                      {appt.scheduled_at
                        ? new Date(appt.scheduled_at).toLocaleString()
                        : "-"}
                    </td>
                    <td className="px-4 py-2 align-top">
                      <span
                        className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                          appt.status === "completed"
                            ? "bg-green-100 text-green-700"
                            : appt.status === "cancelled"
                            ? "bg-red-100 text-red-700"
                            : appt.status === "no_show"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {appt.status.replace("_", " ").toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-2 align-top text-sm text-gray-700">
                      {appt.notes || "-"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function AppointmentsPage() {
  return (
    <Suspense
      fallback={
        <DashboardLayout>
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          </div>
        </DashboardLayout>
      }
    >
      <AppointmentsPageContent />
    </Suspense>
  );
}
