--DATABASE MANIPULATION FOR CYCLONE TRAINS, NOTE : ARE VALUES THAT THE USER INPUTS--

--DATABASE MANIPULATION QUERIES FOR ARRIVALS--

--Get all Arrival stations for display table--
SELECT * FROM arrivals;

--Add new Arrival station--
INSERT INTO arrivals (location) 
VALUES (:aLocationInput);

--Delete Arrival station--
DELETE FROM arrivals 
WHERE arrivalId = :arrivalIdInput;


--DATABASE MANIPULATION QUERIES FOR DEPARTURES--

--Get all Departure stations for display table--
SELECT * FROM departures;

--Add new Departure station--
INSERT INTO departures (location)
VALUES (:dLocationInput);

--Delete Departure station--
DELETE FROM departures 
WHERE departureId = :departureIdInput;


--DATABASE MANIPULATION QUERIES FOR PASSENGERS--

--Get all Passengers for display table--
SELECT * FROM passengers;

--Add new Passenger--
INSERT INTO passengers (firstName, lastName, dob)
VALUES (:firstNameInput, :lastNameInput, :dobInput);

--Search for Passengers by passengerId--
SELECT * FROM passengers 
WHERE passengerId = :passengerIdInput;

--Search for Passengers by firstName--
SELECT * FROM passengers
WHERE firstName = :firstNameInput;

--Search for Passengers by lastName--
SELECT * FROM passengers
WHERE lastName = :lastNameInput;

--Search for Passengers by dob--
SELECT * FROM passengers
WHERE dob = :dobInput;


--DATABASE MANIPULATION QUERIES FOR TICKETS--

--Get all Tickets for display table--
SELECT ticketNumber, firstName, lastName, departureLocation, arrivalLocation, trainId, tripDate FROM tickets 
LEFT JOIN passengers ON tickets.passengerId = passengers.passengerId 
LEFT JOIN trips ON tickets.tripId = trips.tripId 
LEFT JOIN departures ON trips.departureId = departures.departureId 
LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId;

--Add new Ticket--
INSERT INTO tickets (passengerId, tripId, trainId, date)
VALUES (:passengerIdDropDownInput, :tripIdDropDownInput, :trainIdDropDownInput, :dateInput);

--Search for Ticket by tickerNumber--
SELECT * FROM tickets 
WHERE ticketNumber = :ticketNumberInput;

--Search for Tickets by passengerId--
SELECT * FROM tickets
WHERE passengerId = :passengerIdInput;

--Search for Ticket by tripId--
SELECT * FROM tickets
WHERE tripId = :tripIdInput;

--Search for Ticket by trainId--
SELECT * FROM tickets
WHERE trainId = :trainIdInput;

--Search for Ticket by date--
SELECT * FROM tickets
WHERE date = :dateInput;


--DATABASE MANIPULATION QUERIES FOR TRAINS--

--Get all Trains for display table--
SELECT * FROM trains;

--Add new Train--
INSERT INTO trains (capacity, inOperation)
VALUES (:capacityInput, :inOperationCheckBox);

--Update Train Status--
UPDATE trains 
SET inOperation = :inOperationCheckBox
WHERE trainId = :trainIdInput;

--Delete Train--
DELETE FROM trains
WHERE trainId = :trainIdInput;


--DATABASE MANIPULATION QUERIES FOR TRIPS--

--Get all Trips for display table--
SELECT tripId, departureLocation, arrivalLocation, price FROM trips 
LEFT JOIN arrivals ON trips.arrivalId = arrivals.arrivalId 
LEFT JOIN departures ON trips.departureId = departures.departureId;

--Add new Trip--
INSERT INTO trips (departureId, arrivalId, price)
VALUES (:departureIdDropDownInput, :arrivalIdDropDownInput, :priceInput);

--Update Trip price--
UPDATE trips
SET price = :priceInput
WHERE tripId = tripIdInput;

--Delete Trip--
DELETE FROM trips
WHERE tripId = :tripIdInput;
