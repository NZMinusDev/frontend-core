export function parseFileExtension(fullPath: string) {
  const filePath = fullPath.substring(0, fullPath.lastIndexOf(".")) || fullPath;
  const fileExt = fullPath.substring(fullPath.lastIndexOf(".") + 1, fullPath.length) || fullPath;
  return { filePath, fileExt };
}
