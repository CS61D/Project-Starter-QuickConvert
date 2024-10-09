import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

import { FFmpeg } from "@ffmpeg/ffmpeg";
import { fetchFile, toBlobURL } from "@ffmpeg/util";

export async function loadFfmpeg(): Promise<FFmpeg> {
  const ffmpeg = new FFmpeg();
  const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/esm";
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, "application/wasm"),
  });
  return ffmpeg;
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const splitExtension = (filename: string) => {
  // Find the last occurrence of '.'
  const lastDotIndex = filename.lastIndexOf(".");

  // Split the filename
  const name = filename.slice(0, lastDotIndex);
  const extension = filename.slice(lastDotIndex + 1) ?? "";

  return { name, extension };
};

export const formatFileSize = (size: number | undefined) => {
  if (size === undefined) return "Unknown size";
  const units = ["bytes", "KB", "MB", "GB", "TB"];

  let i = 0;
  let newSize = size;
  while (newSize >= 1000 && i < units.length - 1) {
    newSize /= 1000;
    i++;
  }

  return `${newSize.toFixed(2)} ${units[i]}`;
};

// outputFullName include the file extension,
// example: "output.jpg"
export async function convertFile(
  ffmpeg: FFmpeg | null,
  file: File,
  outputFullName: string,
) {
  const inputFullName = file.name;

  try {
    if (!ffmpeg) {
      throw new Error("FFmpeg not loaded");
    }

    const { extension: outputFormat } = splitExtension(outputFullName);

    // Write the input file to FFmpeg's virtual file system
    await ffmpeg.writeFile(inputFullName, await fetchFile(file));
    console.log("Input file written to FFmpeg filesystem");

    // Prepare FFmpeg command
    const ffmpegCmd = ["-i", inputFullName, outputFullName];
    console.log("FFmpeg command:", ffmpegCmd);

    // Execute FFmpeg command
    await ffmpeg.exec(ffmpegCmd);
    console.log("FFmpeg command executed");

    // Read the output file
    const data = await ffmpeg.readFile(outputFullName);
    console.log("Output file read from FFmpeg filesystem");

    // Create a blob from the file data
    const blob = new Blob([data], { type: `image/${outputFormat}` });
    const size = blob.size;

    // Create a downloadable URL
    const url = URL.createObjectURL(blob);

    return { outputObjectUrl: url, outputFileSize: size, outputFullName };
  } catch (error) {
    console.error("Error converting file:", error);
    throw error; // Re-throw the error so it can be handled by the caller
  }
}

// outputFileName represents the file name and extension, such as "image.jpg"
export function downloadFile(objectUrl: string, outputFileName: string) {
  console.log("Downloading file:", outputFileName);
  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = outputFileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Revoke the object URL
  URL.revokeObjectURL(objectUrl);
}
