var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']);


myApp.factory('Tasks', ['$resource',function($resource){
 return $resource('/tasks.json', {},{
 query: { method: 'GET', isArray: true },
 create: { method: 'POST' }
 })
}]);
 
myApp.factory('Task', ['$resource', function($resource){
 return $resource('/tasks/:id.json', {}, {
 show: { method: 'GET' },
 update: { method: 'PUT', params: {id: '@id'} },
 delete: { method: 'DELETE', params: {id: '@id'} }
 });
}]);


myApp.controller("TaskListCtr", ['$scope', '$http', '$resource', 'Tasks', 'Task', '$location', function($scope, $http, $resource, Tasks, Task, $location) {
  $scope.tasks = Tasks.query();
 
  $scope.deleteTask = function (taskId) {
    if (confirm("Are you sure you want to delete this task?")){
      Task.delete({ id: taskId }, function(){
        $scope.tasks = Tasks.query();   // after delete task get tasks collection.
        $location.path('/');
      });
    }
  };

  $scope.createTask = function () {
  	debugger;
    if ($scope.taskForm.$valid){
      Tasks.create({task: $scope.task}, function(){
	    $scope.tasks = Tasks.query();   // after delete task get tasks collection.      
        $location.path('/');
    }, function(error){
      console.log(error)
    });
  }
 }

   // $scope.task = Task.get({id: $routeParams.id})
   // $scope.update = function(){
   //   if ($scope.taskForm.$valid){
   //     Task.update($scope.task,function(){
   //      $scope.tasks = Tasks.query();   // after delete task get tasks collection.
   //       $location.path('/');
   //     }, function(error) {
   //       console.log(error)
   //    });
   //   }
   // };
}]);


myApp.config([
 '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

 $routeProvider.when('/tasks', {
    templateUrl: '/templates/tasks/index.html',
    controller: 'TaskListCtr'
 });
 $routeProvider.otherwise({
   redirectTo: '/tasks'
 });
 }
]);
