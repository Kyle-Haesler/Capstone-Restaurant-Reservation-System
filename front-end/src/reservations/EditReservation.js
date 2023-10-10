import React, { useState, useEffect } from "react";
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { formatAsTime } from "../utils/date-time";
import { editReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation(){
    const [reservation, setReservation] = useState([])
    const [reservationError, setReservationError] = useState(null)
    const [updatedResError, setUpdatedResError] = useState(null)
    const history = useHistory()
    const {reservation_id} = useParams()
    useEffect(loadReservation, [reservation_id])
    const [formData, setFormData] = useState({})

    function loadReservation(){
        const abortController = new AbortController();
        setReservationError(null)
        getReservation(reservation_id, abortController.signal)
        .then((reservation) => {
            setReservation(reservation)
            setFormData({
                first_name: reservation.first_name,
        last_name: reservation.last_name,
        mobile_number: reservation.mobile_number,
        reservation_date: formatAsDate(reservation.reservation_date),
        reservation_time: formatAsTime(reservation.reservation_time),
        people: reservation.people,
        status: reservation.status
            })
        }).catch(setReservationError)
    return () => abortController.abort();
  }
  

    const handleChange = ({target}) => {
        if(target.name === "people"){
            setFormData({
                ...formData, [target.name]: Number(target.value)
            })
        } else {
        setFormData({
            ...formData, [target.name]: target.value
        })
    }
}
    const handleCancel = () => {
        history.goBack()
    }
    const handleSubmit = async (event) => {
        setReservationError(null)
        const abortController = new AbortController();
        event.preventDefault()
        try {
            await editReservation(Number(reservation_id), formData, abortController.signal)
            history.push(`/dashboard?date=${formData.reservation_date}`);
            setFormData({});
        } catch (error) {
            setUpdatedResError(error)
        }
        return () => abortController.abort();
    };
    return (
        <div>
        <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        <button type="button" onClick={handleCancel}>Cancel</button>
        <ErrorAlert error={reservationError} />
        <ErrorAlert error={updatedResError} />
        </div>
    )
}

export default EditReservation