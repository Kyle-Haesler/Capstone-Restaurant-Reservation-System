import React, { useState } from "react";
import {useHistory} from "react-router-dom"
import { createReservation } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import ReservationForm from "./ReservationForm";

function NewReservation(){
    // state for API call errors during creation of a new reservation
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
    // will convert people to a number for the backend
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
    // extensive front-end validation along with API call to create new reservation and catch any errors
    const handleSubmit = async (event) => {
        setReservationsError(null)
        const abortController = new AbortController();
        event.preventDefault()
        const daysOfTheWeek =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            const potentialReservationDate = new Date(formData.reservation_date)
            const dayOfWeekIndex = potentialReservationDate.getDay()
            const reservedDay = daysOfTheWeek[dayOfWeekIndex]
            const currentDate = new Date().toISOString().split("T")[0]
            const resTime = Number(formData.reservation_time.split(":").join(""))
            const nowTime = []
            const now = new Date()
            nowTime.push(now.getHours())
            nowTime.push(now.getMinutes())
            const compareableNowTime = Number(nowTime.join(""))
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
            }
            // make sure reservation_time is within eligible business hours of 10:30am - 9:30pm
            else if (resTime < 1030 || resTime > 2130) {
                setReservationsError({message: "Our business hours are 10:30 AM to 10:30 PM. To fully enjoy your meal, please ensure the latest reservation is before or at 9:30 PM."})
            }
            // make sure reservation_date and reservation_time are in the future
            else if (resTime < compareableNowTime && currentDate === formData.reservation_date){
                setReservationsError({message: "Please ensure you are making a reservation that is in the future so we may accomodate."})
            }
            else {
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
    // shows form and any front-end or back-end validation errors as well as the form itself
    return (
        <div>
            <div className="p-3 mb-2 bg-primary text-white">
            <h1>New Reservation</h1>
            </div>
            <br />
        <ReservationForm formData={formData} handleChange={handleChange} handleSubmit={handleSubmit} handleCancel={handleCancel} />
        <ErrorAlert error={reservationsError} />
        </div>
    )
}

export default NewReservation