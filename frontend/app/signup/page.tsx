import AuthForm from "../components/AuthForm";

export default function SignupPage() {
  return (
    <AuthForm
      type="signup"
      endpoint={`{${process.env.BACKEND_URL}}auth/signup`}
      redirectTo="/signin"
      linkText="Already have an account?"
      linkHref="/signin/"
    />
  );
}
