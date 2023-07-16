import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Table, Button, Form, Container } from 'react-bootstrap';

function App() {
  const [data, setData] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/data');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post('http://localhost:3001/api/data', formData);
      fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/data/${id}`);
      fetchData();
    } catch (error) {
      console.error('Error deleting entry:', error);
    }
  };

  return (
    <Container>
      <h1>CSV Data</h1>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Column 1</th>
            <th>Column 2</th>
            <th>Column 3</th>
            <th>Column 4</th>
            <th>Column 5</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((entry) => (
            <tr key={entry.id}>
              <td>{entry.id}</td>
              <td>{entry.column1}</td>
              <td>{entry.column2}</td>
              <td>{entry.column3}</td>
              <td>{entry.column4}</td>
              <td>{entry.column5}</td>
              <td>
                <Button variant="danger" onClick={() => handleDelete(entry.id)}>
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <h2>Add New Entry</h2>
      <Form onSubmit={handleFormSubmit}>
        <Form.Group controlId="formColumn1">
          <Form.Label>Column 1</Form.Label>
          <Form.Control
            type="text"
            name="column1"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formColumn2">
          <Form.Label>Column 2</Form.Label>
          <Form.Control
            type="text"
            name="column2"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formColumn3">
          <Form.Label>Column 3</Form.Label>
          <Form.Control
            type="text"
            name="column3"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formColumn4">
          <Form.Label>Column 4</Form.Label>
          <Form.Control
            type="text"
            name="column4"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Form.Group controlId="formColumn5">
          <Form.Label>Column 5</Form.Label>
          <Form.Control
            type="text"
            name="column5"
            onChange={handleInputChange}
            required
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </Container>
  );
}

export default App;
