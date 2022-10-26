-- phpMyAdmin SQL Dump
-- version 5.1.3-2.el7.remi
-- https://www.phpmyadmin.net/
--
-- Host: localhost
-- Generation Time: Feb 23, 2022 at 09:39 PM
-- Server version: 10.6.5-MariaDB-log
-- PHP Version: 7.4.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `cs340_gronberb`
--

-- --------------------------------------------------------

--
-- Table structure for table `arrivals`
--

DROP TABLE IF EXISTS `arrivals`;
CREATE TABLE `arrivals` (
  `arrivalId` int(11) NOT NULL,
  `arrivalLocation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `arrivals`
--

INSERT INTO `arrivals` (`arrivalId`, `arrivalLocation`) VALUES
(1, 'Pearl Lane'),
(2, 'Mandarin Boulevard'),
(3, 'Rosemary Street'),
(4, 'Seaview Avenue');

-- --------------------------------------------------------

--
-- Table structure for table `departures`
--

DROP TABLE IF EXISTS `departures`;
CREATE TABLE `departures` (
  `departureId` int(11) NOT NULL,
  `departureLocation` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `departures`
--

INSERT INTO `departures` (`departureId`, `departureLocation`) VALUES
(1, 'Pearl Lane'),
(2, 'Oldtown Road'),
(3, 'Rosemary Street');

-- --------------------------------------------------------

--
-- Table structure for table `passengers`
--

DROP TABLE IF EXISTS `passengers`;
CREATE TABLE `passengers` (
  `passengerId` int(11) NOT NULL,
  `firstName` varchar(255) DEFAULT NULL,
  `lastName` varchar(255) DEFAULT NULL,
  `dob` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `passengers`
--

INSERT INTO `passengers` (`passengerId`, `firstName`, `lastName`, `dob`) VALUES
(1, 'John', 'Smith', '2022-02-22'),
(2, 'Jane', 'Doe', '2022-02-21'),
(3, 'Mike', 'Jones', '2002-01-01'),
(4, 'Cindy', 'Park', '0000-00-00');

-- --------------------------------------------------------

--
-- Table structure for table `tickets`
--

DROP TABLE IF EXISTS `tickets`;
CREATE TABLE `tickets` (
  `ticketNumber` int(11) NOT NULL,
  `passengerId` int(11) NOT NULL,
  `tripId` int(11) NOT NULL,
  `trainId` int(11) DEFAULT NULL,
  `tripDate` date NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `tickets`
--

INSERT INTO `tickets` (`ticketNumber`, `passengerId`, `tripId`, `trainId`, `tripDate`) VALUES
(1, 4, 1, 1, '2022-02-21'),
(2, 2, 3, 3, '2022-01-10'),
(3, 4, 1, 1, '2022-02-22'),
(4, 3, 2, 1, '2022-02-22');

-- --------------------------------------------------------

--
-- Table structure for table `trains`
--

DROP TABLE IF EXISTS `trains`;
CREATE TABLE `trains` (
  `trainId` int(11) NOT NULL,
  `capacity` int(11) NOT NULL,
  `inOperation` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `trains`
--

INSERT INTO `trains` (`trainId`, `capacity`, `inOperation`) VALUES
(1, 400, 1),
(2, 350, 0),
(3, 350, 1);

-- --------------------------------------------------------

--
-- Table structure for table `trips`
--

DROP TABLE IF EXISTS `trips`;
CREATE TABLE `trips` (
  `tripId` int(11) NOT NULL,
  `departureId` int(11) NOT NULL,
  `arrivalId` int(11) NOT NULL,
  `price` decimal(5,2) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

--
-- Dumping data for table `trips`
--

INSERT INTO `trips` (`tripId`, `departureId`, `arrivalId`, `price`) VALUES
(1, 1, 2, '10.00'),
(2, 2, 4, '10.00'),
(3, 3, 2, '10.00');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `arrivals`
--
ALTER TABLE `arrivals`
  ADD PRIMARY KEY (`arrivalId`);

--
-- Indexes for table `departures`
--
ALTER TABLE `departures`
  ADD PRIMARY KEY (`departureId`);

--
-- Indexes for table `passengers`
--
ALTER TABLE `passengers`
  ADD PRIMARY KEY (`passengerId`);

--
-- Indexes for table `tickets`
--
ALTER TABLE `tickets`
  ADD PRIMARY KEY (`ticketNumber`),
  ADD KEY `tripId` (`tripId`),
  ADD KEY `trainId` (`trainId`),
  ADD KEY `passengerId` (`passengerId`);

--
-- Indexes for table `trains`
--
ALTER TABLE `trains`
  ADD PRIMARY KEY (`trainId`);

--
-- Indexes for table `trips`
--
ALTER TABLE `trips`
  ADD PRIMARY KEY (`tripId`),
  ADD KEY `departureId` (`departureId`),
  ADD KEY `arrivalId` (`arrivalId`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `arrivals`
--
ALTER TABLE `arrivals`
  MODIFY `arrivalId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `departures`
--
ALTER TABLE `departures`
  MODIFY `departureId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `passengers`
--
ALTER TABLE `passengers`
  MODIFY `passengerId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `tickets`
--
ALTER TABLE `tickets`
  MODIFY `ticketNumber` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `trains`
--
ALTER TABLE `trains`
  MODIFY `trainId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT for table `trips`
--
ALTER TABLE `trips`
  MODIFY `tripId` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `tickets`
--
ALTER TABLE `tickets`
  ADD CONSTRAINT `tickets_ibfk_1` FOREIGN KEY (`tripId`) REFERENCES `trips` (`tripId`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_2` FOREIGN KEY (`trainId`) REFERENCES `trains` (`trainId`) ON DELETE CASCADE,
  ADD CONSTRAINT `tickets_ibfk_3` FOREIGN KEY (`passengerId`) REFERENCES `passengers` (`passengerId`) ON DELETE CASCADE;

--
-- Constraints for table `trips`
--
ALTER TABLE `trips`
  ADD CONSTRAINT `trips_ibfk_1` FOREIGN KEY (`departureId`) REFERENCES `departures` (`departureId`) ON DELETE CASCADE,
  ADD CONSTRAINT `trips_ibfk_2` FOREIGN KEY (`departureId`) REFERENCES `departures` (`departureId`) ON DELETE CASCADE,
  ADD CONSTRAINT `trips_ibfk_3` FOREIGN KEY (`arrivalId`) REFERENCES `arrivals` (`arrivalId`) ON DELETE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
