'use strict';
var public_value = 1;
angular
    .module('Index', [
        'oc.lazyLoad',
        'ui.router',
        'angular-loading-bar'
    ])
    .config(['$stateProvider', '$urlRouterProvider', '$ocLazyLoadProvider', '$locationProvider', '$httpProvider', '$provide',
        function ($stateProvider, $urlRouterProvider, $ocLazyLoadProvider, $locationProvider, $httpProvider, $provide,$routeProvider) {

            $ocLazyLoadProvider.config({
                debug: false,
                events: true
            });

            //$locationProvider.html5Mode(true);

            $urlRouterProvider.otherwise('/web/category');

            $httpProvider.interceptors.push(function ($q, $rootScope, $location) {
                return {
                    'responseError': function (rejection) {
                        var status = rejection.status;
                        var config = rejection.config;
                        var method = config.method;
                        var url = config.url;

                        /*if (status == 401) {
                            
                        } else {
                            $rootScope.error = method + " on " + url + " failed with status " + status;
                        }*/

                        return $q.reject(rejection);
                    }
                };
            });

            $stateProvider
                .state('web', {
                    url: '/web',
                    templateUrl: 'public.html',
                    resolve: {
                        loadMyDirectives: function ($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'toggle-switch',
                                files: ["bower_components/angular-toggle-switch/angular-toggle-switch.min.js",
                                    "bower_components/angular-toggle-switch/angular-toggle-switch.css"
                                ]
                            }),
                            $ocLazyLoad.load({
                                name: 'ngAnimate',
                                files: ['bower_components/angular-animate/angular-animate.js']
                            }),
                            $ocLazyLoad.load({
                                name: 'ngCookies',
                                files: ['bower_components/angular-cookies/angular-cookies.js']
                            }),
                            $ocLazyLoad.load({
                                name: 'ngResource',
                                files: ['bower_components/angular-animate/angular-animate.js']
                            }),
                            $ocLazyLoad.load({
                                name: 'ngSanitize',
                                files: ['bower_components/angular-sanitize/angular-sanitize.js']
                            })
                        }
                    }
                })
                .state('web.service',{
                    url:'/service',
                    templateUrl:'service.html',
                    controller:'serviceController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'Index',
                                files: [
                                'js/service.js',
                                'css/service.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.download',{
                    url:'/download',
                    templateUrl:'download.html',
                    controller:'downloadController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name:'Index',
                                files: [
                                'js/download.js',
                                'css/download.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.welcome',{
                    url:'/welcome',
                    templateUrl:'welcome.html',
                    controller:'welcomeController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/welcome.js',
                                    'css/welcome.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.activity',{
                    url:'/activity',
                    templateUrl:'activity.html',
                    controller:'activityController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/activity.js',
                                    'css/activity.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.searchList',{
                    url:'/search/list',
                    templateUrl:'searchList.html',
                    controller:'searchListController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/searchList.js',
                                    'css/searchList.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.search',{
                    url:'/search',
                    templateUrl:'search.html',
                    controller:'searchController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/search.js',
                                    'css/search.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.main', {
                    url: '/main',
                    templateUrl: 'main.html',
                    controller: 'mainController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/main.js',
                                    'css/main.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.login', {
                    url: '/login',
                    templateUrl: 'login.html',
                    controller: 'loginController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/login.js',
                                    'css/login.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.category', {
                    url: '/category',
                    templateUrl: 'category.html',
                    controller: 'categoryController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/category.js',
                                    'css/category.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.regist', {
                    url: '/regist',
                    templateUrl: 'regist.html',
                    controller: 'registController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/regist.js',
                                    'css/regist.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.success', {
                    url: '/regist/success',
                    templateUrl: 'success.html',
                    controller: 'successController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/success.js',
                                    'css/success.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.forget', {
                    url: '/forget',
                    templateUrl: 'password.html',
                    controller: 'passwordController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/password.js',
                                    'css/password.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.mine', {
                    url: '/mine',
                    templateUrl: 'user.html',
                    controller: 'mineController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/user.js',
                                    'css/user.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.car', {
                    url: '/car',
                    templateUrl: 'car.html',
                    controller: 'carController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/car.js',
                                    'css/car.css',
                                    'css/carEmpty.css',
                                    'css/carNotlogin.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.caredit', {
                    url: '/car/edit',
                    templateUrl: 'caredit.html',
                    controller: 'careditController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/caredit.js',
                                    'css/caredit.css',
                                    'css/buyagain.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.restaurant', {
                    url: '/restaurant',
                    templateUrl: 'restaurant.html',
                    controller: 'restaurantController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/restaurant.js',
                                    'css/restaurant.css'
                                ]
                            })
                        }
                    }
                })
                /*.state('web.add', {
                    url: '/restaurant/add',
                    templateUrl: 'add.html',
                    controller: 'addController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/add.js',
                                    'css/add.css'
                                ]
                            })
                        }
                    }
                })*/
                .state('web.edit', {
                    url: '/restaurant/edit',
                    templateUrl: 'edit.html',
                    controller: 'editController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/edit.js',
                                    'css/edit.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.product', {
                    url: '/product',
                    templateUrl: 'product.html',
                    controller: 'productController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/product.js',
                                    'css/product.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.orderDetail',{
                    url:'/order/detail',
                    templateUrl:'orderDetail.html',
                    controller:'orderDetailController',
                    resolve: {
                        loadMyFiles:function($ocLazyLoad){
                            return $ocLazyLoad.load({
                                name:'Index',
                                files: [
                                'js/orderDetail.js',
                                'css/orderDetail.css'                                
                                ]
                            })
                        }
                    }
                })
                .state('web.order', {
                    url: '/order',
                    templateUrl: 'order.html',
                    controller: 'orderController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/order.js',
                                    'css/order.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.detail', {
                    url: '/order/detail',
                    templateUrl: 'orderDetail.html',
                    controller: 'orderDetailController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/orderDetail.js',
                                    'css/orderDetail.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.config', {
                    url: '/config',
                    templateUrl: 'config.html',
                    controller: 'configController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/config.js',
                                    'css/config.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.list', {
                    url: '/list',
                    templateUrl: 'list.html',
                    controller: 'listController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/list.js',
                                    'css/list.css',
                                    'css/carEmpty.css',
                                    'css/carNotlogin.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.listEdit', {
                    url: '/list/edit',
                    templateUrl: 'listedit.html',
                    controller: 'listeditController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/listedit.js',
                                    'css/listedit.css',
                                    'css/list.css',
                                    'css/buyagain.css'
                                ]
                            })
                        }
                    }
                })
                .state('web.buyagain', {
                    url: '/list/buyagain',
                    templateUrl: 'buyagain.html',
                    controller: 'buyagainController',
                    resolve: {
                        loadMyFiles: function($ocLazyLoad) {
                            return $ocLazyLoad.load({
                                name: 'Index',
                                files: [
                                    'js/buyagain.js',
                                    'css/buyagain.css'
                                ]
                            })
                        }
                    }
                })

        }
    ]);