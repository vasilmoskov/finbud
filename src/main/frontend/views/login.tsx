import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useSignal } from "@vaadin/hilla-react-signals";
import {
  LoginI18n,
  LoginOverlay,
  LoginOverlayElement,
} from "@vaadin/react-components/LoginOverlay.js";
import { useAuth } from "Frontend/util/auth.js";
import { Link } from "react-router-dom";

export const config: ViewConfig = {
  menu: { exclude: true },
};

const loginI18n: LoginI18n = {
  ...new LoginOverlayElement().i18n,
  header: { title: "FinBud", description: "The manager for your finances" },
};

export default function LoginView() {
  const { login } = useAuth();
  const loginError = useSignal(false);

  return (
    <LoginOverlay
      opened
      error={loginError.value}
      noForgotPassword
      i18n={loginI18n}
      onLogin={async ({ detail: { username, password } }) => {
        loginError.value = false;

        const { defaultUrl, error, redirectUrl } = await login(
          username,
          password
        );

        if (error) {
          loginError.value = true;
        } else {
          const url = redirectUrl ?? defaultUrl ?? "/";
          const path = new URL(url, document.baseURI).pathname;
          document.location = path;
        }
      }}
    >
      <p slot="footer" className="text-center">
        <Link to="/register">Don't have an account? Register</Link>
      </p>
    </LoginOverlay>
  );
}
