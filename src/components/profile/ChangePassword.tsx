"use client";
import { useGlobalContext } from "@/context";
import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { getCookie } from "cookies-next";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineEye,
  AiOutlineEyeInvisible,
  AiOutlineLock,
} from "react-icons/ai";

interface ChangePasswordProps {
  handleCanChangePassword: () => void;
}

interface PasswordDataProps {
  current_password: string;
  password: string;
  password_confirmation: string;
}

interface PasswordVisibleProps {
  current_password: boolean;
  password: boolean;
  password_confirmation: boolean;
}

const ChangePassword: React.FC<ChangePasswordProps> = (props) => {
  const [passwordData, setPasswordData] = React.useState<PasswordDataProps>({
    current_password: "",
    password: "",
    password_confirmation: "",
  });
  const [passwordVisible, setPasswordVisible] =
    React.useState<PasswordVisibleProps>({
      current_password: false,
      password: false,
      password_confirmation: false,
    });

  const { url } = useGlobalContext();

  const handlePasswordData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setPasswordData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handlePasswordVisible = (
    name: "current_password" | "password" | "password_confirmation"
  ) => {
    setPasswordVisible((prev) => {
      return {
        ...prev,
        [name]: !prev[name],
      };
    });
  };

  const changePassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getCSRFToken();

      if (token.csrf_token) {
        const { data: updated } = await axios.post(
          `${url}/change_password`,
          { ...passwordData, _method: "PATCH" },
          {
            headers: { "X-CSRF-TOKEN": token.csrf_token },
            withCredentials: true,
          }
        );

        if (updated.success) {
          props.handleCanChangePassword();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 left-0 z-50 backdrop-blur-md animate-fadeIn p-4
    bg-complementary/30 t:p-8"
    >
      <div className="w-full h-fit my-auto flex flex-col bg-primary rounded-md border-[1px] max-w-screen-ml">
        <div className="flex flex-row p-2 text-accent w-full items-center justify-between text-xl border-b-2 t">
          <div>
            <AiOutlineLock />
          </div>
          <button
            onClick={props.handleCanChangePassword}
            className="hover:bg-accent/10 p-2 rounded-full transition-all"
          >
            <AiOutlineClose />
          </button>
        </div>

        <form
          onSubmit={(e) => changePassword(e)}
          className="flex flex-col gap-2 w-full items-center justify-center font-poppins p-2"
        >
          <div className="w-full relative flex flex-col items-center justify-center">
            <input
              type={passwordVisible.current_password ? "text" : "password"}
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Current Password"
              name="current_password"
              value={passwordData.current_password}
              onChange={(e) => handlePasswordData(e)}
            />

            <button
              type="button"
              onClick={() => handlePasswordVisible("current_password")}
              className="absolute right-2 top-2/4 -translate-y-2/4 bg-white p-2"
            >
              {passwordVisible.current_password ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>

          <div className="w-full relative flex flex-col items-center justify-center">
            <input
              type={passwordVisible.password ? "text" : "password"}
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="New Password"
              name="password"
              value={passwordData.password}
              onChange={(e) => handlePasswordData(e)}
            />
            <button
              type="button"
              onClick={() => handlePasswordVisible("password")}
              className="absolute right-2 top-2/4 -translate-y-2/4 bg-white p-2"
            >
              {passwordVisible.password ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>

          <div className="w-full relative flex flex-col items-center justify-center">
            <input
              type={passwordVisible.password_confirmation ? "text" : "password"}
              className="w-full p-2 focus:outline-none focus:border-accent border-2 transition-all text-complementary"
              placeholder="Confirm New Password"
              name="password_confirmation"
              value={passwordData.password_confirmation}
              onChange={(e) => handlePasswordData(e)}
            />
            <button
              type="button"
              onClick={() => handlePasswordVisible("password_confirmation")}
              className="absolute right-2 top-2/4 -translate-y-2/4 bg-white p-2"
            >
              {passwordVisible.password_confirmation ? (
                <AiOutlineEyeInvisible />
              ) : (
                <AiOutlineEye />
              )}
            </button>
          </div>

          <button
            className=" w-full p-2 bg-complementary text-primary font-bold font-poppins hover:shadow-[0.3rem_0.3rem_#A67C58]
                    transition-all mt-4"
          >
            Change Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
