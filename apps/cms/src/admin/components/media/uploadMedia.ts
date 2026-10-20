export type UploadedMedia = { id: number | string; filename?: string };

export function uploadMedia({
  url,
  file,
  data,
  onProgress,
  signal,
  method = "POST",
}: {
  method?: "POST" | "PATCH";
  url: string;
  file: File;
  data: Record<string, unknown>;
  onProgress: (loaded: number, total: number) => void;
  signal?: AbortSignal;
}): Promise<UploadedMedia> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    const body = new FormData();
    body.append("file", file);
    body.append("_payload", JSON.stringify(data));
    request.open(method, url);
    request.withCredentials = true;
    request.responseType = "json";
    request.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded, event.total);
    };
    request.onload = () => {
      const response = request.response as {
        doc?: UploadedMedia;
        errors?: { message?: string }[];
      } | null;
      if (request.status < 400 && response?.doc) resolve(response.doc);
      else reject(new Error(response?.errors?.[0]?.message ?? "Upload failed"));
    };
    request.onerror = () => reject(new Error("Upload failed"));
    request.onabort = () => reject(new DOMException("Aborted", "AbortError"));
    signal?.addEventListener("abort", () => request.abort(), { once: true });
    request.send(body);
  });
}
