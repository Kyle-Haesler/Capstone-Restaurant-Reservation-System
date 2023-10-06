const knex = require("../db/connection")


function create(newTable){
    return knex("tables").insert(newTable).returning("*").then((createdTables) => createdTables[0])
}
function list(){
    return knex("tables").select("*").orderBy("table_name")
}
function read(tableID){
    return knex("tables").where("table_id", tableID)
}
// update and change status
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
function destroy(tableID){
    return knex("tables").select("*").where("table_id", tableID).update({reservation_id: null}, "*")
}
// grabbing reservation ID to find the number of people and validate it exists as well
function readRes(resID){
    return knex("reservations").where("reservation_id", resID)
}

module.exports = {
    list,
    create,
    read,
    reserveAndChangeStatus,
    delete: destroy,
    readRes
}