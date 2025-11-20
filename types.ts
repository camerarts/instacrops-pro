export interface ProcessedImage {
  originalUrl: string;
  processedUrl: string;
  originalSize: number;
  processedSize: number;
  width: number;
  height: number;
}

export enum ProcessingStatus {
  IDLE = 'IDLE',
  PROCESSING = 'PROCESSING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
