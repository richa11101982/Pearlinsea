
import React, { useState, useCallback } from 'react';
import { generateMockup } from './services/geminiService';
import { PRODUCTS } from './constants';
import type { Product } from './types';

// --- Helper Components (Defined outside App to prevent re-renders) ---

const UploadIcon: React.FC<{className?: string}> = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-10 h-10 mx-auto text-gray-400"}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
  </svg>
);

const MagicWandIcon: React.FC<{className?: string}> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className || "w-6 h-6"}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 0 0-5.78 1.128 2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 0 3 22.5a2.25 2.25 0 0 0 2.25-2.25c0-1.152-.26-2.243-.723-3.218a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118A2.25 2.25 0 0 0 3 9.75a2.25 2.25 0 0 0 2.25-2.25c0-1.152-.26-2.243-.723-3.218a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118A2.25 2.25 0 0 0 3 2.25a2.25 2.25 0 0 0 2.25-2.25c0-1.152.26-2.243.723-3.218a3 3 0 0 0 5.78 1.128c.168.603.337 1.226.504 1.858a2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 0 6.75 9.75a2.25 2.25 0 0 0-2.25 2.25c0 1.152.26 2.243.723 3.218a3 3 0 0 0 5.78 1.128a2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 0 2.25 2.25a2.25 2.25 0 0 0 2.25-2.25c0-1.152.26-2.243.723-3.218a3 3 0 0 0 5.78 1.128c.168.603.337 1.226.504 1.858a2.25 2.25 0 0 1-2.475 2.118A2.25 2.25 0 0 0 17.25 15a2.25 2.25 0 0 0-2.25 2.25c0 1.152.26 2.243.723 3.218a3 3 0 0 0 5.78 1.128a2.25 2.25 0 0 1 2.475 2.118 2.25 2.25 0 0 0 2.25 2.25a2.25 2.25 0 0 0 2.25-2.25c0-1.152-.26-2.243-.723-3.218a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118A2.25 2.25 0 0 0 17.25 9.75a2.25 2.25 0 0 0-2.25-2.25c0-1.152-.26-2.243-.723-3.218a3 3 0 0 0-5.78-1.128 2.25 2.25 0 0 1-2.475-2.118A2.25 2.25 0 0 0 9.75 3.75a2.25 2.25 0 0 0-2.25-2.25c-1.152 0-2.243.26-3.218.723a3 3 0 0 0-1.128 5.78 2.25 2.25 0 0 1 2.118 2.475A2.25 2.25 0 0 0 7.5 12a2.25 2.25 0 0 0 2.25-2.25c0-1.152-.26-2.243-.723-3.218a3 3 0 0 0-1.128-5.78 2.25 2.25 0 0 1-2.118-2.475A2.25 2.25 0 0 0 3.75 6.75a2.25 2.25 0 0 0-2.25-2.25c-1.152 0-2.243.26-3.218.723a3 3 0 0 0-1.128 5.78 2.25 2.25 0 0 1 2.118 2.475c.374.87.683 1.774 1.01 2.708.168.473.336.95.504 1.428.168.473.336.95.504 1.428.168.473.336.95.504 1.428" />
    </svg>
);


const Loader: React.FC = () => (
    <div className="flex flex-col items-center justify-center space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-400"></div>
      <p className="text-purple-300 font-semibold">Generating your masterpiece...</p>
      <p className="text-sm text-gray-400 text-center">This can take a moment. The AI is working its magic!</p>
    </div>
);

interface LogoUploaderProps {
  logoFile: File | null;
  setLogoFile: (file: File | null) => void;
  logoPreview: string | null;
  setLogoPreview: (preview: string | null) => void;
}

const LogoUploader: React.FC<LogoUploaderProps> = ({ logoFile, setLogoFile, logoPreview, setLogoPreview }) => {
  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold text-purple-300 mb-2">Step 1: Upload Your Logo</h3>
      <label htmlFor="logo-upload" className="cursor-pointer block bg-gray-800 border-2 border-dashed border-gray-600 rounded-lg p-6 text-center hover:border-purple-400 transition-colors">
        {logoPreview ? (
          <img src={logoPreview} alt="Logo Preview" className="max-h-32 mx-auto rounded-md" />
        ) : (
          <div>
            <UploadIcon />
            <p className="mt-2 text-sm text-gray-400">Drag & drop or click to upload</p>
            <p className="text-xs text-gray-500">PNG, JPG, WEBP (transparent background recommended)</p>
          </div>
        )}
        <input id="logo-upload" type="file" className="hidden" accept="image/*" onChange={handleLogoChange} />
      </label>
      {logoFile && <p className="text-xs text-gray-400 mt-2 text-center">File: {logoFile.name}</p>}
    </div>
  );
};

interface ProductSelectorProps {
  selectedProduct: Product | null;
  onSelectProduct: (product: Product) => void;
}

