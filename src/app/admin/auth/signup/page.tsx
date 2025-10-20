"use client";

import "../style.scss";
import "./style.scss";

import React from "react";
import Big from "src/components/common/logo/big";
import Button from "src/components/ui/button";
import TextField from "src/components/ui/textField";
import useSignup from "src/hooks/auth/useSignup";

const SignUp = () => {
    const {value, onChange, handleSubmit, canSubmit, isSubmitting} = useSignup();

    return (
        <main className="auth-main">
            <div className="auth-container">
                <div className="auth-logo">
                    <Big/>
                </div>

                <form
                    className="auth-textfield flex flex-col gap-4"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleSubmit();
                    }}
                >
                    <TextField
                        label="Email"
                        name="email"
                        value={value.email}
                        placeholder="Enter your email"
                        onChange={onChange}
                    />
                    <TextField
                        label="Name"
                        name="name"
                        value={value.name}
                        placeholder="Enter your name"
                        onChange={onChange}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={value.password}
                        placeholder="Enter your password"
                        onChange={onChange}
                    />

                    <div className="button-container">
                        <Button
                            style={{width: "100%"}}
                            type="submit"
                            disabled={!canSubmit || isSubmitting}
                        >
                            {isSubmitting ? "Signing up..." : "Sign Up"}
                        </Button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default SignUp;