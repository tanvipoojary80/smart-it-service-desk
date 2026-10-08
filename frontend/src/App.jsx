import { useEffect, useState } from 'react'
import './App.css'

function App() {
  const [tickets, setTickets] = useState([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [priority, setPriority] = useState('MEDIUM')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/tickets')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load tickets')
        return response.json()
      })
      .then((data) => setTickets(data))
      .catch((err) => setError(err.message))
  }, [])

  async function createTicket(event) {
    event.preventDefault()
    setError('')

    try {
      const response = await fetch('/api/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, priority }),
      })

      if (!response.ok) throw new Error('Could not create ticket')

      const newTicket = await response.json()
      setTickets((current) => [...current, newTicket])
      setTitle('')
      setDescription('')
      setPriority('MEDIUM')
    } catch (err) {
      setError(err.message)
    }
  }

  async function changeStatus(id, status) {
    setError('')

    try {
      const response = await fetch(
        `/api/tickets/${id}/status?status=${encodeURIComponent(status)}`,
        { method: 'PUT' },
      )

      if (!response.ok) throw new Error('Could not update status')

      const updatedTicket = await response.json()
      setTickets((current) =>
        current.map((ticket) =>
          ticket.id === id ? updatedTicket : ticket,
        ),
      )
    } catch (err) {
      setError(err.message)
    }
  }

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch = ticket.title
      .toLowerCase()
      .includes(search.toLowerCase())

    const matchesStatus =
      statusFilter === 'ALL' || ticket.status === statusFilter

    return matchesSearch && matchesStatus
  })

  return (
    <main>
      <h1>Smart IT Service Desk</h1>

      <h2>Create a ticket</h2>
      <form onSubmit={createTicket}>
        <input
          placeholder="Issue title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
        <textarea
          placeholder="Describe the issue"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          required
        />
        <select
          value={priority}
          onChange={(event) => setPriority(event.target.value)}
        >
          <option value="LOW">Low priority</option>
          <option value="MEDIUM">Medium priority</option>
          <option value="HIGH">High priority</option>
        </select>
        <button type="submit">Create ticket</button>
      </form>

      {error && <p role="alert">{error}</p>}

      <h2>Support tickets</h2>

      <label htmlFor="ticket-search">Search by title</label>
      <input
        id="ticket-search"
        type="search"
        placeholder="Search tickets..."
        value={search}
        onChange={(event) => setSearch(event.target.value)}
      />

      <label htmlFor="status-filter">Filter by status</label>
      <select
        id="status-filter"
        value={statusFilter}
        onChange={(event) => setStatusFilter(event.target.value)}
      >
        <option value="ALL">All statuses</option>
        <option value="OPEN">Open</option>
        <option value="IN_PROGRESS">In progress</option>
        <option value="RESOLVED">Resolved</option>
      </select>

      {!error && filteredTickets.length === 0 && (
        <p>No matching tickets found.</p>
      )}

      {filteredTickets.map((ticket) => (
        <article key={ticket.id}>
          <h3>#{ticket.id} — {ticket.title}</h3>
          <p>{ticket.description}</p>
          <p>Priority: {ticket.priority || 'Not set'}</p>
          <p>Category: {ticket.category || 'Not categorized'}</p>

          <label htmlFor={`status-${ticket.id}`}>Status</label>
          <select
            id={`status-${ticket.id}`}
            value={ticket.status}
            onChange={(event) =>
              changeStatus(ticket.id, event.target.value)
            }
          >
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In progress</option>
            <option value="RESOLVED">Resolved</option>
          </select>
        </article>
      ))}
    </main>
  )
}

export default App