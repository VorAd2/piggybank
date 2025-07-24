<?php

use CodeIgniter\Router\RouteCollection;
use Config\App;

/**
 * @var RouteCollection $routes
 */
$routes->get('/', 'Home::index');

// Rotas da api
// $routes->get('users', 'Users::index');
$routes->get('campanhas', 'Campanhas::index');
// $routes->get('entidades', 'Entidades::index');

// Rotas com parametros
$routes->get('users/(:num)', 'Users::show/$1');
$routes->get('campanhas/(:num)', 'Campanhas::show/$1');
// $routes->get('entidades/(:num)', 'Entidades::show/$1');
// Rota para servir a imagem para o front end
$routes->get('uploads/img/pfp/(:any)', 'Image::profile/$1');
// Serve a imagem de perfil padrão
$routes->get('img/default/(:any)', 'Image::defaultProfilePicture/$1');


// Rotas POST
// Cria o usuário no banco
// O que vai ocorrer é o frontend criar um formulario com o method POST
// e o target sendo a rota da api
$routes->post('users/create', 'Users::create');
$routes->options('users/create', function () {
    return service('response')->setStatusCode(200);
});

// Cria a entidade no banco
$routes->post('entidades/create', 'Users::createEntity');
$routes->options('entidades/create', function () {
    return service('response')->setStatusCode(200);
});
// Cria a campanha no banco
$routes->post('campanhas/create', 'Campanhas::create');
$routes->options('campanhas/create', function () {
    return service('response')->setStatusCode(200);
});

//Rota de login
$routes->post('users/login', 'Users::login');
$routes->options('users/login', function () {
    return service('response')->setStatusCode(200);
});
// $routes->post('entidades/login', 'Users::login');
// $routes->options('login', function () {
//     return service('response')->setStatusCode(200);
// });

//Rota para realizar a doação
$routes->post('/donate', 'Campanhas::donate');
$routes->options('donate', function () {
    return service('respose')->setStatusCode(200);
});

// Rota com uns joins que o front end pediu
$routes->get('users/', 'Users::superGet');
