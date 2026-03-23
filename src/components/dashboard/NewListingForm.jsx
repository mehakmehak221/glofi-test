import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon, LoadingSpinner } from "../VectorImages";
import { 
    useCreateAssetMutation, 
    useUploadFileMutation, 
    useSubmitAssetForReviewMutation,
    useGetPartnerAssetByIdQuery,
    useUpdateAssetMutation 
} from "@/store/api/assetApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import { validateFileUpload } from "@/utils/assetUtils";
import KYBModal from "./KYBModal";

const CATEGORIES = [
    { label: "Skyscraper", value: "DUBAI_SKYSCRAPER" },
    { label: "Land", value: "LAND" },
    { label: "Commercial", value: "COMMERCIAL" },
    { label: "Residential", value: "RESIDENTIAL" }
];

const UploadArea = ({ label, onUpload, value, isUploading }) => {
    const fileInputRef = useRef(null);

<<<<<<< HEAD
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        try {
            validateFileUpload(file);
            await onUpload(file);
        } catch (err) {
            alert(err.message);
        }
    };

    return (
        <div 
            onClick={() => !isUploading && fileInputRef.current?.click()}
            className={`flex-1 min-w-[200px] aspect-[3/2] rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-bg-nav)] flex flex-col items-center justify-center p-4 transition-colors cursor-pointer group ${
                value ? 'border-[var(--color-primary-300)]/40 bg-[var(--color-primary-300)]/5' : 'hover:border-[var(--color-primary-300)]/20'
            }`}
        >
            <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:bg-[var(--color-primary-300)]/10 transition-colors">
                {isUploading ? (
                    <LoadingSpinner className="w-5 h-5 text-[var(--color-primary-300)]" />
                ) : value ? (
                    <div className="w-6 h-6 rounded-full bg-[var(--color-primary-300)] flex items-center justify-center text-black text-[10px] font-bold">✓</div>
                ) : (
                    <UploadIcon />
                )}
            </div>
            <span className="text-[11px] font-medium text-[var(--color-text-muted)] text-center uppercase tracking-wider font-montserrat">
                {isUploading ? 'Uploading...' : value ? 'File Uploaded' : label}
            </span>
            {value && (
                <span className="text-[9px] text-[var(--color-primary-300)]/60 mt-1 font-montserrat truncate max-w-full px-2">
                    {value.split('/').pop()}
                </span>
            )}
        </div>
    );
};
=======
const UploadArea = ({ label }) => (
    <div className="flex-1 min-w-[200px] aspect-[3/2] rounded-xl border border-[var(--sidebar-border)] bg-[var(--sidebar-bg)] flex flex-col items-center justify-center p-4 hover:shadow-md transition-all cursor-pointer group">
        <div className="w-10 h-10 rounded-full  flex items-center justify-center mb-3 group-hover:bg-[var(--sidebar-active-bg)] transition-colors">
        <UploadIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-60 group-hover:text-[var(--sidebar-active-text)] group-hover:opacity-100" />
        </div>
        <span className="text-[11px] font-medium text-[var(--sidebar-text)] opacity-60 text-center uppercase tracking-wider font-montserrat">
            {label}
        </span>
    </div>
);
>>>>>>> light-mode-ui

