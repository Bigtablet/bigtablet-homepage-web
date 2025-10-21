"use client";

import "../style.scss";

import useSignin from "src/hooks/auth/useSignin";
import TextField from "src/components/ui/textField";
import Button from "src/components/ui/button";
import BigLogo from "src/components/common/logo/big";

const Signin = () => {
    const {signinData, handleSigninData, handleKeyDown, submitSigninData, isLoading} = useSignin();

    return (
        <main className="auth-main">
            <div className="auth-container">
                <div className="auth-logo"><BigLogo/></div>
                <div className="auth-textfield">
                    <TextField
                        label="Email"
                        name="email"
                        value={signinData.email}
                        placeholder="Input your Email"
                        onChange={handleSigninData}
                        onKeyDown={handleKeyDown}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        name="password"
                        value={signinData.password}
                        placeholder="Input your Password"
                        onChange={handleSigninData}
                        onKeyDown={handleKeyDown}
                    />
                </div>
                <Button style={{width: "100%"}} children={isLoading ? "Signing in..." : "Signin"}
                        onClick={submitSigninData} disabled={isLoading}/>
            </div>
        </main>
    );
}

export default Signin;