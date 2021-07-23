const createDataURL = (
  blobParts: BlobPart[],
  options: BlobPropertyBag = { type: 'text/plain' }
) => {
  const blob = new Blob(blobParts, options);

  return URL.createObjectURL(blob);
};

const createBase64 = async (
  blobParts: BlobPart[],
  options: BlobPropertyBag = { type: 'text/plain' }
) => {
  const blob = new Blob(blobParts, options);

  const fileReader = new FileReader();
  fileReader.readAsDataURL(blob);

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const result = await new Promise<string>((resolve) => {
    const onLoad = () => {
      resolve(fileReader.result as string);
    };

    fileReader.addEventListener('load', onLoad);
  });

  return result;
};

const blobToArrayBuffer = async (blob: Blob) => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(blob);

  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const result = await new Promise<ArrayBuffer>((resolve) => {
    const onLoad = () => {
      resolve(fileReader.result as ArrayBuffer);
    };

    fileReader.addEventListener('load', onLoad);
  });

  return result;
};

const imgToCanvas = (
  img: HTMLImageElement,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  imgProcessing = (canvas: HTMLCanvasElement) => {}
) => {
  const canvas = document.createElement('canvas');
  canvas.width = img.clientWidth;
  canvas.height = img.clientHeight;

  const context = canvas.getContext('2d');
  context?.drawImage(img, 0, 0);

  imgProcessing(canvas);

  return canvas;
};

const imgToBlob = async (
  img: HTMLImageElement,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  imgProcessing = (canvas: HTMLCanvasElement) => {}
) => {
  const canvas = imgToCanvas(img, imgProcessing);
  // eslint-disable-next-line sonarjs/prefer-immediate-return
  const result = await new Promise<Blob>((resolve) =>
    canvas.toBlob(resolve as BlobCallback, 'image/png')
  );

  return result;
};

export { createDataURL, createBase64, blobToArrayBuffer, imgToCanvas, imgToBlob };
