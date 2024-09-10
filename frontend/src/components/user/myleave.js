import React, { useState, useEffect, Fragment, useCallback } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Col from 'react-bootstrap/Col';
import Container from "react-bootstrap/Container";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from "../common/navbar";

const MyLeave = () => {
    const [show, setShow] = useState(false);
    const [show1, setShow1] = useState(false);
    const [deleteItemId, setDeleteItemId] = useState(null);
    const [editID, setEditId] = useState(null);
    const [editLeave, setEditLeave] = useState('');
    const [editStartdate, setEditStartdate] = useState('');
    const [editEnddate, setEditEnddate] = useState('');
    const [editComments, setEditComments] = useState('');
    const [data, setData] = useState([]);
    const [additionalData, setAdditionalData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const rowsPerPage = 2;

    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : '';

    const getData = useCallback(() => {
        axios.get('http://localhost:8085/api/LeaveView/')
            .then((result) => {
                const filteredData = result.data.data.filter(item => item.username === username);
                setData(filteredData);
            })
            .catch((error) => {
                console.log(error);
            });
    }, [username]);

    const fetchLeaveTypes = useCallback(() => {
        axios.get('http://localhost:8085/api/Leavetype')
            .then((result) => {
                setAdditionalData(result.data);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    useEffect(() => {
        getData();
        fetchLeaveTypes();
    }, [username, getData, fetchLeaveTypes]);

    const handleEdit = (id) => {
        setShow(true);
        setEditId(id); // Set the ID here
        axios.get(`http://localhost:8085/api/LeaveView/${id}`)
            .then((result) => {
                const { leave, startdate, enddate, comments } = result.data;
                setEditLeave(leave || '');
                setEditStartdate(startdate ? new Date(startdate).toISOString().substr(0, 10) : '');
                setEditEnddate(enddate ? new Date(enddate).toISOString().substr(0, 10) : '');
                setEditComments(comments || '');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    const confirmDelete = () => {
        if (deleteItemId) {
            axios.delete(`http://localhost:8085/api/LeaveView/delete/${deleteItemId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Leave request has been deleted");
                        getData();
                        setShow1(false);
                    }
                })
                .catch((error) => {
                    toast.error(error.message);
                });
        }
    };

    const handleUpdate = () => {
        if (!editID) {
            toast.error('Invalid ID');
            return;
        }
    
        const url = `http://localhost:8085/api/LeaveView/${editID}`;
        const data = {
            id: editID,
            leave_type: editLeave,
            start_date: editStartdate,
            end_date: editEnddate,
            comments: editComments,
            username: username,
            status: "pending"
        };
    
        console.log("Updating Leave ID:", editID);
        console.log("URL:", url);
        console.log("Payload:", data);

        axios.put(url, data)
            .then((result) => {
                toast.success('Leave request has been updated');
                getData();  // Refresh the data
                setShow(false);  // Close the modal
            })
            .catch((error) => {
                console.error('Error during update:', error);
                console.error('Response:', error.response);
                toast.error('Leave request updating failed');
            });
    };

    const indexOfLastRow = currentPage * rowsPerPage;
    const indexOfFirstRow = indexOfLastRow - rowsPerPage;
    const currentRows = data.slice(indexOfFirstRow, indexOfLastRow);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <Fragment>
            <Navbar user />
            <ToastContainer /> <br />
            <Container>
            <div className="row">
                    <h2 className="mb-4 text-darkblue">Allocated Leaves</h2>
                    <hr />
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h4 className=" text-darkblue">Sick Leave</h4>
                                <hr />
                                <p className="card-text">No. of Days: 5</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-darkblue">Annual Leave</h4>
                                <hr />
                                <p className="card-text">No. of Days: 10</p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4 mb-3">
                        <div className="card">
                            <div className="card-body">
                                <h4 className="text-darkblue">Casual Leave</h4>
                                <hr />
                                <p className="card-text">No. of Days: 2</p>
                            </div>
                        </div>
                    </div>
                    
                </div>
                <br />
                <h2 className="text-darkblue">My Leave Requests</h2> <hr />
                <Table striped hover className="table-light">
                    <thead>
                        <tr>
                            <th>Leave Type</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Comments</th>
                            <th>Actions</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentRows.map((item, index) => (
                            <tr key={index}>
                                <td>{item.leave_type}</td>
                                <td>{item.start_date}</td>
                                <td>{item.end_date}</td>
                                <td>{item.comments}</td>
                                <td>
                                    <button className="btn btn-primary custom-darkblue-button" disabled={item.status === 'Accepted' || item.status === 'Declined'} onClick={() => handleEdit(item.id)}>
                                        <FontAwesomeIcon icon={faPencil} />
                                    </button> &nbsp;
                                    <button className="btn btn-danger" disabled={item.status === 'Accepted' || item.status === 'Declined'} onClick={() => {
                                        setDeleteItemId(item.id);
                                        setShow1(true);
                                    }}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </button>
                                </td>
                                <td>
                                <div
  className={`badge text-wrap ${item.status === 'pending' ? 'bg-warning' : item.status === 'Accepted' ? 'bg-success' : item.status === 'Declined' ? 'bg-danger' : ''}`}
  style={{
    color: item.status === 'pending' ? 'black' : 
           item.status === 'approved' ? 'green' : 
           item.status === 'rejected' ? 'red' : 'inherit'
  }}
>
  {item.status}
</div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
                <div className="d-flex justify-content-center ">
                    <ul className="pagination ">
                        {Array.from(
                            { length: Math.ceil(data.length / rowsPerPage) },
                            (_, index) => (
                                <li
                                    key={index}
                                    className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => paginate(index + 1)}
                                    >
                                        {index + 1}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </div>
            </Container>

            <Modal show={show} onHide={() => setShow(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-darkblue">Update Leave Request</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Col>
                        <label htmlFor="">Leave Type</label>
                        {additionalData.length > 0 ? (
                            <select
                                className="form-control"
                                value={editLeave}
                                onChange={(e) => setEditLeave(e.target.value)}
                                required
                            >
                                <option value="">--Select Leave Type--</option>
                                {additionalData.map((item, index) => (
                                    <option key={item.id} value={item.leave_type_name}>
                                    {item.leave_type_name}
                                </option>
                                ))}
                            </select>
                        ) : (
                            <p>No leave types available</p>
                        )}
                        <br />
                        <label htmlFor="">Start Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={editStartdate}
                            onChange={(e) => setEditStartdate(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="">End Date</label>
                        <input
                            type="date"
                            className="form-control"
                            value={editEnddate}
                            onChange={(e) => setEditEnddate(e.target.value)}
                            required
                        />
                        <br />
                        <label htmlFor="">Comments</label>
                        <textarea
                            className="form-control"
                            value={editComments}
                            onChange={(e) => setEditComments(e.target.value)}
                            rows="3"
                            required
                        />
                    </Col>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleUpdate}>
                        Update
                    </Button>
                </Modal.Footer>
            </Modal>

            <Modal show={show1} onHide={() => setShow1(false)}>
                <Modal.Header closeButton>
                    <Modal.Title className="text-darkblue">Confirm Delete</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to delete this leave request?</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShow1(false)}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={confirmDelete}>
                        Delete
                    </Button>
                </Modal.Footer>
            </Modal>
        </Fragment>
    );
};

export default MyLeave;
