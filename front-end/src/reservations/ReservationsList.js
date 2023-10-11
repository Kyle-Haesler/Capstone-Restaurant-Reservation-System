import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
function ReservationsList({ reservations, handleCancel, cancelReservationError, filterFinishedCancelled }) {
    
        const filteredReservations = filterFinishedCancelled ? reservations.filter((reservation) => reservation.status !== "finished" && reservation.status !== "cancelled")
        : reservations
        
    
    return (
        <>
        <ErrorAlert error={cancelReservationError} />
        
    {reservations && (
        filteredReservations.map((reservation) => (
            <div key={reservation.reservation_id}>
              <h3>Reservation: {reservation.reservation_id}</h3>
              <p>First Name: {reservation.first_name}</p>
              <p>Last Name: {reservation.last_name}</p>
              <p>Phone Number: {reservation.mobile_number}</p>
              <p>Date: {reservation.reservation_date}</p>
              <p>Time: {reservation.reservation_time}</p>
              <p>Party Of: {reservation.people}</p>
              <p>Created At: {reservation.created_at}</p>
              <p>Updated At: {reservation.updated_at}</p>
              <div data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
                </div>
                {reservation.status === "booked" && (
                  <a href={`/reservations/${reservation.reservation_id}/seat`}>
                  <button>Seat</button>
                </a>
                )}
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                  <button>Edit</button>
                </a>
                <button data-reservation-id-cancel={reservation.reservation_id} onClick={() => handleCancel(reservation.reservation_id)}>Cancel</button>
                
              </div>
              ))
    )}
    </>
  );
}

export default ReservationsList;