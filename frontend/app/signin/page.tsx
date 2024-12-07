import AuthForm from "../components/AuthForm";

export default function SigninPage() {
  return (
    <AuthForm
      type="signin"
      endpoint="/auth/signin"
      redirectTo="/documents"
      linkText="Don't have an account?"
      linkHref="/signup"
    />
  );
}
