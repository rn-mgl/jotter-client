import { useGlobalContext } from "@/context";
import axios from "axios";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineFileImage,
  AiOutlineUser,
} from "react-icons/ai";
import { BiImage } from "react-icons/bi";

interface EditProfileProps {
  handleCanEditProfile: () => void;
}

interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
  const [user, setUser] = React.useState<UserProps>({
    email: "",
    first_name: "",
    last_name: "",
    image: "",
  });

  const { url } = useGlobalContext();

  const handleUserData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const name = e.target.name;
    const value = e.target.value;

    setUser((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
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
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 left-0 z-50 backdrop-blur-md animate-fadeIn p-4
        bg-complementary/30 t:p-8"
    >
      <div className="w-full h-fit my-auto flex flex-col bg-primary rounded-md border-[1px] max-w-screen-t">
        <div className="flex flex-row p-2 text-accent w-full items-center justify-between text-xl border-b-2 t">
          <div>
            <AiOutlineUser />
          </div>
          <button
            onClick={props.handleCanEditProfile}
            className="hover:bg-accent/10 p-2 rounded-full transition-all"
          >
            <AiOutlineClose />
          </button>
        </div>

        <form className="w-full h-full flex flex-col font-poppins p-2 gap-6">
          <div className="w-full flex flex-col gap-2">
            <div
              className="w-full border-accent border-[1px] aspect-square flex flex-col 
                        items-center justify-center bg-cover bg-center text-accent/30"
            >
              <BiImage className="text-4xl" />
            </div>
            <div className="w-full flex flex-row items-center justify-between text-accent">
              <label>
                <input
                  type="file"
                  accept="image/*"
                  name=""
                  id=""
                  className="hidden"
                />
                <AiOutlineFileImage className="text-xl" />
              </label>
            </div>
          </div>

          <input
            type="text"
            placeholder="First Name"
            name="first_name"
            id="first_name"
            value={user.first_name}
            onChange={(e) => handleUserData(e)}
            className="w-full border-b-[1px] border-accent p-2 bg-transparent outline-none"
          />

          <input
            type="text"
            placeholder="Last Name"
            name="last_name"
            id="last_name"
            value={user.last_name}
            onChange={(e) => handleUserData(e)}
            className="w-full border-b-[1px] border-accent p-2 bg-transparent outline-none"
          />

          <button className="w-full p-2 bg-complementary font-bold mt-2 text-primary hover:shadow-[0.2rem_0.2rem_#A67C58]">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditProfile;
