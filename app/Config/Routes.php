<?php

use CodeIgniter\Router\RouteCollection;
use Config\App;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Rotas da api
$routes->get('users', 'Users::index');
$routes->get('campanhas', 'Campanhas::index');
$routes->get('entidades', 'Entidades::index');

// Rotas com parametros
$routes->get('users/(:num)', 'Users::show/$1');
$routes->get('campanhas/(:num)', 'Campanhas::show/$1');
$routes->get('entidades/(:num)', 'Entidades::show/$1');

// Rotas POST
// Cria o usuário no banco
// O que vai ocorrer é o frontend criar um formulario com o method POST
// e o target sendo a rota da api
$routes->post('users/create', 'Users::create');