const ProductSelector: React.FC<ProductSelectorProps> = ({ selectedProduct, onSelectProduct }) => (
  <div>
    <h3 className="text-lg font-semibold text-purple-300 mb-2">Step 2: Choose a Product</h3>
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {PRODUCTS.map((product) => (
        <div
          key={product.id}
          onClick={() => onSelectProduct(product)}
          className={`cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 ${selectedProduct?.id === product.id ? 'border-purple-500 scale-105 shadow-lg shadow-purple-900/50' : 'border-gray-700 hover:border-purple-400'}`}
        >
          <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover aspect-square" />
          <p className="text-center bg-gray-800 text-xs py-1 font-medium">{product.name}</p>
        </div>
      ))}
    </div>
  </div>
);

interface ResultPanelProps {
    isLoading: boolean;
    error: string | null;
    generatedImage: string | null;
    selectedProduct: Product | null;
}

const ResultPanel: React.FC<ResultPanelProps> = ({ isLoading, error, generatedImage, selectedProduct }) => {
    const downloadImage = () => {
        if (!generatedImage) return;
        const link = document.createElement('a');
        link.href = generatedImage;
        link.download = `mockup-${selectedProduct?.name.toLowerCase().replace(' ', '-') || 'download'}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (
        <div className="bg-gray-800/50 rounded-lg p-4 lg:p-6 w-full h-full flex items-center justify-center min-h-[400px] lg:min-h-0">
            {isLoading && <Loader />}
            {!isLoading && error && (
                <div className="text-center text-red-400">
                    <h3 className="text-lg font-bold">An error occurred</h3>
                    <p className="text-sm">{error}</p>
                </div>
            )}
            {!isLoading && !error && generatedImage && (
                <div className="space-y-4 w-full">
                    <h3 className="text-xl font-bold text-center text-purple-300">Your Mockup is Ready!</h3>
                    <img src={generatedImage} alt="Generated Mockup" className="rounded-lg w-full max-w-md mx-auto shadow-2xl" />
                    <button onClick={downloadImage} className="w-full bg-purple-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2">
                        <span>Download Image</span>
                    </button>
                </div>
            )}
            {!isLoading && !error && !generatedImage && (
                <div className="text-center text-gray-500">
                    <MagicWandIcon className="w-16 h-16 mx-auto" />
                    <h3 className="text-lg font-semibold mt-4">Your result will appear here</h3>
                    <p className="text-sm">Complete the steps to generate your mockup.</p>
                </div>
            )}
        </div>
    );
};


// --- Main App Component ---

export default function App() {
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(PRODUCTS[0]);
  const [prompt, setPrompt] = useState<string>('Place the logo on the center of the chest, make it look natural.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = useCallback(async () => {
    if (!logoFile || !selectedProduct) {
      setError('Please upload a logo and select a product.');
      return;
    }

    setIsLoading(true);
    setGeneratedImage(null);
    setError(null);

    try {
      const result = await generateMockup(logoFile, selectedProduct.imageUrl, prompt);
      setGeneratedImage(result);
    } catch (e: any) {
      setError(e.message || 'An unknown error occurred.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  }, [logoFile, selectedProduct, prompt]);

  const isGenerateDisabled = !logoFile || !selectedProduct || isLoading;

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
            Merch Mockup Generator
          </h1>
          <p className="mt-2 text-lg text-gray-400">
            Create stunning product mockups instantly with AI.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column: Controls */}
          <div className="bg-gray-800/50 p-6 rounded-lg shadow-lg space-y-8">
            <LogoUploader logoFile={logoFile} setLogoFile={setLogoFile} logoPreview={logoPreview} setLogoPreview={setLogoPreview} />
            <ProductSelector selectedProduct={selectedProduct} onSelectProduct={setSelectedProduct} />
            
            <div>
              <h3 className="text-lg font-semibold text-purple-300 mb-2">Step 3: Describe Your Mockup (Optional)</h3>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., 'Place the logo on the left chest, slightly smaller'"
                className="w-full bg-gray-900 border border-gray-600 rounded-lg p-3 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                rows={3}
              />
            </div>

            <button
              onClick={handleGenerate}
              disabled={isGenerateDisabled}
              className={`w-full text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 text-lg
                ${isGenerateDisabled ? 'bg-gray-600 cursor-not-allowed' : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'}
              `}
            >
              <MagicWandIcon className="w-6 h-6"/>
              <span>{isLoading ? 'Generating...' : 'Generate Mockup'}</span>
            </button>
          </div>

          {/* Right Column: Result */}
          <div className="flex-grow">
            <ResultPanel 
                isLoading={isLoading} 
                error={error} 
                generatedImage={generatedImage}
                selectedProduct={selectedProduct}
            />
          </div>
        </div>

        <footer className="text-center mt-12 text-gray-500 text-sm">
            <p>Powered by Gemini 2.5 Flash Image</p>
        </footer>
      </div>
    </div>
  );
}
