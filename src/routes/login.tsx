import { createFileRoute, Navigate, useRouteContext } from "@tanstack/react-router";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AuthSplash, LoginScreen } from "@/components/login-screen";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  const { user, isPending } = useCurrentUserState();
  const { sessionUser } = useRouteContext({ from: "__root__" });
  if (user) return <Navigate to="/" />;
  if (isPending && sessionUser) return <AuthSplash />;
  return <LoginScreen />;
}
