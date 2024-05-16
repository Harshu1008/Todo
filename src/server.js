const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { MongoClient } = require('mongodb');

const app = express();
const PORT = process.env.PORT || 5000;

// Connection URI
const uri = "mongodb://localhost:27017";
const dbName = "todo";

// Middleware
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// Connect to MongoDB
async function connect() {
  try {
    // Create a new MongoClient instance
    const client = new MongoClient(uri);
    
    // Connect to MongoDB
    await client.connect();
    console.log("Connected to MongoDB server");

    // Access the database
    const db = client.db(dbName);

    // Define collection
    const usersCollection = db.collection("student");


    // Signup endpoint
    app.post('/signup', async (req, res) => {
      const { task,done} = req.body;

      try {
        // Insert the new task into the collection
        const newUser = await usersCollection.insertOne({ task,done });
      } catch (err) {
        res.status(500).json({ message: 'Internal server error' });
      }
    });

    app.post('/delete', async (req, res) => {
        try{
            const result = await usersCollection.deleteMany({});
            res.status(200).json({ message: 'All data deleted successfully' });
        }
        catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Failed to delete data' });
        } finally {
            await client.close();
        }
    });

    app.post('/tasks/done', async (req, res) => {
      try {
          // Delete tasks that are done
          const result = await usersCollection.deleteMany({ done: true });
  
          res.status(200).json({ message: 'Done tasks deleted successfully' });
      } catch (error) {
          console.error(error);
          res.status(500).json({ message: 'Failed to delete done tasks' });
      }
  });

  
  app.post('/check/:name', async (req, res) => {
    const { name } = req.params;
    const { done } = req.body;
    console.log({name ,done})
    try {
        //console.log({name ,done})
        const updatedTask = await usersCollection.findOneAndUpdate(
            { task: name }, // Use 'name' as the filter field
            { $set: { done: !done } } // Update 'status' field with 'done' value
        );
        console.log(updatedTask);
        if (!updatedTask || !updatedTask.value) {
            return res.status(404).json({ message: 'Task not found' });
        }
      
        return res.status(200).json({ message: 'Task status updated successfully', updatedTask });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Internal server error' });
    }
});
  
  app.post('/del/:name', async (req, res) => {
    const { name } = req.params;
    const result = await usersCollection.deleteOne({ task:name });
  });

  app.post('/edit/:name', async (req, res) => {
    const { name } = req.params;
    const { newName } = req.body;
    console.log({name,newName})
    const updatedTask = await usersCollection.findOneAndUpdate(
        { task: name }, // Filter by task name
        { $set: { task: newName } } // Update the name field
    );
    
});

    // Start server
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
  }

}

// Call the connect function
connect();