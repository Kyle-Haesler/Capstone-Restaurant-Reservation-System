import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SearchReservations() {
  const [mobileNumber, setMobileNumber] = useState("");
    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState(null)
  const handleChange = ({target}) => {
    setMobileNumber(target.value);
  };

  const handleFind = async (event) => {
    event.preventDefault();
    setReservationsError(null)
    const abortController = new AbortController()
    try {
        const data = await searchReservations(mobileNumber)
        setReservations(data)

    } catch(error){
        setReservationsError(error)
    }
    return () => abortController.abort();
  };

  return (
    <div>
      <form onSubmit={handleFind}>
        <input
          type="text"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          value={mobileNumber}
          onChange={handleChange}
        />
        <button type="submit">Find</button>
      </form>
      <div>
        {reservations.length === 0 ? (
            <p>No reservations found</p>
        ) : (
      reservations.map((reservation, index) => (
        <div key={index}>
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
          </div>
          ))
      )}
      </div>
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default SearchReservations;