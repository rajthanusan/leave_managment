import React, { useState, useEffect, Fragment } from "react";
import Table from 'react-bootstrap/Table';
import 'bootstrap/dist/css/bootstrap.min.css';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons'
import axios from "axios";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../common/navbar'

const Leavetype = () => {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    //const handleShow = () => setShow(true);

    // Add
    const [leave, setLeave] = useState('')
    const [days, setDays] = useState('')

    //Edit
    const [editID, setEditId] = useState('')
    const [editLeave, setEditLeave] = useState('')
    const [editDays, setEditDays] = useState('')

    const [data, setData] = useState([]);

    useEffect(() => {
        getData();
    }, [])

    const getData = () => {
        axios.get('http://localhost:8085/api/Leavetype')
            .then((result) => {
                setData(result.data)
            })
            .catch((error) => {
                console.log(error)
            })
    }

    const handleEdit = (id) => {
            setShow(true);
            setEditId(id); 
        axios.get(`http://localhost:8085/api/Leavetype/${id}`) // Fixed missing `/`
            .then((result) => {
                setEditLeave(result.data.leave_type_name); // Ensure it matches the field returned from the API
                setEditDays(result.data.days);
                setEditId(id);
            })
            .catch((error) => {
                console.log(error);
            });
    };
    
    const handleUpdate = () => {
        if (!editID) {
            toast.error('Invalid ID');
            return;
        }
    
        const url = `http://localhost:8085/api/Leavetype/${editID}`; // Correct URL for update
        const data = {
            leave_type_name: editLeave, // Ensure it matches the field returned from the API
            days: editDays
        };
    
        console.log("Updating Leave ID:", editID);
        console.log("URL:", url);
        console.log("Payload:", data);
    
        axios.put(url, data)
            .then((result) => {
                toast.success('Leave type has been updated');
                getData(); // Refresh the data
                setShow(false); // Close the modal
            })
            .catch((error) => {
                console.error('Error during update:', error);
                console.error('Response:', error.response);
                toast.error('Leave type updating failed');
            });
    };
    

    

    const handleSave = () => {
        const url = 'http://localhost:8085/api/Leavetype';
        const data = {

            "leave": leave,
            "days": days
        }
        axios.post(url, data)
            .then((result) => {
                getData();
                clear();
                toast.success('Leave type has been added');
            })
            .catch((error) => {
                toast.error(error);
            })
    }

    const clear = () => {
        setLeave('');
        setDays('');

        setEditLeave('');
        setEditDays('');
        setEditId('');
    }


    
    
    // Pagination
    const [currentPage, setCurrentPage] = useState(0);
    const itemsPerPage = 3;

    const startIndex = currentPage * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;

    const currentItems = data.slice(startIndex, endIndex);

    const totalPages = Math.ceil(data.length / itemsPerPage);

    const nextPage = () => {
        setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages - 1));
    };
    const prevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 0));
    };

    // Delete
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleteId, setDeleteId] = useState(null);

    const handleCloseDeleteModal = () => setShowDeleteModal(false);
    const handleShowDeleteModal = (id) => {
        setDeleteId(id);
        setShowDeleteModal(true);
    };

    const confirmDelete = () => {
        if (deleteId) {
            axios.delete(`http://localhost:8085/api/Leavetype/${deleteId}`)
                .then((result) => {
                    if (result.status === 200) {
                        toast.success("Leave type has been deleted");
                        getData();
                        handleCloseDeleteModal();
                    }
                })
                .catch((error) => {
                    toast.error(error);
                })
        }
    };

    return (
        <Fragment>
            <Navbar admin /> <br />
            <div className="container">
                <ToastContainer />
                <Row>
                    <Col>
                        <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="card shadow-lg p-4">
                                        <h1 className="text-darkblue">Create Leave Type</h1> <hr /> <br />
                                        <label htmlFor="">Leave Type</label>
                                        <input type="text" className="form-control" placeholder="Leave Type" value={leave} onChange={(e) => setLeave(e.target.value)} required />
                                        <br />
                                        <label htmlFor="">No. of days</label>
                                        <input type="number" className="form-control" placeholder="No. of Days" value={days} onChange={(e) => setDays(e.target.value)} required />
                                        <br />
                                        <button className="btn btn-primary custom-darkblue-button" onClick={() => handleSave()}>Create</button> <br />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Col>
                    <Col>
                        <div className="container pt-5">
                            <div className="row justify-content-center">
                                <div className="col-md-12">
                                    <div className="card shadow-lg p-4">
                                        <h1 className="text-darkblue">Index (Leave Types)</h1> <hr />
                                        <Table>
                                            <thead>
                                                <tr>
                                                    <th>Leave Type</th>
                                                    <th>No. of Days</th>
                                                    <th>Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {currentItems.map((item, index) => (
                                                    <tr key={index}>
                                                        <td>{item.leave_type_name}</td>
                                                        <td>{item.days}</td>
                                                        <td>
                                                            <button className="btn btn-primary custom-darkblue-button" onClick={() => handleEdit(item.id)}><FontAwesomeIcon icon={faPencil} /></button>&nbsp;
                                                            <button className="btn btn-danger" onClick={() => handleShowDeleteModal(item.id)}><FontAwesomeIcon icon={faTrash} /></button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </Table>
                                        <div>
                                            <button className="btn" onClick={prevPage} disabled={currentPage === 0}>
                                                {"<"}
                                            </button>
                                            &nbsp;<span>{currentPage + 1} / {totalPages}</span>&nbsp;
                                            <button className="btn custom-darkblue-button" onClick={nextPage} disabled={currentPage === totalPages - 1}>
                                                {">"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <Modal show={show} onHide={handleClose}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-darkblu">Update Leave Type</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <Row>
                                    <Col>
                                        <label htmlFor="">Leave Type</label>
                                        <input type="text" className="form-control" placeholder="Leave Type" value={editLeave} onChange={(e) => setEditLeave(e.target.value)}></input>
                                    </Col>
                                    <Col>
                                        <label htmlFor="">No. of days</label>
                                        <input type="number" className="form-control" placeholder="No. of Days" value={editDays} onChange={(e) => setEditDays(e.target.value)}></input>
                                    </Col>

                                </Row>
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClose}>
                                    Close
                                </Button>
                                <Button variant="primary custom-darkblue-button" onClick={handleUpdate}>
                                    Save
                                </Button>
                            </Modal.Footer>
                        </Modal>
                        <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
                            <Modal.Header closeButton>
                                <Modal.Title className="text-danger">Delete Confirmation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                Are you sure you want to delete this Leave type?
                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseDeleteModal}>
                                    Cancel
                                </Button>
                                <Button variant="danger" onClick={confirmDelete}>
                                    Delete
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </Col>
                </Row>
            </div>
        </Fragment>
    )
}

export default Leavetype;
