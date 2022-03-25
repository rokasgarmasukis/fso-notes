import { useState, useEffect } from "react";
import axios from "axios";

import Note from "./components/Note";

const App = (props) => {
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);

  const notesToShow = showAll ? notes : notes.filter((note) => note.important);

  useEffect(() => {
    axios.get("http://localhost:3001/notes").then((response) => {
      setNotes(response.data);
    });
  }, []);


  const addNote = (event) => {
    event.preventDefault();
    const newNoteObject = {
      content: newNote,
      id: notes.length + 1,
      important: Math.random() > 0.5,
      date: new Date().toISOString(),
    };

    axios
    .post("http://localhost:3001/notes", newNoteObject)
    .then(response => {
      setNotes(notes.concat(response.data));
      setNewNote("");
    })

  };

  const handleNoteChange = (e) => {
    setNewNote(e.target.value);
  };

  const toggleImportanceOf = (id) => {
    const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(note => note.id === id)
    const changedNote = {...note, important: !note.important}
    
    axios.put(url, changedNote).then(response => {
      setNotes(note => note.id !== id ? note : response.data)
    })
  }

  return (
    <div>
      <h1>Notes</h1>
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? "important" : "all"}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note} toggleImportance={() => toggleImportanceOf(note.id)} />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="submit">save</button>
      </form>
    </div>
  );
};

export default App;
