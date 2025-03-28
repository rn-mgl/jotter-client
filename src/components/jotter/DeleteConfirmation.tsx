"use client";

import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";

import React from "react";
import { AiOutlineClose, AiOutlineDelete } from "react-icons/ai";

interface DeleteConfirmationProps {
  activeNote: number;
  handleActiveDeleteConfirmation: () => void;
  handleActiveNote: (activeNote: number) => void;
  getNotes: () => Promise<void>;
}

const DeleteConfirmation: React.FC<DeleteConfirmationProps> = (props) => {
  const url = process.env.NEXT_PUBLIC_API_URL;

  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const deleteNote = async () => {
    try {
      const token = await getCSRFToken();

      if (token.csrf_token && user?.token) {
        const { data: deleted } = await axios.delete(
          `${url}/note/${props.activeNote}`,
          {
            headers: {
              "X-CSRF-TOKEN": token.csrf_token,
              Authorization: `Bearer ${user?.token}`,
            },
            withCredentials: true,
          }
        );

        if (deleted.success) {
          props.handleActiveDeleteConfirmation();
          props.handleActiveNote(props.activeNote);
          props.getNotes();
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
      <div className="w-full h-fit flex flex-col bg-primary rounded-md border-[1px] max-w-(--breakpoint-ml) font-poppins">
        <div className="flex flex-row p-2 text-accent w-full items-center justify-between text-xl border-b-2 t">
          <div>
            <AiOutlineDelete />
          </div>
          <button
            onClick={props.handleActiveDeleteConfirmation}
            className="hover:bg-accent/10 p-2 rounded-full transition-all"
          >
            <AiOutlineClose />
          </button>
        </div>

        <div className="w-full flex flex-col p-4 text-center">
          <p className=" font-bold">
            Are you sure you want to delete this note?
          </p>
        </div>

        <div className="p-2 border-t-2">
          <button
            onClick={deleteNote}
            className="w-full bg-red-500 text-primary p-2 rounded-md font-bold hover:bg-red-700 transition-all"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmation;
