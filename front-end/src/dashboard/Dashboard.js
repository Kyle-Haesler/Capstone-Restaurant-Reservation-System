import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory, useLocation} from "react-router-dom"
/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [tables, setTables] = useState([]);
  const [tablesError, setTablesError] = useState(null);
  const history = useHistory()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  let applicableDate;
  if(params.get("date")){
    applicableDate = params.get("date")
  } else {
    applicableDate = date
  }
  useEffect(loadDashboard, [applicableDate]);

  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null)
    setTablesError(null)
    listReservations(applicableDate, abortController.signal)
      .then(reservationsData => {
        setReservations(reservationsData)
        return listTables(abortController.signal)
      }).then(tablesData => {
        setTables(tablesData)
      })
      .catch(error => {
        setReservationsError(error)
        setTablesError(error)
      });
    return () => abortController.abort();
  }
  function handlePrevious(){
    const newDate = previous(applicableDate)

    history.push(`/dashboard?date=${newDate}`);
  }
  function handleToday(){
    history.push(`/dashboard?date=${date}`);
  }
  function handleNext(){
    const newDate = next(applicableDate)
    history.push(`/dashboard?date=${newDate}`);
  }
  function handleFinish(tableID){
    const confirmMessage = "Is this table ready to seat new guests? This cannot be undone."
    const confirmed = window.confirm(confirmMessage)
    if(confirmed){
      /// need to implement delete request here.
      console.log(tableID)
    }
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0">Reservations for date</h4>
        </div>
        <button type="button" onClick={handlePrevious}>Previous</button>
        <button type="button" onClick={handleToday}>Today</button>
        <button type="button" onClick={handleNext}>Next</button>
      <div>
        <br />
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      </div>
      <div>
      {reservations.map((reservation, index) => (
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
          <a href={`/reservations/${reservation.reservation_id}/seat`}>
            <button>Seat</button>
          </a>
          </div>
      ))}
      </div>
      <br />
      <div>
        {tables.map((table, index) => (
          <div key={index}>
            <h3 data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"}
      </h3>
          <h4>Table: {table.table_id}</h4>
          <p>Table Name: {table.table_name}</p>
          <p>Reservation ID: {table.reservation_id}</p>
          <p>Capacity: {table.capacity}</p>
          <p>Created At: {table.created_at}</p>
          <p>Updated At: {table.updated_at}</p>
          {table.reservation_id && (
            <button 
            type="button"
            data-table-id-finish={table.table_id}
            onClick={() => handleFinish(table.table_id)}
            >Finish</button>
          )}
          </div>
        ))}
      </div>
    </main>
  );
}

export default Dashboard;
