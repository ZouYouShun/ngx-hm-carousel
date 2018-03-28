import { FileError, FileOption } from './ngxf-uploader.service';
export function emitOpload
  (files: FileList,
  accept: string,
  multiple: string,
  option: FileOption): File | File[] | FileError {

  if (multiple !== undefined) {
    return checkAllFile(files, accept, option);
  } else {
    if (files.length === 1) {
      return checkAllFile(files[0], accept, option);
    }
    return FileError.NumError;
  }
}

function checkAllFile(file: File | FileList, accept: string, option: FileOption): File | File[] | FileError {
  if (file instanceof FileList) {
    let result: any = null;
    const files: File[] = [];

    if (!Array.from(file).every((f) => {
      if (!cfType(f, accept)) {
        result = FileError.TypeError;
      }
      if (result === null && !cfSize(f, option)) {
        result = FileError.SizeError;
      }
      files.push(f);
      return (result === null);
    })) {
      return result;
    }

    return files;

  } else {
    if (!cfType(file, accept)) {
      return FileError.TypeError;
    }
    if (!cfSize(file, option)) {
      return FileError.SizeError;
    }
    return file;
  }
}

function cfType(file: File, accept: string): boolean {
  if (accept) {
    const acceptedFilesArray = accept.split(',');

    return acceptedFilesArray.some(type => {
      const validType = type.trim();
      if (validType.charAt(0) === '.') {
        return file.name.toLowerCase().endsWith(validType.toLowerCase());
      } else if (/\/\*$/.test(validType)) {
        // This is something like a image/* mime type
        return file.type.replace(/\/.*$/, '') === validType.replace(/\/.*$/, '');
      }
      return file.type === validType;
    });
  }
  return true;
}

function cfSize(file: File, option: FileOption): boolean {
  if (option) {
    const size = file.size;
    const chkSize = option.size;
    if ((chkSize.min && size < chkSize.min) || (chkSize.max && size > chkSize.max)) {
      return false;
    }
  }
  return true;
}
