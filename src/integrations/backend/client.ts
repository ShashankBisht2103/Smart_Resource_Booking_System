// Python Backend Client
// This file provides functions to interact with the Python Flask backend

const BACKEND_URL = 'http://localhost:5000/api';

// Generic fetch function with error handling
const apiFetch = async (endpoint: string, options: RequestInit = {}) => {
  try {
    const response = await fetch(`${BACKEND_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching ${endpoint}:`, error);
    throw error;
  }
};

// Resources API
export const getResources = () => apiFetch('/resources');

export const getResourcesByType = (typeId: number) => apiFetch(`/resources/by-type/${typeId}`);

export const addResource = (resource: any) => 
  apiFetch('/resources', {
    method: 'POST',
    body: JSON.stringify(resource),
  });

export const deleteResource = (id: number) => 
  apiFetch(`/resources/${id}`, {
    method: 'DELETE',
  });

export const getResourceTypes = () => apiFetch('/resources/types');

// Bookings API
export const getBookings = () => apiFetch('/bookings');

export const getBookingsByDate = (date: string) => apiFetch(`/bookings/date/${date}`);

export const getBookingsForResource = (resourceId: number, date?: string) => {
  const queryParams = date ? `?date=${date}` : '';
  return apiFetch(`/bookings/resource/${resourceId}${queryParams}`);
};

export const addBooking = (booking: any) => 
  apiFetch('/bookings', {
    method: 'POST',
    body: JSON.stringify(booking),
  });

export const cancelBooking = (id: number, userId?: string, userRole?: string) => {
  const headers: Record<string, string> = {};
  if (userId) headers['X-User-ID'] = userId;
  if (userRole) headers['X-User-Role'] = userRole;
  
  return apiFetch(`/bookings/${id}`, {
    method: 'DELETE',
    headers,
  });
};

export const cancelAllBookingsForResource = (resourceId: number, userId?: string, userRole?: string) => {
  const headers: Record<string, string> = {};
  if (userId) headers['X-User-ID'] = userId;
  if (userRole) headers['X-User-Role'] = userRole;
  
  return apiFetch(`/bookings/resource/${resourceId}`, {
    method: 'DELETE',
    headers,
  });
};

// Time Slots API
export const getTimeSlots = (resourceId: number, date: string) => 
  apiFetch(`/timeslots/${resourceId}?date=${date}`);

export const getFreeTimeSlots = (resourceId: number, date: string) => 
  apiFetch(`/timeslots/free/${resourceId}?date=${date}`);

export const getAllBookedTimeSlots = (date: string) => 
  apiFetch(`/timeslots/booked?date=${date}`);

// This function is kept for backward compatibility
export const getResourceTimeSlots = (resourceId: number, date?: string) => {
  return getTimeSlots(resourceId, date || new Date().toISOString().split('T')[0]);
};

export const addTimeSlot = (timeSlot: any) => 
  apiFetch('/timeslots', {
    method: 'POST',
    body: JSON.stringify(timeSlot),
  });

export const updateTimeSlot = (id: number, updates: any) => 
  apiFetch(`/timeslots/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates),
  });

<<<<<<< HEAD
// New function to get available resources for a specific time slot
export const getAvailableResources = (date: string, startTime: string, endTime: string) => 
  apiFetch(`/resources/available?date=${date}&start_time=${startTime}&end_time=${endTime}`);

=======
>>>>>>> 279f32751ea9e4b7af603b974022215c4cf4f65a
// Timetable API
export const getTimetable = () => apiFetch('/timetable');

export const getTodayTimetable = () => apiFetch('/timetable/today');

// Health check
export const healthCheck = () => apiFetch('/health');

// Types
export interface Booking {
  id: number;
  user_id: string;
  user_name: string;
  resource_id: number;
  resource_name: string;
  start_time: string;
  end_time: string;
  purpose: string;
  status: string;
  created_at: string;
}

export interface Resource {
  id: number;
  name: string;
  type_id: number;
  type_name: string;
  location: string;
  capacity: number;
  description: string;
  created_at: string;
}

export interface TimeSlot {
  start_time: string;
  end_time: string;
  duration: string;
  is_booked: boolean;
  is_timetable: boolean;
  booking_info?: {
    booking_id: number;
    user_name: string;
    type: string;
  };
  timetable_info?: {
    subject_code: string;
    subject_name: string;
    faculty_name: string;
    type: string;
  };
}

export interface TimetableEntry {
  id: number;
  day: string;
  time_start: string;
  time_end: string;
  subject_code: string;
  subject_name: string;
  faculty_name: string;
  venue: string;
  resource_id: number;
}