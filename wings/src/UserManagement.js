import React, { useEffect, useState } from 'react';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUserId, setEditUserId] = useState(null);
  const [editUsername, setEditUsername] = useState("");

  // Fetch users on component mount
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Function to handle deleting a user
  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to delete user');

      setUsers(users.filter(user => user.id !== id));
    } catch (error) {
      console.error(`Error deleting user with ID ${id}:`, error);
    }
  };

  // Function to handle editing a user
  const handleEdit = (user) => {
    if (editUserId !== null) {
      setEditUserId(null);
      setEditUsername("");
    }
    setEditUserId(user.id);
    setEditUsername(user.username);
  };

  // Function to save the edited user
  const handleSave = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/users/${editUserId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: editUsername }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.message || 'Failed to update user');

      setUsers(users.map(user => (user.id === editUserId ? { ...user, username: editUsername } : user)));
      setEditUserId(null);
      setEditUsername("");
    } catch (error) {
      console.error(`Error updating user with ID ${editUserId}:`, error);
    }
  };

  if (loading) return <div style={styles.loading}>Loading...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>User Management</h2>
      <table style={styles.table}>
        <thead>
          <tr>
            <th style={styles.header}>Username</th>
            <th style={styles.header}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="2" style={styles.noUsers}>No users available</td>
            </tr>
          ) : (
            users.map((user) => (
              <tr key={user.id} style={styles.row}>
                <td style={styles.cell}>
                  {editUserId === user.id ? (
                    <input
                      type="text"
                      value={editUsername}
                      onChange={(e) => setEditUsername(e.target.value)}
                      style={styles.input}
                    />
                  ) : (
                    user.username
                  )}
                </td>
                <td style={styles.cell}>
                  {editUserId === user.id ? (
                    <>
                      <button onClick={handleSave} style={styles.saveButton}>Save</button>
                      <button onClick={() => setEditUserId(null)} style={styles.cancelButton}>Cancel</button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(user)} disabled={editUserId !== null} style={styles.editButton}>
                        Edit
                      </button>
                      <button onClick={() => handleDelete(user.id)} style={styles.deleteButton}>Delete</button>
                    </>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  container: {
    padding: '20px',
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: '#ffffff',
    borderRadius: '8px',
    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
  },
  title: {
    textAlign: 'center',
    marginBottom: '20px',
    color: '#2c3e50',
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },
  header: {
    padding: '12px 15px',
    backgroundColor: '#3498db',
    color: 'white',
    textAlign: 'left',
  },
  row: {
    transition: 'background-color 0.2s ease',
  },
  cell: {
    padding: '12px 15px',
    borderBottom: '1px solid #ddd',
    backgroundColor: '#ecf0f1',
  },
  input: {
    width: '100%',
    padding: '8px',
    border: '1px solid #ddd',
    borderRadius: '4px',
  },
  saveButton: {
    backgroundColor: '#28a745',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  cancelButton: {
    backgroundColor: '#e74c3c',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  editButton: {
    backgroundColor: '#3498db',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
    marginRight: '5px',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
    color: 'white',
    border: 'none',
    padding: '8px 12px',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noUsers: {
    textAlign: 'center',
    fontStyle: 'italic',
    color: '#7f8c8d',
    padding: '20px',
  },
  loading: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '18px',
    color: '#3498db',
  },
};

export default UserManagement;