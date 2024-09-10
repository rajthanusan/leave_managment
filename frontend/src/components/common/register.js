import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { Calendar } from "primereact/calendar";
import Navbar from "./navbar";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [birthday, setBirthday] = useState(null);
  const [joindate, setJoindate] = useState(null);
  const [name, setName] = useState("");

  // validation
  const [validationErrors, setValidationErrors] = useState({});

  const validateForm = () => {
    const errors = {};

    if (!name.trim()) {
      errors.name = "Name is required";
    }

    if (!birthday) {
      errors.birthday = "Birth Date is required";
    }

    if (!joindate) {
      errors.joindate = "Join Date is required";
    }

    if (!username) {
      errors.username = "Email / Username is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(username)) {
      errors.username = "Invalid email";
    }

    if (!password) {
      errors.password = "Password is required";
    }
    /*else if (password.length < 8) {
            errors.password = 'Password should be at least 8 characters long';
        } else if (!/(?=.*[a-z])(?=.*[A-Z])/.test(password)) {
            errors.password = 'Password should contain at least one uppercase and one lowercase letter';
        }*/

    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Form submitted"); // Debugging statement

    const errors = validateForm();
    if (Object.keys(errors).length === 0) {
      try {
        const response = await axios.post(
          "http://localhost:8085/api/register",
          {
            username,
            password,
            birthday,
            joindate,
            name,
          }
        );

        if (response.status === 201) {
          toast.success("Registration successful");
          console.log(response.data); // Debugging statement
          // Clear form fields
          setUsername("");
          setPassword("");
          setBirthday(null);
          setJoindate(null);
          setName("");
          setValidationErrors({});
        }
      } catch (error) {
        console.error("Registration failed:", error);
        toast.error("Registration failed, please try again");
      }
    } else {
      setValidationErrors(errors);
    }
  };

  return (
    <>
      <Navbar />
      <ToastContainer />
      <div className="container pt-4">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <Card className="shadow-lg registration-card">
              <h1 className="text-center mb-4" style={{ color: "darkblue" }}>
                Register
              </h1>
              <hr />
              <form onSubmit={handleSubmit} className="p-fluid">
                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={validationErrors.name ? "p-invalid" : ""}
                      placeholder="Full Name"
                    />
                  </div>
                  <div>
                    {validationErrors.name && (
                      <small className="p-error">{validationErrors.name}</small>
                    )}
                  </div>
                </div>
                <br />
                <div className="row mb-3">
                  <div className="col">
                    <span className="p-float-label">
                      <Calendar
                        id="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.value)}
                        dateFormat="dd/mm/yy"
                        className={`custom-calendar ${
                          validationErrors.birthday ? "p-invalid" : ""
                        }`}
                        showIcon
                      />
                      <label htmlFor="birthday">Birth date</label>
                    </span>
                    {validationErrors.birthday && (
                      <small className="p-error">
                        {validationErrors.birthday}
                      </small>
                    )}
                  </div>
                  <div className="col">
                    <span className="p-float-label">
                      <Calendar
                        id="joindate"
                        value={joindate}
                        onChange={(e) => setJoindate(e.value)}
                        dateFormat="dd/mm/yy"
                        className={`custom-calendar ${
                          validationErrors.joindate ? "p-invalid" : ""
                        }`}
                        showIcon
                      />
                      <label htmlFor="joindate">Joined date</label>
                    </span>
                    {validationErrors.joindate && (
                      <small className="p-error">
                        {validationErrors.joindate}
                      </small>
                    )}
                  </div>
                </div>

                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-user"></i>
                    </span>
                    <InputText
                      id="email"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className={validationErrors.username ? "p-invalid" : ""}
                      placeholder="Enter Email"
                    />
                  </div>
                  <div>
                    {validationErrors.username && (
                      <small className="p-error">
                        {validationErrors.username}
                      </small>
                    )}
                  </div>
                </div>
                <br />

                <div>
                  <div className="p-inputgroup flex-1">
                    <span className="p-inputgroup-addon">
                      <i className="pi pi-lock"></i>
                    </span>
                    <InputText
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className={validationErrors.password ? "p-invalid" : ""}
                      placeholder="Password"
                    />
                  </div>
                  <div>
                    {validationErrors.password && (
                      <small className="p-error">
                        {validationErrors.password}
                      </small>
                    )}
                  </div>
                </div>
                <br />
                <Button
                  type="submit"
                  label="Register"
                  className="p-button-primary w-100 custom-darkblue-button"
                  style={{
                    backgroundColor: "darkblue",
                    borderColor: "darkblue",
                    color: "white",
                  }}
                />
              </form>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
