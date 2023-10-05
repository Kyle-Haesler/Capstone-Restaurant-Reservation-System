import React, { useState } from "react";
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

function NewTable(){
    const [tableError, setTableError] = useState(null);
    const history = useHistory()
    const initialFormState = {
        table_name: "",
        capacity: ""
    }
    const [formData, setFormData] = useState({...initialFormState})
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
    return (
        <div>
        <form onSubmit={handleSubmit}>
            <label htmlFor="table_name">
                Table Name:
                <input 
                id="table_name"
                type="text"
                name="table_name"
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
                onChange={handleChange}
                value={formData.capacity}
                required
                min="1"
                />
            </label>
            <br />
            <button type="submit">Submit</button>
        </form>
        <button type="button" onClick={handleCancel}>Cancel</button>
        <ErrorAlert error={tableError} />
        </div>
    )
}




export default NewTable