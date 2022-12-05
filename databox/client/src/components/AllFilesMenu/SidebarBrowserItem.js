import React, { useEffect, useState } from "react";
import { FaChevronRight, FaFolder } from "react-icons/fa";
import { BsDot } from "react-icons/bs";
// import { File } from "../../helpers";
import AnimatedDropdown from "../utilities/AnimatedDropdown";

const SidebarBrowserItem = ({
  file,
  files,
  folders,
  indentLevel = 0,
  currentDirectory,
  openDirectory,
  moveFiles,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [childFolders, setChildFolders] = useState([]);
  const [dragover, setDragover] = useState(false);

  useEffect(() => {
    setChildFolders(
      files.filter((f) => f.parent === file.id && f.type === "directory")
    );
  }, [files, file.id]);

  const background_1 =
    currentDirectory === file.id
      ? "bg-[rgba(0,97,254,0.16)]"
      : "hover:bg-gray-100";
  const background_2 = dragover
    ? "bg-[rgba(0,97,254,0.16)]"
    : "hover:bg-gray-100";
  const background = dragover ? background_2 : background_1;

  const left_margin = 4;

  const allowDrop = (e) => {
    e.preventDefault();
    setDragover(true);
  };
  const drag = (e) => {
    e.dataTransfer.setData("file_id", file.id);
  };
  const drop = (e) => {
    e.preventDefault();
    const file_id = e.dataTransfer.getData("file_id");
    if (file_id) moveFiles([file_id], file.id);
    setDragover(false);
  };

  const iconStyle = {
    color: "#a1c9f7",
    fontSize: "1.5em",
    marginRight: "5px",
  };

  return (
    <div className="flex cursor-pointer flex-col text-xs">
      <div
        className={`flex flex-row items-center gap-[5px] p-[4px] ${background}`}
        style={{ paddingLeft: `${indentLevel * 10 + left_margin}px` }}
        onClick={() => {
          if (currentDirectory === file.id) setIsOpen((prev) => !prev);
          else openDirectory(file.id);
        }}
        draggable
        onDragStart={drag}
        onDragOver={allowDrop}
        onDragLeave={() => setDragover(false)}
        onDrop={drop}
      >
        {childFolders.length > 0 ? (
          <div
            className="p-[5px] hover:bg-gray-300"
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen((prev) => !prev);
            }}
          >
            <FaChevronRight
              size={8}
              className="duration-50 transition-transform"
              style={{
                transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
              }}
            />
          </div>
        ) : (
          <div className="p-[5px]">
            <BsDot size={8} />
          </div>
        )}
        <FaFolder className="drop-shadow-sm" style={iconStyle} />
        {file.name}
      </div>
      <AnimatedDropdown isOpen={isOpen}>
        {childFolders.map((child) => (
          <SidebarBrowserItem
            file={child}
            files={files}
            folders={folders}
            key={child.id}
            indentLevel={indentLevel + 1}
            currentDirectory={currentDirectory}
            openDirectory={openDirectory}
            moveFiles={moveFiles}
          />
        ))}
      </AnimatedDropdown>
    </div>
  );
};

export default SidebarBrowserItem;
