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
              <h5 className="p-3 mb-2 bg-secondary text-white">Reservation: {reservation.reservation_id}</h5>
              <p className="font-weight-bold">First Name: {reservation.first_name}</p>
              <p className="font-weight-bold">Last Name: {reservation.last_name}</p>
              <p className="font-weight-bold">Phone Number: {reservation.mobile_number}</p>
              <p className="font-weight-bold">Date: {reservation.reservation_date}</p>
              <p className="font-weight-bold">Time: {reservation.reservation_time}</p>
              <p className="font-weight-bold">Party Of: {reservation.people}</p>
              <p className="font-weight-bold">Created At: {reservation.created_at}</p>
              <p className="font-weight-bold">Updated At: {reservation.updated_at}</p>
              <div className="font-weight-bold" data-reservation-id-status={reservation.reservation_id}>
                Status: {reservation.status}
                </div>
                <br />
                {reservation.status === "booked" && (
                  <a href={`/reservations/${reservation.reservation_id}/seat`}>
                  <button type="button" className="btn btn-success">Seat</button>
                </a>
                )}
                <a href={`/reservations/${reservation.reservation_id}/edit`}>
                  <button type="button" className="btn btn-warning">Edit</button>
                </a>
                <button type="button" className="btn btn-danger" data-reservation-id-cancel={reservation.reservation_id} onClick={() => handleCancel(reservation.reservation_id)}>Cancel</button>
                <hr />
              </div>
              ))
    )}
    </>
  );
}

export default ReservationsList;