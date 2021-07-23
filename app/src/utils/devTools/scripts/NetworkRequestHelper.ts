import { imgToBlob } from './FileHelper';

interface CancellableFetchesOptions {
  ourAsyncTask?: (...args: unknown[]) => Promise<unknown>;
  ourAsyncTaskArgs?: unknown[];
  abortCallback?: (...args: unknown[]) => unknown;
}

/**
 * If you call controller.abort() from somewhere, it will interrupt all fetch calls
 * @param urls - fetch URLs
 * @param ourAsyncTask
 * @param ourAsyncTaskArgs
 * @returns controller - controller to abort, response - response of fetches and task
 */
const cancellableFetches = (
  urls: URL[],
  {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    ourAsyncTask = async () => {},
    ourAsyncTaskArgs = [],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    abortCallback = () => {},
  }: CancellableFetchesOptions = {}
) => {
  const controller = new AbortController();

  const ourJob = new Promise((resolve, reject) => {
    controller.signal.addEventListener('abort', reject);
    ourAsyncTask(...ourAsyncTaskArgs).then((taskResult) => resolve(taskResult));
  });

  const fetchJobs = urls.map((url) =>
    fetch(url.toString(), {
      signal: controller.signal,
    })
  );

  try {
    const response = Promise.all([...fetchJobs, ourJob]);

    return { controller, response };
  } catch (err) {
    if (err.name === 'AbortError') {
      abortCallback();
    } else {
      throw err;
    }
  }
};

const getJSON = async (url: URL) => {
  const response = await fetch(url.toString());

  if (response.ok) {
    return (await response.json()) as Promise<JSON>;
  }

  throw new Error(`Ошибка HTTP: ${response.status}`);
};

interface HandleResponseProcessOptions {
  fetchOptions?: RequestInit;
  progressCallback?: (receivedLength: number, contentLength: number) => unknown;
}
const handleResponseProcess = async (
  url: URL,
  {
    fetchOptions = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    progressCallback = (receivedLength: number, contentLength: number) => {},
  }: HandleResponseProcessOptions = {}
) => {
  const response = await fetch(url.toString(), fetchOptions);

  if (response.body !== null) {
    const reader = response.body.getReader();

    // should be allowed by server
    const contentLengthAnswer = response.headers.get('Content-Length');

    if (contentLengthAnswer !== null) {
      const contentLength = Number(contentLengthAnswer);
      const chunks: Uint8Array[] = [];
      let receivedLength = 0;

      // should be for await..of in the future
      // eslint-disable-next-line no-loops/no-loops
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
};

/**
 * Content-Length should be allowed by server
 */
const getProgressedJSON = async (
  url: URL,
  {
    fetchOptions = {},
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    progressCallback = (receivedLength: number, contentLength: number) => {},
  }: HandleResponseProcessOptions = {}
) => {
  const result = await handleResponseProcess(url, { fetchOptions, progressCallback });

  if (result !== null) {
    const chunksAll = new Uint8Array(result.receivedLength);
    let position = 0;

    result.chunks.forEach((chunk) => {
      chunksAll.set(chunk, position);
      position += chunk.length;
    });

    return JSON.parse(new TextDecoder('utf-8').decode(chunksAll));
  }

  return null;
};

const getBlob = async (url: URL) => {
  const response = await fetch(url.toString());

  if (response.ok) {
    return await response.blob();
  }

  throw new Error(`Ошибка HTTP: ${response.status}`);
};

/**
 * Content-Length should be allowed by server
 */
const getProgressedBlob = async (
  url: URL,
  {
    fetchOptions = {},
    progressCallback = (receivedLength: number, contentLength: number) => {},
  }: HandleResponseProcessOptions = {}
) => {
  const result = await handleResponseProcess(url, { fetchOptions, progressCallback });

  if (result !== null) {
    return new Blob(result.chunks);
  }

  return null;
};

const sendJSON = async (url: URL, valueToStringify: unknown) =>
  await fetch(url.toString(), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    body: JSON.stringify(valueToStringify),
  });

const sendProgressedJSON = async (
  url: URL,
  valueToStringify: unknown,
  { progressCallback = (event: ProgressEvent<EventTarget>) => {} } = {}
) => {
  const xhr = new XMLHttpRequest();

  xhr.upload.onprogress = (event) => {
    progressCallback(event);
  };

  return new Promise(async (resolve, reject) => {
    xhr.onloadend = () => {
      resolve(xhr);
    };

    xhr.setRequestHeader('Content-Type', 'application/json;charset=utf-8');

    xhr.open('POST', url.toString());
    xhr.send(JSON.stringify(valueToStringify));
  });
};

const sendImg = async (url: URL, img: HTMLImageElement, { name = 'image' } = {}) => {
  const blob = await imgToBlob(img);

  const formData = new FormData();
  formData.append(name, blob, img.src);

  return await fetch(url.toString(), {
    method: 'POST',
    body: formData,
  });
};

const sendProgressedImg = async (
  url: URL,
  img: HTMLImageElement,
  { progressCallback = (event: ProgressEvent<EventTarget>) => {}, name = 'image' } = {}
) => {
  const xhr = new XMLHttpRequest();

  xhr.upload.onprogress = (event) => {
    progressCallback(event);
  };

  return await new Promise(async (resolve, reject) => {
    xhr.onloadend = () => {
      resolve(xhr);
    };

    const blob = await imgToBlob(img);

    const formData = new FormData();
    formData.append(name, blob, img.src);

    xhr.open('POST', url.toString());
    xhr.send(blob);
  });
};

/**
 * @example
 * const headers = getXMLHttpRequestHeaders(xhr);
 * headers['Content-Type'] // 'image/png';
 */
const getXMLHttpRequestHeaders = (xhr: XMLHttpRequest) =>
  xhr
    .getAllResponseHeaders()
    .split('\r\n')
    .reduce((result: { [index: string]: string }, current) => {
      const [name, value] = current.split(': ');
      result[name] = value;

      return result;
    }, {});

export {
  cancellableFetches,
  getJSON,
  getProgressedJSON,
  getBlob,
  getProgressedBlob,
  sendJSON,
  sendProgressedJSON,
  sendImg,
  sendProgressedImg,
  getXMLHttpRequestHeaders,
};
