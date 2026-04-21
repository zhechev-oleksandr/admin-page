import { useRef, useState, type DragEvent, type ChangeEvent } from "react";
import { FileIcon, UploadIcon } from '@shared/ui/icons';

interface FileDropzoneProps {
  label?: string;
  accept?: string;
  value: File | null;
  onChange: (file: File | null) => void;
  error?: string;
}

export const FileDropzone = ({ label, accept, value, onChange, error }: FileDropzoneProps) => {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleDrop(e: DragEvent<HTMLDivElement>) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped) onChange(dropped);
  }

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    onChange(e.target.files?.[0] ?? null);
  }

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-[0.8125rem] font-medium text-fg-muted tracking-wide">
          {label}
        </label>
      )}

      <div
        role="button"
        tabIndex={0}
        aria-label={label ?? "Upload file"}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => e.key === "Enter" && inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={[
          "flex items-center justify-center min-h-20 px-5 py-4",
          "border-[1.5px] border-dashed rounded-lg cursor-pointer",
          "transition-colors duration-150",
          error
            ? "border-danger-fg"
            : dragOver
              ? "border-accent-fg bg-bg-subtle"
              : "border-border-strong hover:border-accent-fg hover:bg-bg-subtle",
        ].join(" ")}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          className="hidden"
        />

        {value ? (
          <div className="flex items-center gap-2.5 w-full">
            <FileIcon />
            <span className="flex-1 text-sm font-medium text-fg-base truncate">
              {value.name}
            </span>
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onChange(null); }}
              className="shrink-0 text-fg-subtle hover:text-fg-muted text-sm px-1 py-0.5 rounded bg-transparent border-none cursor-pointer transition-colors"
              aria-label="Remove file"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="text-center">
            <UploadIcon />
            <p className="text-sm text-fg-muted mt-1.5">
              Drop a file here or{" "}
              <span className="text-accent-fg font-medium">browse</span>
            </p>
          </div>
        )}
      </div>

      {error && (
        <span className="text-[0.8125rem] text-danger-fg">{error}</span>
      )}
    </div>
  );
}

