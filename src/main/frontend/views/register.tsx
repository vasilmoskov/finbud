import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useForm } from "@vaadin/hilla-react-form";
import {
  Button,
  Dialog,
  HorizontalLayout,
  Icon,
  Notification,
  PasswordField,
  TextField,
  VerticalLayout,
} from "@vaadin/react-components";
import RegisterUserDto from "Frontend/generated/com/example/application/dto/RegisterUserDto";
import RegisterUserDtoModel from "Frontend/generated/com/example/application/dto/RegisterUserDtoModel";
import { UserEndpoint } from "Frontend/generated/endpoints";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const config: ViewConfig = {
  menu: { exclude: true },
};

export default function RegisterView() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [notificationOpened, setNotificationOpened] = useState(false);

  const { model, addValidator, field, submit, invalid, submitting } =
    useForm(RegisterUserDtoModel, {
      onSubmit: async (u) => {
        try {
          await UserEndpoint.register(u);
          navigate("/login");
        } catch (error) {
            setErrorMessage("Username already exists. Please choose another one.");
            setNotificationOpened(true);
          }
      },
    });

  useEffect(() => {
    addValidator({
      message: "Passwords don't match",
      validate: (value: RegisterUserDto) => {
        if (value.password != value.confirmPassword) {
          return [{ property: model.password }];
        }

        return [];
      },
    });
  }, []);

  const navigateToLogin = () => {
    navigate("/login");
  }

  return (
    <>
          <Notification
            theme="error"
            duration={3000}
            position="top-center"
            opened={notificationOpened}
            onOpenedChanged={(e) => {
              setNotificationOpened(e.detail.value);
            }}
          >
              <HorizontalLayout theme="spacing" style={{ alignItems: 'center' }}>
          <div>{errorMessage}</div>
          <Button
            theme="tertiary-inline"
            onClick={() => {
              setNotificationOpened(false);
            }}
            aria-label="Close"
          >
            <Icon icon="lumo:cross" />
          </Button>
        </HorizontalLayout>
      </Notification>

      <Dialog
        headerTitle='Register'
        opened
        footerRenderer={() => (
          <>
            <Button onClick={() => navigateToLogin()}>Go to Login</Button>
            <Button theme="primary" onClick={submit} disabled={invalid || submitting}>
              Register
            </Button>
          </>
        )}
      >
        <VerticalLayout style={{ alignItems: 'stretch', width: '18rem', maxWidth: '100%' }}>
          <TextField label="First Name" {...field(model.firstName)} />
          <TextField label="Last Name" {...field(model.lastName)} />
          <TextField label="Username" {...field(model.username)} />
          <PasswordField label="Password" {...field(model.password)} />
          <PasswordField
            label="Confirm Password"
            {...field(model.confirmPassword)}
          />
        </VerticalLayout>
      </Dialog>
    </>
  );
}
