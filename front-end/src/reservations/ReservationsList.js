import React from "react";
import ErrorAlert from "../layout/ErrorAlert";
function ReservationsList({ reservations, handleCancel, cancelReservationError, filterFinishedCancelled }) {
    // will filter list depending on if it is used for the dashboard or the search page
        const filteredReservations = filterFinishedCancelled ? reservations.filter((reservation) => reservation.status !== "finished" && reservation.status !== "cancelled")
        : reservations
        
    // shows list of reservations
    return (
        <>
        <ErrorAlert error={cancelReservationError} />
        
    {reservations && (
        filteredReservations.map((reservation) => (
            <div key={reservation.reservation_id}>
              <h5 className="p-3 mb-2 bg-secondary text-white">Reservation: {reservation.reservation_id}</h5>
              <p><strong>First Name: </strong>{reservation.first_name}</p>
              <p><strong>Last Name: </strong>{reservation.last_name}</p>
              <p><strong>Phone Number: </strong>{reservation.mobile_number}</p>
              <p><strong>Date: </strong>{reservation.reservation_date}</p>
              <p><strong>Time: </strong>{reservation.reservation_time}</p>
              <p><strong>Party Of: </strong>{reservation.people}</p>
              <p><strong>Created At: </strong>{reservation.created_at}</p>
              <p><strong>Updated At: </strong>{reservation.updated_at}</p>
              <div data-reservation-id-status={reservation.reservation_id}>
                <strong>Status: </strong>{reservation.status}
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