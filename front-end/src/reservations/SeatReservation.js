import React, { useEffect, useState } from "react";
import {useHistory, useParams} from "react-router-dom"
import { getReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";


function SeatReservation(){
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [tables, setTables] = useState([])
    const [tablesError, setTablesError] = useState(null)
    const {reservation_id} = useParams()
    useEffect(loadReservation, [reservation_id])
    function loadReservation(){
        const abortController = new AbortController();
        setReservationError(null)
        getReservation(reservation_id, abortController.signal)
        .then(setReservation).catch(setReservationError)
    return () => abortController.abort();
  }
  console.log(reservation)
  return (
    <p>{reservation.first_name}</p>
  )
    }



export default SeatReservation