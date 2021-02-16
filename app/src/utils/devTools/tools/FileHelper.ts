export function createDataURL(
  blobParts: BlobPart[],
  options: BlobPropertyBag = { type: "text/plain" }
) {
  let blob = new Blob(blobParts, options);
  return URL.createObjectURL(blob);
}

export async function createBase64(
  blobParts: BlobPart[],
  options: BlobPropertyBag = { type: "text/plain" }
) {
  let blob = new Blob(blobParts, options);

  let fileReader = new FileReader();
  fileReader.readAsDataURL(blob);

  return await new Promise<string>((resolve) => {
    fileReader.onload = function () {
      resolve(fileReader.result as string);
    };
  });
}

export async function blobToArrayBuffer(blob: Blob) {
  let fileReader = new FileReader();
  fileReader.readAsArrayBuffer(blob);

  return await new Promise<ArrayBuffer>((resolve) => {
    fileReader.onload = function () {
      resolve(fileReader.result as ArrayBuffer);
    };
  });
}

export function imgToCanvas(
  img: HTMLImageElement,
  imgProcessing = function (canvas: HTMLCanvasElement) {}
) {
  let canvas = document.createElement("canvas");
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;

  let context = canvas.getContext("2d");
  context?.drawImage(img, 0, 0);

  imgProcessing(canvas);

  return canvas;
}
export async function imgToBlob(
  img: HTMLImageElement,
  imgProcessing = function (canvas: HTMLCanvasElement) {}
) {
  const canvas = imgToCanvas(img, imgProcessing);

  return await new Promise<Blob>((resolve) => canvas.toBlob(resolve as BlobCallback, "image/png"));
}
