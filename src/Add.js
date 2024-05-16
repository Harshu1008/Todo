// Add.js
import React, { useState } from 'react';
import './App.css';

function Add({ addTask }) {
  const [inputValue, setInputValue] = useState('');

  const handleChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleSubmit = () => {
    if (inputValue.trim() !== '') {
      addTask(inputValue);
      setInputValue('');
    }
    const postData = {
      task: inputValue,
      done:false,
      };
  
      fetch('http://localhost:5000/signup', {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json'
      },
      body: JSON.stringify(postData)
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

  return (
    <div>
      <center>
        <h1>Todo List</h1>
        <div className="d1">
          <br />
          <input
            id="inp1"
            className="d2"
            type="text"
            placeholder="Add task..."
            value={inputValue}
            onChange={handleChange}
          />
          <br />
          <br />
          <button className="b1" onClick={handleSubmit}>Add Task</button>
        </div>
      </center>
    </div>
  );
}

export default Add;