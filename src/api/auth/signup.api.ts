import axios from "axios";
import {SignupType} from "src/types/auth/signup.type";

const SERVER_URL = process.env.NEXT_PUBLIC_SERVER_URL;

export const signupApi = async (signup: SignupType) => await axios.post(`${SERVER_URL}/auth/sign-up`, signup);