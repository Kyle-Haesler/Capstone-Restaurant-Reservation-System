# Restaurant Reservation System

The Restaurant Reservation System Application is a system for handling reservations to be used by a restaurant manager. The application allows the user to create, edit, seat and search reservations. It also allows the user to create tables and assign reservations to specific tables. When the customers have finished dining, the application allows the user to end their dining experience as well. In short, it allows the user to systematically handle customer reservations in an efficient manner.

## Table of Contents

1. [Installation](#installation)
2. [Usage](#usage)
3. [Technologies Used](#technologies-used)
4. [Features](#features)
5. [API Documentation](#API-documentation)

## Installation

To install this application: fork and clone this repository and run npm install.  
To run the tests: run npm run test.  
NOTE: If you are having trouble running the tests for this application try using version 14 of Node.js (Specifically if you are receiving a minimatch error while running tests).  
The live application is running here: https://restaurant-reservation-system-front-end.onrender.com  
Backend URL: https://restaurant-reservation-system-back-end.onrender.com

## Usage

### /dashboard

![Dashboard Page](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/DashboardScreenShot.png?raw=true)

- Shows reservations whose status is not cancelled or finished for a given date. If no date is provided in the URL parameters, reservations for todays date are shown
- The previous, today and next buttons change the date and list the reservations for that given date
- Each reservation has an edit and cancel button, only reservations whose status is booked will have a seat button
- On the right hand side of the page, all tables are listed
- Tables that are currently occupied will have a finish button that allows the user to change the status of the reservation to finished and free up the table

### /reservations/new

![New Reservation](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/NewReservationScreenShot.png?raw=true)

- Allows user to create a new reservation that must be in the future
- Any validation errors will appear under the form
- After submit, the use is directed to the dashboard page for the date of their newly created reservation

### /tables/new

![New Table](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/NewTableScreenShot.png?raw=true)

- Allows user to create a new table
- Table Name must be atleast two characters and the capacity must be a positive integer, any errors will show up underneath the form
- After submit, the user is directed back to the dashboard page (today's dashboard)

### /reservations/:reservation_id/edit

![Edit Reservation](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/EditReservationScreenShot.png?raw=true)

- Automatically populates specified reservation information to be edited
- Same validation applies as the new reservation form, any errors will show up below the form
- After submit, the user is directed to the dashboard page for the date of the newly edited reservation

### /reservation/:reservation_id/seat

![Seat Reservation](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/SeatReservationScreenShot.png?raw=true)

- Allows user to assign a reservation to a table that must be open and have enough room for the party. Any errors will show up below the form
- After submit, the user is directed back to the dashboard (today's date)

### /search

![Search Reservation](https://github.com/Kyle-Haesler/Capstone-Restaurant-Reservation-System/blob/main/images/SearchReservationScreenShot.png?raw=true)

- Allows user to search for a reservation by phone number
- All reservations that match or partial match will be shown here, regardless of status

## Technologies Used

- Front-end: JavaScript, React, Bootstrap
- Back-end: Node.js, Knex, Express, JavaScript
- Database: PostgreSQL

## Features

- Create new reservation
- Look at reservations for different dates
- Search reservations by phone number
- Edit reservation
- Create new table
- Assign reservation to table
- Cancel reservation
- Free table after customers have finished dining

## API Documentation

### Reservations

#### /reservations?date=x

- Method: GET
- Description: Returns a list of reservations on the date given in the parameter, ordered by reservation time.

#### /reservations?mobile_number

- Method: GET
- Description: Returns a list of reservations whose mobile number matches or partially matches the number given in the parameter, ordered by reservation date.

#### /reservations

- Method: POST
- Description: Creates a new reservation.

#### /reservations/:reservation_id

- Method: GET
- Description: Returns the reservation that matches the reservation ID.

#### /reservations/:reservation_id

- Method: PUT
- Description: Updates the reservation that matches the reservation ID.

#### /reservations/:reservation_id/status

- Method: PUT
- Description: Changes the status of the reservation that matches the reservation ID.

### Tables

#### /tables

- Method: GET
- Description: Returns the list of tables ordered by the table name.

#### /tables

- Method: POST
- Description: Creates a new table.

#### /tables/:table_id

- Method: GET
- Description: Returns the table that matches the table ID.

#### /tables/:table_id/seat

- Method: PUT
- Description: Dual transaction that will seat the table and change the status of the reservation to seated.

#### /tables/:table_id/seat

- Method: DELETE
- Description: Dual transaction that changes the status of the reservation to finished and opens a table.
