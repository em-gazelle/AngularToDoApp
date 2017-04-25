var myApp = angular.module('myapplication', ['ngRoute', 'ngResource']);


myApp.factory('Tasks', ['$resource',function($resource){
 return $resource('/tasks.json', {},{
 query: { method: 'GET', isArray: true },
 create: { method: 'POST' }
 })
}]);
 
myApp.factory('Task', ['$resource', function($resource){
 return $resource('/tasks/:id.json', {}, {
 update: { method: 'PUT', params: {id: '@id'} },
 delete: { method: 'DELETE', params: {id: '@id'} }
 });
}]);

myApp.controller("TaskUpdateCtr", ['$scope', '$resource', 'Task', '$location', '$routeParams', function($scope, $resource, Task, $location, $routeParams) {
   $scope.task = Task.get({id: $routeParams.id})
   $scope.update = function(){
     if ($scope.taskForm.$valid){
       Task.update($scope.task,function(){
         $location.path('/');
       }, function(error) {
         console.log(error)
      });
     }
   };
}]);

myApp.controller("TaskListCtr", ['$scope', '$http', '$resource', 'Tasks', 'Task', '$location', function($scope, $http, $resource, Tasks, Task, $location) {
  $scope.tasks = Tasks.query();
 
  $scope.deleteTask = function (taskId) {
    if (confirm("Are you sure you want to delete this task?")){
      Task.delete({ id: taskId }, function(){
        $scope.tasks = Tasks.query();   // after delete task get tasks collection.
      });
    }
  };

  $scope.createTask = function () {
    if ($scope.taskForm.$valid){
      Tasks.create({task: $scope.task}, function(){
	    $scope.tasks = Tasks.query();   // after delete task get tasks collection.      
        $location.path('/');
    }, function(error){
      console.log(error)
    });
  }
 }
	$scope.updateTask = function(taskId, completed) {
		Task.update({ id: taskId, completed: completed }, function(){
			$scope.tasks = Tasks.query();
		});
	};
}]);


myApp.config([
 '$routeProvider', '$locationProvider', function($routeProvider, $locationProvider) {

 $routeProvider.when('/tasks', {
    templateUrl: '/templates/tasks/index.html',
    controller: 'TaskListCtr'
 });
 $routeProvider.when('/tasks/:id/edit', {
    templateUrl: '/templates/tasks/edit.html',
    controller: 'TaskUpdateCtr'
 });
 $routeProvider.otherwise({
   redirectTo: '/tasks'
 });
 }
]);
