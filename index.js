/* Copyright (c) 4D, 2012
*
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
*
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*
* The Software shall be used for Good, not Evil.
*
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
* AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
* LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
* OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
* THE SOFTWARE.
*/

var
	actions;
actions = {};


actions.toDos = function toDos() {
	"use strict";
	//studio.extension.storage.returnValue = '123';
	//studio.alert(studio.extension.storage.returnValue);
	
	if (!studio.currentSolution.getSolutionFile()) {

		studio.alert('You must open a solution before using this extension.');
		
	} else {
	
	studio.sendCommand("Todos.loadSolutionTodos");

	studio.extension.registerTabPage('index.html', 'to-do-icon.png');

	studio.extension.openPageInTab('index.html','ToDos Tool');

	return true;
    
        }
};

exports.handleMessage = function handleMessage(message) {
	"use strict";
	var
		actionName;

	actionName = message.action;

	if (!actions.hasOwnProperty(actionName)) {
		studio.alert("I don't know about this message: " + actionName);
		return false;
	}
	actions[actionName](message);
};


actions.saveSolutionTodos = function saveSolutionTodos(message) {

	studio.extension.setSolutionSetting('todos', studio.extension.storage.getItem('todos'));

};

actions.loadSolutionTodos = function loadSolutionTodos(message) {
	if (studio.extension.storage.setItem('todos', studio.extension.getSolutionSetting('todos'))) {
	}
};
