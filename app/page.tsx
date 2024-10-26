"use client";

import { useState } from "react";
import { Upload, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";

export default function Home() {
  const [files, setFiles] = useState<File[]>([]);
  const [companyName, setCompanyName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append("Label", companyName);
      formData.append("CutType", "Full Cut");

      files.forEach((file) => {
        formData.append("Files", file);
      });

      const response = await fetch("https://staging.motor-cut.com/brouchers/Create-Broucher/", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      toast({
        title: "Success!",
        description: "Your brochure has been uploaded successfully.",
      });

      // Reset form
      setCompanyName("");
      setFiles([]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload brochure. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Card className="p-6 sm:p-8 bg-white shadow-xl rounded-xl">
          <div className="flex items-center gap-3 mb-8">
            <Building2 className="h-8 w-8 text-primary" />
            <h1 className="text-2xl font-bold text-gray-900">Brochure Upload</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                placeholder="Enter company name"
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="files">Upload Files</Label>
              <div className="mt-2">
                <div className="flex justify-center rounded-lg border border-dashed border-gray-300 px-6 py-10">
                  <div className="text-center">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-4 flex text-sm leading-6 text-gray-600">
                      <label
                        htmlFor="files"
                        className="relative cursor-pointer rounded-md bg-white font-semibold text-primary focus-within:outline-none focus-within:ring-2 focus-within:ring-primary focus-within:ring-offset-2 hover:text-primary/80"
                      >
                        <span>Upload files</span>
                        <Input
                          id="files"
                          type="file"
                          multiple
                          className="sr-only"
                          onChange={handleFileChange}
                          required
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs leading-5 text-gray-600">
                      PDF, PNG, JPG up to 10MB each
                    </p>
                  </div>
                </div>
              </div>
              {files.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-900">Selected files:</h4>
                  <ul className="mt-2 divide-y divide-gray-100">
                    {files.map((file, index) => (
                      <li key={index} className="py-2 text-sm text-gray-600">
                        {file.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Uploading..." : "Upload Brochure"}
            </Button>
          </form>
        </Card>
      </div>
    </main>
  );
}