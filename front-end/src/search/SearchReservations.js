import React, { useState } from "react";
import { searchReservations } from "../utils/api";
import { updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationsList from "../reservations/ReservationsList";

function SearchReservations() {
    // state for mobile number in the search form
  const [mobileNumber, setMobileNumber] = useState("");
  // state for API call to search reservations and any errors that may come along with
    const [reservations, setReservations] = useState([])
    const [reservationsError, setReservationsError] = useState(null)
    // state for errors associated with API call to cancel a reservation
    const [cancelReservationError, setCancelReservationError] = useState(null)
    // state for keeping track of whether or not a search has been performed
    const [searchPerformed, setSearchPerformed] = useState(false)
  const handleChange = ({target}) => {
    setMobileNumber(target.value);
  };
// API call to search for reservations and catch any errors
  const handleFind = async (event) => {
    event.preventDefault();
    setReservationsError(null)
    const abortController = new AbortController()
    try {
        const data = await searchReservations(mobileNumber)
        setReservations(data)
        setSearchPerformed(true)

    } catch(error){
        setReservationsError(error)
    }
    return () => abortController.abort();
  };
  // API call to cancel a reservation and catch any errors
  async function handleCancel(reservationId){
    const confirmed = window.confirm("Do you want to cancel this reservation? This cannot be undone.")
    if(confirmed){
      setCancelReservationError(null)
      const abortController = new AbortController()
      const status = "cancelled"
      try{
        await updateReservationStatus(Number(reservationId), status, abortController.signal)
        window.location.reload()
      } catch (error){
        setCancelReservationError(error)
      }
      return () => abortController.abort()
    }

  }
// shows the reservations found or a message saying none were found at all. Same component used in dashboard but unfiltered to show all results. Also shows any errors

  return (
    <div>
        <div className="p-3 mb-2 bg-primary text-white">
            <h1>Search</h1>
            </div>
            <br />
      <form onSubmit={handleFind} className="form-group">
        <input
          type="text"
          name="mobile_number"
          placeholder="Enter a customer's phone number"
          className="form-control"
          value={mobileNumber}
          onChange={handleChange}
          required
        />
        <br />
        <button className="btn btn-primary" type="submit">Find</button>
      </form>
      <div>
        {reservations.length === 0 && searchPerformed ? (
            <p><strong>No reservations found </strong></p>
        ) : (
            <ReservationsList reservations={reservations} handleCancel={handleCancel} cancelReservationError={cancelReservationError} filterFinishedCancelled={false} />
      )}
      </div>
      <ErrorAlert error={reservationsError} />
    </div>
  );
}

export default SearchReservations;