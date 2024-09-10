import React from 'react'
import Navbar from './navbar'

export function Homebase() {
    return (
        <>
        <Navbar />
        <div className="container mt-5">
        <div className="row align-items-center">
            <div className="col-md-6 text-center">
                <img 
                    src="https://lh6.googleusercontent.com/proxy/6v_PvNlJtVYe8wV0p_EyjhComzRXAGs5WXkh-w0tDFZaB3bbvAgEA4iyWlfDc816tB3Tk4L0p-jvMhP1vTPcspU9Y-y-BVXBfNV_dgXelQ" 
                    alt="Leave Management" 
                    className="img-fluid mb-5"
                />
            </div>
            <div className="col-md-6">
                <div className="text-center text-md-left mt-5">
                    <h1 className="text-center text-danger">Welcome to</h1>
                    <h1 className="text-center" >leave management</h1>
                    <hr />
                    <p className="text-justify">
                        A comprehensive Leave Management System encompasses a range of essential features to streamline the leave management process effectively. Some of these key features include:
                    </p>
                    <h4>1. Online Leave Application</h4>
                    <p>
                        Employees can easily request leaves through a user-friendly online interface, specifying the type of leave, duration, and reason.
                    </p>
                    <h4>2. Automated Workflows</h4>
                    <p>
                        The system allows for automated approval workflows, where leave requests are routed for quick and efficient decision-making.
                    </p>
                </div>
            </div>
        </div>
    </div>
</>
    );
}
export function Homeuser() {
    return (
        <>
            <Navbar user />
            <div className="container mt-5">
        <div className="row align-items-center">
            <div className="col-md-6 text-center">
                <img 
                    src="https://lh6.googleusercontent.com/proxy/6v_PvNlJtVYe8wV0p_EyjhComzRXAGs5WXkh-w0tDFZaB3bbvAgEA4iyWlfDc816tB3Tk4L0p-jvMhP1vTPcspU9Y-y-BVXBfNV_dgXelQ" 
                    alt="Leave Management" 
                    className="img-fluid mb-5"
                />
            </div>
            <div className="col-md-6">
                <div className="text-center text-md-left mt-5">
                    <h1 className="text-center text-danger">Welcome to</h1>
                    <h1 className="text-center">leave management</h1>
                    <hr />
                    <p className="text-justify">
                        A comprehensive Leave Management System encompasses a range of essential features to streamline the leave management process effectively. Some of these key features include:
                    </p>
                    <h4>1. Online Leave Application</h4>
                    <p>
                        Employees can easily request leaves through a user-friendly online interface, specifying the type of leave, duration, and reason.
                    </p>
                    <h4>2. Automated Workflows</h4>
                    <p>
                        The system allows for automated approval workflows, where leave requests are routed for quick and efficient decision-making.
                    </p>
                </div>
            </div>
        </div>
    </div>
</>
    );
}
export function Homeadmin() {
    return (
        <>
            <Navbar admin />
            <div className="container mt-5">
        <div className="row align-items-center">
            <div className="col-md-6 text-center">
                <img 
                    src="https://lh6.googleusercontent.com/proxy/6v_PvNlJtVYe8wV0p_EyjhComzRXAGs5WXkh-w0tDFZaB3bbvAgEA4iyWlfDc816tB3Tk4L0p-jvMhP1vTPcspU9Y-y-BVXBfNV_dgXelQ" 
                    alt="Leave Management" 
                    className="img-fluid mb-5"
                />
            </div>
            <div className="col-md-6">
                <div className="text-center text-md-left mt-5">
                    <h1 className="text-center text-danger">Welcome to</h1>
                    <h1 className="text-center">leave management</h1>
                    <hr />
                    <p className="text-justify">
                        A comprehensive Leave Management System encompasses a range of essential features to streamline the leave management process effectively. Some of these key features include:
                    </p>
                    <h4>1. Online Leave Application</h4>
                    <p>
                        Employees can easily request leaves through a user-friendly online interface, specifying the type of leave, duration, and reason.
                    </p>
                    <h4>2. Automated Workflows</h4>
                    <p>
                        The system allows for automated approval workflows, where leave requests are routed for quick and efficient decision-making.
                    </p>
                </div>
            </div>
        </div>
    </div>
</>
    );
}

export default function Home(props) {
    if (props.user) {
        return <Homeuser />;
    }
    if (props.admin) {
        return <Homeadmin />;
    }
    else {
        return <Homebase />;
    }
}
