"use client";

import React, { useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Navbar } from "@/components/Navbar";
import { Sidebar } from "@/components/Sidebar";
import { DashboardHeader } from "@/components/DashboardHeader";
import { Input } from "@/components/Input";
import { Button } from "@/components/Button";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useAuth } from "@/features/auth/AuthContext";
import { issueService } from "@/services/issue";
import { Camera, MapPin, Loader2, UploadCloud, X } from "lucide-react";

// Dynamically load the Leaflet Map to avoid SSR errors
const InteractiveMap = dynamic(
  () => import("@/components/InteractiveMap").then((mod) => mod.InteractiveMap),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] w-full bg-zinc-100 dark:bg-zinc-900 rounded-3xl flex flex-col items-center justify-center text-zinc-400 dark:text-zinc-600 animate-pulse border border-zinc-150 dark:border-zinc-800">
        <Loader2 className="w-8 h-8 animate-spin mb-2" />
        <span className="text-xs font-semibold uppercase tracking-wider">Loading Map...</span>
      </div>
    ),
  }
);

const reportSchema = z.object({
  title: z
    .string()
    .min(1, "Title is required")
    .min(3, "Title must be at least 3 characters"),
  description: z
    .string()
    .min(1, "Description is required")
    .min(5, "Description must be at least 5 characters"),
  category: z.string().min(1, "Please select a category"),
  priority: z.string().min(1, "Please select priority"),
  latitude: z.number().min(-90, "Latitude must be between -90 and 90").max(90, "Latitude must be between -90 and 90"),
  longitude: z.number().min(-180, "Longitude must be between -180 and 180").max(180, "Longitude must be between -180 and 180"),
  address: z.string().min(1, "Address details are required"),
});

type ReportFields = z.infer<typeof reportSchema>;

