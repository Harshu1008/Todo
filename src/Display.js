// Display.js
import React, { useState } from 'react';
import './App.css';
//import axios from 'axios';

function Display({ tasks, setTasks }) {
  const [editingTaskIndex, setEditingTaskIndex] = useState(null);
  const [editedTask, setEditedTask] = useState('');
  const [filter, setFilter] = useState('all');
  
  const handleToggleDone = (index) => {
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, done: !task.done } : task
    );
    setTasks(newTasks);
    const task = tasks[index];


    fetch(`http://localhost:5000/check/${encodeURIComponent(task.name)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done: task.done }), // Toggle the done status
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        throw new Error(data.message); // Handle known server errors
      }
      console.log("Task updated:", data);
    })
    .catch(error => console.error('Error:', error));
  };

  const handleDeleteTask = (index) => {
    setTasks(tasks.filter((task, i) => i !== index));

    const task = tasks[index];
    fetch(`http://localhost:5000/del/${encodeURIComponent(task.name)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ done: task.done }), // Toggle the done status
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        throw new Error(data.message); // Handle known server errors
      }
      console.log("Task deleted:", data);
    })
    .catch(error => console.error('Error:', error));

  };

  const handleEditTask = (index, editedTask) => {
    const updatedTasks = [...tasks];
    const oldName=updatedTasks[index].name;
    updatedTasks[index].name = editedTask;
    setTasks(updatedTasks);
    setEditingTaskIndex(null);
    setEditedTask('');
    const task = tasks[index];
    //alert(task.name)

    fetch(`http://localhost:5000/edit/${encodeURIComponent(oldName)}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ newName: task.name }), // Toggle the done status
    })
    .then(response => response.json())
    .then(data => {
      if (data.message) {
        throw new Error(data.message); // Handle known server errors
      }
      console.log("Task updated:", data);
    })
    .catch(error => console.error('Error:', error));
  };


  const handleChange = (event) => {
    setEditedTask(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    if (filter === 'all') return true;
    if (filter === 'done') return task.done;
    if (filter === 'todo') return !task.done;
    return true;
  });


  return (
    <div>
      <center>
        <h2>Tasks:</h2>
        <div>
          <button className="b2" type="button" onClick={() => setFilter('all')}>All</button>
          <button className="b2" type="button" onClick={() => setFilter('done')}>Done</button>
          <button className="b2" type="button" onClick={() => setFilter('todo')}>Todo</button>
        </div>
        <br />
        <div>
          {filteredTasks.map((task, index) => (
            <div className="d3" key={index}>
              <div className="d6">
                {editingTaskIndex === index ? (
                  <input
                    type="text"
                    value={editedTask}
                    onChange={handleChange}
                    onBlur={() => handleEditTask(index, editedTask)}
                    autoFocus
                  />
                ) : (
                  <p style={{ textDecoration: task.done ? 'line-through' : 'none' }}>{task.name}</p>
                )}
              </div>
              <div className="d5">
                <input type="checkbox" id="myCheckbox" checked={task.done} onChange={() => handleToggleDone(index)} />
                <img style={{ width: "15px", height: "15px" }} src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRf-89eQGBf_MkmDD5QhWIb3NjuEc6LcMqbvA&s" alt="edit" onClick={() => setEditingTaskIndex(index)} />
                <img style={{ width: "15px", height: "15px" }} src="https://cdn-icons-png.flaticon.com/512/5073/5073620.png" alt="delete" onClick={() => handleDeleteTask(index)} />
              </div>
            </div>
          ))}
        </div>
      </center>
    </div>
  );
}

export default Display;