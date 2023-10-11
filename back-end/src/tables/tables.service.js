const knex = require("../db/connection")

// POST /tables
function create(newTable){
    return knex("tables").insert(newTable).returning("*").then((createdTables) => createdTables[0])
}
// GET /tables
function list(){
    return knex("tables").select("*").orderBy("table_name")
}
// GET /tables/:table_id
function read(tableID){
    return knex("tables").where("table_id", tableID)
}
// dual transaction to change status and reserve table
async function reserveAndChangeStatus(tableID, resID, status){
    try{
        const result = await knex.transaction(async (trx) => {
            const updatedTable = await trx("tables")
            .select("*")
            .where("table_id", tableID)
            .update({reservation_id: resID}, "*")
            const updatedStatus = await trx("reservations")
            .select("*")
            .where("reservation_id", resID)
            .update({status})
            
            if(updatedTable && updatedStatus){
                await trx.commit()
            } else {
                await trx.rollback()
            }
        })
        return result 
    } catch (error) {
        return error
    }
    
}
// dual transaction to finish table and change status 
async function finishTableAndChangeStatus(tableID, status){
    try{
            const result = await knex.transaction(async (trx) => {
            const resID = await trx("tables").where("table_id", tableID).select("reservation_id").first()
            const updatedTable = await trx("tables")
            .select("*").where("table_id", tableID).update({reservation_id: null}, "*")
            
            const updatedStatus = await trx("reservations")
            .select("*")
            .where("reservation_id", resID.reservation_id)
            .update({status})
            
            if(updatedTable && updatedStatus && resID){
                await trx.commit()
            } else {
                await trx.rollback()
            }
        })
        return result 
    } catch (error) {
        console.log(error)
        return error
    }
    
}

// function to grab reservation ID to find the number of people and validate it exists as well
function readRes(resID){
    return knex("reservations").where("reservation_id", resID)
}

module.exports = {
    list,
    create,
    read,
    reserveAndChangeStatus,
    delete: finishTableAndChangeStatus,
    readRes
}