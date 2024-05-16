// Delete.js
import React from 'react';
import './App.css';

function Delete({ deleteAllTasks, deleteDoneTasks }) {
  return (
    <center>
      <div>
        <div>
          <button className="b3" type="button" onClick={deleteDoneTasks}>Delete done tasks</button>
          <button className="b3" type="button" onClick={deleteAllTasks}>Delete all tasks</button>
        </div>
      </div>
    </center>
  );
}

export default Delete;
