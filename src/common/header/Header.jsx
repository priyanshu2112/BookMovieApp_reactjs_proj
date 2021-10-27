import React, { useState } from "react";
import "./Header.css"
import { Button } from "@material-ui/core";
import LOGO from "../../assets/logo.svg"
import Modal from 'react-modal';
import PropTypes from 'prop-types';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import InputLabel from '@material-ui/core/InputLabel';
import Input from '@material-ui/core/Input';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';
import Typography from '@material-ui/core/Typography';
import { Link } from 'react-router-dom';


const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: 0, textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

const Header = (props) => {

    const customStyles = {
        content: {
            top: '50%',
            left: '50%',
            right: 'auto',
            bottom: 'auto',
            marginRight: '-50%',
            transform: 'translate(-50%, -50%)'
        }
    };

    const [modalIsOpen, setModalIsOpen] = useState(false)
    const [value, setValue] = useState(0)
    const [usernameRequired, setUsernameRequired] = useState("dispNone")
    const [username, setUsername] = useState("")
    const [loginPasswordRequired, setLoginPasswordRequired] = useState("dispNone")
    const [loginPassword, setLoginPassword] = useState("")
    const [firstnameRequired, setFirstnameRequired] = useState("dispNone")
    const [firstname, setFirstname] = useState("")
    const [lastnameRequired, setLastnameRequired] = useState("dispNone")
    const [lastname, setLastname] = useState("")
    const [emailRequired, setEmailRequired] = useState("dispNone")
    const [email, setEmail] = useState("")
    const [registerPasswordRequired, setRegisterPasswordRequired] = useState("dispNone")
    const [registerPassword, setRegisterPassword] = useState("")
    const [contactRequired, setContactRequired] = useState("dispNone")
    const [contact, setContact] = useState("")
    const [registrationSuccess, setRegistrationSuccess] = useState(false)
    const [loggedIn, setLoggedIn] = useState(sessionStorage.getItem("access-token") == null ? false : true)

    const openModalHandler = () => {
        setModalIsOpen(true)
        setValue(0)
        setUsernameRequired("dispNone")
        setUsername("")
        setLoginPasswordRequired("dispNone")
        setLoginPassword("")
        setFirstnameRequired("dispNone")
        setFirstname("")
        setLastnameRequired("dispNone")
        setLastname("")
        setEmailRequired("dispNone")
        setEmail("")
        setRegisterPasswordRequired("dispNone")
        setRegisterPassword("")
        setContactRequired("dispNone")
        setContact("")
    };


    const closeModalHandler = () => {
        setModalIsOpen(false)
    }

    const tabChangeHandler = (event, value) => {
        setValue(value)
    }

    const loginClickHandler = () => {
        setUsernameRequired(username === "" ? "dispBlock" : "dispNone");
        setLoginPasswordRequired(loginPassword === "" ? "dispBlock" : "dispNone");

        let dataLogin = null;

        fetch(props.baseUrl + "auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
                "Authorization": "Basic " + window.btoa(username + ":" + loginPassword)
            },
            body: dataLogin,
        }).then((response) => {
            let accessToken = response.headers.get("access-token");
            sessionStorage.setItem("access-token", accessToken);
            return response.json()
        }).then((response) => {
            sessionStorage.setItem("uuid", response.id);
            setLoggedIn(true)
            closeModalHandler()
        }).catch((e) => {
            console.log("error" + e)
        });
    }

    const inputUsernameChangeHandler = (e) => {
        setUsername(e.target.value);
    }

    const inputLoginPasswordChangeHandler = (e) => {
        setLoginPassword(e.target.value);
    }

    const registerClickHandler = () => {
        setFirstnameRequired(firstname === "" ? "dispBlock" : "dispNone")
        setLastnameRequired(lastname === "" ? "dispBlock" : "dispNone")
        setEmailRequired(email === "" ? "dispBlock" : "dispNone")
        setRegisterPasswordRequired(registerPassword === "" ? "dispBlock" : "dispNone")
        setContactRequired(contact === "" ? "dispBlock" : "dispNone")

        let dataSignup = JSON.stringify({
            "email_address": email,
            "first_name": firstname,
            "last_name": lastname,
            "mobile_number": contact,
            "password": registerPassword
        });

        fetch(props.baseUrl + "signup/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Cache-Control": "no-cache",
            },
            body: dataSignup,
        }).then((response) => response.json())
            .then((response) => {
                setRegistrationSuccess(true);
            }).catch((e) => {
            console.log("error" + e)
        });
    }

    const inputFirstNameChangeHandler = (e) => {
        setFirstname(e.target.value);
    }

    const inputLastNameChangeHandler = (e) => {
        setLastname(e.target.value);
    }

    const inputEmailChangeHandler = (e) => {
        setEmail(e.target.value);
    }

    const inputRegisterPasswordChangeHandler = (e) => {
        setRegisterPassword(e.target.value);
    }

    const inputContactChangeHandler = (e) => {
        setContact(e.target.value);
    }

    const logoutHandler = () => {
        sessionStorage.removeItem("uuid");
        sessionStorage.removeItem("access-token");
        setLoggedIn(false)
    }

    return (
        <div>
            <header className="app-header">
                <img src={LOGO} className="app-logo" alt="Movies App Logo" />
                {!loggedIn ?
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={openModalHandler}>
                            Login
                        </Button>
                    </div>
                    :
                    <div className="login-button">
                        <Button variant="contained" color="default" onClick={logoutHandler}>
                            Logout
                        </Button>
                    </div>
                }
                {props.showBookShowButton && !loggedIn
                    ? <div className="bookshow-button">
                        <Button variant="contained" color="primary" onClick={(e) => openModalHandler(e)}>
                            Book Show
                        </Button>
                    </div>
                    : ""
                }

                {props.showBookShowButton && loggedIn
                    ? <div className="bookshow-button">
                        <Link to={"/bookshow/" + props.id}>
                            <Button variant="contained" color="primary">
                                Book Show
                            </Button>
                        </Link>
                    </div>
                    : ""
                }

            </header>
            <Modal
                ariaHideApp={false}
                isOpen={modalIsOpen}
                contentLabel="Login"
                onRequestClose={() => closeModalHandler()}
                style={customStyles}
            >
                <Tabs className="tabs" value={value} onChange={(e, value) => tabChangeHandler(e, value)}>
                    <Tab label="Login" />
                    <Tab label="Register" />
                </Tabs>

                {value === 0 &&
                <TabContainer>
                    <FormControl required>
                        <InputLabel htmlFor="username">Username</InputLabel>
                        <Input id="username" type="text" username={username} onChange={(e) => inputUsernameChangeHandler(e)} />
                        <FormHelperText className={usernameRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                        <InputLabel htmlFor="loginPassword">Password</InputLabel>
                        <Input id="loginPassword" type="password" loginpassword={loginPassword} onChange={(e) => inputLoginPasswordChangeHandler(e)} />
                        <FormHelperText className={loginPasswordRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    {loggedIn === true &&
                    <FormControl>
                                <span className="successText">
                                    Login Successful!
                                </span>
                    </FormControl>
                    }
                    <br /><br />
                    <Button variant="contained" color="primary" onClick={() => loginClickHandler()}>LOGIN</Button>
                </TabContainer>
                }

                {value === 1 &&
                <TabContainer>
                    <FormControl required>
                        <InputLabel htmlFor="firstname">First Name</InputLabel>
                        <Input id="firstname" type="text" firstname={firstname} onChange={(e) => inputFirstNameChangeHandler(e)} />
                        <FormHelperText className={firstnameRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                        <InputLabel htmlFor="lastname">Last Name</InputLabel>
                        <Input id="lastname" type="text" lastname={lastname} onChange={(e) => inputLastNameChangeHandler(e)} />
                        <FormHelperText className={lastnameRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                        <InputLabel htmlFor="email">Email</InputLabel>
                        <Input id="email" type="text" email={email} onChange={(e) => inputEmailChangeHandler(e)} />
                        <FormHelperText className={emailRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                        <InputLabel htmlFor="registerPassword">Password</InputLabel>
                        <Input id="registerPassword" type="password" registerpassword={registerPassword} onChange={(e) => inputRegisterPasswordChangeHandler(e)} />
                        <FormHelperText className={registerPasswordRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    <FormControl required>
                        <InputLabel htmlFor="contact">Contact No.</InputLabel>
                        <Input id="contact" type="text" contact={contact} onChange={(e) => inputContactChangeHandler(e)} />
                        <FormHelperText className={contactRequired}>
                            <span className="red">required</span>
                        </FormHelperText>
                    </FormControl>
                    <br /><br />
                    {registrationSuccess === true &&
                    <FormControl>
                                <span className="successText">
                                    Registration Successful. Please Login!
                                </span>
                    </FormControl>
                    }
                    <br /><br />
                    <Button variant="contained" color="primary" onClick={() => registerClickHandler()}>REGISTER</Button>
                </TabContainer>
                }
            </Modal>l̥
        </div>
    )

}
export default Header
