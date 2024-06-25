import React from "react";

interface NoteProps {
  title: string;
  content: string;
  file_content: string | null;
}

const Note: React.FC<NoteProps> = (props) => {
  return (
    <div
      className="w-full cursor-pointer border-[1px] border-complementary hover:shadow-[0.2rem_0.2rem_#0D0D0D] transition-all
                font-poppins flex flex-col gap-4 bg-primary"
    >
      <p className="font-bold p-2 border-b-[1px] border-accent">
        {props.title}
      </p>

      <p className="text-sm p-2">{props.content}</p>
    </div>
  );
};

export default Note;
