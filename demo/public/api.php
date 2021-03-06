<?php

ini_set('display_errors', 'Off');

require_once realpath(__DIR__ . '/../vendor/autoload.php');

$dotenv = Dotenv\Dotenv::create(realpath(__DIR__ . '/../'));
$dotenv->load();

Jlbelanger\Robroy\Router::load();
