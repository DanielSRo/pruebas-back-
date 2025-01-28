import { useState, useEffect } from 'react'

import Note from './components/Note'
import noteService from './servers/notes'
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  // useEffect(() => {
  //   console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }, [])
  // console.log('render', notes.length, 'notes')

  // const hook = () => {
  //   // console.log('effect')
  //   axios
  //     .get('http://localhost:3001/notes')
  //     .then(response => {
  //       // console.log('promise fulfilled')
  //       setNotes(response.data)
  //     })
  // }

  // useEffect(hook, [])

  useEffect(() => {
    noteService
      .getAll()
      .then(inicialNotes => { setNotes(inicialNotes) })
  }, [])

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  // const [notes, setNotes] = useState(props.notes)
  const [notes, setNotes] = useState([])
  const [newNote, setNewNote] = useState('a new note...')
  const [showAll, setShowAll] = useState(false)
  const [errorMessage , setErrorMessage] = useState('some error happened ...')

  const notesToShow = showAll
    ? notes
    : notes.filter(note => note.important)

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  const toggleImportanceOf = id => {
    // console.log('impotance of ' + id + ' needs to be toggled')
    // const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important }

    // axios.put(url, changedNote).then(response => {
    //   setNotes(notes.map(note => note.id !== id ? note : response.data))
    // })

    noteService
      .update(id, changedNote)
      .then(returnedNote => {
        setNotes(notes.map(note => note.id !== id ? note : returnedNote))
      })
      .catch(error => {
        setErrorMessage(
          `the note '${note.content}' was already deleted from server`
        )
        setTimeout (() => {
          setErrorMessage(null)
        }, 5000)

        // alert(
        //   `the note '${note.content}' was already deleted from server`
        // )
        setNotes(notes.filter(n=>n.id !== id))
      })
  }

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  const addNote = (event) => {
    event.preventDefault()
    console.log('this the event.target', event.target)
    const noteObject = {
      content: newNote,
      important: Math.random() > 0.5,
      // id: notes.length + 1,
    }

    // axios
    //   .post('http://localhost:3001/notes', noteObject)
    //   .then(response => {
    //     setNotes(notes.concat(response.data))
    //     console.log(response)
    //   })

    noteService
      .create(noteObject)
      .then(returnedNote => {
        setNotes(notes.concat(returnedNote))
        setNewNote('')
      })

    // setNotes(notes.concat(noteObject))
    // setNewNote('')
  }

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  const handleNoteChange = (event) => {
    setNewNote(event.target.value)
  }

  /* *** *** *** *** *** *** *** *** *** *** *** *** *** */
  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage}/>

      <div>
        <button onClick={() => setShowAll(!showAll)}>
          show {showAll ? 'important' : 'all'}
        </button>
      </div>
      <ul>
        {/* {notes.map(note =>
          <Note key={note.id} note={note} />
        )} */}
        {notesToShow.map(note =>
          <Note
            key={note.id}
            note={note}
            toggleImportance={() => toggleImportanceOf(note.id)} />
        )}
      </ul>
      <form onSubmit={addNote}>
        <input
          value={newNote}
          onChange={handleNoteChange}
        />
        <button type="submit">save</button>
      </form>
      <Footer/>
    </div>
  )
}

export default App