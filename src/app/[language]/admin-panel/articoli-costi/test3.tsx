
import React from "react";
import { Controller, useForm } from "react-hook-form";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    control,
  } = useForm();

  const handleRegistration = (data: any) => {
    console.log(data);
  };

  const handleError = (errors: any) => {
    console.log(errors);
  };

  const registerOptions = {
    name: { required: "Il nome è obbligatorio" },
    email: { required: "L'email è obbligatoria" },
    password: {
      required: "La password è obbligatoria",
      minLength: {
        value: 8,
        message: "La password deve contenere almeno 8 caratteri",
      },
    },
    role: { required: "Role is required" },
  };

  const selectOptions: Array<{value:string, label:string}> = [
    { value: "student", label: "Student" },
    { value: "developer", label: "Developer" },
    { value: "manager", label: "Manager" },
  ];

  return (
    <form onSubmit={handleSubmit(handleRegistration, handleError)}>
      <div>
        <label>Nome</label>
        <input type="text" {...register("name", registerOptions.name)} />
        {errors.name && (
          <small className="text-danger">
            {errors.name.message?.toString()}
          </small>
        )}
      </div>

      <div>
        <label>Email</label>
        <input type="email" {...register("email", registerOptions.email)} />
        {errors.email && (
          <small className="text-danger">
            {errors.email.message?.toString()}
          </small>
        )}
      </div>

      <div>
        <label>Password</label>
        <input
          type="password"
          {...register("password", registerOptions.password)}
        />
        {errors.password && (
          <small className="text-danger">
            {errors.password.message?.toString()}
          </small>
        )}
      </div>
      <Controller
        name="role"
        control={control}
        defaultValue=""
        rules={registerOptions.role}
        render={({ field }) => (
          <select {...field}>
            {selectOptions.map(it=><option key={it.value} value={it.value}>{it.label}</option>)}
          </select>
        )}
      />
      {errors.role && (
        <small className="text-danger">{errors.role.message?.toString()}</small>
      )}

      <button type="submit">Invia</button>
    </form>
  );
};

export default RegisterForm;
