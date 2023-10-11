import React, { useEffect, useState } from "react";
import {useHistory, useParams} from "react-router-dom"
import { getReservation, listTables, updateTable } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation(){
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
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
            history.push("/dashboard")
            setSelectedTable("")
        } catch (error){
            setSeatReservationError(error)
            
        }
        return () => abortController.abort();
    }
};

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
          className="form-control w-25"
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
      <button type="submit" className="btn btn-primary">Seat Reservation</button>
      <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
    </form>
        
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={tablesError} />
        <ErrorAlert error={seatReservationError} />
        </div>
    )
    }



export default SeatReservation