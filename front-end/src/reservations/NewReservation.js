import React, { useState } from "react";
import {useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

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
        <form onSubmit={handleSubmit}>
            <label htmlFor="first_name">
                First Name:
                <input 
                id="first_name"
                type="text"
                name="first_name"
                onChange={handleChange}
                value={formData.first_name}
                required
                />
            </label>
            <br />
            <label htmlFor="last_name">
                Last Name:
                <input 
                id="last_name"
                type="text"
                name="last_name"
                onChange={handleChange}
                value={formData.last_name}
                required
                />
            </label>
            <br />
            <label htmlFor="mobile_number">
                Mobile Number:
                <input 
                id="mobile_number"
                type="text"
                name="mobile_number"
                onChange={handleChange}
                value={formData.mobile_number}
                required
                />
            </label>
            <br />
            <label htmlFor="reservation_date">
                Reservation Date:
                <input 
                id="reservation_date"
                type="date"
                name="reservation_date"
                onChange={handleChange}
                value={formData.reservation_date}
                required
                />
            </label>
            <br />
            <label htmlFor="reservation_time">
                Reservation Time:
                <input 
                id="reservation_time"
                type="time"
                name="reservation_time"
                onChange={handleChange}
                value={formData.reservation_time}
                required
                />
            </label>
            <br />
            <label htmlFor="people">
                Party Size:
                <input 
                id="people"
                type="number"
                name="people"
                onChange={handleChange}
                value={formData.people}
                required
                min="1"
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        <button type="button" onClick={handleCancel}>Cancel</button>
        <ErrorAlert error={reservationsError} />
        </div>
    )
}

export default NewReservation