"use client";

import { getCSRFToken } from "@/src/utils/token";
import axios from "axios";
import { useSession } from "next-auth/react";

import Image from "next/image";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineFileImage,
  AiOutlineSave,
} from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";

interface NoteModalProps {
  toggleModal: () => void;
  getNotes: () => Promise<void>;
}

interface NoteData {
  title: string;
  content: string;
}

interface SelectedFileProps {
  url: string;
  raw: File | null;
}

const NoteModal: React.FC<NoteModalProps> = (props) => {
  const [noteData, setNoteData] = React.useState<NoteData>({
    title: "",
    content: "",
  });
  const [selectedFile, setSelectedFile] = React.useState<SelectedFileProps>();
  const [isLoading, setIsLoading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { data: session } = useSession({ required: true });
  const user = session?.user;
  const url = process.env.NEXT_PUBLIC_API_URL;

  const handleNoteData = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const name = e.target.name;
    const value = e.target.value;

    setNoteData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  const handleSelectedFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files;

    if (!file || !file.length) {
      return;
    }

    const fileData = file[0];
    const url = URL.createObjectURL(fileData);

    setSelectedFile({ url, raw: fileData });
  };

  const removeSelectedFile = () => {
    setSelectedFile({ url: "", raw: null });
    if (fileRef.current) {
      fileRef.current.files = null;
      fileRef.current.value = "";
    }
  };

  const saveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const token = await getCSRFToken();

      const formData: any = new FormData();
      formData.set("title", noteData.title ?? null);
      formData.set("content", noteData.content ?? null);
      formData.set("file_content", selectedFile?.raw ?? null);

      if (token.csrf_token && user?.token) {
        const { data: note } = await axios.post(`${url}/note`, formData, {
          headers: {
            "X-CSRF-TOKEN": token.csrf_token,
            "Content-Type": "mutipart/form-data",
            Authorization: `Bearer ${user.token}`,
          },
          withCredentials: true,
        });

        if (note) {
          props.getNotes();
          props.toggleModal();
        }
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 left-0 z-50 backdrop-blur-md animate-fadeIn p-4
                bg-complementary/30 t:p-8"
    >
      <div className="w-full h-full flex flex-col bg-primary rounded-md border-[1px] max-w-(--breakpoint-t)">
        <div className="w-full flex flex-row items-center justify-between font-poppins p-2 border-b-2 text-accent">
          <p className="font-bold flex flex-row gap-2 items-center justify-start text-xl">
            <CiStickyNote />
          </p>
          <button
            onClick={props.toggleModal}
            className="hover:bg-complementary/10 p-2 rounded-full transition-all"
          >
            <p>
              <AiOutlineClose />
            </p>
          </button>
        </div>

        <form
          id="createNoteForm"
          className="w-full h-full flex flex-col font-poppins"
          onSubmit={(e) => saveNote(e)}
        >
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Title..."
            className="p-2 px-4 font-semibold bg-transparent outline-hidden"
            onChange={(e) => handleNoteData(e)}
            value={noteData.title}
          />
          <textarea
            name="content"
            id="content"
            className="w-full h-full resize-none rounded-md focus:outline-hidden p-4 bg-transparent text-sm"
            placeholder="Jot down..."
            onChange={(e) => handleNoteData(e)}
            value={noteData.content}
          ></textarea>

          {selectedFile?.raw ? (
            <div
              className="w-full animate-fadeIn p-2 bg-accent/10 rounded-md max-w-72 flex flex-col items-end justify-center
                        relative t:max-w-96 t:w-fit gap-2"
            >
              <Image
                src={selectedFile.url}
                alt="selectedFile"
                className="rounded-md"
                width={400}
                height={400}
              />
              <button
                type="button"
                onClick={removeSelectedFile}
                title="Remove File"
                className="text-accent hover:bg-accent hover:text-primary transition-all p-1 rounded-full"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ) : null}

          <div className="w-full p-2 border-t-2 font-medium flex flex-row items-center justify-between">
            <label
              htmlFor="file_content"
              title="Upload Image"
              className="w-8 h-8 text-accent hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
                        cursor-pointer"
            >
              <input
                type="file"
                accept="image/*"
                name="file_content"
                id="file_content"
                className="hidden"
                onChange={(e) => handleSelectedFile(e)}
                ref={fileRef}
              />
              <AiOutlineFileImage />
            </label>

            <button
              disabled={isLoading}
              title="Save"
              className="w-8 h-8 text-accent hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
                        disabled:text-neutral-500 cursor-pointer"
            >
              <AiOutlineSave />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
