"use client";

import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { getFirebaseAuth } from "@/services/firebase-service";
import { useRouter } from "next/navigation";

const { Form, Button, Spinner } = require("react-bootstrap");

const initialFormData = {
  email: "",
  password: "",
};

const SignUpForm = () => {
  const router = useRouter();

  // states
  const [formData, setFormData] = useState(initialFormData);
  const [submittingForm, setSubmittingForm] = useState(false);

  const inputChangeHandler = (fieldName, event) =>
    setFormData((currFormData) => ({
      ...currFormData,
      [fieldName]: event.target.value,
    }));

  const formSubmitHandler = (event) => {
    event.preventDefault();

    const signUp = async () => {
      setSubmittingForm(true);
      // TODO: validate data
      try {
        const auth = getFirebaseAuth();
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          formData.email,
          formData.password
        );
        const user = userCredential.user;
        const idToken = await user.getIdToken();
        localStorage.setItem("idToken", idToken);
        setSubmittingForm(false);
        router.push("/");
      } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        // TODO: show error message
      }
    };

    signUp();
  };

  return (
    <Form onSubmit={formSubmitHandler}>
      <Form.Group className="mb-3">
        <Form.Label>Email address</Form.Label>
        <Form.Control
          type="email"
          placeholder="Enter email"
          onChange={inputChangeHandler.bind(this, "email")}
        />
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Password"
          onChange={inputChangeHandler.bind(this, "password")}
        />
      </Form.Group>

      <Button variant="primary" type="submit" disabled={submittingForm}>
        {submittingForm ? (
          <Spinner animation="border" variant="light" size="sm" />
        ) : (
          "Submit"
        )}
      </Button>
    </Form>
  );
};

export default SignUpForm;
