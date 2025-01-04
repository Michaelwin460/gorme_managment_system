-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: ינואר 04, 2025 בזמן 09:57 PM
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
(2, 'It', 'Barkuni', 'barkon@gmail.com'),
(3, 'Development', 'Yuri Boika', 'youdead@gmail.com'),
(4, 'Designing', ' Nickol Nicey ', 'niceli@gmail.com'),
(5, 'Dindin', 'Delitoriko', 'del@gmail.com'),
(6, 'Add Name', 'Simon', 'deg@gmail.com'),
(7, 'Transport', 'Joe Transporter', 'transport@gmail.com'),
(8, 'Tayasim', 'Tayas Tayaony', 'tayaony@gmail.com'),
(9, 'deptodel', 'Delos', 'del@gmail.com'),
(11, 'Human Resources', 'Yael Mashan', 'ymash@gmail.com');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `equipment`
--

CREATE TABLE `equipment` (
  `id` int(11) NOT NULL,
  `item_category` int(30) NOT NULL,
  `item_name` varchar(30) NOT NULL,
  `item_description` varchar(100) NOT NULL,
  `item_id` varchar(150) NOT NULL,
  `employee_id` varchar(15) DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `leave_date` date DEFAULT NULL,
  `file_name` varchar(150) DEFAULT NULL,
  `status` enum('active','leaving','available') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `equipment`
--

INSERT INTO `equipment` (`id`, `item_category`, `item_name`, `item_description`, `item_id`, `employee_id`, `start_date`, `leave_date`, `file_name`, `status`) VALUES
(3, 2, 'Tablet tab 10', '15.5 Inch, color: black, shiomi ', '128975', '4114415', '2024-10-03', '2024-12-22', 'file_1732992206286.pdf', 'available'),
(4, 1, 'Toyota Land cruiser', '2022, 6 cylinder, Turbo', '12398456', '123', '2024-10-06', NULL, NULL, 'active'),
(6, 2, 'Lenovo 13', 'O.S: Windows, 5GR ', '12355556', '123', '2024-10-10', NULL, NULL, 'active'),
(10, 3, 'Boing 707', 'privet jet ', '456789', '6459823546', '2024-11-12', '2024-12-03', NULL, 'active'),
(11, 1, 'Helicopter', '5 blades, combat', '65485236', '586497', '2024-11-15', '2024-12-04', NULL, 'active'),
(12, 3, 'pen', 'pilot 0.4', '8975236', '545', '2024-11-20', NULL, NULL, 'active'),
(13, 3, 'Cheap', 'just a cheap for dining room', '6416164164', '4114415', '2024-11-25', '2024-12-22', 'file_1733070173802.pdf', 'available'),
(14, 3, 'Headphones', 'got to have nice vibes in the air', '654892315', '586497', '2024-12-03', NULL, NULL, 'active'),
(15, 1, 'Toyota corola', '2017, 120,000 km, white', '56486666', '4114415', '2024-11-30', NULL, NULL, 'active'),
(16, 4, 'Tablet IOS', 'black, white fro the back', '5461324181', '6459823546', '2024-12-09', NULL, NULL, 'active'),
(17, 1, 'B.M.W X25', '4x4, metal', '56485878', '25897465', '2024-12-10', NULL, NULL, 'active'),
(18, 1, 'Tesla', 'color: white, Model: 2024', '65656554', '5461687', '2024-12-11', '2025-03-11', NULL, 'leaving'),
(19, 2, 'computer Del i7', 'color: black, front pc', '546843', '5461687', '2024-12-11', '2025-03-11', NULL, 'leaving'),
(20, 5, 'somthing new', 'gdouyfvlhvpf;hv', '', '646464646464646', '2024-12-11', '2024-12-11', NULL, 'active'),
(21, 2, 'Mac ', 'Mac OS, version 15', '5166843', '45695', '2024-12-16', '2024-12-16', NULL, 'available'),
(22, 2, 'HP pavilion', '5GR ', '45614587', '45695', '2024-12-16', NULL, NULL, 'active');

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
(1, 'car', 'Caron Caroniso', 'caron@gmail.com', 'monthly', '10:00:00'),
(2, 'computers', 'Adam Heyman', 'aman@gmail.com', 'daily', '12:00:00'),
(3, 'stuff to borrow', 'moshe zuchmir', 'zuchmir@gmail.com', 'weekly', '10:00:00'),
(4, 'tablets', 'yossef tobul', 'tablani@gmail.com', 'weekly', '10:00:00'),
(5, 'nameToDelete', 'delitor', 'del@gmail.com', 'weekly', '10:00:00'),
(6, 'somo', 'simon simoni ', 'deg@gmail.com', 'weekly', '10:00:00'),
(7, 'Car Wash', 'Chamudi Chamudi', 'chamudi@gmail.com', 'weekly', '10:00:00');

-- --------------------------------------------------------

--
-- מבנה טבלה עבור טבלה `requests`
--

CREATE TABLE `requests` (
  `id` int(30) NOT NULL,
  `user_id` varchar(30) NOT NULL,
  `user_department_name` varchar(50) NOT NULL,
  `request_category` varchar(30) NOT NULL,
  `status` enum('by_user','by_department_manager','by_category_manager','by_admin','reject','approve') NOT NULL,
  `header` varchar(255) NOT NULL,
  `body` text NOT NULL,
  `request_date` date NOT NULL DEFAULT current_timestamp(),
  `note` text NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `requests`
--

INSERT INTO `requests` (`id`, `user_id`, `user_department_name`, `request_category`, `status`, `header`, `body`, `request_date`, `note`) VALUES
(1, '123', '', 'car', 'by_category_manager', 'request for a new computer ', 'I would like to get a new computer please', '2024-12-09', 'Trade In is better\nget your own car'),
(2, '12365478', '', 'stuff_to_borrow', 'by_category_manager', 'charger', 'I need charger to my computer', '2024-12-09', 'lenovo pavilion 5gr\n\nyour reqquest has approved \ncome to the logistic office'),
(5, '12365478', '', 'stuff to borrow', 'reject', 'Ten-bis card', 'Did\'nt get any card for lunch', '2024-12-09', 'What\'s up with that???'),
(7, '545', '', 'car', 'by_department_manager', 'I need a new car', 'i m switching to a familiy car', '2024-12-18', '');

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
  `role` enum('admin','itemCategoryAdmin','departmentAdmin','employee','guest') NOT NULL DEFAULT 'employee',
  `start_date` date DEFAULT current_timestamp(),
  `leave_date` date DEFAULT current_timestamp(),
  `status` enum('active','leaving','done') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- הוצאת מידע עבור טבלה `users`
--

INSERT INTO `users` (`id`, `user_id`, `name`, `password`, `email`, `phone`, `image`, `department_id`, `role`, `start_date`, `leave_date`, `status`) VALUES
(32, '123', 'Moshe Moshe', '$2b$10$EL6LDUF9zP9kLnekbn6TC.cScLQCuIolg7LhDbm7zmNvqITzbEhS6', 'moshonov@gmail.com', '026562558', 'image_1729253438634.png', 9, 'employee', '2024-11-13', '0000-00-00', 'active'),
(42, '4114415', 'adminos', '$2b$10$Dhsamo77YcSUKS98kf2BVOO6ef9Lzc21KJ0lKmgxz/UAsuohMILY.', 'admin@gmail.com', '034896587', 'image_1729253475447.jpg', 3, 'admin', '0000-00-00', NULL, 'active'),
(48, '586497', 'Eli Chaviv', '$2b$10$tJyReAnBcXfz4H3sFFKxLOTJtnkslAoClUxFfZGhT6d/VPQKsaK6e', 'chavivi@gmail.com', '025645245', 'image_1729253496958.png', 6, 'admin', '2024-11-01', '2025-02-14', 'leaving'),
(49, '45695', 'Avi Avivim', '$2b$10$hN/XdeKMV/VZzNXzKsiF9OAJVVQks.9mEpyAgpikx3epZuQRyYcZi', 'avivim@gmail.com', '025652595', 'image_1729253514035.png', 4, 'admin', '2024-10-28', '0000-00-00', 'active'),
(51, '12365478', 'Chamudi Chamudi', '$2b$10$sfJNfhCcy.U5clclTW3lUOWnW0WeulJd1hNDOJtyvucIJwfXBFs5e', 'chamudi@gmail.com', '059658256', 'image_1729379619034.jpeg', 6, 'itemCategoryAdmin', '2024-09-26', '0000-00-00', 'active'),
(52, '6459823546', 'Yos Hamatos', '$2b$10$PIbB58Cgg5LeJaS/DTYDre90RFJ20rje44WuQbDwohrPWZqckS5I.', 'matostos@gmail.com', '41856425', 'image_1731537854736.png', 8, 'employee', '2024-11-13', '0000-00-00', 'active'),
(53, '545', 'Jesy Jane', '$2b$10$char0QzKyzZv0BsBAf/UWOF9FSH8zfi6JbJ3c/51oTsB6QTL9Zhva', 'jes@gmail.com', '23456894', 'image_1732145027806.jpg', 5, 'employee', '2024-11-21', '2024-11-21', 'active'),
(54, '25897465', 'Adam Heyman', '$2b$10$N6AiZMdBRBOkIVabKZ1G4uOQsPdkXc5b9/U/qdG/yA6dFloiSQt3K', 'aman@gmail.com', '0507854241', 'image_1733790901167.jpg', 5, 'itemCategoryAdmin', '2024-12-08', '2024-12-08', 'active'),
(55, '5461687', 'Yael Mashan', '$2b$10$fGMVntCclQZURkxgmHatquEFPh5fIxAPfzVpt98pSoTl5csVyP0RC', 'ymash@gmail.com', '0546548754', 'image_1733952387523.jpg', 4, 'employee', '2024-12-10', '2025-03-11', 'leaving'),
(56, '85946585555', 'New Member', '$2b$10$12Mmjhj62JIuWxIq1xk10uuQOmA1/p8P6ngIXt.7s85YvEy0/AxSG', 'nmember@gmail.com', '2546895', 'image_1734379300328.jpg', 3, 'employee', '2024-12-16', '2024-12-16', 'active'),
(57, '456456456', 'Caron Caroniso', '$2b$10$c5eUWwOv5LzQohDKSt/YR.e/KdXVl7skX4.gaZ9NFG.Fy1BTnQQ/y', 'caron@gmail.com', '0548457454', 'image_1734379738009.jpg', 7, 'itemCategoryAdmin', '2024-12-15', '2024-12-15', 'active'),
(58, '56585858888', 'Delitoriko', '$2b$10$QNLEHJ0nzWkCXwvY9.beSOOdHTMKIfed30lioqf4EdsXCwDzd3/ry', 'del@gmail.com', '035689785', 'image_1734561726033.jpg', 5, 'departmentAdmin', '2024-12-19', '2024-12-19', 'active');

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
-- אינדקסים לטבלה `requests`
--
ALTER TABLE `requests`
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
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT for table `equipment`
--
ALTER TABLE `equipment`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=23;

--
-- AUTO_INCREMENT for table `equipment_category`
--
ALTER TABLE `equipment_category`
  MODIFY `id` int(10) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `requests`
--
ALTER TABLE `requests`
  MODIFY `id` int(30) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

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