export default function NewListingForm({ onBack, editId }) {
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        valuation: "",
        totalFractions: "",
        expectedYield: "",
        description: "",
        riskRating: "MEDIUM",
        category: "DUBAI_SKYSCRAPER",
        titleDeedUrl: "",
        valuationReportUrl: "",
        legalOpinionUrl: "",
        images: []
    });

    const [showKybModal, setShowKybModal] = useState(false);

    const { data: assetData, isLoading: isLoadingAsset } = useGetPartnerAssetByIdQuery(editId, { skip: !editId });
    const { data: kybStatus } = useGetKybStatusQuery();
    const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();
    const [updateAsset, { isLoading: isUpdating }] = useUpdateAssetMutation();
    const [submitAssetForReview] = useSubmitAssetForReviewMutation();
    const [uploadFile] = useUploadFileMutation();
    const [uploadingField, setUploadingField] = useState(null);

    const isSubmitting = isCreating || isUpdating;

    useEffect(() => {
        if (assetData?.data) {
            const asset = assetData.data;
            setFormData({
                title: asset.title || "",
                location: asset.location || "",
                valuation: asset.valuation || "",
                totalFractions: asset.totalFractions || "",
                expectedYield: asset.expectedYield || "",
                description: asset.description || "",
                riskRating: asset.riskRating || "MEDIUM",
                category: asset.category || "DUBAI_SKYSCRAPER",
                titleDeedUrl: asset.titleDeedUrl || "",
                valuationReportUrl: asset.valuationReportUrl || "",
                legalOpinionUrl: asset.legalOpinionUrl || "",
                images: asset.images || []
            });
        }
    }, [assetData]);

    const handleFileUpload = async (file, field) => {
        setUploadingField(field);
        try {
            const result = await uploadFile({ file, folder: 'assets' }).unwrap();
            const url = result.key || result.url || result.path; // Use 'key' as returned by the server
            
            if (field === 'images') {
                setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            } else {
                setFormData(prev => ({ ...prev, [field]: url }));
            }
        } catch (err) {
            console.error('Upload failed:', err);
            alert('Upload failed. Please try again.');
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async () => {
        // Validation
        const required = ['title', 'location', 'valuation', 'totalFractions', 'expectedYield', 'description', 'titleDeedUrl'];
        for (const field of required) {
            if (!formData[field]) {
                alert(`Please fill in ${field}`);
                return;
            }
        }

        try {
            const payload = {
                ...formData,
                valuation: Number(formData.valuation),
                totalFractions: Number(formData.totalFractions),
                expectedYield: Number(formData.expectedYield),
                fractionPrice: Number(formData.valuation) / Number(formData.totalFractions),
            };

            console.log('Saving asset with payload:', payload);

            if (editId) {
                await updateAsset({ id: editId, data: payload }).unwrap();
                alert('Asset updated successfully!');
                onBack();
            } else {
                const result = await createAsset(payload).unwrap();
                console.log('Create asset result:', result);
                
             
                await submitAssetForReview(result.asset.id).unwrap();

                alert('Asset created and submitted for review!');
                

                if (kybStatus?.status === 'APPROVED' || kybStatus?.status === 'PENDING' || kybStatus?.status === 'UNDER_REVIEW') {
                    onBack();
                } else {
                    setShowKybModal(true);
                }
            }
        } catch (err) {
            console.error('Failed to save asset. Full error:', err);
            console.error('Error detail:', JSON.stringify(err, null, 2));
            alert(err?.data?.message || err?.message || 'Failed to save asset');
        }
    };

    return (
        <>
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pb-12"
        >
            <div className="flex items-center justify-between mb-8">
<<<<<<< HEAD
                <h1 className="text-xl lg:text-2xl font-semibold text-white font-montserrat tracking-tight">
                    {editId ? "Edit Property" : "New Property"}
=======
                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight">
                    Properties
>>>>>>> light-mode-ui
                </h1>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:opacity-80 text-[var(--sidebar-active-text)] px-4 py-2 rounded-lg text-sm font-medium font-montserrat transition-all"
                >
                    Back to List
                </button>
            </div>

<<<<<<< HEAD
            {isLoadingAsset ? (
                <div className="flex items-center justify-center p-20">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="bg-[var(--color-bg-surface-subtle)] border border-[var(--color-border-subtle)] rounded-3xl p-6 lg:p-10">
                    {/* ... rest of the form ... */}
                <div className="flex items-center justify-center gap-12 mb-10 border-b border-[var(--color-border-subtle)] pb-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${
                                formData.category === cat.value ? "text-white" : "text-[var(--color-text-muted)] hover:text-white"
                            }`}
=======

          
            <div className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-3xl p-6 lg:p-10">
               
                <div className="flex items-center justify-center gap-12 mb-10 border-b border-[var(--sidebar-border)] pb-4">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => setActiveCat(cat)}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${activeCat === cat ? "text-[var(--foreground)]" : "text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)]"
                                }`}
>>>>>>> light-mode-ui
                        >
                            {cat.label}
                            {formData.category === cat.value && (
                                <motion.div
                                    layoutId="activeCat"
                                    className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--sidebar-active-text)]"
                                />
                            )}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Title</label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Valuation ($)</label>
                        <input
                            type="number"
                            value={formData.valuation}
                            onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Total Fractions</label>
                        <input
                            type="number"
                            value={formData.totalFractions}
                            onChange={(e) => setFormData({ ...formData, totalFractions: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-1">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Annual Yield (%)</label>
                        <input
                            type="number"
                            value={formData.expectedYield}
                            onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat md:max-w-[calc(50%-16px)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Description</label>
                        <textarea
                            rows={5}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--sidebar-bg)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat resize-none"
                        />
                    </div>
                </div>

                <div className="flex flex-wrap gap-4 mb-8">
                    <UploadArea 
                        label="Title Deed" 
                        onUpload={(file) => handleFileUpload(file, 'titleDeedUrl')}
                        value={formData.titleDeedUrl}
                        isUploading={uploadingField === 'titleDeedUrl'}
                    />
                    <UploadArea 
                        label="Valuation Report" 
                        onUpload={(file) => handleFileUpload(file, 'valuationReportUrl')}
                        value={formData.valuationReportUrl}
                        isUploading={uploadingField === 'valuationReportUrl'}
                    />
                    <UploadArea 
                        label="Legal Opinion" 
                        onUpload={(file) => handleFileUpload(file, 'legalOpinionUrl')}
                        value={formData.legalOpinionUrl}
                        isUploading={uploadingField === 'legalOpinionUrl'}
                    />
                    <UploadArea 
                        label="Property Images" 
                        onUpload={(file) => handleFileUpload(file, 'images')}
                        value={formData.images[0]} // Show indicator if at least one image is uploaded
                        isUploading={uploadingField === 'images'}
                    />
                </div>

<<<<<<< HEAD
                <div className="bg-[var(--color-accent-orange)]/5 border border-[var(--color-accent-orange)]/10 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                        <BusinessPropertyIcon className="w-4 h-4 text-[var(--color-accent-orange)]" />
                    </div>
                    <p className="text-base text-[var(--color-accent-orange)]/50 font-montserrat font-medium ">
                        Business verification (KYB) required before listing properties. Company info, documents & bank setup.
=======
                
                <div className="bg-[#f5a623]/5 dark:bg-[var(--color-accent-orange)]/5 border border-[#f5a623]/20 dark:border-[var(--color-accent-orange)]/10 rounded-xl p-4 mb-8 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full  flex items-center justify-center flex-shrink-0">
                    <BusinessPropertyIcon className="w-4 h-4 text-[#f5a623] dark:text-[var(--color-accent-orange)]" />
                    </div>
                    <p className="text-base text-[#f5a623]/90 dark:text-[var(--color-accent-orange)]/50 font-montserrat font-medium ">
                     Business verification (KYB) required before listing properties. Company info, documents & bank setup.
>>>>>>> light-mode-ui
                    </p>
                </div>

                <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
<<<<<<< HEAD
                    className="bg-[var(--color-primary-300)] text-black font-bold text-sm px-8 py-3.5 rounded-2xl hover:bg-[var(--color-primary-100)] transition-colors font-montserrat min-w-[200px] flex items-center justify-center"
=======
                    onClick={() => setIsModalOpen(true)}
                    className="bg-[var(--sidebar-active-text)] text-white font-bold text-sm px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity font-montserrat"
>>>>>>> light-mode-ui
                >
                    {isSubmitting ? <LoadingSpinner color="black" /> : editId ? "Update Property" : "Verify & Submit"}
                </motion.button>
            </div>
            )}

            <KYBModal 
                isOpen={showKybModal} 
                onClose={() => {
                    setShowKybModal(false);
                    onBack();
                }} 
            />
        </motion.div>
        </>
    );
}
