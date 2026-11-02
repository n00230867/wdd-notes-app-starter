import { useEffect, useState } from "react";

function App() {
  const [notes, setNotes] = useState([]);
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  function load() {
    fetch("/api/notes")
      .then((res) => res.json())
      .then((data) => setNotes(data));
  }

  useEffect(load, []);

  const count = notes.length;

  function submit(event) {
    event.preventDefault();

    // FormData is what makes the browser send a multipart request. Do not set
    // a Content-Type header here, the browser has to set it itself.
    const form = new FormData();
    form.append("text", text);
    if (file) form.append("file", file);

    fetch("/api/notes", { method: "POST", body: form }).then(() => {
      setText("");
      setFile(null);
      event.target.reset();
      load();
    });
  }

  function remove(noteId) {
    fetch(`/api/notes/${noteId}`, { method: "DELETE" }).then((res) => {
      if (!res.ok) throw new Error("Could not delete note");
      load();
    });
  }

  return (
    <div>
      <h1>Notes TEST MY Own</h1>
      <p>{count} notes</p>

      <form onSubmit={submit}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a note"
        />
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button type="submit">Add note</button>
      </form>

      <ul>
        {notes.map((note) => (
          <li key={note.id}>
            {note.text}
            {note.url && <a href={note.url}> (attachment)</a>}
            <button type="button" onClick={() => remove(note.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;

// test
