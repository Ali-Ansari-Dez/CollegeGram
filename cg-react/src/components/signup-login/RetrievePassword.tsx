import Box from "./BoxComponent";
import InputField from "../TextInputComponent";
import UserSvg from "../../assets/icons/user.svg";
import CustomButtonH36 from "../ButtonComponentH36";
import Label from "../Label";
import { Navigate, NavLink, useNavigate } from "react-router-dom";
import BoxTitle from "./BoxTitle";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState } from "react";

const RetrievePassSchema = z.object({
  username: z
    .string({ required_error: "نام کاربری مورد نیاز است" })
    .min(3, { message: "نام کاربری باید حداقل 3 کاراکتر باشد" }),
});

interface RetrievePassFormData {
  username: string;
}

const RetrievePassword: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RetrievePassFormData>({
    resolver: zodResolver(RetrievePassSchema),
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  const onSubmit = async (data: RetrievePassFormData) => {
    setLoading(true);
    setMessage(null); 

    try {
      const response = await fetch('http://5.34.194.155:4000/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Failed to send password reset link');
      }

      const result = await response.json();
      setMessage(result.message || 'Password reset link sent successfully');
      navigate("/checkYourEmail");
    } catch (error) {
      if (error instanceof Error) {
        setMessage(error.message || 'An error occurred');
      } else {
        setMessage('An unexpected error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="backImg flex min-h-screen items-center justify-center">
      <Box height="w-full">
        <div className="rahnema-logo absolute top-10"></div>
        <div className="mt-14">
          <BoxTitle text={"بازیابی رمز عبور"}></BoxTitle>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col items-center"
          >
            <Label
              text={"لطفا نام کاربری یا ایمیل خودتون رو وارد کنید"}
            ></Label>
            <InputField
              type="text"
              placeholder="نام کاربری یا ایمیل"
              name="username"
              error={errors.username?.message}
              iconsrc={UserSvg}
              register={register}
            />
            <div className="flex items-center justify-start gap-x-6">
              <CustomButtonH36
                text={"ارسال لینک بازیابی رمز عبور"}
                styling="bg-okhra-200 text-sm"
              ></CustomButtonH36>
              <NavLink
                to="/"
                className="flex content-end items-center align-text-bottom"
              >
                انصراف
              </NavLink>
            </div>
          </form>
        </div>
      </Box>
    </div>
  );
};

export default RetrievePassword;
