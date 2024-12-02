-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: דצמבר 02, 2024 בזמן 01:56 AM
-- גרסת שרת: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `g-food`
--

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `admin`
--

CREATE TABLE `admin` (
  `id` int(11) NOT NULL,
  `email` varchar(50) NOT NULL,
  `password` varchar(140) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `admin`
--

INSERT INTO `admin` (`id`, `email`, `password`) VALUES
(1, 'admin@gmail.com', '12345');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `department`
--

CREATE TABLE `department` (
  `id` int(11) NOT NULL,
  `name` varchar(30) NOT NULL,
  `manager_name` varchar(30) NOT NULL,
  `manager_email` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `department`
--

INSERT INTO `department` (`id`, `name`, `manager_name`, `manager_email`) VALUES
(2, 'It', 'barkuni', 'barko@gmail.com'),
(3, 'Development', 'yuri boika', 'youdead@gmail.com'),
(4, 'Designing', ' Nickol Nicey ', 'niceli@gmail.com'),
(5, 'Human Resources', 'adam heyman', 'human@gmail.com'),
(6, 'Cleaning', 'clonico clinex', 'clxks@gmail.com'),
(7, 'Transport', 'Joe Transporter', 'transport@gmail.com'),
(8, 'Tayasim', 'tayas tayaony', 'tayaony@gmail.com');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `item_category` int(30) NOT NULL,
  `item_name` varchar(30) NOT NULL,
  `item_description` varchar(100) NOT NULL,
  `item_id` varchar(30) NOT NULL,
  `employee_id` varchar(15) NOT NULL,
  `start_date` date DEFAULT current_timestamp(),
  `leave_date` date DEFAULT NULL,
  `file_name` varchar(150) DEFAULT NULL,
  `status` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `equipment`
--

INSERT INTO `equipment` (`id`, `item_category`, `item_name`, `item_description`, `item_id`, `employee_id`, `start_date`, `leave_date`, `file_name`, `status`) VALUES
(3, 2, 'Tablet tab 10', '15.5 Inch, color: black, shiomi ', '128975', '123', '2024-10-09', NULL, 'file_1732992206286.pdf', 'active'),
(4, 1, 'Toyota Land cruiser', '2022, 6 cylinder, Turbo', '12398456', '123', '2024-10-09', NULL, NULL, 'active'),
(5, 1, 'Toyota corola', 'Model: 2016, color: white', '4568521', '123', '2024-10-10', '2024-12-01', NULL, 'done'),
(6, 2, 'Lenovo 13', 'O.S: Windows, 5GR ', '12355556', '123', '2024-10-10', NULL, NULL, 'active'),
(10, 1, 'Boing 707', 'privet jet ', '456789', '6459823546', '2024-11-14', '2025-02-21', NULL, 'leaving'),
(11, 1, 'Helicopter', '5 blades, combat', '65485236', '586497', '2024-11-15', '2025-02-15', NULL, 'leaving'),
(12, 3, 'pen', 'pilot 0.4', '', '545', '2024-11-20', NULL, NULL, 'active'),
(13, 3, 'Cheap', 'just a cheap for dining room', '', '4114415', '2024-11-28', '2025-03-02', 'file_1733070173802.pdf', 'leaving');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `equipment_category`
--

CREATE TABLE `equipment_category` (
  `id` int(10) NOT NULL,
  `category_name` varchar(30) NOT NULL,
  `manager_name` varchar(30) NOT NULL,
  `manager_email` varchar(30) NOT NULL,
  `date_alarm` enum('daily','weekly','monthly') DEFAULT 'weekly',
  `time_alarm` enum('10:00:00','12:00:00','14:00:00') DEFAULT '10:00:00'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `equipment_category`
--

INSERT INTO `equipment_category` (`id`, `category_name`, `manager_name`, `manager_email`, `date_alarm`, `time_alarm`) VALUES
(1, 'car', 'caron caroni', 'chamudi@gmail.com', 'daily', '12:00:00'),
(2, 'computers', 'yaron yadan', 'yaron@gmail.com', 'weekly', '10:00:00'),
(3, 'stuff to borrow', 'moshe zuchmir', 'zuchmir@gmail.com', 'weekly', '10:00:00'),
(4, 'tablets', 'yossef tobul', 'tablani@gmail.com', 'weekly', '10:00:00');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `users`
--

CREATE TABLE `users` (
  `id` int(11) NOT NULL,
  `user_id` varchar(15) NOT NULL,
  `name` varchar(30) NOT NULL,
  `password` varchar(150) NOT NULL,
  `email` varchar(50) NOT NULL,
  `phone` varchar(15) NOT NULL,
  `image` varchar(50) NOT NULL,
  `department_id` int(11) NOT NULL,
  `role` enum('admin','itemCategoryAdmin','manager','employee','guest') NOT NULL DEFAULT 'employee',
  `start_date` date DEFAULT current_timestamp(),
  `leave_date` date DEFAULT current_timestamp(),
  `status` enum('active','leaving','done') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `password`, `email`, `phone`, `image`, `department_id`, `role`, `start_date`, `leave_date`, `status`) VALUES
(32, '123', 'Moshe Moshe', '$2b$10$y8Bf/QI37zhr69vRI4lAhu8HoGO33B4NSMoN4Hhc6mXV286ROIODG', 'moshonov@gmail.com', '053311157', 'image_1729253438634.png', 5, 'employee', '2024-11-21', '0000-00-00', 'active'),
(42, '4114415', 'adminos', '$2b$10$ENv123eAR.XmKWx.qXk3..35J3Wj3TdIXh8xQWzB8Qirw.0dz8.9q', 'admin@gmail.com', '034896587', 'image_1729253475447.jpg', 3, 'admin', '0000-00-00', '2025-03-02', 'leaving'),
(48, '586497', 'Eli Chaviv', '$2b$10$tJyReAnBcXfz4H3sFFKxLOTJtnkslAoClUxFfZGhT6d/VPQKsaK6e', 'chavivi@gmail.com', '025645245', 'image_1729253496958.png', 6, 'admin', '2024-11-01', '2025-02-14', 'leaving'),
(49, '45695', 'Avi Avivim', '$2b$10$VfVSDnDMyjDn4VFkp1apA.9cL2fCZ.Jz0xaoxl8Hpz/RJnLpujbj6', 'avivim@gmail.com', '025652595', 'image_1729253514035.png', 4, 'admin', '2024-10-30', '0000-00-00', 'active'),
(51, '12365478', 'Chamudi Chamudi', '$2b$10$sfJNfhCcy.U5clclTW3lUOWnW0WeulJd1hNDOJtyvucIJwfXBFs5e', 'chamudi@gmail.com', '059658256', 'image_1729379619034.jpeg', 6, 'itemCategoryAdmin', '2024-09-26', '0000-00-00', 'active'),
(52, '6459823546', 'Yos Hamatos', '$2b$10$Cq5qna3OJfvZdwWuCZI/K.GgyQOSvTuxMoZYdChn2jujMGJBM2/Ly', 'matostos@gmail.com', '41856425', 'image_1731537854736.png', 4, 'employee', '2024-11-14', '2025-02-21', 'leaving'),
(53, '545', 'Jesy Jane', '$2b$10$char0QzKyzZv0BsBAf/UWOF9FSH8zfi6JbJ3c/51oTsB6QTL9Zhva', 'jes@gmail.com', '23456894', 'image_1732145027806.jpg', 5, 'employee', '2024-11-21', '2024-11-21', 'active');

--
-- Indexes for dumped tables
--

--
-- אינדקסים לטבלה `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `department`
--
ALTER TABLE `department`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `equipment`
--
ALTER TABLE `equipment`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `equipment_category`
--
ALTER TABLE `equipment_category`
  ADD PRIMARY KEY (`id`);

--
-- אינדקסים לטבלה `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id`),
  ADD KEY `department_id` (`department_id`) USING BTREE;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `department`
--
ALTER TABLE `department`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- AUTO_INCREMENT for table `equipment_category`
--
ALTER TABLE `equipment_category`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=54;

--
-- הגבלות לטבלאות שהוצאו
--

--
-- הגבלות לטבלה `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`department_id`) REFERENCES `department` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
