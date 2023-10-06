import React, { useEffect, useState } from "react";
import {useHistory, useParams} from "react-router-dom"
import { getReservation, listTables, updateTable, updateReservationStatus } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation(){
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [reservationStatusError, setReservationStatusError] = useState(null)
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null)
    const [selectedTable, setSelectedTable] = useState("");
    const [seatReservationError, setSeatReservationError] = useState(null)
    const {reservation_id} = useParams()
    const history = useHistory()
    useEffect(loadReservation, [reservation_id])
    useEffect(loadTables, [reservation_id])

    function loadReservation(){
        const abortController = new AbortController();
        setReservationError(null)
        getReservation(reservation_id, abortController.signal)
        .then(setReservation).catch(setReservationError)
    return () => abortController.abort();
  }
  function loadTables(){
    const abortController = new AbortController();
    setTablesError(null)
    listTables(abortController.signal)
    .then(setTables).catch(setTablesError)
return () => abortController.abort();
}
const handleCancel = () => {
    history.goBack()
}
const handleSubmit = async (event) => {
    setSeatReservationError(null)
    setReservationStatusError(null)
    event.preventDefault()
    const resParty = reservation.people
    const foundTable = tables.find((table) => table.table_id === Number(selectedTable))
    if(resParty > foundTable.capacity){
        setSeatReservationError({message: `This table cannot accomodate your party of ${resParty}. Please select a different table`})
    } else if(foundTable.reservation_id){
        setSeatReservationError({message: `This table is currently reserved, please choose a different table.`})
    } else {
        const abortController = new AbortController()
        try{
            await updateTable(Number(selectedTable), Number(reservation_id), abortController.signal)
            await updateReservationStatus(Number(reservation_id), "seated", abortController.signal)
            history.push("/dashboard")
            setSelectedTable("")
        } catch (error){
            setSeatReservationError(error)
            setReservationStatusError(error)
        }
        return () => abortController.abort();
    }
};

  return (
        <div>
        <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="table_id">Select a Table:</label>
        <select
          id="table_id"
          name="table_id"
          value={selectedTable}
          onChange={(e) => setSelectedTable(e.target.value)}
        >
          <option value="">Select a table...</option>
          {tables.map((table) => (
            <option key={table.table_id} value={table.table_id}>
              {table.table_name} - {table.capacity}
            </option>
          ))}
        </select>
      </div>
      <button type="submit">Seat Reservation</button>
    </form>
        <button type="button" onClick={handleCancel}>Cancel</button>
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={seatReservationError} />
        <ErrorAlert error={reservationStatusError} />
        </div>
    )
    }



export default SeatReservation