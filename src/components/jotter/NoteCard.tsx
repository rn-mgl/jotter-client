import Link from "next/link";
import React from "react";

interface NoteCardProps {
  title: string;
  content: string;
  file_content: string | null;
  updated_at: string;
  id: number;
  handleActiveNote: () => void;
}

const NoteCard: React.FC<NoteCardProps> = (props) => {
  return (
    <div
      onClick={props.handleActiveNote}
      className="w-full cursor-pointer border-[1px] border-complementary hover:shadow-[0.2rem_0.2rem_#0D0D0D] transition-all
                font-poppins flex flex-col gap-4 bg-primary h-48 t:w-80 ls:w-72 ll:w-[21rem] relative group overflow-hidden
                pb-6"
    >
      <div
        className={`font-bold p-2 border-b-[1px] border-accent ${
          props.title ? "text-complementary" : "text-neutral-400"
        }`}
      >
        {props.title || "No Title"}
      </div>

      <p
        className={`text-sm p-2 text-wrap w-full whitespace-pre-wrap break-words truncate ${
          props.content ? "text-complementary" : "text-neutral-400"
        }`}
      >
        {props.content || "No Content"}
      </p>

      <p
        className="text-xs font-poppins font-light text-neutral-500 p-2 pb-1 absolute w-full
                  bottom-0 hidden group-hover:flex group-hover:animate-fadeIn"
      >
        {new Date(props.updated_at).toLocaleDateString()} |{" "}
        {new Date(props.updated_at).toLocaleTimeString()}
      </p>
    </div>
  );
};

export default NoteCard;
