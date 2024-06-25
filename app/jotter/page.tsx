"use client";
import { useGlobalContext } from "@/context";
import Note from "@/src/components/jotter/Note";
import NoteModal from "@/src/components/jotter/NoteModal";
import axios from "axios";
import React from "react";
import { AiOutlinePlus } from "react-icons/ai";

interface NoteData {
  title: string;
  content: string;
  file_content: string | null;
}

const Jotter = () => {
  const [notes, setNotes] = React.useState<Array<NoteData>>([]);
  const [canCreateNote, setCanCreateNote] = React.useState(false);

  const { url } = useGlobalContext();

  const handleCanCreateNote = () => {
    setCanCreateNote((prev) => !prev);
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
    return <Note key={index} {...note} />;
  });

  React.useEffect(() => {
    getNotes();
  }, [getNotes]);

  return (
    <div className="w-full h-full flex flex-col items-center justify-start">
      <div className="w-full h-full flex flex-col items-center justify-start relative">
        <div className="w-full flex flex-col h-full items-center justify-start gap-6">
          {canCreateNote ? (
            <NoteModal toggleModal={handleCanCreateNote} getNotes={getNotes} />
          ) : null}

          <div className="flex flex-col w-full items-center justify-start gap-4">
            {mappedNotes}
          </div>

          <button
            onClick={handleCanCreateNote}
            className={`w-8 h-8 text-sm items-start flex flex-row p-2 border-complementary border-[1px]
            hover:shadow-[0.2rem_0.2rem_#0D0D0D] transition-all font-cormorant font-bold absolute bottom-0 right-0
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
