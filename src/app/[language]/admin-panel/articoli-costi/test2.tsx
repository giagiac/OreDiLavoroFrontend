import React from "react";
import { useForm } from "react-hook-form";

const RegisterForm = () => {
  const { register, handleSubmit } = useForm();
  const handleRegistration = (data:any) => console.log(data);
  const handleError = (data:any) => console.log(data);

  const textField = register('name', { required: true })

  return (
    <form onSubmit={handleSubmit(handleRegistration, handleError)}>
      <div>
        <label>Name</label>
        <input {...textField} />
      </div>
      <div>
        <label>Email</label>
        <input type="email" {...register('email')} />
      </div>
      <div>
        <label>Password</label>
        <input type="password" {...register('password')} />
      </div>
      <button>Submit</button>
    </form>
  );
};
export default RegisterForm;