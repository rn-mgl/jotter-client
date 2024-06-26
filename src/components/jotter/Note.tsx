import React from "react";
import { AiOutlineClose } from "react-icons/ai";
import { CiStickyNote } from "react-icons/ci";

interface NoteProps {
  handleActiveNote: () => void;
}

const Note: React.FC<NoteProps> = (props) => {
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
            onClick={props.handleActiveNote}
            className="hover:bg-complementary/10 p-2 rounded-full transition-all"
          >
            <AiOutlineClose />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Note;
