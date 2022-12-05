import { useState } from "react";
import { FaChevronRight } from "react-icons/fa";
// import { File } from "../../helpers";
import AnimatedDropdown from "../utilities/AnimatedDropdown";
import SidebarBrowser from "./SidebarBrowser";

const AllFilesMenuItem = ({
  title,
  files,
  currentDirectory,
  openDirectory,
  moveFiles,
}) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="flex cursor-pointer flex-col">
      <div
        className="flex flex-row items-center font-light gap-[5px] px-[20px] py-[10px]"
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <FaChevronRight
          size={10}
          className="transition-transform"
          style={{
            transform: isOpen ? "rotate(90deg)" : "rotate(0deg)",
          }}
        />
        {title}
      </div>
      <AnimatedDropdown
        isOpen={isOpen}
        maxHeight="250px"
        border="border-y border-gray-300"
        dragOutline={true}
      >
        <SidebarBrowser
          files={files}
          openDirectory={openDirectory}
          currentDirectory={currentDirectory}
          moveFiles={moveFiles}
        />
      </AnimatedDropdown>
    </div>
  );
};

export default AllFilesMenuItem;
