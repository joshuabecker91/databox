import { useEffect, useState, Fragment } from "react";
import {
  // FaFile,
  // FaFolder,
  FaSistrix,
  FaRegFolder,
  FaRegFile,
} from "react-icons/fa";
import Breadcrumb from "./components/Breadcrumb";
import AllFilesMenuItem from "./components/AllFilesMenu/AllFilesMenuItem";
import db from "./db-wrapper";
import { getDirectoryPath, sortFiles } from "./helpers";
import MainFileBrowser from "./components/MainFileBrowser/MainFileBrowser";
// import Login from "./components/Login";

import { Menu, Transition } from "@headlessui/react";

function App() {
  const [files, setFiles] = useState([]);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [currentDirectory, setCurrentDirectory] = useState(null);
  const [currentDirectoryFiles, setCurrentDirectoryFiles] = useState([]);

  const openDirectory = (directory_id) => {
    // clear selected files, unless the directory is simply being refreshed
    if (directory_id !== currentDirectory) setSelectedFiles([]);
    setCurrentDirectory(directory_id);
    setCurrentDirectoryFiles(
      files.filter((file) => file.parent === directory_id).sort(sortFiles)
    );
  };
  const selectFile = (file_id) => {
    setSelectedFiles((prev) => {
      if (prev.includes(file_id))
        return prev.filter((candidate_id) => candidate_id !== file_id);
      else return [...prev, file_id];
    });
  };
  const massToggleSelectFiles = () => {
    if (selectedFiles.length > 0) setSelectedFiles([]);
    else setSelectedFiles(currentDirectoryFiles.map((file) => file.id));
  };

  const openFile = (file_id) => {
    if (files.find((file) => file.id === file_id)?.type === "directory")
      openDirectory(file_id);
  };

  // CRUD operations
  const createFile = (name) => {
    db.createFile(name, currentDirectory).then((data) => {
      setFiles((prev) => [...prev, data]);
    });
  };
  const createFolder = (name) => {
    db.createFolder(name, currentDirectory).then((data) => {
      setFiles((prev) => [...prev, data]);
    });
  };
  const deleteFile = (file_id) =>
    db
      .deleteFile(file_id)
      .then((_) => {
        setFiles((prev) => prev.filter((file) => file.id !== file_id));
        setSelectedFiles((prev) => prev.filter((id) => id !== file_id));
      })
      .catch((err) => console.log(err));
  const deleteFiles = (file_ids) =>
    file_ids.forEach((file_id) => deleteFile(file_id));

  // a function that opens a prompt to create a new file name
  const promptNewFile = () => {
    const name = prompt("Enter a file name");
    if (name) {
      createFile(name);
    }
  };
  const promptNewFolder = () => {
    const name = prompt("Enter a folder name");
    if (name) {
      createFolder(name);
    }
  };

  // prompt to rename a file
  const promptRenameFile = (file_id) => {
    const name = prompt("Enter a new file name");
    if (name) {
      db.renameFile(file_id, name).then((data) => {
        setFiles((prev) =>
          prev.map((file) => (file.id === file_id ? data : file))
        );
      });
    }
  };
  const moveFiles = (file_ids_to_move, parent_id) => {
    file_ids_to_move.forEach((file_id) => {
      if (file_id === parent_id) return;
      const file = files.find((file) => file.id === file_id);
      const parent = files.find((file) => file.id === parent_id);
      const valid_parent = parent?.type === "directory" || parent_id === null;
      const circular_parent = checkForCircularReference(file_id, parent_id);
      if (valid_parent) {
        if (!circular_parent) {
          db.moveFile(file_id, parent_id).then((data) => {
            setFiles((prev) =>
              prev.map((file) => (file.id === data.id ? data : file))
            );
            // if the file was moved to a different directory, deselect it
            if (parent_id !== currentDirectory)
              setSelectedFiles((prev) => prev.filter((id) => id !== file_id));
          });
        } else {
          alert(
            `Failed to move "${file?.name}" into "${parent?.name}": Cannot move a folder into its own subfolder!`
          );
        }
      } else {
        alert(
          `Failed to move "${file?.name}" into "${parent?.name}": Cannot move a file into a file!`
        );
      }
    });
  };

  // check if a file is being moved into its own subfolder
  const checkForCircularReference = (file_id, parent_id) => {
    if (file_id === parent_id) return true;
    if (parent_id === null) return false;
    const parent = files.find((file) => file.id === parent_id);
    if (parent) return checkForCircularReference(file_id, parent.parent);
    return false;
  };

  useEffect(() => {
    db.fetchFiles().then((data) => setFiles(data));
  }, []);
  useEffect(() => {
    files.forEach((file) => {
      if (file.parent === file.id) {
        moveFiles([file.id], null);
      }
    });
    openDirectory(currentDirectory);
    // eslint-disable-next-line
  }, [files]);

  //prompt that enables search
  const searchFiles = (query) => {
    const query_lower = query.toLowerCase();
    const search_results = files.filter((file) =>
      file.name.toLowerCase().includes(query_lower)
    );
    setCurrentDirectoryFiles(search_results);
  };

  function classNames(...classes) {
    return classes.filter(Boolean).join(" ");
  }

  return (
    <div className="flex h-full w-full flex-col bg-white">
      {/* Navbar */}

      {/* Icon Section */}
      <div
        id="navbar"
        className="flex grid-cols-3 justify-between w-full border-b border-gray-300 p-[8px]"
      >
        <div
          className="flex w-fit cursor-pointer flex-row items-center visible xs:invisible gap-[6px] p-[4px]"
          onClick={() => openDirectory(null)}
        >
          {/* <img className="h-[30px]" src="/imgs/Logo.svg" alt="" /> */}
          {/* <img className="h-[20px]" src="/imgs/Fallcrate.svg" alt="" /> */}
          <img className="h-[30px]" src="/static/imgs/db-logo.png" alt="" />
          <img
            className="h-[40px]"
            src="/static/imgs/databox_logo_sm-alt.png"
            alt=""
          />
        </div>

        {/* Search Field */}
        <div className="form-group flex align-middle flex-row">
          <div className="input-group">
            <label htmlFor="identifier" className="align-middle">
              <input
                id="identifier"
                type="text"
                placeholder="&nbsp;Search"
                className="border border-slate-700 focus:border-blue-500 font-light lg:w-[800px] md:w-[500px] sm:w-[650px] xs:w-[400px] h-[30px] pl-[10px] pr-[10px] text-sm  dark:focus:ring-blue-500 focus:ring-4 form-control form-input icon-placeholder"
                onChange={(e) => searchFiles(e.target.value)}
              />
              <span className="flex gap-2">
                <FaSistrix />
              </span>
            </label>
          </div>
        </div>

        {/* User Icon */}
        <div style={{ marginBlock: "auto" }}>
          {/* <Login /> */}
          Login
        </div>
      </div>

      {/* Sidebar */}
      <div id="dashboard" className="flex flex-1 flex-row overflow-hidden">
        <div
          id="sidebar"
          className="h-full w-[250px] border-r border-gray-300 bg-gray-100"
        >
          <ul>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Home
            </li>
            <li>
              <AllFilesMenuItem
                title={"All Files"}
                files={files.sort(sortFiles)}
                currentDirectory={currentDirectory}
                openDirectory={openDirectory}
                moveFiles={moveFiles}
              />
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Recents
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Starred
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Photos
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Signatures
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Shared
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              File Requests
            </li>
            <li className="flex flex-row items-center font-light text-gray-500 gap-[5px] px-[20px] py-[10px] ml-4">
              Deleted Files
            </li>
          </ul>
        </div>
        <div id="content" className="flex h-full flex-1 flex-col">
          <div id="breadcrumbs" className="flex flex-row p-[20px] pb-[10px]">
            {getDirectoryPath(currentDirectory, files).map((file) => (
              <Breadcrumb
                key={file?.id ?? "root"}
                file={file}
                currentDirectory={currentDirectory}
                openDirectory={openDirectory}
                moveFiles={moveFiles}
              />
            ))}
          </div>

          {/* "Upload" Dropdown Menu */}
          <div
            id="create-dropdown"
            className="flex min-h-[60px] flex-row gap-[10px] border-gray-300 py-[10px] px-[20px]"
          >
            <Menu as="div" className="relative inline-block text-left z-40">
              <div>
                <Menu.Button className="flex items-center gap-[5px] bg-blue-600 py-[5px] px-[15px] h-[40px] text-white hover:bg-blue-700 focus:ring-blue-300 font-medium transition text-sm text-center">
                  Upload
                  <svg
                    className="ml-2 w-4 h-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        // eslint-disable-next-line
                        <a
                          href="#"
                          onClick={promptNewFolder}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm cursor-pointer"
                          )}
                        >
                          <FaRegFolder className="drop-shadow-sm mb-[3px] mr-[5px] inline-block" />{" "}
                          Folder
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        // eslint-disable-next-line
                        <a
                          href="#"
                          onClick={() => promptNewFile()}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          <FaRegFile className="drop-shadow-sm mb-[3px] mr-[5px] inline-block" />{" "}
                          File
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* "Create" Dropdown Menu */}
            <Menu as="div" className="relative inline-block text-left z-40">
              <div>
                <Menu.Button className="text-black bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-blue-300 font-medium transition text-sm px-4 py-2.5 text-center inline-flex items-center">
                  Create
                  <svg
                    className="ml-2 w-4 h-4"
                    aria-hidden="true"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    ></path>
                  </svg>
                </Menu.Button>
              </div>

              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <Menu.Item>
                      {({ active }) => (
                        // eslint-disable-next-line
                        <a
                          href="#"
                          onClick={promptNewFolder}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm cursor-pointer"
                          )}
                        >
                          <FaRegFolder className="drop-shadow-sm mb-[3px] mr-[5px] inline-block" />{" "}
                          Folder
                        </a>
                      )}
                    </Menu.Item>
                    <Menu.Item>
                      {({ active }) => (
                        // eslint-disable-next-line
                        <a
                          href="#"
                          onClick={() => promptNewFile()}
                          className={classNames(
                            active
                              ? "bg-gray-100 text-gray-900"
                              : "text-gray-700",
                            "block px-4 py-2 text-sm"
                          )}
                        >
                          <FaRegFile className="drop-shadow-sm mb-[3px] mr-[5px] inline-block" />{" "}
                          File
                        </a>
                      )}
                    </Menu.Item>
                  </div>
                </Menu.Items>
              </Transition>
            </Menu>
            {/* Original "Create File & Folder" Button */}
            {/* <button
              className="flex min-w-[120px] items-center gap-[5px] bg-blue-600 py-[5px] px-[15px] h-[40px] text-white hover:bg-blue-700"
              onClick={promptNewFile}
            >
              <FaFile />
              Create File
            </button>
            <button
              className="flex min-w-[120px] items-center gap-[5px] bg-blue-600 py-[5px] px-[15px] h-[40px] text-white hover:bg-blue-700"
              onClick={promptNewFolder}
            >
              <FaFolder />
              Create Folder
            </button> */}
            {selectedFiles.length > 0 && (
              <>
                {selectedFiles.length === 1 && (
                  <button
                    className="min-w-[120px] border py-[5px] px-[15px] hover:bg-gray-200"
                    onClick={() => promptRenameFile(selectedFiles[0])}
                  >
                    Rename
                  </button>
                )}
                <button
                  className="ml-auto min-w-[120px] border py-[5px] px-[15px] hover:bg-red-100"
                  onClick={() => deleteFiles(selectedFiles)}
                >
                  Delete Files ({selectedFiles.length})
                </button>{" "}
              </>
            )}
          </div>
          <MainFileBrowser
            currentDirectory={currentDirectory}
            currentDirectoryFiles={currentDirectoryFiles}
            selectedFiles={selectedFiles}
            selectFile={selectFile}
            openFile={openFile}
            moveFiles={moveFiles}
            massToggleSelectFiles={massToggleSelectFiles}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
