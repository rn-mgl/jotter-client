import axios from "axios";

import Image from "next/image";
import Link from "next/link";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineDelete,
  AiOutlineFileImage,
  AiOutlineSave,
} from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";
import DeleteConfirmation from "./DeleteConfirmation";
import { getCSRFToken } from "@/src/utils/token";
import { useSession } from "next-auth/react";

interface NoteProps {
  activeNote: number;
  handleActiveNote: (activeNote: number) => void;
  getNotes: () => Promise<void>;
}

interface NoteDataProps {
  title: string;
  content: string;
  file_content: string | null;
}

interface SelectedFileProps {
  url: string;
  raw: File | null;
}

const Note: React.FC<NoteProps> = (props) => {
  const [noteData, setNoteData] = React.useState<NoteDataProps>({
    title: "",
    content: "",
    file_content: null,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const [selectedFile, setSelectedFile] = React.useState<SelectedFileProps>();
  const [activeDeleteConfirmation, setActiveDeleteConfirmation] =
    React.useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);
  const { data: session } = useSession({ required: true });
  const user = session?.user;

  const url = process.env.NEXT_PUBLIC_API_URL;

  const getNoteData = React.useCallback(async () => {
    try {
      const token = await getCSRFToken();

      if (token.csrf_token && user?.token) {
        const { data: note } = await axios.get(
          `${url}/note/${props.activeNote}`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${user.token}`,
              "X-CSRF-TOKEN": token.csrf_token,
            },
          }
        );

        if (note) {
          setNoteData(note);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, props.activeNote, user?.token]);

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

  const removeUploadedFile = () => {
    setNoteData((prev) => {
      return {
        ...prev,
        file_content: null,
      };
    });
  };

  const handleActiveDeleteConfirmation = () => {
    setActiveDeleteConfirmation((prev) => !prev);
  };

  const updateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const token = await getCSRFToken();

      const formData: any = new FormData();
      formData.append("title", noteData.title);
      formData.append("content", noteData.content);
      formData.append("_method", "PATCH");

      if (selectedFile?.raw) {
        formData.append("file_content", selectedFile?.raw);
      } else if (noteData.file_content) {
        formData.append("file_content", noteData.file_content);
      }

      if (token.csrf_token && user?.token) {
        const { data: note } = await axios.post(
          `${url}/note/${props.activeNote}`,
          formData,
          {
            headers: {
              "X-CSRF-TOKEN": token.csrf_token,
              Authorization: `Bearer ${user.token}`,
            },
            withCredentials: true,
          }
        );

        if (note.success) {
          props.handleActiveNote(props.activeNote);
          props.getNotes();
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  React.useEffect(() => {
    getNoteData();
  }, [getNoteData]);

  return (
    <div
      className="w-full h-full flex flex-col items-center justify-center fixed top-0 left-0 z-50 backdrop-blur-md animate-fadeIn p-4
            bg-complementary/30 t:p-8"
    >
      <div className="w-full h-full flex flex-col bg-primary rounded-md border-[1px] max-w-(--breakpoint-t)">
        {activeDeleteConfirmation ? (
          <DeleteConfirmation
            handleActiveDeleteConfirmation={handleActiveDeleteConfirmation}
            handleActiveNote={props.handleActiveNote}
            getNotes={props.getNotes}
            activeNote={props.activeNote}
          />
        ) : null}
        <div className="flex flex-row p-2 text-accent w-full items-center justify-between text-xl border-b-2 t">
          <div>
            <CiStickyNote />
          </div>
          <button
            onClick={() => props.handleActiveNote(props.activeNote)}
            className="hover:bg-accent/10 p-2 rounded-full transition-all"
          >
            <AiOutlineClose />
          </button>
        </div>

        <form
          id="updateNoteForm"
          className="w-full h-full flex flex-col font-poppins"
          onSubmit={(e) => updateNote(e)}
        >
          <input
            type="text"
            name="title"
            id="title"
            placeholder="Edit Title..."
            value={noteData.title}
            className="p-2 px-4 font-semibold bg-transparent outline-hidden"
            onChange={(e) => handleNoteData(e)}
          />

          <textarea
            name="content"
            id="content"
            value={noteData.content}
            placeholder="Edit Content..."
            className="bg-transparent p-4 w-full h-full resize-none focus:outline-hidden text-sm"
            onChange={(e) => handleNoteData(e)}
          ></textarea>

          {selectedFile?.raw ? (
            <div
              className="w-full animate-fadeIn p-2 bg-accent/10 rounded-md max-w-60 flex flex-col items-end justify-center
                        relative gap-2"
            >
              <Image
                src={selectedFile.url}
                alt="selectedFile"
                className="rounded-md"
                width={500}
                height={500}
              />
              <button
                type="button"
                onClick={removeSelectedFile}
                title="Remove File"
                className="text-accent hover:bg-accent hover:text-primary transition-all p-1 rounded-full"
              >
                <AiOutlineClose />
              </button>
            </div>
          ) : noteData.file_content ? (
            <div
              className="w-full animate-fadeIn p-2 bg-accent/10 rounded-md max-w-60 flex flex-col items-end justify-center
                    relative gap-2"
            >
              <Link
                href={noteData.file_content}
                className="w-full cursor-pointer group "
                target="_blank"
              >
                <Image
                  src={noteData.file_content}
                  alt="selectedFile"
                  className="rounded-md group-hover:opacity-80 transition-all"
                  width={800}
                  height={800}
                />
              </Link>

              <button
                type="button"
                onClick={removeUploadedFile}
                title="Remove File"
                className=" text-accent hover:bg-accent hover:text-primary transition-all p-1 rounded-full"
              >
                <AiOutlineDelete />
              </button>
            </div>
          ) : null}

          <div className="w-full p-2 border-t-2 font-medium flex flex-row items-center justify-between">
            <div className="flex flex-row gap-2 items-center justify-center text-accent">
              <button
                onClick={handleActiveDeleteConfirmation}
                title="Delete Note"
                type="button"
                className="w-8 h-8  hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
                          cursor-pointer"
              >
                <AiOutlineDelete />
              </button>

              <label
                htmlFor="file_content"
                title="Upload Image"
                className="w-8 h-8  hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
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
            </div>
            <button
              disabled={isLoading}
              title="Save"
              className="w-8 h-8 text-accent hover:bg-accent/30 transition-all rounded-full flex items-center justify-center text-xl
                        disabled:text-neutral-500"
            >
              <AiOutlineSave />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Note;
