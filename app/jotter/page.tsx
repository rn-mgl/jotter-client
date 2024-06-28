"use client";
import { useGlobalContext } from "@/context";
import Note from "@/src/components/jotter/Note";
import NoteCard from "@/src/components/jotter/NoteCard";
import NoteModal from "@/src/components/jotter/NoteModal";
import axios from "axios";
import React from "react";
import { AiOutlinePlus, AiOutlineSearch } from "react-icons/ai";

interface NoteData {
  title: string;
  content: string;
  file_content: string | null;
  updated_at: string;
  id: number;
}

const Jotter = () => {
  const [notes, setNotes] = React.useState<Array<NoteData>>([]);
  const [canCreateNote, setCanCreateNote] = React.useState(false);
  const [activeNote, setActiveNote] = React.useState(0);

  const { url } = useGlobalContext();

  const handleCanCreateNote = () => {
    setCanCreateNote((prev) => !prev);
  };

  const handleActiveNote = (note: number) => {
    setActiveNote((prev) => (note === prev ? 0 : note));
  };

  const getNotes = React.useCallback(async () => {
    try {
      const {
        data: { notes, user },
      } = await axios.get(`${url}/note`, {
        withCredentials: true,
      });
      if (notes) {
        setNotes(notes);
      }
    } catch (error) {
      console.log(error);
    }
  }, [url]);

  const mappedNotes = notes.map((note, index) => {
    return (
      <NoteCard
        handleActiveNote={() => handleActiveNote(note.id)}
        key={index}
        {...note}
      />
    );
  });

  React.useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-start relative">
        <div className="w-full flex flex-col h-full items-center justify-start gap-6 max-w-screen-ll">
          {canCreateNote ? (
            <NoteModal toggleModal={handleCanCreateNote} getNotes={getNotes} />
          ) : null}

          {activeNote ? (
            <Note
              handleActiveNote={handleActiveNote}
              getNotes={getNotes}
              activeNote={activeNote}
            />
          ) : null}

          <div className="flex flex-row items-center justify-center w-full ls:max-w-screen-ml ml-auto relative">
            <input
              type="text"
              className="w-full p-2 bg-primary border-[1px] border-complementary focus:shadow-[0.2rem_0.2rem_#0D0D0D] 
                        outline-none transition-all font-poppins text-sm"
              placeholder="Search..."
            />
            <div className="absolute right-0.5 px-3 py-2.5 bg-primary text-neutral-500">
              <AiOutlineSearch />
            </div>
          </div>

          <div className="flex flex-col w-full items-center justify-start gap-4 t:grid t:grid-cols-2 ls:grid-cols-3 ll:grid-cols-4">
            {mappedNotes}
          </div>

          <button
            onClick={handleCanCreateNote}
            className={`w-8 h-8 text-sm items-start flex flex-row p-2 border-complementary border-[1px]
            hover:shadow-[0.2rem_0.2rem_#0D0D0D] transition-all font-cormorant font-bold fixed bottom-5 right-5
            bg-primary shadow-md ll:bottom-10 ll:right-10
            ${canCreateNote ? "rotate-45" : "rotate-0"}`}
          >
            <AiOutlinePlus />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Jotter;
