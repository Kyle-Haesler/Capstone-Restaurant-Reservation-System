import React from "react"


function ReservationForm({handleSubmit, handleChange, formData, handleCancel}){
    return (
        <div>
        <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="first_name">
                First Name:
                <input 
                id="first_name"
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
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
                className="form-control"
                onChange={handleChange}
                value={formData.people}
                required
                min="1"
                />
            </label>
            <br />
            <button type="submit" className="btn btn-primary">Submit</button>
            <button type="button" className="btn btn-danger" onClick={handleCancel}>Cancel</button>
        </form>
        </div>
        )
}

export default ReservationForm