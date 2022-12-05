import { useEffect, useState } from "react";
// import { File } from "../../helpers";
import SidebarBrowserItem from "./SidebarBrowserItem";

const SidebarBrowser = ({
  files,
  currentDirectory,
  openDirectory,
  moveFiles,
}) => {
  const [folders, setFolders] = useState([]);

  useEffect(() => {
    setFolders(
      files
        .filter((file) => file.type === "directory")
        .map((file) => [file, false])
    );
  }, [files]);

  const top_level_folders = files.filter(
    (file) => file.parent === null && file.type === "directory"
  );

  return (
    <div className="h-full bg-white">
      <div className="flex h-full flex-col overflow-auto">
        {top_level_folders.map((file) => (
          <SidebarBrowserItem
            file={file}
            files={files}
            folders={folders}
            indentLevel={0}
            key={file.id}
            openDirectory={openDirectory}
            currentDirectory={currentDirectory}
            moveFiles={moveFiles}
          />
        ))}
      </div>{" "}
    </div>
  );
};

export default SidebarBrowser;
