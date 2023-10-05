const reservationsService = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
// validation for POST request
const requiredProperties = [
  "first_name",
  "last_name",
  "mobile_number",
  "reservation_date",
  "reservation_time",
  "people"
]
function bodyDataComplete(req, res, next){
  if(!req.body.data){
  next({
    status: 400,
    message: "Must include a data property in body"
  })
}

const requestData = req.body.data
for(let property of requiredProperties){
  if(!requestData[property] || requestData[property.trim() === ""]){
    next({
      status: 400,
      message: `Missing or empty property: ${property}`
    })
  }
} 
return next()
}

function validDate(req, res, next){
const {reservation_date} = req.body.data
const dateRegex = /^\d{4}-\d{2}-\d{2}$/
if(!dateRegex.test(reservation_date)){
  next({
    status: 400,
    message: "'reservation_date' is an invalid date format. Please use YYYY-MM-DD"
  })
}
return next()
}
function validTime(req, res, next) {
const { reservation_time } = req.body.data;
const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;
if (!timeRegex.test(reservation_time)) {
  next({
    status: 400,
    message: "'reservation_time' property is an invalid time format. Please use HH:mm (24-hour format).",
  });
}
return next();
}
function validPeople(req, res, next) {
const { people } = req.body.data;
if (typeof people === "string" || people <= 0) {
  next({
    status: 400,
    message: "Invalid value for 'people'. Must be a positive number.",
  });
}
return next()
}
function restaurantOpen(req, res, next){
  const {reservation_date} = req.body.data
  const daysOfTheWeek =  ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
  const date = new Date(reservation_date)
  const dayOfWeekIndex = date.getDay()
  const reservedDay = daysOfTheWeek[dayOfWeekIndex]
  if(reservedDay === "Tuesday"){
    next({
      status: 400,
      message: "The restaurant is closed on Tuesdays, please reserve a different day."
    })
  }
  return next()
}
function isReservationDateValid(req, res, next){
  const {reservation_date} = req.body.data
  const currentDate = new Date().toISOString().split("T")[0]
  if(reservation_date < currentDate){
    next({
      status: 400,
      message: "Reservation date must be in the future."
    })
  }
  res.locals.resDate = reservation_date
  res.locals.current = currentDate
  return next()
}
function isReservationTimeValid(req, res, next){
  const {reservation_time} = req.body.data
  const numberTime = Number(reservation_time.split(":").join(""))
  if(numberTime < 1030 || numberTime > 2130){
    next({
      status: 400,
      message: "Our business hours are 10:30 AM to 10:30 PM. To fully enjoy your meal, please ensure the latest reservation is before or at 9:30 PM."
    })
  }
  const nowTime = []
  const resDate = res.locals.resDate
  const currentDate = res.locals.current
  const now = new Date()
  nowTime.push(now.getHours())
  nowTime.push(now.getMinutes())
  const compareableNowTime = Number(nowTime.join(""))
  if(numberTime < compareableNowTime && currentDate === resDate){
    next({
      status: 400,
      message: "Please ensure you are making a reservation time that is in the future so we may accomodate."
    })
  }
  return next()
}
// reservation validation
async function reservationExists(req, res, next){
  const resId = req.params.reservation_id
  const data = await reservationsService.read(resId)
  if(data.length === 0){
   return next({
      status: 404,
      message: `Reservation ID ${resId} does not exist!`
    })
  }
  res.locals.reservation = data[0]
  next()
}
async function list(req, res) {
  const date = req.query.date
  const data = await reservationsService.list(date)
  res.json({
    data
  });
}
async function create(req, res, next){
  const data = await reservationsService.create(req.body.data)
  res.status(201).json({data})
}
function read(req, res, next){
  const reservation = res.locals.reservation
  res.json({data: reservation})
}


module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(reservationExists), read],
  create: [
    bodyDataComplete,
    validDate,
    validTime,
    validPeople,
    restaurantOpen,
    isReservationDateValid,
    isReservationTimeValid,
    asyncErrorBoundary(create)
  ]
};