export default function ReportIssuePage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [selectedMapPin, setSelectedMapPin] = useState<[number, number] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ReportFields>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "Pothole",
      priority: "Medium",
      latitude: 19.076, // Default Mumbai
      longitude: 72.8777,
      address: "",
    },
  });

  if (authLoading) {
    return <LoadingSpinner fullPage message="Verifying session..." />;
  }

  // Redirect non-citizens (admins shouldn't report issues)
  if (user && user.role !== "citizen") {
    return (
      <div className="flex flex-col min-h-screen bg-zinc-50 dark:bg-zinc-950">
        <Navbar />
        <div className="flex-1 flex items-center justify-center p-6 text-center">
          <div className="max-w-md bg-white border border-zinc-150 p-8 rounded-3xl dark:bg-zinc-900 dark:border-zinc-800 shadow-lg">
            <h2 className="text-xl font-bold text-red-650 dark:text-red-400 mb-2">Access Denied</h2>
            <p className="text-zinc-550 dark:text-zinc-450 text-sm mb-6">
              Only registered citizens can submit issues. Ward administrators monitor and resolve reported cases.
            </p>
            <Button variant="primary" onClick={() => router.push("/admin-dashboard")}>
              Go to Admin Dashboard
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const handleMapClick = (lat: number, lng: number) => {
    setSelectedMapPin([lat, lng]);
    setValue("latitude", Number(lat.toFixed(6)));
    setValue("longitude", Number(lng.toFixed(6)));
    
    // Auto populate address helper if empty
    setValue("address", `Coordinates: ${lat.toFixed(4)}, ${lng.toFixed(4)} (Double-click to edit)`);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
  };

  const onSubmit = async (data: ReportFields) => {
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      formData.append("category", data.category);
      formData.append("priority", data.priority);
      formData.append("latitude", data.latitude.toString());
      formData.append("longitude", data.longitude.toString());
      formData.append("address", data.address);
      
      if (imageFile) {
        formData.append("image", imageFile);
      }

      await issueService.createIssue(formData);
      toast.success("Civic report submitted successfully!");
      router.push("/citizen-dashboard");
    } catch (e: any) {
      toast.error(e.message || "Failed to submit report. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-50 dark:bg-zinc-950 transition-colors">
      <Navbar />

      <div className="flex-1 flex flex-row">
        <Sidebar />

        {/* Form area */}
        <main className="flex-1 p-6 sm:p-8 max-w-5xl mx-auto overflow-y-auto w-full">
          <DashboardHeader
            title="Report Civic Issue"
            subtitle="File a geotagged complaint regarding public infrastructure issues in your neighborhood."
          />

          <div className="bg-white border border-zinc-150 p-6 sm:p-8 rounded-3xl shadow-xl dark:bg-zinc-900 dark:border-zinc-800 transition-colors">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
              {/* Basic Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-5">
                  <Input
                    label="Issue Title"
                    placeholder="e.g. Clogged drain on Main Street"
                    error={errors.title?.message}
                    {...register("title")}
                  />

                  <Input
                    label="Description"
                    type="textarea"
                    placeholder="Describe the issue, including location details, hazard level, and since when it has been present..."
                    error={errors.description?.message}
                    {...register("description")}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Category"
                      type="select"
                      options={[
                        { value: "Pothole", label: "Pothole" },
                        { value: "Garbage", label: "Garbage" },
                        { value: "Water Logging", label: "Water Logging" },
                        { value: "Streetlight", label: "Streetlight" },
                        { value: "Road Damage", label: "Road Damage" },
                        { value: "Other", label: "Other" },
                      ]}
                      error={errors.category?.message}
                      {...register("category")}
                    />

                    <Input
                      label="Priority"
                      type="select"
                      options={[
                        { value: "Low", label: "Low Priority" },
                        { value: "Medium", label: "Medium Priority" },
                        { value: "High", label: "High Priority" },
                      ]}
                      error={errors.priority?.message}
                      {...register("priority")}
                    />
                  </div>
                </div>

                {/* Image upload preview */}
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                    Upload Issue Photograph
                  </span>
                  
                  {imagePreview ? (
                    <div className="relative h-64 w-full rounded-2xl overflow-hidden bg-zinc-100 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex-1 min-h-[220px]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={imagePreview}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-3 right-3 p-1.5 rounded-xl bg-black/60 hover:bg-black/80 text-white transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex-1 min-h-[220px] rounded-2xl border-2 border-dashed border-zinc-200 hover:border-blue-500/50 bg-zinc-50/50 hover:bg-blue-50/10 cursor-pointer flex flex-col items-center justify-center p-6 text-center transition-all dark:border-zinc-800 dark:bg-zinc-900/10 dark:hover:bg-zinc-900/20">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="sr-only"
                      />
                      <UploadCloud className="w-12 h-12 text-zinc-400 dark:text-zinc-6550 mb-3" />
                      <span className="text-sm font-bold text-zinc-700 dark:text-zinc-350 mb-1">
                        Drag and drop or browse files
                      </span>
                      <span className="text-xs text-zinc-400 dark:text-zinc-500">
                        Supports PNG, JPG, JPEG (Max 5MB)
                      </span>
                    </label>
                  )}
                </div>
              </div>

              {/* Map Coordinates Picker */}
              <div className="border-t border-zinc-100 dark:border-zinc-850 pt-8 space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-zinc-900 dark:text-white flex items-center gap-1.5">
                    <MapPin className="w-5 h-5 text-blue-600" />
                    Geotag Incident Location
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Click anywhere on the interactive map below to drop a pin. This will automatically lock the coordinates for our engineers.
                  </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Form fields */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <Input
                        label="Latitude"
                        type="text"
                        error={errors.latitude?.message}
                        {...register("latitude", { valueAsNumber: true })}
                      />
                      <Input
                        label="Longitude"
                        type="text"
                        error={errors.longitude?.message}
                        {...register("longitude", { valueAsNumber: true })}
                      />
                    </div>

                    <Input
                      label="Site Address / Landmarks"
                      type="textarea"
                      placeholder="e.g. Outside gate #2 of Sunshine Appts, near the municipal park..."
                      error={errors.address?.message}
                      className="min-h-[110px]"
                      {...register("address")}
                    />
                  </div>

                  {/* Interactive Leaflet Map */}
                  <div className="lg:col-span-2 relative z-10">
                    <InteractiveMap
                      interactive
                      selectedLocation={selectedMapPin}
                      onLocationSelect={handleMapClick}
                      className="h-[250px] w-full rounded-2xl"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-4 border-t border-zinc-100 dark:border-zinc-850 pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={submitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  isLoading={submitting}
                >
                  Submit Complaint
                </Button>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
