import { v4 as uuid } from "uuid";

// export interface File {
//   id: string;
//   name: string;
//   type: string;
//   parent: string;
//   url: string;
// }

// export class File {
//   id;
//   name;
//   type;
//   parent;

//   constructor(name, type, parent) {
//     this.id = uuid();
//     this.name = name;
//     this.type = type;
//     this.parent = parent;
//   }

//   get path() {
//     return this.parent ? `${this.parent.path}/${this.name}` : this.name;
//   }

//   compare(file) {
//     if (this.type === "directory" && file.type === "file") {
//       return -1;
//     } else if (this.type === "file" && file.type === "directory") {
//       return 1;
//     } else {
//       return this.name.localeCompare(file.name);
//     }
//   }

//   static compare(file1, file2) {
//     return file1.compare(file2);
//   }

//   static compareByPath(file1, file2) {
//     return file1.path.localeCompare(file2.path);
//   }

//   static compareByType(file1, file2) {
//     return file1.type.localeCompare(file2.type);
//   }

//   static compareByDate(file1, file2) {
//     return file1.date.localeCompare(file2.date);
//   }
// }

export const buildNewFolder = ({ name, parent }) => {
  return {
    id: uuid(),
    name,
    type: "directory",
    parent: parent ?? null,
  };
};

export const buildNewFile = ({ name, parent }) => {
  return {
    id: uuid(),
    name,
    type: "file",
    parent: parent ?? null,
  };
};

export const sortFiles = (file_a, file_b) => {
  if (file_a.type === "directory" && file_b.type === "file") {
    return -1;
  } else if (file_a.type === "file" && file_b.type === "directory") {
    return 1;
  } else {
    return file_a.name.localeCompare(file_b.name);
  }
};

export const getDirectoryPath = (file_id, files) => {
  if (file_id === null) return [null];
  const file = files.find((file) => file?.id === file_id);
  if (!file) return [null];
  return [...getDirectoryPath(file?.parent, files), file];
};
