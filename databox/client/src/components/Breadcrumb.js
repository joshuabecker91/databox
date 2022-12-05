import React, { useState } from "react";
// import { File } from "../helpers";

const Breadcrumb = ({ file, currentDirectory, openDirectory, moveFiles }) => {
  const [dragover, setDragover] = useState(false);

  const file_id = file?.id ?? null;
  const is_current_directory = (file?.id ?? null) === currentDirectory;
  const color = is_current_directory ? "text-black" : "text-gray-500";
  const underline = is_current_directory ? "" : "hover:underline";

  const allowDrop = (e) => {
    e.preventDefault();
    setDragover(true);
  };
  const drag = (e) => {
    if (file_id) {
      e.dataTransfer.setData("file_id", file_id);
    }
  };
  const drop = (e) => {
    e.preventDefault();
    const child_file_id = e.dataTransfer.getData("file_id");
    if (child_file_id) {
      moveFiles([child_file_id], file_id);
    }
    setDragover(false);
  };

  // const Databox = {
  //   color: "#f5f5f5",
  // };

  return (
    <div className="flex items-center">
      <div className="relative font-light mx-[4px] py-[2px] px-[4px]">
        <div
          className="pointer-events-none absolute inset-[1px] z-20"
          style={{ border: dragover ? "2px solid blue" : "none" }}
        ></div>
        <button
          draggable={file_id !== null}
          onDragStart={drag}
          onDrop={drop}
          onDragOver={allowDrop}
          onDragLeave={() => setDragover(false)}
          disabled={is_current_directory}
          className={`${underline} ${color}`}
          onClick={() => openDirectory(file?.id ?? null)}
        >
          {file?.name ?? "Databox"}
        </button>
      </div>

      {!is_current_directory && <span className={color}>/</span>}
    </div>
  );
};

export default Breadcrumb;
