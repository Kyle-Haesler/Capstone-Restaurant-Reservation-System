import React, { useState } from "react";
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTable(){
    // state for catching errors associated with API call to create new table
    const [tableError, setTableError] = useState(null);
    const history = useHistory()
    const initialFormState = {
        table_name: "",
        capacity: ""
    }
    const [formData, setFormData] = useState({...initialFormState})
    // live validation for length of name, converts capacity to number for the backend
    const handleChange = ({target}) => {
        if(target.name === "capacity"){
            setFormData({
                ...formData, [target.name]: Number(target.value)
            })
        } else if(target.name === "table_name"){
        if(target.value.length < 2){
            setTableError({message: "Table Name must be atleast 2 characters"})
        } else {
            setTableError(null)
        }
        
        setFormData({
            ...formData, [target.name]: target.value
        })
    }
    
    }
    const handleCancel = () => {
        history.goBack()
    }
    // API call to create a new table and catch any errors 
    const handleSubmit = async (event) => {
        setTableError(null)
        const abortController = new AbortController();
        event.preventDefault()
        
        try {
            await createTable(formData, abortController.signal);
            history.push(`/dashboard`);
            setFormData({...initialFormState});
        } catch (error) {
            setTableError(error)
        }
        return () => abortController.abort();
        
    };
    // shows new table form and any errors from the front-end or the back-end
    return (
        <div>
            <div className="p-3 mb-2 bg-primary text-white">
            <h1>New Table</h1>
            </div>
            <br />
        <form onSubmit={handleSubmit} className="form-group">
            <label htmlFor="table_name">
                Table Name:
                <input 
                id="table_name"
                type="text"
                name="table_name"
                className="form-control"
                onChange={handleChange}
                value={formData.table_name}
                required
                />
            </label>
            <br />
            <label htmlFor="capacity">
                Capacity:
                <input 
                id="capacity"
                type="number"
                name="capacity"
                className="form-control"
                onChange={handleChange}
                value={formData.capacity}
                required
                min="1"
                />
            </label>
            <br />
            <button className="btn btn-primary" type="submit">Submit</button>
            <button className="btn btn-danger" type="button" onClick={handleCancel}>Cancel</button>
        </form>
        <ErrorAlert error={tableError} />
        </div>
    )
}




export default NewTable