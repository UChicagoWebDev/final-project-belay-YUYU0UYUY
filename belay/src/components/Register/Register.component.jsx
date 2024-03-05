import React, { useState } from 'react'
import {
  Grid,
  Form,
  Segment,
  Header,
  Icon,
  Button,
  Message,
} from 'semantic-ui-react'

import './Register.css'
import { Link, useNavigate } from 'react-router-dom'

const Register = (props) => {
  let user = {
    userName: '',
    email: '',
    password: '',
    confirmpassword: '',
  }

  let errors = []

  const [userState, setuserState] = useState(user)

  const [errorState, seterrorState] = useState(errors)

  const navigate = useNavigate()
  const handleInput = (event) => {
    // get which part changed
    let target = event.target
    setuserState((currentState) => {
      let currentUser = { ...currentState }
      currentState[target.name] = target.value
      return currentUser
    })
  }

  const checkForm = () => {
    if (isFormEmpty()) {
      seterrorState((error) =>
        error.concat({ message: 'please fill in all fields' })
      )
      return false
    } else if (!checkPassword()) {
      seterrorState([{ message: 'Password too short or not match' }])
      return false
    }
    return true
  }

  const isFormEmpty = () => {
    return (
      !userState.userName.length ||
      !userState.password.length ||
      !userState.confirmpassword.length ||
      !userState.email.length
    )
  }

  const checkPassword = () => {
    if (userState.password.length < 8) {
      return false
    } else if (userState.password !== userState.confirmpassword) {
      return false
    }
    return true
  }

  const onSubmit = (event) => {
    seterrorState([])
    if (checkForm()) {
      // Send user information to backend
      const userInfo = {
        userName: userState.userName,
        email: userState.email,
        password: userState.password,
      }

      fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-Key': '',
        },
        body: JSON.stringify(userInfo),
      })
        .then((response) => {
          return response.json() // Assuming the API returns JSON data
        })
        .then((user) => {
          console.log(user)
          window.localStorage.setItem('chengyu_auth_key', user.authKey)
          console.log(user.userName)
          props.setUser({
            userName: user.userName,
            apiKey: user.authKey,
            userId: user.user_id,
          })
          navigate('/')
        })
        .catch((error) =>
          console.error('There was a problem with your fetch operation:', error)
        )
    } else {
      console.log(errors)
    }
  }

  const formaterrors = () => {
    return errorState.map((error, index) => (
      <p key={index}> {error.message} </p>
    ))
  }

  return (
    <Grid centered className="grid-form ">
      <Grid.Column textAlign="center" style={{ maxWidth: '500px' }}>
        <Header icon as="h2">
          <Icon name="slack" />
          Register
        </Header>
        <Form onSubmit={onSubmit}>
          <Segment stacked>
            <Form.Input // User Name Part
              name="userName"
              value={userState.userName}
              icon="user"
              iconPosition="left"
              onChange={handleInput}
              type="text"
              placeholder="User Name"
            />
            <Form.Input // Email Part
              name="email"
              value={userState.email}
              icon="mail"
              iconPosition="left"
              onChange={handleInput}
              type="email"
              placeholder="User Email"
            />
            <Form.Input // Password Part
              name="password"
              value={userState.password}
              icon="lock"
              iconPosition="left"
              onChange={handleInput}
              type="password"
              placeholder="User password"
            />
            <Form.Input // confirm password Part
              name="confirmpassword"
              value={userState.confirmpassword}
              icon="lock"
              iconPosition="left"
              onChange={handleInput}
              type="password"
              placeholder="User password"
            />
          </Segment>
          <Button disabled={errorState.length > 0}>Submit</Button>
        </Form>

        {errorState.length > 0 && (
          <Message error>
            <h3>Errors: </h3>
            {formaterrors()}
          </Message>
        )}

        <Message>
          Already a user? <Link to="/login"> Login </Link>
        </Message>
      </Grid.Column>
    </Grid>
  )
}

export default Register
