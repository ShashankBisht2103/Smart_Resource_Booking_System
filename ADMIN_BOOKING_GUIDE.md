# Admin Resource Booking Guide

This guide explains how to use the admin resource booking features that allow administrators to book resources on behalf of users and manage all bookings in the system.

## Admin Resource Booking Page

The admin resource booking page is identical to the user's resource booking page with additional fields for specifying the user:

1. **Select Resource Type**
   - Choose from available resource types (Lecture Theatre, Classroom, Lab/TCL, Other)
   - The interface will update to show specific resources of that type

2. **Select Specific Resource**
   - Click on the specific resource you want to book
   - Information about the resource (description, location, capacity) will be displayed

3. **Select Date**
   - Use the calendar to choose the date for the booking
   - The system will automatically load available time slots for that date

4. **Select Time Slot**
   - Available time slots will be displayed
   - Green slots are available for booking
   - Red slots are already booked
   - Blue slots are reserved for scheduled classes
   - Click on an available time slot to select it

5. **Enter User Information**
   - Fill in the user's full name
   - Enter the user's ID (this is required for system tracking)

6. **Add Purpose/Notes (Optional)**
   - Enter any additional information about the booking

7. **Confirm Booking**
   - Click the "Confirm Booking" button
   - A success message will appear if the booking is created successfully

## Admin All Bookings Page

The admin all bookings page is identical to the user's "My Bookings" page but with additional capabilities to view and manage all bookings:

1. **View All Bookings**
   - Navigate to "All Bookings" from the admin dashboard
   - View all bookings in a card-based layout similar to the user interface
   - See today's schedule and timetable in calendar views

2. **Filter Bookings by Type**
   - **Today's Schedule**: Shows today's bookings
   - **Today's Classes**: Shows today's scheduled classes
   - **Full Schedule**: Shows all bookings in a calendar view
   - **Upcoming Bookings**: Shows upcoming bookings made by the admin
   - **Past Bookings**: Shows past bookings made by the admin

3. **Cancel Any Booking**
   - Admins can cancel any booking made by themselves
   - Click the "Cancel" button on any booking card
   - A confirmation will appear when the booking is successfully cancelled
   - Bookings are marked as "cancelled" rather than deleted

4. **Reschedule Bookings**
   - Admins can reschedule bookings (feature available for upcoming bookings)
   - Click the "Reschedule" button on any booking card

## Important Notes

- Admins can book any available time slot for any user
- Admins cannot book time slots that are already reserved for scheduled classes
- Admins cannot book time slots that are already booked by other users
- All bookings made by admins will appear in the regular booking system
- Users will be able to view bookings made on their behalf
- Admins can cancel their own bookings
- Bookings are never permanently deleted, only marked as "cancelled"

## Technical Implementation

The feature was implemented by:

1. Creating an `AdminBookForUser.tsx` component that is identical to the user's `BookResource.tsx` but with additional fields for user information
2. Making the `AdminAllBookings.tsx` component identical to the user's `MyBookings.tsx`
3. Adding a route `/admin/book-for-user` in `App.tsx`
4. Adding navigation links in the admin dashboard
5. Leveraging existing backend APIs for resource and booking management

## API Endpoints Used

- `GET /api/resources/types` - Fetch resource types
- `GET /api/resources` - Fetch all resources
- `GET /api/timeslots/:resource_id?date=:date` - Fetch time slots for a resource on a specific date
- `POST /api/bookings` - Create a new booking
- `DELETE /api/bookings/:booking_id` - Cancel a booking

The implementation follows the same patterns and conventions as the rest of the application.