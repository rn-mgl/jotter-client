"use client";

import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import { sensitiveHeaders } from "http2";
import React, { LegacyRef, MutableRefObject } from "react";
import {
  AiOutlineClose,
  AiOutlineFileImage,
  AiOutlineSend,
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

const NoteModal: React.FC<NoteModalProps> = (props) => {
  const [noteData, setNoteData] = React.useState<NoteData>({
    title: "",
    content: "",
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const { url } = useGlobalContext();

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

  const saveNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: note } = await axios.post(
          `${url}/note`,
          { ...noteData, file_content: fileRef.current?.value },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
            withCredentials: true,
          }
        );

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
      <div className="w-full h-full flex flex-col bg-primary rounded-md border-[1px] max-w-screen-t">
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
            className="p-2 px-4 font-semibold bg-transparent outline-none"
            onChange={(e) => handleNoteData(e)}
          />
          <textarea
            name="content"
            id="content"
            className="w-full h-full resize-none rounded-md focus:outline-none p-4 bg-transparent text-sm"
            placeholder="Jot down..."
            onChange={(e) => handleNoteData(e)}
          ></textarea>

          <div className="w-full p-2 border-t-2 font-medium flex flex-row items-center justify-between">
            <label
              htmlFor="file_content"
              className="w-8 h-8 text-accent hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl"
            >
              <input
                type="file"
                accept="image/*"
                name="file_content"
                id="file_content"
                className="hidden"
                ref={fileRef}
              />
              <AiOutlineFileImage />
            </label>

            <button
              disabled={isLoading}
              form="createNoteForm"
              className="w-8 h-8 text-accent hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
                        disabled:text-neutral-500"
            >
              <AiOutlineSend />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteModal;
