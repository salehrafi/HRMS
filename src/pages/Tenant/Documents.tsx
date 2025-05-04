
import { useState, useRef } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { documents } from "@/lib/mock-data";
import { Document } from "@/types/property";
import { FileText, Upload, File, X, Download } from "lucide-react";

const TenantDocuments = () => {
  const [docs, setDocs] = useState<Document[]>(documents);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;
    handleFilesSelected(Array.from(e.target.files));
  };

  // Handle files selected via drag and drop or file input
  const handleFilesSelected = (selectedFiles: File[]) => {
    if (!selectedFiles.length) return;
    
    // Process the files (in a real app, we'd upload them)
    const newDocs: Document[] = selectedFiles.map((file) => ({
      id: `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      name: file.name,
      type: file.type.split('/')[1].toUpperCase(),
      url: "#", // In a real app, this would be the URL after upload
      uploadedAt: new Date().toISOString(),
    }));
    
    setDocs((prevDocs) => [...prevDocs, ...newDocs]);
    
    toast({
      title: "Document Uploaded",
      description: `${selectedFiles.length} document(s) uploaded successfully.`,
    });
  };

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files?.length) {
      handleFilesSelected(Array.from(e.dataTransfer.files));
    }
  };

  // Delete a document
  const handleDeleteDocument = (docId: string) => {
    setDocs((prevDocs) => prevDocs.filter((doc) => doc.id !== docId));
    
    toast({
      title: "Document Deleted",
      description: "Document has been deleted successfully.",
    });
  };

  return (
    <DashboardLayout title="Documents" subtitle="Upload and manage your documents">
      {/* Upload Area */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Upload Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div
            className={`flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors ${
              dragActive ? "border-rentflow-primary bg-rentflow-primary/5" : "border-gray-300"
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <Upload className={`mb-2 h-10 w-10 ${dragActive ? "text-rentflow-primary" : "text-gray-400"}`} />
            <p className="mb-1 text-sm font-medium">
              {dragActive ? "Drop files here" : "Drag and drop files here"}
            </p>
            <p className="mb-4 text-xs text-gray-500">
              or click to browse (PDF, JPG, PNG)
            </p>
            <Button
              onClick={() => fileInputRef.current?.click()}
              className="bg-rentflow-primary hover:bg-rentflow-secondary"
            >
              Select Files
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              className="hidden"
              onChange={handleFileChange}
            />
          </div>
        </CardContent>
      </Card>

      {/* Document List */}
      <Card>
        <CardHeader>
          <CardTitle>Your Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {docs.length > 0 ? (
              docs.map((doc) => (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-lg border p-4"
                >
                  <div className="flex items-center space-x-3">
                    <div className="rounded-lg bg-gray-100 p-2">
                      <FileText className="h-6 w-6 text-gray-500" />
                    </div>
                    <div>
                      <p className="font-medium">{doc.name}</p>
                      <div className="flex items-center space-x-2 text-xs text-gray-500">
                        <span>{doc.type}</span>
                        <span>&bull;</span>
                        <span>{new Date(doc.uploadedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => toast({
                        title: "Download Started",
                        description: `Downloading ${doc.name}...`,
                      })}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:border-red-500 hover:bg-red-50"
                      onClick={() => handleDeleteDocument(doc.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-lg border border-dashed p-6 text-center">
                <File className="mx-auto mb-2 h-10 w-10 text-gray-300" />
                <p className="text-gray-500">No documents uploaded yet</p>
                <p className="mt-1 text-xs text-gray-400">
                  Upload important documents like rental agreement, ID proof, etc.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
};

export default TenantDocuments;
