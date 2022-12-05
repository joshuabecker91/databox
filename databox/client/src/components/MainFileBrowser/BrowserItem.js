import { useState } from "react";
import { FaCheck, FaFile, FaFolder } from "react-icons/fa";

const BrowserItem = ({
  file,
  selectedFiles,
  selectFile,
  openFile,
  moveFiles,
}) => {
  const is_selected = selectedFiles.includes(file.id);
  const some_selected = selectedFiles.length > 0;

  const allowDrop = (e) => {
    e.preventDefault();
    setDragover(true);
  };
  const drag = (e) => {
    setDragging(true);
    e.dataTransfer.setData("file_id", file.id);
  };
  const drop = (e) => {
    e.preventDefault();
    const file_id = e.dataTransfer.getData("file_id");
    if (file_id) moveFiles([file_id], file.id);
    setDragover(false);
    setDragging(false);
  };

  const [dragover, setDragover] = useState(false);
  const [dragging, setDragging] = useState(false);

  const background = dragover && !dragging ? "bg-[rgba(0,97,254,0.16)]" : "";

  // const item_background_colors = {
  //   hover: "#f5f5f5",
  //   selected: "rgba(0,97,254,0.16)",
  // };

  const iconStyle = {
    color: "#a1c9f7",
    fontSize: "2em",
    marginRight: "10px",
  };

  const fileStyle = {
    color: "#a1c9f7",
    fontSize: "1.75em",
    marginRight: "10px",
  };

  const item_selected = `border-l-[2px] pl-[8px]`;
  const item_unselected = `pl-[10px]`;
  const possible_bgs = {
    unselected: "group-hover:bg-[#f5f5f5]",
    selected: "bg-[rgba(0,97,254,0.16)]",
    dragging: is_selected ? "bg-[rgba(0,97,254,0.16)]" : "bg-[#f5f5f5]",
  };
  const selected_class = is_selected ? item_selected : item_unselected;
  const bg = dragging
    ? possible_bgs.dragging
    : is_selected
    ? possible_bgs.selected
    : possible_bgs.unselected;

  return (
    <div
      className={`group flex w-full flex-row items-center ${background}`}
      draggable
      onDragStart={drag}
      onDragOver={allowDrop}
      onDragLeave={() => {
        setDragover(false);
      }}
      onDrop={drop}
      onDragEnd={() => {
        setDragging(false);
      }}
    >
      <div className="p-[10px]">
        <div
          className={`flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-sm border-gray-500 group-hover:border ${
            some_selected && "border"
          } ${
            is_selected
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={() => selectFile(file.id)}
        >
          {is_selected && <FaCheck />}
        </div>
      </div>
      <div
        className={`flex h-full flex-1 cursor-pointer flex-row items-center font-light gap-[10px] border-b border-[rgba(167,146,114,0.2)] border-l-[rgb(0,97,254)] py-[4px] pr-[10px] ${selected_class} ${bg}`}
        onClick={() => openFile(file.id)}
      >
        {file.type === "directory" ? (
          <FaFolder className="drop-shadow-sm" style={iconStyle} />
        ) : (
          <FaFile style={fileStyle} />
        )}
        {file.name}
      </div>
    </div>
  );
};

export default BrowserItem;
