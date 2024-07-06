import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineFileImage,
  AiOutlineUser,
} from "react-icons/ai";
import { BiImage } from "react-icons/bi";

interface EditProfileProps {
  handleCanEditProfile: () => void;
  getUserData: () => Promise<void>;
}

interface UserProps {
  first_name: string;
  last_name: string;
  email: string;
  image: string;
}

interface SelectedFileProps {
  raw: File | null;
  url: string;
}

const EditProfile: React.FC<EditProfileProps> = (props) => {
  const [user, setUser] = React.useState<UserProps>({
    email: "",
    first_name: "",
    last_name: "",
    image: "",
  });
  const [selectedFile, setSelectedFile] = React.useState<SelectedFileProps>();

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

  const removeSelectedFile = () => {
    setSelectedFile({ url: "", raw: null });
  };

  const removeUploadedFile = () => {
    setUser((prev) => {
      return {
        ...prev,
        image: "",
      };
    });
  };

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (!file || !file.length) {
      return;
    }

    const raw = file[0];

    const url = URL.createObjectURL(raw);

    setSelectedFile({ url, raw });
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

  const editProfile = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const formData = new FormData();
        formData.append("first_name", user.first_name);
        formData.append("last_name", user.last_name);
        formData.append("existing_image", user.image);
        formData.append("_method", "PATCH");
        if (selectedFile?.raw) {
          formData.append("image", selectedFile?.raw);
        }

        const { data: updated } = await axios.post(`${url}/profile`, formData, {
          headers: {
            "X-XSRF-TOKEN": getCookie("XSRF-TOKEN"),
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        if (updated.success) {
          props.getUserData();
          props.handleCanEditProfile();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

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

        <form
          onSubmit={(e) => editProfile(e)}
          className="w-full h-full flex flex-col font-poppins p-2 gap-6"
        >
          <div className="w-full flex flex-col gap-2">
            <div
              style={{
                backgroundImage: selectedFile?.url
                  ? `url(${selectedFile?.url})`
                  : user.image
                  ? `url(${user.image})`
                  : "",
              }}
              className="w-full border-accent border-[1px] aspect-square flex flex-col 
                        items-center justify-center bg-cover bg-center text-accent/30"
            >
              {selectedFile?.raw || user?.image ? null : (
                <BiImage className="text-4xl" />
              )}
            </div>

            <div className="w-full flex flex-row items-center justify-between text-accent">
              <p>Select Image</p>
              <div className="flex flex-row gap-2 items-center justify-center text-xl">
                {selectedFile?.raw ? (
                  <button
                    type="button"
                    onClick={removeSelectedFile}
                    title="Remove Photo"
                    className="text-accent"
                  >
                    <AiOutlineClose />
                  </button>
                ) : user?.image ? (
                  <button
                    type="button"
                    onClick={removeUploadedFile}
                    title="Remove Photo"
                    className="text-accent"
                  >
                    <AiOutlineDelete />
                  </button>
                ) : null}

                <label>
                  <input
                    type="file"
                    accept="image/*"
                    name=""
                    id=""
                    className="hidden"
                    onChange={(e) => handleSelectedFile(e)}
                  />
                  <AiOutlineFileImage />
                </label>
              </div>
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
