"use client";
import { useGlobalContext } from "@/context";
import EditProfile from "@/src/components/profile/EditProfile";
import axios from "axios";
import React from "react";
import { AiOutlineEdit } from "react-icons/ai";

interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}

const Profile = () => {
  const [user, setUser] = React.useState<UserProps>({
    email: "",
    first_name: "",
    last_name: "",
    image: "",
  });
  const [canEditProfile, setCanEditProfile] = React.useState(false);

  const { url } = useGlobalContext();

  const handleCanEditProfile = () => {
    setCanEditProfile((prev) => !prev);
  };

  const getUserData = React.useCallback(async () => {
    try {
      const { data: user } = await axios.get(`${url}/profile`, {
        withCredentials: true,
      });

      if (user) {
        setUser(user);
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
        <div className="w-full flex flex-col h-full items-center justify-start gap-6 max-w-screen-ll t:flex-row t:gap-10">
          {canEditProfile ? (
            <EditProfile
              getUserData={getUserData}
              handleCanEditProfile={handleCanEditProfile}
            />
          ) : null}

          <div
            style={{ backgroundImage: user.image && `url(${user.image})` }}
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
                {user.first_name}
              </p>
              <p className="font-poppins text-lg font-light">
                {user.last_name}
              </p>
            </div>

            <div className="w-full h-[1px] bg-complementary/30"></div>

            <p className="font-poppins text-sm font-light italic">
              {user.email}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
