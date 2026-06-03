import React, { useRef, useState } from 'react';
import { Paperclip, Image, Trash2, FileText, UploadCloud } from 'lucide-react';

interface SelectedFile {
  name: string;
  url: string;
  type: string;
}

interface FileUploaderProps {
  onFilesChange: (files: SelectedFile[]) => void;
  language: 'en' | 'bn';
  multiple?: boolean;
  accept?: string;
  maxSizeMB?: number;
}

export default function FileUploader({
  onFilesChange,
  language,
  multiple = true,
  accept = '*/*',
  maxSizeMB = 5
}: FileUploaderProps) {
  const [selectedFiles, setSelectedFiles] = useState<SelectedFile[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const text = {
    dragText: language === 'en' ? 'Drag and drop files here, or' : 'এখানে ফাইল ড্র্যাগ করুন, অথবা',
    browseBtn: language === 'en' ? 'Browse Files' : 'ফাইল সিলেক্ট করুন',
    photoLimit: language === 'en' ? `Max physical size: ${maxSizeMB}MB` : `সর্বোচ্চ ফাইল সাইজ: ${maxSizeMB} মেগাবাইট`,
    attachedHeader: language === 'en' ? 'Attached Attachments' : 'সংযুক্ত ফাইলসমূহ:',
    maxMBText: language === 'en' ? `File too large (exceeds ${maxSizeMB}MB)` : `ফাইল সাইজ খুব বড় (${maxSizeMB}MB এর বেশি)`,
    generalError: language === 'en' ? 'Failed to read file' : 'ফাইল পড়তে ব্যর্থ হয়েছে'
  };

  const handleFiles = (filesList: FileList) => {
    setErrorMsg(null);
    const filesArray = Array.from(filesList);
    const validFiles: SelectedFile[] = [];

    let processedCount = 0;
    
    filesArray.forEach(file => {
      // Validate file size
      if (file.size > maxSizeMB * 1024 * 1024) {
        setErrorMsg(text.maxMBText);
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          validFiles.push({
            name: file.name,
            url: reader.result,
            type: file.type || 'application/octet-stream'
          });
        }
        processedCount++;

        if (processedCount === filesArray.length) {
          const updated = multiple ? [...selectedFiles, ...validFiles] : validFiles;
          setSelectedFiles(updated);
          onFilesChange(updated);
        }
      };
      
      reader.onerror = () => {
        setErrorMsg(text.generalError);
        processedCount++;
      };

      reader.readAsDataURL(file);
    });
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(true);
  };

  const onDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
  };

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };

  const removeFile = (index: number) => {
    const updated = selectedFiles.filter((_, i) => i !== index);
    setSelectedFiles(updated);
    onFilesChange(updated);
  };

  const clearUploader = () => {
    setSelectedFiles([]);
    onFilesChange([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Expose reset trigger if parent needs it (could be handled externally)
  React.useEffect(() => {
    // Watch selectedFiles internally
  }, [selectedFiles]);

  return (
    <div className="space-y-3 w-full">
      <div
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center transition cursor-pointer ${
          isDragActive 
            ? 'border-indigo-400 bg-indigo-500/5' 
            : 'border-white/10 bg-white/2 hover:bg-white/4'
        }`}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple={multiple}
          accept={accept}
          onChange={onInputChange}
          className="hidden"
        />
        
        <UploadCloud className="h-6 w-6 text-slate-400 mb-1.5" />
        <p className="text-[11px] text-slate-300 font-mono text-center">
          {text.dragText} <span className="text-indigo-400 font-bold hover:underline">{text.browseBtn}</span>
        </p>
        <span className="text-[9px] text-slate-500 block font-mono mt-0.5">{text.photoLimit}</span>
        
        {errorMsg && (
          <span className="text-[9.5px] text-rose-400 block mt-1 bg-rose-500/10 border border-rose-500/15 px-2 py-0.5 rounded-md font-mono">
            {errorMsg}
          </span>
        )}
      </div>

      {selectedFiles.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <span className="text-[9px] text-indigo-300 font-mono uppercase font-black tracking-wider">
              {text.attachedHeader} ({selectedFiles.length})
            </span>
            <button
              type="button"
              onClick={clearUploader}
              className="text-[9px] text-rose-400 hover:text-rose-300 font-mono cursor-pointer"
            >
              {language === 'en' ? 'Clear All' : 'সব মুছুন'}
            </button>
          </div>
          
          <div className="flex flex-wrap gap-2">
            {selectedFiles.map((f, i) => {
              const isImg = f.type.startsWith('image/') || f.url.startsWith('data:image/');
              return (
                <div key={i} className="bg-[#192033] border border-white/5 p-1.5 rounded-lg flex items-center gap-2 max-w-[200px] text-[10.5px] relative group pr-6 animate-fade-in">
                  {isImg ? (
                    <img 
                      src={f.url} 
                      alt={f.name} 
                      className="h-8 w-8 rounded object-cover border border-white/10" 
                      referrerPolicy="no-referrer"
                    />
                  ) : (
                    <div className="h-8 w-8 rounded bg-white/5 flex items-center justify-center text-slate-400 border border-white/10 shrink-0">
                      <FileText className="h-4 w-4" />
                    </div>
                  )}
                  
                  <div className="truncate flex-1">
                    <span className="block font-bold text-slate-205 truncate font-mono text-[9.5px]">{f.name}</span>
                    <span className="block text-[8px] text-slate-500 font-mono truncate">{f.type.split('/')[1] || 'file'}</span>
                  </div>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(i);
                    }}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-5 w-5 bg-black/40 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 rounded-md flex items-center justify-center transition cursor-pointer"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export function AttachmentPreview({
  attachments,
  language
}: {
  attachments?: SelectedFile[];
  language: 'en' | 'bn';
}) {
  const [zoomImage, setZoomImage] = useState<string | null>(null);

  if (!attachments || attachments.length === 0) return null;

  return (
    <div className="mt-2 space-y-1">
      <div className="flex flex-wrap gap-2">
        {attachments.map((file, idx) => {
          const isImg = file.type.startsWith('image/') || file.url.startsWith('data:image/');
          return (
            <div 
              key={idx} 
              className="bg-black/35 border border-white/10 rounded-xl p-2 flex items-center gap-2 max-w-[240px] text-left relative group hover:bg-black/50 transition cursor-pointer"
              onClick={() => isImg && setZoomImage(file.url)}
            >
              {isImg ? (
                <img 
                  src={file.url} 
                  alt={file.name} 
                  className="h-10 w-10 rounded-lg object-cover border border-white/20 hover:scale-105 transition"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="h-10 w-10 rounded-lg bg-teal-500/10 flex items-center justify-center text-teal-400 border border-teal-500/20 shrink-0">
                  <FileText className="h-5 w-5" />
                </div>
              )}

              <div className="truncate flex-1 max-w-[150px]">
                <span className="block font-bold text-slate-200 truncate font-mono text-[9.5px]" title={file.name}>
                  {file.name}
                </span>
                <a 
                  href={file.url} 
                  download={file.name}
                  onClick={(e) => e.stopPropagation()} // Prevent trigger zoom modal
                  className="text-[9px] text-indigo-400 hover:text-indigo-300 underline font-mono tracking-wider uppercase block mt-0.5"
                >
                  {language === 'en' ? 'Download' : 'ডাউনলোড'}
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {zoomImage && (
        <div 
          onClick={() => setZoomImage(null)}
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center z-[9999] p-4 cursor-zoom-out animate-fade-in"
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-2xl border border-white/10 shadow-2xl">
            <img 
              src={zoomImage} 
              alt="Zoomed attachment" 
              className="object-contain max-w-full max-h-[80vh] mx-auto select-none rounded-xl"
              referrerPolicy="no-referrer"
            />
            <button
              onClick={() => setZoomImage(null)}
              className="absolute top-3 right-3 bg-black/60 hover:bg-rose-600 hover:text-white text-slate-300 font-bold font-mono h-8 w-8 rounded-full flex items-center justify-center transition cursor-pointer"
            >
              ✕
            </button>
            <span className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white font-mono text-[9px] px-3 py-1 rounded-full uppercase tracking-wider backdrop-blur-xs select-none">
              {language === 'en' ? 'Click anywhere to close' : 'বন্ধ করতে যেকোনো স্থানে ক্লিক করুন'}
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
