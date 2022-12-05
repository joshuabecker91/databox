import { FaCheck, FaMinus } from "react-icons/fa";
// import { File } from "../../helpers";

const BrowserHeader = ({
  selectedFiles,
  currentDirectoryFiles,
  massToggleSelectFiles,
}) => {
  const all_files_selected =
    selectedFiles.length === currentDirectoryFiles.length;
  const some_files_selected = selectedFiles.length > 0 && !all_files_selected;

  return (
    <div className="group pointer-events-none sticky top-0 z-10 flex w-full flex-row items-center bg-white font-semibold">
      <div className="p-[10px]">
        <div
          className={`flex h-[25px] w-[25px] cursor-pointer items-center justify-center rounded-sm border-gray-500 group-hover:border ${
            some_files_selected && "border"
          } ${
            some_files_selected || all_files_selected
              ? "bg-black text-white"
              : "bg-white text-black hover:bg-gray-200"
          }`}
          onClick={massToggleSelectFiles}
        >
          {all_files_selected && <FaCheck />}
          {some_files_selected && <FaMinus />}
        </div>
      </div>
      <div className="flex h-full flex-1 flex-row items-center gap-[10px] border-b border-[rgba(167,146,114,0.2)] border-l-[rgb(0,97,254)] py-[4px] px-[10px] align-baseline">
        Name
      </div>
    </div>
  );
};

export default BrowserHeader;
