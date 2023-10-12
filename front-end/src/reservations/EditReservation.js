import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { getReservation } from "../utils/api";
import { formatAsDate } from "../utils/date-time";
import { formatAsTime } from "../utils/date-time";
import { editReservation } from "../utils/api";
import ReservationForm from "./ReservationForm";

function EditReservation() {
  // state for API call to get the reservation as well as state for errors that may occur
  const [reservation, setReservation] = useState([]);
  const [reservationError, setReservationError] = useState(null);
  // state for API call errors on update request
  const [updatedResError, setUpdatedResError] = useState(null);
  const history = useHistory();
  const { reservation_id } = useParams();
  // make API call to get reservation anytime the reservation Id in the parameters changes
  useEffect(loadReservation, [reservation_id]);
  const initialFormState = {
    first_name: "",
    last_name: "",
    mobile_number: "",
    reservation_date: "",
    reservation_time: "",
    people: "",
  };
  const [formData, setFormData] = useState({ ...initialFormState });
  // API call to get the reservation and then set that reservation to formData, will catch any errors
  function loadReservation() {
    const abortController = new AbortController();
    setReservationError(null);
    getReservation(reservation_id, abortController.signal)
      .then((reservation) => {
        setReservation(reservation);
        setFormData({
          first_name: reservation.first_name,
          last_name: reservation.last_name,
          mobile_number: reservation.mobile_number,
          reservation_date: formatAsDate(reservation.reservation_date),
          reservation_time: formatAsTime(reservation.reservation_time),
          people: reservation.people,
          status: reservation.status,
        });
      })
      .catch(setReservationError);
    return () => abortController.abort();
  }
  // will convert people to a number for the backend
  const handleChange = ({ target }) => {
    if (target.name === "people") {
      setFormData({
        ...formData,
        [target.name]: Number(target.value),
      });
    } else {
      setFormData({
        ...formData,
        [target.name]: target.value,
      });
    }
  };
  const handleCancel = () => {
    history.goBack();
  };
  // extensive front-end validation for edit form, will make API call to update the reservation and catch any errors
  const handleSubmit = async (event) => {
    setUpdatedResError(null);
    const abortController = new AbortController();
    event.preventDefault();
    // form validation, the same as the creation of the new form with the addition of making sure the reservation is editable.
    const daysOfTheWeek = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
      "Sunday",
    ];
    const potentialReservationDate = new Date(formData.reservation_date);
    const dayOfWeekIndex = potentialReservationDate.getDay();
    const reservedDay = daysOfTheWeek[dayOfWeekIndex];
    const currentDate = new Date().toISOString().split("T")[0];
    const resTime = Number(formData.reservation_time.split(":").join(""));
    const nowTime = [];
    const now = new Date();
    nowTime.push(now.getHours());
    nowTime.push(now.getMinutes());
    const compareableNowTime = Number(nowTime.join(""));
    // make sure reservation date is not on a Tuesday and not in the past
    if (reservedDay === "Tuesday" && formData.reservation_date < currentDate) {
      setUpdatedResError({
        message:
          "The restaurant is closed on Tuesdays, please reserve a different day. Also, the reservation date must be in the future.",
      });
    }
    // make sure reservation_date is not on a Tuesday as the restaurant is closed on Tuesdays.
    else if (reservedDay === "Tuesday") {
      setUpdatedResError({
        message:
          "The restaurant is closed on Tuesdays, please reserve a different day.",
      });
    }
    // make sure reservation_date is not in the past
    else if (formData.reservation_date < currentDate) {
      setUpdatedResError({
        message: "Reservation date must be in the future.",
      });
    }
    // make sure reservation_time is within eligible business hours of 10:30am - 9:30pm
    else if (resTime < 1030 || resTime > 2130) {
      setUpdatedResError({
        message:
          "Our business hours are 10:30 AM to 10:30 PM. To fully enjoy your meal, please ensure the latest reservation is before or at 9:30 PM.",
      });
    }
    // make sure reservation_date and reservation_time are in the future
    else if (
      resTime < compareableNowTime &&
      currentDate === formData.reservation_date
    ) {
      setUpdatedResError({
        message:
          "Please ensure you are making a reservation that is in the future so we may accomodate.",
      });
    }
    // make sure the reservation is editable
    else if (reservation.status !== "booked") {
      setUpdatedResError({
        message:
          "This reservation cannot be edited, please choose a reservation with the status of 'booked' in order to edit.",
      });
    } else {
      try {
        await editReservation(
          Number(reservation_id),
          formData,
          abortController.signal,
        );
        history.push(`/dashboard?date=${formData.reservation_date}`);
        setFormData({});
      } catch (error) {
        setUpdatedResError(error);
      }
      return () => abortController.abort();
    }
  };
  // will show the form with populated data and return any front-end validation errors as well as backend validation errors
  return (
    <div>
      <div className="p-3 mb-2 bg-primary text-white">
        <h1>Edit Reservation</h1>
      </div>
      <br />
      <ReservationForm
        formData={formData}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        handleCancel={handleCancel}
      />
      <ErrorAlert error={reservationError} />
      <ErrorAlert error={updatedResError} />
    </div>
  );
}

export default EditReservation;
