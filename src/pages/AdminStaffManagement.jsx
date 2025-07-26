import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';

export default function AdminStaffManagement() {
  const [staffList, setStaffList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', staff_id: '', department: '', phone: '', password: '' });
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ staff_id: '', first_name: '', last_name: '', department: '', phone: '', password: '' });
  const [addError, setAddError] = useState('');
  const [addSuccess, setAddSuccess] = useState('');
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchStaff();
  }, []);

  const fetchStaff = async () => {
    setLoading(true);
    setError('');
    const { data, error } = await supabase
      .from('staff')
      .select('*')
      .order('staff_id');
    if (error) setError('Failed to load staff');
    setStaffList(data || []);
    setLoading(false);
  };

  const openEdit = (user) => {
    setEditUser(user);
    setEditForm({
      first_name: user.first_name || '',
      last_name: user.last_name || '',
      staff_id: user.staff_id || '',
      department: user.department || '',
      phone: user.phone || '',
      password: '',
    });
    setSuccess('');
    setError('');
  };

  const closeEdit = () => {
    setEditUser(null);
    setEditForm({ first_name: '', last_name: '', staff_id: '', department: '', phone: '', password: '' });
    setSuccess('');
    setError('');
  };

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const saveEdit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError('');
    setSuccess('');
    try {
      let updateObj = {
        first_name: editForm.first_name,
        last_name: editForm.last_name,
        staff_id: editForm.staff_id,
        department: editForm.department,
        phone: editForm.phone,
      };
      if (editForm.password) {
        updateObj.password = editForm.password; // Plain text password
      }
      const { error } = await supabase
        .from('staff')
        .update(updateObj)
        .eq('id', editUser.id);
      if (error) {
        setError('Failed to update staff: ' + error.message);
      } else {
        setSuccess('Staff updated successfully!');
        fetchStaff();
        setTimeout(closeEdit, 1200);
      }
    } catch (err) {
      setError('Unexpected error.');
    }
    setSaving(false);
  };

  // Add Staff Logic
  const openAdd = () => {
    setShowAdd(true);
    setAddForm({ staff_id: '', first_name: '', last_name: '', department: '', phone: '', password: '' });
    setAddError('');
    setAddSuccess('');
  };
  const closeAdd = () => {
    setShowAdd(false);
    setAddForm({ staff_id: '', first_name: '', last_name: '', department: '', phone: '', password: '' });
    setAddError('');
    setAddSuccess('');
  };
  const handleAddChange = (e) => {
    setAddForm({ ...addForm, [e.target.name]: e.target.value });
  };
  const saveAdd = async (e) => {
    e.preventDefault();
    setAdding(true);
    setAddError('');
    setAddSuccess('');
    try {
      // Check required fields
      if (!addForm.staff_id || !addForm.first_name || !addForm.last_name || !addForm.password) {
        setAddError('Staff ID, first name, last name, and password are required.');
        setAdding(false);
        return;
      }
      // Insert new staff with plain text password
      const { error } = await supabase
        .from('staff')
        .insert({
          staff_id: addForm.staff_id,
          first_name: addForm.first_name,
          last_name: addForm.last_name,
          department: addForm.department,
          phone: addForm.phone,
          password: addForm.password, // Plain text password
        });
      if (error) {
        setAddError('Failed to add staff: ' + error.message);
      } else {
        setAddSuccess('Staff added successfully!');
        fetchStaff();
        setTimeout(closeAdd, 1200);
      }
    } catch (err) {
      setAddError('Unexpected error.');
    }
    setAdding(false);
  };

  return (
    <div style={{ padding: 32 }}>
      <h1>Staff Management</h1>
      <p>Admins can add and edit staff details here.</p>
      <button onClick={openAdd} style={{ background: '#153A6B', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer', marginBottom: 16 }}>Create New Staff</button>
      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div style={{ color: 'red' }}>{error}</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 24 }}>
          <thead>
            <tr style={{ background: '#153A6B', color: '#fff' }}>
              <th style={{ padding: 8 }}>Staff ID</th>
              <th style={{ padding: 8 }}>First Name</th>
              <th style={{ padding: 8 }}>Last Name</th>
              <th style={{ padding: 8 }}>Department</th>
              <th style={{ padding: 8 }}>Phone</th>
              <th style={{ padding: 8 }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staffList.map((user) => (
              <tr key={user.id} style={{ background: '#f7f8fa' }}>
                <td style={{ padding: 8 }}>{user.staff_id}</td>
                <td style={{ padding: 8 }}>{user.first_name}</td>
                <td style={{ padding: 8 }}>{user.last_name}</td>
                <td style={{ padding: 8 }}>{user.department}</td>
                <td style={{ padding: 8 }}>{user.phone}</td>
                <td style={{ padding: 8 }}>
                  <button onClick={() => openEdit(user)} style={{ background: '#153A6B', color: '#fff', border: 'none', borderRadius: 4, padding: '6px 14px', cursor: 'pointer' }}>Edit</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editUser && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={saveEdit} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px #153A6B22', position: 'relative' }}>
            <h2>Edit Staff</h2>
            <label>Staff ID</label>
            <input name="staff_id" value={editForm.staff_id} onChange={handleEditChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>First Name</label>
            <input name="first_name" value={editForm.first_name} onChange={handleEditChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Last Name</label>
            <input name="last_name" value={editForm.last_name} onChange={handleEditChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Department</label>
            <input name="department" value={editForm.department} onChange={handleEditChange} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Phone</label>
            <input name="phone" value={editForm.phone} onChange={handleEditChange} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>New Password (leave blank to keep current)</label>
            <input name="password" type="password" value={editForm.password} onChange={handleEditChange} style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" disabled={saving} style={{ background: '#153A6B', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Save</button>
              <button type="button" onClick={closeEdit} style={{ background: '#eee', color: '#153A6B', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
            {error && <div style={{ color: 'red', marginTop: 8 }}>{error}</div>}
            {success && <div style={{ color: 'green', marginTop: 8 }}>{success}</div>}
          </form>
        </div>
      )}
      {showAdd && (
        <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: '#0008', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <form onSubmit={saveAdd} style={{ background: '#fff', borderRadius: 12, padding: 32, minWidth: 320, boxShadow: '0 4px 24px #153A6B22', position: 'relative' }}>
            <h2>Create New Staff</h2>
            <label>Staff ID</label>
            <input name="staff_id" value={addForm.staff_id} onChange={handleAddChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>First Name</label>
            <input name="first_name" value={addForm.first_name} onChange={handleAddChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Last Name</label>
            <input name="last_name" value={addForm.last_name} onChange={handleAddChange} required style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Department</label>
            <input name="department" value={addForm.department} onChange={handleAddChange} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Phone</label>
            <input name="phone" value={addForm.phone} onChange={handleAddChange} style={{ width: '100%', marginBottom: 12, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <label>Password</label>
            <input name="password" type="password" value={addForm.password} onChange={handleAddChange} required style={{ width: '100%', marginBottom: 16, padding: 8, borderRadius: 6, border: '1px solid #d1d5db' }} />
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="submit" disabled={adding} style={{ background: '#153A6B', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Add</button>
              <button type="button" onClick={closeAdd} style={{ background: '#eee', color: '#153A6B', border: 'none', borderRadius: 4, padding: '8px 18px', fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
            </div>
            {addError && <div style={{ color: 'red', marginTop: 8 }}>{addError}</div>}
            {addSuccess && <div style={{ color: 'green', marginTop: 8 }}>{addSuccess}</div>}
          </form>
        </div>
      )}
    </div>
  );
} 