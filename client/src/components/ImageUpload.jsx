import React, { useState, useCallback, useRef } from 'react';
import { Upload, X, FileImage, Loader2, Camera as CameraIcon } from 'lucide-react';
import Webcam from 'react-webcam';

const ImageUpload = ({ onUpload }) => {
    const [dragActive, setDragActive] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [showCamera, setShowCamera] = useState(false);
    const webcamRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    }, []);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = (file) => {
        setSelectedFile(file);
        const reader = new FileReader();
        reader.onloadend = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const clearSelection = () => {
        setSelectedFile(null);
        setPreview(null);
        setShowCamera(false);
    };

    const handleUploadClick = async () => {
        if (!selectedFile) return;
        setUploading(true);
        await onUpload(selectedFile);
        setUploading(false);
    };

    const capture = useCallback(() => {
        const imageSrc = webcamRef.current.getScreenshot();
        setPreview(imageSrc);

        // Convert base64 to blob/file
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
                setSelectedFile(file);
            });

        setShowCamera(false);
    }, [webcamRef]);

    return (
        <div className="w-full max-w-2xl mx-auto">
            {!preview && !showCamera ? (
                <div className="space-y-4">
                    <div
                        className={`relative border-2 border-dashed rounded-3xl p-10 text-center transition-all duration-300 ${dragActive
                            ? "border-neonBlue bg-neonBlue/10"
                            : "border-gray-600 hover:border-gray-400 bg-white/5"
                            }`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="hidden"
                            id="file-upload"
                            accept="image/*"
                            onChange={handleChange}
                        />
                        <label
                            htmlFor="file-upload"
                            className="flex flex-col items-center cursor-pointer"
                        >
                            <div className="bg-gray-800 p-4 rounded-full mb-4">
                                <Upload className="w-8 h-8 text-neonBlue" />
                            </div>
                            <p className="text-xl font-bold text-white mb-2">
                                Upload your image
                            </p>
                            <p className="text-gray-400 text-sm mb-6">
                                Drag & Drop or valid files .jpg, .png, .webp
                            </p>
                            <span className="px-6 py-2 rounded-full border border-gray-600 text-gray-300 hover:text-white hover:border-white transition-colors">
                                Browse Files
                            </span>
                        </label>
                    </div>

                    <div className="relative flex items-center justify-center">
                        <div className="h-px bg-gray-700 w-full absolute"></div>
                        <span className="bg-gray-900 px-4 relative text-gray-400 text-sm">OR</span>
                    </div>

                    <button
                        onClick={() => setShowCamera(true)}
                        className="w-full py-4 rounded-xl border border-gray-600 hover:border-neonBlue hover:bg-white/5 transition-all text-gray-300 hover:text-white flex items-center justify-center gap-2 font-semibold"
                    >
                        <CameraIcon className="w-5 h-5" />
                        Take a Photo
                    </button>
                </div>
            ) : showCamera ? (
                <div className="glass p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <CameraIcon className="w-5 h-5 text-neonBlue" />
                            Camera
                        </h3>
                        <button
                            onClick={() => setShowCamera(false)}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                    </div>

                    <div className="relative rounded-xl overflow-hidden mb-6 bg-black">
                        <Webcam
                            audio={false}
                            ref={webcamRef}
                            screenshotFormat="image/jpeg"
                            className="w-full h-auto"
                        />
                    </div>

                    <div className="flex justify-center">
                        <button
                            onClick={capture}
                            className="px-8 py-3 rounded-full bg-red-500 hover:bg-red-600 text-white font-bold transition-colors flex items-center gap-2"
                        >
                            <div className="w-4 h-4 bg-white rounded-full"></div>
                            Capture
                        </button>
                    </div>
                </div>
            ) : (
                <div className="glass p-6 rounded-3xl">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="font-semibold text-white flex items-center gap-2">
                            <FileImage className="w-5 h-5 text-neonBlue" />
                            Selected Image
                        </h3>
                        <button
                            onClick={clearSelection}
                            className="p-2 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-5 h-5 text-gray-400 hover:text-white" />
                        </button>
                    </div>

                    <div className="relative rounded-xl overflow-hidden mb-6 max-h-[400px] flex items-center justify-center bg-black/50">
                        <img
                            src={preview}
                            alt="Preview"
                            className="max-w-full max-h-full object-contain"
                        />
                    </div>

                    <button
                        onClick={handleUploadClick}
                        disabled={uploading}
                        className="w-full py-3 rounded-xl bg-gradient-to-r from-neonBlue to-neonPurple text-white font-bold hover:shadow-[0_0_20px_rgba(0,243,255,0.4)] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {uploading ? (
                            <>
                                <Loader2 className="animate-spin" /> Processing...
                            </>
                        ) : (
                            'Generate Magic'
                        )}
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUpload;
