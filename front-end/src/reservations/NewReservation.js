import React, { useState } from "react";
import {useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation(){
    const [reservationsError, setReservationsError] = useState(null);
    const history = useHistory()
    const initialFormState = {
        first_name: "",
        last_name: "",
        mobile_number: "",
        reservation_date: "",
        reservation_time: "",
        people: ""
    }
    const [formData, setFormData] = useState({...initialFormState})
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
        setReservationsError(null)
        const abortController = new AbortController();
        event.preventDefault()
        try {
            await createReservation(formData, abortController.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
            setFormData({...initialFormState});
        } catch (error) {
            setReservationsError(error)
        }
        return () => abortController.abort();
    };
    return (
        <div>
        <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} />
        <button type="button" onClick={handleCancel}>Cancel</button>
        <ErrorAlert error={reservationsError} />
        </div>
    )
}

export default NewReservation