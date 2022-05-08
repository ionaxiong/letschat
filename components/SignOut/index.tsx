import { Auth } from "aws-amplify";

async function SignOut() {
  try {
    await Auth.signOut();
  } catch (error) {
    console.log("error signing out: ", error);
  }
}

export default SignOut;
