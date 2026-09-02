import React, { useRef, useState, useEffect } from 'react';
import { Camera, RefreshCw, Check, X, AlertCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/Button';
import { LanguageCode } from '../../types';

export interface CameraCaptureModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (base64Image: string, fileName: string) => void;
  language: LanguageCode;
}

export const CameraCaptureModal: React.FC<CameraCaptureModalProps> = ({
  isOpen,
  onClose,
  onCapture,
  language,
}) => {
  const isHindi = language === 'hi';
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setIsInitializing(true);
    setCameraError(null);
    setCapturedImage(null);

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error(
          isHindi
            ? 'आपका ब्राउज़र कैमरा उपयोग का समर्थन नहीं करता।'
            : 'Camera access is not supported by your browser.'
        );
      }

      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
        audio: false,
      });

      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play().catch(() => {});
      }
    } catch (err: any) {
      console.warn('Camera initialization error:', err);
      setCameraError(
        err.message ||
          (isHindi
            ? 'कैमरा खोलने में असमर्थ। कृपया अनुमति जांचें।'
            : 'Unable to access camera. Please check camera permissions.')
      );
    } finally {
      setIsInitializing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const handleTakePhoto = () => {
    if (!videoRef.current) return;

    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      setCapturedImage(dataUrl);
      stopCamera();
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedImage) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      onCapture(capturedImage, `campus-capture-${timestamp}.jpg`);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between text-white">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base">
              {isHindi ? 'कैमरा से फोटो लें (Live Capture)' : 'Live Camera Capture'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded-lg cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Camera Stage */}
        <div className="relative aspect-video w-full bg-black flex items-center justify-center overflow-hidden">
          {cameraError ? (
            <div className="p-6 text-center space-y-3 text-slate-300">
              <AlertCircle className="w-10 h-10 text-rose-500 mx-auto" />
              <p className="text-xs text-rose-300">{cameraError}</p>
              <Button size="sm" variant="outline" onClick={startCamera}>
                {isHindi ? 'पुनः प्रयास करें' : 'Retry Camera'}
              </Button>
            </div>
          ) : capturedImage ? (
            <img
              src={capturedImage}
              alt="Captured Frame"
              className="w-full h-full object-contain"
            />
          ) : (
            <>
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
              {isInitializing && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-xs text-slate-300 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-emerald-400" />
                  <span>{isHindi ? 'कैमरा शुरू हो रहा है...' : 'Starting camera feed...'}</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Controls */}
        <div className="p-4 bg-slate-950 flex items-center justify-between gap-3">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-slate-300 hover:text-white">
            {isHindi ? 'रद्द करें' : 'Cancel'}
          </Button>

          {capturedImage ? (
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                leftIcon={<RefreshCw className="w-3.5 h-3.5" />}
                onClick={handleRetake}
                className="text-slate-300 border-slate-700"
              >
                {isHindi ? 'दोबारा लें' : 'Retake'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Check className="w-4 h-4" />}
                onClick={handleConfirm}
              >
                {isHindi ? 'फोटो का उपयोग करें' : 'Use Photo'}
              </Button>
            </div>
          ) : (
            <Button
              variant="primary"
              size="md"
              leftIcon={<Camera className="w-4 h-4" />}
              onClick={handleTakePhoto}
              disabled={isInitializing || !!cameraError}
            >
              {isHindi ? 'फोटो खींचें' : 'Capture Snapshot'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
