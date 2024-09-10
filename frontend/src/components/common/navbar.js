import React from 'react';
import { Menubar } from 'primereact/menubar';
import { Button } from 'primereact/button';
import { Link } from 'react-router-dom';
import { SplitButton } from 'primereact/splitbutton';
import '../customStyles.css';  // Import the custom CSS

export function Nav() {
    const items = [
        { label: 'Home', icon: 'pi pi-home', url: '/home' },
    ];

    const end = (
        <>
            <Link to="/login">
                <Button 
                    label="Login" 
                    className="p-button-sm custom-darkblue-button" 
                    icon="pi pi-sign-in" 
                />
            </Link>
            <Link to="/register">
                <Button 
                    label="Register" 
                    className="p-button-sm mx-2 custom-darkblue-button" 
                    icon="pi pi-user-plus" 
                />
            </Link>
        </>
    );

    return (
        <Menubar model={items} end={end} className="menu-item" />
    );
}

export function Navuser() {
    const loggedInUser = sessionStorage.getItem('loggedInUser');
    const username = loggedInUser ? JSON.parse(loggedInUser).username : '';

    const items = [
        { label: 'Home', icon: 'pi pi-home', url: '/homeuser' },
        { label: 'Apply for Leave', icon: 'pi pi-calendar-plus', url: '/applyleave' },
        { label: 'My Leave', icon: 'pi pi-list', url: '/myleave' },
    ];

    const end = (
        <SplitButton
            label={username}
            icon="pi pi-user"
            className="custom-darkblue-button"  // Apply the custom CSS class
            model={[
                {
                    label: 'Logout',
                    icon: 'pi pi-power-off',
                    command: () => {
                        sessionStorage.removeItem('loggedInUser');
                        window.location.href = '/login';
                    },
                },
            ]}
        />
    );

    return (
        <Menubar model={items} end={end} className="menu-item" />
    );
}

export function Navadmin() {
    const items = [
        { label: 'Home', icon: 'pi pi-home', url: '/homeadmin' },
        { label: 'Employees', icon: 'pi pi-users', url: '/employees' },
        {
            label: 'Leave Management', icon: 'pi pi-calendar-plus', items: [
                { label: 'Leave Types', icon: 'pi pi-list', url: '/leavetype' },
                { label: 'Leave Requests', icon: 'pi pi-calendar-plus', url: '/leaverequest' },
            ]
        },
    ];

    const end = (
        <SplitButton
            label="admin@gmail.com"
            icon="pi pi-cog"
            className="custom-darkblue-button"  // Apply the custom CSS class
            model={[
                {
                    label: 'Logout',
                    icon: 'pi pi-power-off',
                    command: () => {
                        sessionStorage.removeItem('loggedInAdmin');
                        window.location.href = '/login';
                    },
                },
            ]}
        />
    );

    return (
        <Menubar model={items} end={end} className="menu-item" />
    );
}

export default function Navbar(props) {
    if (props.user) {
        return <Navuser />;
    }
    if (props.admin) {
        return <Navadmin />;
    } else {
        return <Nav />;
    }
}
