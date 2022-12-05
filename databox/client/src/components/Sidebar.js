import React from "react";
import AllFilesMenuItem from "./components/AllFilesMenu/AllFilesMenuItem";

const Sidebar = () => {
  return (
    <div>
      <div className="flex flex-row items-center text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
        Home
      </div>
      <AllFilesMenuItem
        title={"All Files"}
        files={files.sort(sortFiles)}
        currentDirectory={currentDirectory}
        openDirectory={openDirectory}
        moveFiles={moveFiles}
      />
    </div>
  );
};

export default Sidebar;
