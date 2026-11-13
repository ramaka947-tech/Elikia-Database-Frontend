// Zone de sélection de fichier CSV (clic ou glisser-déposer)
import { useRef, useState } from 'react';

export default function FileDropzone({ file, onChange, accept = '.csv' }) {
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);

  function handleDrop(e) {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files[0]) onChange(e.dataTransfer.files[0]);
  }

  return (
    <div
      onClick={() => inputRef.current.click()}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      className={`cursor-pointer rounded-xl border-2 border-dashed p-8 text-center transition ${
        dragging ? 'border-elikia bg-elikia-light' : 'border-gray-300 bg-white hover:border-elikia'
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => e.target.files[0] && onChange(e.target.files[0])}
      />
      {file ? (
        <p className="font-medium text-elikia">{file.name} ({(file.size / 1024).toFixed(1)} Ko)</p>
      ) : (
        <p className="text-gray-500">Glissez votre fichier CSV ici ou cliquez pour le choisir</p>
      )}
    </div>
  );
}
