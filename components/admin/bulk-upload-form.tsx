"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, Download, CheckCircle, XCircle, Loader2 } from "lucide-react";
import toast from "react-hot-toast";
import Papa from "papaparse";

interface UploadResult {
  success: number;
  failed: number;
  errors: string[];
}

const CSV_TEMPLATE = `name,sku,categorySlug,status,tag,brands,models,years,fuelTypes,countrySpecs,description,shortDesc,isFeatured
BMW M5 Engine Mount,BMW-M5-EM-001,engine-parts,AVAILABLE,OEM,"BMW","M5;M5 Competition","2018;2019;2020","Petrol","GCC;Euro","OEM engine mount for BMW M5","OEM fitment guaranteed",false`;

export function BulkUploadForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    setResult(null);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        try {
          const res = await fetch("/api/products/bulk", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rows: results.data }),
          });

          const data = await res.json();
          if (data.success) {
            setResult(data.data);
            toast.success(`Uploaded ${data.data.success} products`);
            router.refresh();
          } else {
            toast.error(data.error || "Upload failed");
          }
        } catch {
          toast.error("Upload failed");
        } finally {
          setIsLoading(false);
        }
      },
      error: () => {
        toast.error("Failed to parse CSV");
        setIsLoading(false);
      },
    });
  };

  const downloadTemplate = () => {
    const blob = new Blob([CSV_TEMPLATE], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "products-template.csv";
    a.click();
  };

  return (
    <div className="space-y-5">
      <div className="glass rounded-lg p-5">
        <h3 className="font-display font-semibold text-white mb-3">Instructions</h3>
        <ol className="text-carbon-400 text-sm space-y-1 list-decimal list-inside">
          <li>Download the CSV template below</li>
          <li>Fill in your product data (use semicolons for multiple values)</li>
          <li>Upload the completed CSV file</li>
          <li>Review the upload results</li>
        </ol>
        <button onClick={downloadTemplate} className="btn-ghost-gold text-sm py-2 mt-4 flex items-center gap-2">
          <Download size={14} /> Download Template
        </button>
      </div>

      <div className="glass rounded-lg p-8 border-2 border-dashed border-carbon-600 hover:border-gold/50 transition-colors text-center">
        <Upload size={32} className="text-carbon-500 mx-auto mb-3" />
        <p className="text-white font-medium mb-1">Upload CSV File</p>
        <p className="text-carbon-500 text-sm mb-4">Max 500 products per upload</p>
        <label className="btn-gold text-sm cursor-pointer inline-flex items-center gap-2">
          {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {isLoading ? "Processing..." : "Choose File"}
          <input type="file" accept=".csv" onChange={handleUpload} className="hidden" disabled={isLoading} />
        </label>
      </div>

      {result && (
        <div className="glass rounded-lg p-5 space-y-3">
          <h3 className="font-display font-semibold text-white">Upload Results</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle size={16} />
              <span className="text-sm">{result.success} successful</span>
            </div>
            <div className="flex items-center gap-2 text-red-400">
              <XCircle size={16} />
              <span className="text-sm">{result.failed} failed</span>
            </div>
          </div>
          {result.errors.length > 0 && (
            <div className="bg-red-400/5 border border-red-400/20 rounded-sm p-3">
              <p className="text-red-400 text-xs font-medium mb-2">Errors:</p>
              {result.errors.slice(0, 10).map((err, i) => (
                <p key={i} className="text-carbon-400 text-xs">{err}</p>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
