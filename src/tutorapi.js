
const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const app = express();


const serviceAccount = require('C:/Users/admin/OneDrive/Desktop/campus-tutoring/smart-campus-tutor-management-system-2024/src/wits-campus-tutoring-firebase-adminsdk-bf7py-d1439ce237.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://wits-campus-tutoring-default-rtdb.firebaseio.com',
});

const db = admin.firestore();
app.use(bodyParser.json());

// API Endpoints
app.get('/api/tutor/:id', async (req, res) => {
  try {
    const tutorDoc = await db.collection('tutors').doc(req.params.id).get();
    if (!tutorDoc.exists) {
      return res.status(404).send('Tutor not found');
    }
    res.json(tutorDoc.data());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 2. Create or Update Tutor Profile
app.post('/api/tutor', async (req, res) => {
  const { id, name, bio, profilePic, subjects, availability } = req.body;

  try {
    const tutorRef = db.collection('tutors').doc(id || name);  // Use id if provided, or name as the doc ID

    await tutorRef.set(
      { name, bio, profilePic, subjects, availability },
      { merge: true }  // Update existing data without overwriting the entire document
    );

    const updatedTutor = await tutorRef.get();
    res.json(updatedTutor.data());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// 3. Add Availability
app.post('/api/tutor/:id/availability', async (req, res) => {
  const { date, startTime, endTime } = req.body;

  try {
    const tutorRef = db.collection('tutors').doc(req.params.id);
    const tutorDoc = await tutorRef.get();

    if (!tutorDoc.exists) {
      return res.status(404).send('Tutor not found');
    }

    // Append new availability
    const availability = tutorDoc.data().availability || [];
    availability.push({ date, startTime, endTime });

    await tutorRef.update({ availability });

    const updatedTutor = await tutorRef.get();
    res.json(updatedTutor.data());
  } catch (err) {
    res.status(500).send(err.message);
  }
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
