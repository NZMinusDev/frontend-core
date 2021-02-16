import { imgToBlob } from "./FileHelper";

/**
 * If you call controller.abort() from somewhere, it will interrupt all fetch calls
 * @param urls - fetch URLs
 * @param ourAsyncTask
 * @param ourAsyncTaskArgs
 * @returns controller - controller to abort, response - response of fetches and task
 */
export function cancellableFetches(
  urls: URL[],
  {
    ourAsyncTask = async () => {},
    ourAsyncTaskArgs = [],
    abortCallback = () => {},
  }: CancellableFetchesOptions = {}
) {
  let controller = new AbortController();

  let ourJob = new Promise((resolve, reject) => {
    controller.signal.addEventListener("abort", reject);
    ourAsyncTask(...ourAsyncTaskArgs).then((taskResult) => resolve(taskResult));
  });

  let fetchJobs = urls.map((url) =>
    fetch(url.toString(), {
      signal: controller.signal,
    })
  );

  let response: Promise<unknown[]>;
  try {
    response = Promise.all([...fetchJobs, ourJob]);
    return { controller, response };
  } catch (err) {
    if (err.name == "AbortError") {
      abortCallback();
    } else {
      throw err;
    }
  }
}

export async function getJSON(url: URL) {
  let response = await fetch(url.toString());

  if (response.ok) {
    return (await response.json()) as Promise<JSON>;
  } else {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
}
/**
 * Content-Length should be allowed by server
 */
export async function getProgressedJSON(
  url: URL,
  {
    fetchOptions = {},
    progressCallback = function (receivedLength: number, contentLength: number) {},
  }: HandleResponseProcessOptions = {}
) {
  const result = await handleResponseProcess(url, { fetchOptions, progressCallback });

  if (result !== null) {
    let chunksAll = new Uint8Array(result.receivedLength);
    let position = 0;
    for (let chunk of result.chunks) {
      chunksAll.set(chunk, position);
      position += chunk.length;
    }

    return JSON.parse(new TextDecoder("utf-8").decode(chunksAll));
  }

  return null;
}
export async function getBlob(url: URL) {
  let response = await fetch(url.toString());

  if (response.ok) {
    return await response.blob();
  } else {
    throw new Error(`Ошибка HTTP: ${response.status}`);
  }
}
/**
 * Content-Length should be allowed by server
 */
export async function getProgressedBlob(
  url: URL,
  {
    fetchOptions = {},
    progressCallback = function (receivedLength: number, contentLength: number) {},
  }: HandleResponseProcessOptions = {}
) {
  const result = await handleResponseProcess(url, { fetchOptions, progressCallback });

  if (result !== null) {
    return new Blob(result.chunks);
  }

  return null;
}

export async function sendJSON(url: URL, valueToStringify: unknown) {
  const response = await fetch(url.toString(), {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(valueToStringify),
  });
  return response;
}
export async function sendProgressedJSON(
  url: URL,
  valueToStringify: unknown,
  { progressCallback = function (event: ProgressEvent<EventTarget>) {} } = {}
) {
  let xhr = new XMLHttpRequest();

  xhr.upload.onprogress = function (event) {
    progressCallback(event);
  };

  return new Promise(async (resolve, reject) => {
    xhr.onloadend = function () {
      resolve(xhr);
    };

    xhr.setRequestHeader("Content-Type", "application/json;charset=utf-8");

    xhr.open("POST", url.toString());
    xhr.send(JSON.stringify(valueToStringify));
  });
}
export async function sendImg(url: URL, img: HTMLImageElement, { name = "image" } = {}) {
  const blob = await imgToBlob(img);

  let formData = new FormData();
  formData.append(name, blob, img.src);

  return await fetch(url.toString(), {
    method: "POST",
    body: formData,
  });
}
export async function sendProgressedImg(
  url: URL,
  img: HTMLImageElement,
  { progressCallback = function (event: ProgressEvent<EventTarget>) {}, name = "image" } = {}
) {
  let xhr = new XMLHttpRequest();

  xhr.upload.onprogress = function (event) {
    progressCallback(event);
  };

  return await new Promise(async (resolve, reject) => {
    xhr.onloadend = function () {
      resolve(xhr);
    };

    const blob = await imgToBlob(img);

    let formData = new FormData();
    formData.append(name, blob, img.src);

    xhr.open("POST", url.toString());
    xhr.send(blob);
  });
}

/**
 * @example
 * const headers = getXMLHttpRequestHeaders(xhr);
 * headers['Content-Type'] // 'image/png';
 */
export function getXMLHttpRequestHeaders(xhr: XMLHttpRequest) {
  return xhr
    .getAllResponseHeaders()
    .split("\r\n")
    .reduce((result: { [index: string]: string }, current) => {
      let [name, value] = current.split(": ");
      result[name] = value;
      return result;
    }, {});
}

interface HandleResponseProcessOptions {
  fetchOptions?: RequestInit;
  progressCallback?: (receivedLength: number, contentLength: number) => unknown;
}
interface CancellableFetchesOptions {
  ourAsyncTask?: (...args: unknown[]) => Promise<unknown>;
  ourAsyncTaskArgs?: unknown[];
  abortCallback?: (...args: unknown[]) => unknown;
}

async function handleResponseProcess(
  url: URL,
  {
    fetchOptions = {},
    progressCallback = function (receivedLength: number, contentLength: number) {},
  }: HandleResponseProcessOptions = {}
) {
  let response = await fetch(url.toString(), fetchOptions);

  if (response.body !== null) {
    const reader = response.body.getReader();

    //should be allowed by server
    const contentLengthAnswer = response.headers.get("Content-Length");

    if (contentLengthAnswer !== null) {
      const contentLength = +contentLengthAnswer;

      let receivedLength = 0;
      let chunks: Uint8Array[] = [];
      // should be for await..of in the future
      while (true) {
        const { done, value } = await reader.read();

        if (done) {
          // Is there no more data to read?
          break;
        }

        chunks.push(value as Uint8Array);
        receivedLength += (value as Uint8Array).length;

        progressCallback(receivedLength, contentLength);
      }

      return { receivedLength, chunks };
    }
  }

  return null;
}
