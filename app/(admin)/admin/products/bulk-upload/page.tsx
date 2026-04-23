import { BulkUploadForm } from "@/components/admin/bulk-upload-form";

export default function BulkUploadPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-2xl font-bold text-white">Bulk Upload</h1>
        <p className="text-carbon-400 text-sm mt-1">Upload multiple products via CSV</p>
      </div>
      <BulkUploadForm />
    </div>
  );
}
