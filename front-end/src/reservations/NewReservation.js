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
        const daysOfTheWeek =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            const potentialReservationDate = new Date(formData.reservation_date)
            const dayOfWeekIndex = potentialReservationDate.getDay()
            const reservedDay = daysOfTheWeek[dayOfWeekIndex]
            const currentDate = new Date().toISOString().split("T")[0]
            // make sure reservation date is not on a Tuesday and not in the past
            if(reservedDay === "Tuesday" && formData.reservation_date < currentDate){
                setReservationsError({message: "The restaurant is closed on Tuesdays, please reserve a different day. Also, the reservation date must be in the future."})
            }
            // make sure reservation_date is not on a Tuesday as the restaurant is closed on Tuesdays.
            else if(reservedDay === "Tuesday"){
                setReservationsError({message: "The restaurant is closed on Tuesdays, please reserve a different day."})
            } 
            // make sure reservation_date is not in the past
            else if (formData.reservation_date < currentDate){
                setReservationsError({message: "Reservation date must be in the future."})
            } else {
            try {    
            await createReservation(formData, abortController.signal);
            history.push(`/dashboard?date=${formData.reservation_date}`);
            setFormData({...initialFormState});
        } catch (error) {
            setReservationsError(error)
        }
        return () => abortController.abort();
    }
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