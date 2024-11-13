
import { AuthErrorCodes } from "firebase/auth"

export const getErrorCode = (code) => {
    switch(code) {
        case AuthErrorCodes.INVALID_LOGIN_CREDENTIALS:
            return 'Invalid Credentials';
        case AuthErrorCodes.INVALID_EMAIL:
            return 'Please provide a correct email'
        default:
            return "There was an error"
    }
}