import { ViewConfig } from "@vaadin/hilla-file-router/types.js";
import { useForm } from "@vaadin/hilla-react-form";
import {
  Button,
  EmailField,
  PasswordField,
  TextField,
  VerticalLayout,
} from "@vaadin/react-components";
import RegisterUserDto from "Frontend/generated/com/example/application/dto/RegisterUserDto";
import RegisterUserDtoModel from "Frontend/generated/com/example/application/dto/RegisterUserDtoModel";
import { UserEndpoint } from "Frontend/generated/endpoints";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export const config: ViewConfig = {
  menu: { exclude: true },
};

export default function RegisterView() {
  const navigate = useNavigate();

  const { model, addValidator, field, submit, invalid, submitting, value } =
    useForm(RegisterUserDtoModel, {
      onSubmit: async (u) => {
        await UserEndpoint.register(u);
        navigate("/login");
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
  });

  return (
    <>
      <VerticalLayout theme="spacing padding">
        <TextField label="First Name" {...field(model.firstName)} />
        <TextField label="Last Name" {...field(model.lastName)} />
        <TextField label="Username" {...field(model.username)} />
        <EmailField label="Email" {...field(model.email)} />
        <PasswordField label="Password" {...field(model.password)} />
        <PasswordField
          label="Confirm Password"
          {...field(model.confirmPassword)}
        />

        <Button 
        disabled={invalid || submitting} 
        onClick={submit}>
          Register
        </Button>
      </VerticalLayout>
    </>
  );
}
