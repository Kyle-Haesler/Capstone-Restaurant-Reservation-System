import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { getReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

function SeatReservation() {
  // state for API call to get reservation along with the state used for any errors that may come along
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  // state for API call to list tables along with the state used for any errors that may come along
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  // state for table selection on form
  const [selectedTable, setSelectedTable] = useState("");
  // state for API call error to seat the reservation
  const [seatReservationError, setSeatReservationError] = useState(null);
  const { reservation_id } = useParams();
  const history = useHistory();
  // API calls to get the reservation and the tables everytime reservation ID is changed in the parameters
  useEffect(loadReservation, [reservation_id]);
  useEffect(loadTables, [reservation_id]);
  // API call to get the reservation and capture any errors
  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    getReservation(reservation_id, abortController.signal)
      .then(setReservation)
      .catch(setReservationError);
    return () => abortController.abort();
  }
  // API call to get the tables and capture any errors
  function loadTables() {
    const abortController = new AbortController();
    setTablesError(null);
    listTables(abortController.signal).then(setTables).catch(setTablesError);
    return () => abortController.abort();
  }
  const handleCancel = () => {
    history.goBack();
  };
  // seat reservation front-end validation along with API call to seat the reservation and capture any errors
  const handleSubmit = async (event) => {
    setSeatReservationError(null);
    event.preventDefault();
    const resParty = reservation.people;
    const foundTable = tables.find(
      (table) => table.table_id === Number(selectedTable),
    );
    if (resParty > foundTable.capacity) {
      setSeatReservationError({
        message: `This table cannot accomodate your party of ${resParty}. Please select a different table`,
      });
    } else if (foundTable.reservation_id) {
      setSeatReservationError({
        message: `This table is currently reserved, please choose a different table.`,
      });
    } else {
      const abortController = new AbortController();
      try {
        await updateTable(
          Number(selectedTable),
          Number(reservation_id),
          abortController.signal,
        );
        history.push("/dashboard");
        setSelectedTable("");
      } catch (error) {
        setSeatReservationError(error);
      }
      return () => abortController.abort();
    }
  };
  // select form for seating a reservation along with any front-end or backend validation errors
  return (
    <div>
      <div className="p-3 mb-2 bg-primary text-white">
        <h1>Seat Reservation</h1>
      </div>
      <br />
      <form onSubmit={handleSubmit} className="form-group">
        <div>
          <label htmlFor="table_id">Select a Table:</label>
          <select
            id="table_id"
            name="table_id"
            value={selectedTable}
            className="form-control"
            onChange={(e) => setSelectedTable(e.target.value)}
            required
          >
            <option value="">Select a table...</option>
            {tables.map((table) => (
              <option key={table.table_id} value={table.table_id}>
                {table.table_name} - {table.capacity}
              </option>
            ))}
          </select>
        </div>
        <br />
        <button type="submit" className="btn btn-primary">
          Seat Reservation
        </button>
        <button type="button" className="btn btn-danger" onClick={handleCancel}>
          Cancel
        </button>
      </form>

      <ErrorAlert error={reservationError} />
      <ErrorAlert error={tablesError} />
      <ErrorAlert error={seatReservationError} />
    </div>
  );
}

export default SeatReservation;
