"use client";

import ChangePassword from "@/src/components/profile/ChangePassword";
import EditProfile from "@/src/components/profile/EditProfile";
import axios from "axios";
import { useSession } from "next-auth/react";
import React from "react";
import { AiOutlineEdit, AiOutlineLock } from "react-icons/ai";

interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}

const Profile = () => {
  const [userData, setUserData] = React.useState<UserProps>({
    email: "",
    first_name: "",
    last_name: "",
    image: "",
  });
  const [canEditProfile, setCanEditProfile] = React.useState(false);
  const [canChangePassword, setCanChangePassword] = React.useState(false);

  const url = process.env.NEXT_PUBLIC_API_URL;
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const handleCanEditProfile = () => {
    setCanEditProfile((prev) => !prev);
  };

  const handleCanChangePassword = () => {
    setCanChangePassword((prev) => !prev);
  };

  const getUserData = React.useCallback(async () => {
    try {
      const { data: userData } = await axios.get(`${url}/profile`, {
        headers: { Authorization: `Bearer ${user?.token}` },
        withCredentials: true,
      });

      if (userData) {
        setUserData(userData);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  React.useEffect(() => {
    getUserData();
  }, [getUserData]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-start relative">
        <div className="w-full flex flex-col h-full items-center justify-center gap-6 max-w-(--breakpoint-ll) t:flex-row t:gap-10">
          {canEditProfile ? (
            <EditProfile
              getUserData={getUserData}
              handleCanEditProfile={handleCanEditProfile}
            />
          ) : null}

          {canChangePassword ? (
            <ChangePassword handleCanChangePassword={handleCanChangePassword} />
          ) : null}

          <div
            style={{
              backgroundImage: userData.image && `url(${userData.image})`,
            }}
            className="aspect-square bg-accent/30 w-full ls:max-w-96 bg-center bg-cover"
          ></div>

          <div className="w-full h-[1px] bg-complementary/30 t:w-[1px] t:h-full t:min-h-64 ls:min-h-96"></div>

          <div className="w-full flex flex-col gap-6 h-full aspect-square ls:max-w-96 relative">
            <button
              onClick={handleCanEditProfile}
              className="absolute bottom-0 right-0 text-accent p-1 border-[1px] hover:shadow-[0.2rem_0.2rem_#A67C58]
                        transition-all border-accent"
            >
              <AiOutlineEdit />
            </button>
            <div className="w-full ">
              <p className="font-cormorant text-4xl font-extrabold">
                {userData.first_name}
              </p>
              <p className="font-poppins text-lg font-light">
                {userData.last_name}
              </p>
            </div>

            <div className="w-full h-[1px] bg-complementary/30"></div>

            <p className="font-poppins text-sm font-light italic">
              {userData.email}
            </p>

            <button
              onClick={handleCanChangePassword}
              className="font-poppins text-accent font-light mt-auto mr-auto flex 
                        flex-row gap-1 items-center justify-center hover:underline hover:underline-offset-2"
            >
              change password <AiOutlineLock />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
