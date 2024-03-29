import { useState, useEffect, useRef } from "react";
import Footer from "./components/Footer";
import LoginForm from "./components/LoginForm";
import Note from "./components/Note";
import NoteForm from "./components/NoteForm";
import Togglable from "./components/Togglable";
import noteService from "./services/notes";
import Notification from "./components/Notification";

const App = () => {
    const [notes, setNotes] = useState([]);
    const [showAll, setShowAll] = useState(true);
    const [errorMessage, setErrorMessage] = useState(null);
    const [user, setUser] = useState(null);

    const noteFormRef = useRef();

    useEffect(() => {
        noteService.getAll().then((initialNotes) => {
            setNotes(initialNotes);
        });
    }, []);

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem("loggedNoteappUser");
        if (loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON);
            setUser(user);
            noteService.setToken(user.token);
        }
    }, []);

    const loginForm = () => {
        return (
            <Togglable buttonLabel="log in">
                <LoginForm
                    setUser={setUser}
                    setErrorMessage={setErrorMessage}
                />
            </Togglable>
        );
    };

    const handleLogout = () => {
        window.localStorage.clear();
        setUser(null);
    };

    const addNote = (noteObject) => {
        noteFormRef.current.toggleVisibility();
        noteService.create(noteObject).then((returnedNote) => {
            setNotes(notes.concat(returnedNote));
        });
    };

    const notesToShow = showAll
        ? notes
        : notes.filter((note) => note.important);

    const toggleImportanceOf = (id) => {
        const note = notes.find((n) => n.id === id);
        const changedNote = { ...note, important: !note.important };

        noteService
            .update(id, changedNote)
            .then((returnedNote) => {
                setNotes(
                    notes.map((note) => (note.id !== id ? note : returnedNote))
                );
            })
            .catch((error) => {
                setErrorMessage(
                    `Note '${note.content}' was already removed from server`
                );
                setTimeout(() => {
                    setErrorMessage(null);
                }, 5000);
                setNotes(notes.filter((n) => n.id !== id));
            });
    };

    return (
        <div>
            <h1>Notes</h1>

            <Notification message={errorMessage} />

            {!user && loginForm()}
            {user && (
                <div>
                    <p>{user.name} logged in</p>
                    <div>
                        <button onClick={handleLogout} type="text">
                            logout
                        </button>
                    </div>
                    {
                        <Togglable buttonLabel="new note" ref={noteFormRef}>
                            <NoteForm createNote={addNote} />
                        </Togglable>
                    }
                </div>
            )}

            <div>
                <button onClick={() => setShowAll(!showAll)}>
                    show {showAll ? "important" : "all"}
                </button>
            </div>
            <ul>
                {notesToShow.map((note, i) => (
                    <Note
                        key={i}
                        note={note}
                        toggleImportance={() => toggleImportanceOf(note.id)}
                    />
                ))}
            </ul>

            <Footer />
        </div>
    );
};

export default App;
