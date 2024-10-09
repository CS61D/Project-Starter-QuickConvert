import { ImageMimeTypes } from "@/lib/constants";
import { useDropzone } from "react-dropzone";

export const Dropzone = () => {
  const { getRootProps, getInputProps } = useDropzone({
    accept: ImageMimeTypes,
    onDrop: (files: File[]) => {
      console.log("Files dropped:", files);
      // TODO: Do something with the dropped files
    },
  });

  return (
    <div className="h-64 w-64 rounded-lg border-2 border-gray-300 border-dashed p-2 ">
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div className="text-center">
          This is your unstyled dropzone. Drop files here!
        </div>
      </div>
    </div>
  );
};
