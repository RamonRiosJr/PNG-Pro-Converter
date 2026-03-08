
export interface ProcessedImage {
  id: string;
  originalFile: File;
  processedBlob: Blob | null;
  previewUrl: string;
  newName: string;
  originalSize: number;
  newSize: number | null;
  status: 'pending' | 'processing' | 'done' | 'error';
  error?: string;
}
