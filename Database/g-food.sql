-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: נובמבר 11, 2024 בזמן 11:33 PM
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
(7, 'Transport', 'Joe Transporter', 'transport@gmail.com');

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
  `status` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `equipment`
--

INSERT INTO `equipment` (`id`, `item_category`, `item_name`, `item_description`, `item_id`, `employee_id`, `start_date`, `leave_date`, `status`) VALUES
(3, 2, 'Tablet tab 10', '15.5 Inch, color: black, shiomi ', '128975', '123', '2024-10-09', '0000-00-00', 'leaving'),
(4, 1, 'Toyota Land cruiser', '2022, 6 cylinder, Turbo', '12398456', '123', '2024-10-09', '0000-00-00', 'leaving'),
(5, 1, 'Toyota corola', 'Model: 2016, color: white', '4568521', '123', '2024-10-10', '0000-00-00', 'leaving'),
(6, 2, 'Lenovo 13', 'O.S: Windows, 5GR ', '12355556', '123', '2024-10-10', '0000-00-00', 'leaving'),
(7, 2, 'Charger', 'Type C, Double Entry', '456821', '4865854', '2024-10-10', NULL, 'active'),
(8, 1, 'Scoda Octavia', 'Model 2020, color: black', '52598747', '4865854', '2024-10-10', NULL, 'active'),
(9, 1, 'Oudi A8', 'Model 2024, Color: Black', '25465897', '4865854', '2024-10-10', NULL, 'active');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `equipment_category`
--

CREATE TABLE `equipment_category` (
  `id` int(10) NOT NULL,
  `category_name` varchar(30) NOT NULL,
  `manager_name` varchar(30) NOT NULL,
  `manager_email` varchar(30) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `equipment_category`
--

INSERT INTO `equipment_category` (`id`, `category_name`, `manager_name`, `manager_email`) VALUES
(1, 'car', 'caron caroni', 'chamudi@gmail.com'),
(2, 'computers', 'yaron yadan', 'yaron@gmail.com'),
(3, 'stuff to borrow', 'moshe zuchmir', 'zuchmir@gmail.com'),
(4, 'tablets', 'yossef tobul', 'tablani@gmail.com');

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
(32, '123', 'Moshe Moshe', '$2b$10$fgQEHiuRlECcL9xL0dmXxu7xxTYa7QrGOkr32sR7QoJL3mNAY2PhW', 'moshonov@gmail.com', '053311157', 'image_1729253438634.png', 4, 'employee', '2024-11-04', '0000-00-00', 'leaving'),
(38, '4865854', 'David', '$2b$10$BfYuA8zs69VnJKlgvqeq8uIYPMy.nEd0Xn0vyTpyyK7z/XpyKkCna', 'd@gmail.com', '0584569871', 'image_1729253460403.jpg', 3, 'employee', '2024-10-28', '0000-00-00', 'leaving'),
(42, '4114415', 'adminos', '123', 'admin@gmail.com', '034896587', 'image_1729253475447.jpg', 3, 'admin', '0000-00-00', NULL, 'active'),
(48, '586497', 'Eli Chaviv', '$2b$10$CSQNRgEIvVNmuzQugIEf0OcuXObBxe6ygTsS8Ynxe37dAyVzuNrU6', 'chavivi@gmail.com', '025645245', 'image_1729253496958.png', 6, 'admin', '2024-11-02', '0000-00-00', 'active'),
(49, '45695', 'Avi Avivim', '$2b$10$VfVSDnDMyjDn4VFkp1apA.9cL2fCZ.Jz0xaoxl8Hpz/RJnLpujbj6', 'avivim@gmail.com', '025652595', 'image_1729253514035.png', 4, 'admin', '2024-10-30', '0000-00-00', 'active'),
(51, '12365478', 'Chamudi Chamudi', '$2b$10$sfJNfhCcy.U5clclTW3lUOWnW0WeulJd1hNDOJtyvucIJwfXBFs5e', 'chamudi@gmail.com', '059658256', 'image_1729379619034.jpeg', 6, 'itemCategoryAdmin', '2024-09-26', '0000-00-00', 'active');

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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT for table `equipment_category`
--
ALTER TABLE `equipment_category`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=52;

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
