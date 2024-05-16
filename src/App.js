import React, { useState } from 'react';
import Add from './Add';
import Display from './Display';
import Delete from './Delete';

function App() {
  const [tasks, setTasks] = useState([]);

  const addTask = (task) => {
    setTasks([...tasks, { name: task, done: false }]); // Adding tasks as objects with a "done" property
  };

  const deleteAllTasks = () => {
    setTasks([]);
    fetch('http://localhost:5000/delete', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .catch(error => {
        console.error('Error:', error);
      });
  };
 
    const deleteDoneTasks = async () => {
      try {
        const response = await fetch('http://localhost:5000/tasks/done', {
          method: 'POST',
        });
        if (!response.ok) {
          throw new Error('Failed to delete done tasks');
        }
        setTasks(tasks.filter(task => !task.done));
      } catch (error) {
        console.error('Error deleting done tasks:', error);
      }
    };
  
  return (
    <div>
      <Add addTask={addTask} />
      <Display tasks={tasks} setTasks={setTasks} /> {/* Pass setTasks to Display for updating task status */}
      <Delete deleteAllTasks={deleteAllTasks} deleteDoneTasks={deleteDoneTasks} /> {/* Pass deleteDoneTasks function */}
    </div>
  );
}

export default App;