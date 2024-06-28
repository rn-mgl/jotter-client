import { useGlobalContext } from "@/context";
import axios from "axios";
import { getCookie } from "cookies-next";
import React from "react";
import {
  AiOutlineClose,
  AiOutlineFileImage,
  AiOutlineSend,
} from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";

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

const Note: React.FC<NoteProps> = (props) => {
  const [noteData, setNoteData] = React.useState<NoteDataProps>({
    title: "",
    content: "",
    file_content: null,
  });
  const [isLoading, setIsLoading] = React.useState(false);
  const fileRef = React.useRef(null);

  const { url } = useGlobalContext();

  const getNoteData = React.useCallback(async () => {
    try {
      const { data: note } = await axios.get(
        `${url}/note/${props.activeNote}`,
        { withCredentials: true }
      );

      if (note) {
        setNoteData(note);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url, props.activeNote]);

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

  const updateNote = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const { data: token } = await axios.get(`${url}/csrf_token`, {
        withCredentials: true,
      });

      if (token.csrf_token) {
        const { data: note } = await axios.patch(
          `${url}/note/${props.activeNote}`,
          { ...noteData },
          {
            headers: { "X-XSRF-TOKEN": getCookie("XSRF-TOKEN") },
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
      <div className="w-full h-full flex flex-col bg-primary rounded-md border-[1px] max-w-screen-t">
        <div className="flex flex-row p-2 text-accent w-full items-center justify-between text-xl border-b-2 t">
          <div>
            <CiStickyNote />
          </div>
          <button
            onClick={() => props.handleActiveNote(props.activeNote)}
            className="hover:bg-complementary/10 p-2 rounded-full transition-all"
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
            className="p-2 px-4 font-semibold bg-transparent outline-none"
            onChange={(e) => handleNoteData(e)}
          />

          <textarea
            name="content"
            id="content"
            value={noteData.content}
            placeholder="Edit Content..."
            className="bg-transparent p-4 w-full h-full resize-none focus:outline-none text-sm"
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

export default Note;
