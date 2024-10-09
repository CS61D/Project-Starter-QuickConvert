import { Dropzone } from "./components/Dropzone";

function App() {
  return (
    <div className="flex w-screen flex-col items-center justify-center">
      <h1 className="p-2 text-3xl">Quick Convert</h1>
      <p className="pb-5">An Online Image Format Converter</p>

      {/* Dropzone */}
      <Dropzone />
    </div>
  );
}

export default App;
