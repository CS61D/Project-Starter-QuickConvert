// Only worry about supporting these output formats
export const ImageOutputFormat = ["png", "jpeg", "webp"] as const;
export type ImageOutputFormatType = (typeof ImageOutputFormat)[number];

export const ImageMimeTypes = {
  "image/png": [".png"],
  "image/jpeg": [".jpeg", ".jpg"],
  "image/webp": [".webp"],
  "image/bmp": [".bmp"],
  "image/ico": [".ico"],
  "image/tiff": [".tiff"],
  "image/gif": [".gif"],
};
