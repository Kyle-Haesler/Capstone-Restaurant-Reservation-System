import React, { useEffect, useState } from "react";
import { listReservations } from "../utils/api";
import { listTables } from "../utils/api";
import { removeTableAssignment } from "../utils/api";
import { updateReservationStatus } from "../utils/api";
import { previous, next } from "../utils/date-time";
import ErrorAlert from "../layout/ErrorAlert";
import {useHistory, useLocation} from "react-router-dom"
import ReservationsList from "../reservations/ReservationsList";
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
  const [endDiningExperienceError, setEndDiningExperienceError] = useState(null)
  const [cancelReservationError, setCancelReservationError] = useState(null)
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
  async function handleFinish(tableID, reservationID){
    setEndDiningExperienceError(null)
    const confirmMessage = "Is this table ready to seat new guests? This cannot be undone."
    const confirmed = window.confirm(confirmMessage)
    if(confirmed){
      const abortController = new AbortController()
        // make sure table is occupied before allowing to to finish
        if(!reservationID){
          setEndDiningExperienceError({message: "This table is not occupied, please select a different table to finish."})
        } else {
          try {
          await removeTableAssignment(Number(tableID), abortController.signal)
        window.location.reload()
      } catch (error) {
        setEndDiningExperienceError(error)
      }
      return () => abortController.abort();
    }
    }
  }
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

  return (
    <main>
      <div className="p-3 mb-2 bg-primary text-white">
      <h1>Dashboard</h1>
      </div>
      <div className="d-md-flex mb-3">
      <div className="p-3 mb-2 bg-success-subtle text-emphasis-success">
        <h4 className="mb-0">Reservations for {applicableDate}</h4>
        </div>
        </div>
        <button type="button" className="btn btn-dark" onClick={handlePrevious}>Previous</button>
        <button type="button" className="btn btn-primary" onClick={handleToday}>Today</button>
        <button type="button" className="btn btn-dark" onClick={handleNext}>Next</button>
      <div>
        <br />
      <ErrorAlert error={reservationsError} />
      <ErrorAlert error={tablesError} />
      </div>
        <div className="row">
          <div className="col-md-6">
      <ReservationsList reservations={reservations} handleCancel={handleCancel} cancelReservationError={cancelReservationError} filterFinishedCancelled={true} />
      </div>
      
      
      <br />
      <div className="col-md-6">
        {tables.map((table) => (
          <div key={table.table_id}>
            <h5 className="p-3 mb-2 bg-light text-dark" data-table-id-status={table.table_id}>
        {table.reservation_id ? "Occupied" : "Free"}
        
      </h5>
          <h5 className="p-3 mb-2 bg-secondary text-white">Table: {table.table_id}</h5>
          <p><strong>Table Name:</strong> {table.table_name}</p>
          <p><strong>Reservation ID:</strong> {table.reservation_id}</p>
          <p><strong>Capacity: </strong> {table.capacity}</p>
          <p><strong>Created At: </strong> {table.created_at}</p>
          <p><strong>Updated At: </strong>{table.updated_at}</p>
          {table.reservation_id && (
            <button 
            type="button"
            className="btn btn-danger"
            data-table-id-finish={table.table_id}
            onClick={() => handleFinish(table.table_id, table.reservation_id)}
            >Finish</button>
          )}
          <ErrorAlert error={endDiningExperienceError} />
          <hr />
          </div>
        ))}
        </div>
      </div>
    </main>
  );
}

export default Dashboard;
