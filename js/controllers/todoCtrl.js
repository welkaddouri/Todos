/*global angular */

/**
 * The main controller for the app. The controller:
 * - retrieves and persists the model via the todoStorage service
 * - exposes the model to the template and provides event handlers
 */
angular.module('todomvc')
	.controller('TodoCtrl', function TodoCtrl($scope, $routeParams, $filter) {
		'use strict';


        if(studio.extension.storage.getItem("todos")){
            
            var todos = $scope.todos = JSON.parse(studio.extension.storage.getItem("todos"));

        }else{

            var todos = $scope.todos = [];

        }
		


		$scope.newTodo = '';
		$scope.editedTodo = null;

		$scope.$watch('todos', function () {
			$scope.remainingCount = $filter('filter')(todos, { completed: false }).length;
			$scope.completedCount = todos.length - $scope.remainingCount;
			$scope.allChecked = !$scope.remainingCount;
		}, true);

		// Monitor the current route for changes and adjust the filter accordingly.
		$scope.$on('$routeChangeSuccess', function () {
			var status = $scope.status = $routeParams.status || '';

			$scope.statusFilter = (status === 'active') ?
				{ completed: false } : (status === 'completed') ?
				{ completed: true } : null;
		});

		$scope.addTodo = function () {
			var newTodo = {
				title: $scope.newTodo.trim(),
				completed: false
			};

			if (!newTodo.title) {
				return;
			}

			$scope.saving = true;

            if($scope.findItem(todos,"title",newTodo.title) == -1){


			todos.push(newTodo);

			studio.extension.storage.setItem('todos', JSON.stringify(todos));

			studio.sendCommand("Todos.saveSolutionTodos");
            
            $scope.newTodo = '';
            
            $scope.saving = false;

            }

            $scope.saving = false;

			
		};

		$scope.editTodo = function (todo) {

			$scope.editedTodo = todo;
			// Clone the original todo to restore it on demand.
			$scope.originalTodo = angular.extend({}, todo);
		};

		$scope.saveEdits = function (todo, event) {
			// Blur events are automatically triggered after the form submit event.
			// This does some unfortunate logic handling to prevent saving twice.
			if (event === 'blur' && $scope.saveEvent === 'submit') {
				$scope.saveEvent = null;
				return;
			}

			$scope.saveEvent = event;

			if ($scope.reverted) {
				// Todo edits were reverted-- don't save.
				$scope.reverted = null;
				return;
			}

			todo.title = todo.title.trim();

			if (todo.title === $scope.originalTodo.title) {
				$scope.editedTodo = null;
				return;
			}
            
            todos[$scope.findItem(todos,"title",$scope.originalTodo.title)] = todo;
            
            studio.extension.storage.setItem('todos', JSON.stringify(todos));

			studio.sendCommand("Todos.saveSolutionTodos");

            $scope.editedTodo = null;
			
		};

		$scope.revertEdits = function (todo) {

			todos[todos.indexOf(todo)] = $scope.originalTodo;
			$scope.editedTodo = null;
			$scope.originalTodo = null;
			$scope.reverted = true;
		};

		$scope.removeTodo = function (todo) {

			todos.splice($scope.findItem(todos,"title",todo.title),1);

			studio.extension.storage.setItem('todos', JSON.stringify(todos));

			studio.sendCommand("Todos.saveSolutionTodos");
		};

		$scope.saveTodo = function (todo) {
			//store.put(todo);
		};

		$scope.toggleCompleted = function (todo, completed) {
			if (angular.isDefined(completed)) {
				todo.completed = completed;
			}

			todos[$scope.findItem(todos,"title",todo.title)] = todo;
            
            studio.extension.storage.setItem('todos', JSON.stringify(todos));

			studio.sendCommand("Todos.saveSolutionTodos");
			
		};

		$scope.clearCompletedTodos = function () {

            var isSomethingCompleted = $scope.findItem(todos,"completed",true);

            while(isSomethingCompleted != -1){

                  todos.splice(isSomethingCompleted,1);
                  isSomethingCompleted = $scope.findItem(todos,"completed",true);

            }

			studio.extension.storage.setItem('todos', JSON.stringify(todos));

			studio.sendCommand("Todos.saveSolutionTodos");
		};

		$scope.markAll = function (completed) {
			todos.forEach(function (todo) {
				if (todo.completed !== completed) {
					$scope.toggleCompleted(todo, completed);
				}
			});

		};

		$scope.findItem = function (arr, key, value) {
		for (var i = 0; i < arr.length; i++) {
			if (arr[i][key] === value) {
				return (i);
			}
		}
		return -1;
        };
	});
