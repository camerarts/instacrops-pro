import React, { useState, useCallback, useEffect } from 'react';
import Header from './components/Header';
import UploadArea from './components/UploadArea';
import ResultCard from './components/ResultCard';
import ManualCropper from './components/ManualCropper';
import { ProcessedImage, ProcessingStatus, processImage, CropConfig, OutputDimensions } from './utils/imageProcessor';
import { Loader2, Wand2, Crop as CropIcon, Zap } from 'lucide-react';

type ProcessMode = 'auto' | 'manual';

const App: React.FC = () => {
  const [status, setStatus] = useState<ProcessingStatus>(ProcessingStatus.IDLE);
  const [result, setResult] = useState<ProcessedImage | null>(null);
  
  const [totalConverted, setTotalConverted] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('instacrops_total_converted');
      return saved ? parseInt(saved, 10) : 0;
    }
    return 0;
  });

  useEffect(() => {
    localStorage.setItem('instacrops_total_converted', totalConverted.toString());
  }, [totalConverted]);

  const [mode, setMode] = useState<ProcessMode>('auto');
  const [tempFile, setTempFile] = useState<File | null>(null);
  const [showCropper, setShowCropper] = useState(false);

  const handleFileSelect = useCallback(async (file: File) => {
    if (mode === 'manual') {
      setTempFile(file);
      setShowCropper(true);
    } else {
      processFile(file);
    }
  }, [mode]);

  const processFile = async (file: File, cropConfig?: CropConfig, outputDim?: OutputDimensions) => {
    setStatus(ProcessingStatus.PROCESSING);
    try {
      if (!cropConfig) await new Promise(resolve => setTimeout(resolve, 800));

      const { blob, width, height } = await processImage(file, cropConfig, outputDim);
      
      const processedUrl = URL.createObjectURL(blob);
      const originalUrl = URL.createObjectURL(file);

      setResult({
        originalUrl,
        processedUrl,
        originalSize: file.size,
        processedSize: blob.size,
        width,
        height
      });
      
      setStatus(ProcessingStatus.SUCCESS);
      setTotalConverted(prev => prev + 1);
    } catch (error) {
      console.error("Error processing image:", error);
      setStatus(ProcessingStatus.ERROR);
      alert("处理图片时出错，请重试。");
    } finally {
      setTempFile(null);
      setShowCropper(false);
    }
  };

  const handleManualCropConfirm = (cropConfig: CropConfig, outputDim: OutputDimensions) => {
    if (tempFile) {
      processFile(tempFile, cropConfig, outputDim);
    }
  };

  const handleManualCropCancel = () => {
    setTempFile(null);
    setShowCropper(false);
  };

  const handleReset = useCallback(() => {
    if (result) {
      URL.revokeObjectURL(result.originalUrl);
      URL.revokeObjectURL(result.processedUrl);
    }
    setResult(null);
    setStatus(ProcessingStatus.IDLE);
  }, [result]);

  return (
    <div className="min-h-screen flex flex-col relative bg-[#0B0F19] text-slate-200 overflow-x-hidden selection:bg-primary/30 selection:text-white">
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40 animate-pulse-slow" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] bg-secondary/15 rounded-full blur-[100px] opacity-40" />
        <div className="absolute top-[20%] left-[50%] translate-x-[-50%] w-[800px] h-[800px] bg-blue-600/5 rounded-full blur-[100px]" />
      </div>
      <div className="relative z-10 flex flex-col min-h-screen">
        <Header totalConverted={totalConverted} />
        <main className="flex-1 container mx-auto px-4 py-12 md:py-20 flex flex-col items-center">
          {status === ProcessingStatus.IDLE && (
            <div className="text-center mb-12 max-w-4xl animate-fade-in relative">
               <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 backdrop-blur-md mb-8 shadow-[0_0_20px_rgba(79,70,229,0.15)]">
                <Zap className="w-3.5 h-3.5 text-indigo-400 fill-indigo-400" />
                <span className="text-xs font-semibold text-indigo-200 tracking-wide uppercase">Pro Image Tools</span>
              </div>
              <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-tight">
                智能构建
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-indigo-400 via-purple-400 to-pink-400"> 极致视觉</span>
              </h2>
              <p className="text-lg md:text-xl text-gray-400 leading-relaxed max-w-2xl mx-auto mb-10 font-light">
                专为创作者打造的图像处理引擎。无论是社交媒体封面还是高清展示图，一键实现<span className="text-gray-200 font-medium">完美裁剪</span>与<span className="text-gray-200 font-medium">无损压缩</span>。
              </p>
              <div className="inline-flex bg-[#131725] border border-white/10 p-1.5 rounded-2xl shadow-2xl relative z-20">
                <button onClick={() => setMode('auto')} className={`flex items-center px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${mode === 'auto' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/40 scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <Wand2 className="w-4 h-4 mr-2" />
                  自动模式 (16:9)
                </button>
                <button onClick={() => setMode('manual')} className={`flex items-center px-8 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${mode === 'manual' ? 'bg-gradient-to-br from-indigo-600 to-indigo-700 text-white shadow-lg shadow-indigo-900/40 scale-[1.02]' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <CropIcon className="w-4 h-4 mr-2" />
                  手动裁剪
                </button>
              </div>
            </div>
          )}
          <div className="w-full flex flex-col items-center justify-center min-h-[320px] transition-all duration-500">
            {status === ProcessingStatus.IDLE && (
              <UploadArea onFileSelect={handleFileSelect} isProcessing={false} />
            )}
            {status === ProcessingStatus.PROCESSING && (
              <div className="flex flex-col items-center justify-center w-full max-w-lg p-12 bg-white/5 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl animate-fade-in">
                <div className="relative mb-6">
                  <div className="absolute inset-0 bg-primary/30 blur-xl rounded-full animate-pulse"></div>
                  <Loader2 className="w-14 h-14 text-indigo-400 animate-spin relative z-10" />
                </div>
                <h3 className="text-2xl font-semibold text-white mb-2">正在处理...</h3>
                <p className="text-gray-400 text-center">正在{mode === 'manual' ? '应用您的裁剪' : '智能分析主体'}，并生成高清图像。</p>
              </div>
            )}
            {status === ProcessingStatus.SUCCESS && result && (
              <ResultCard data={result} onReset={handleReset} />
            )}
          </div>
          {status === ProcessingStatus.IDLE && (
            <div className="mt-24 grid grid-cols-1 md:grid-cols-3 gap-6 text-center w-full max-w-5xl">
              {[
                { title: "多比例支持", desc: "支持 16:9, 4:3, 1:1 等多种常用社交媒体比例。" },
                { title: "智能压缩引擎", desc: "自动将体积控制在 2MB 以内，同时保持画质。" },
                { title: "隐私安全", desc: "所有处理均在浏览器本地完成，图片无需上传服务器。" }
              ].map((item, idx) => (
                <div key={idx} className="p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.05] transition-all duration-300 group">
                  <h4 className="text-gray-200 font-semibold mb-2 group-hover:text-indigo-300 transition-colors">{item.title}</h4>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          )}
        </main>
        <footer className="py-8 text-center text-gray-600 text-sm border-t border-white/[0.05] bg-[#0B0F19]/50">
          <p>&copy; {new Date().getFullYear()} InstaCrops Pro. Designed for 宁波大学 Camerart</p>
        </footer>
      </div>
      {showCropper && tempFile && (
        <ManualCropper file={tempFile} onConfirm={handleManualCropConfirm} onCancel={handleManualCropCancel} />
      )}
    </div>
  );
};
export default App;
