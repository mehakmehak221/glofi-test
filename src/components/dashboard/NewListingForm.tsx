import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon, LoadingSpinner } from "../VectorImages";
import { 
    useCreateAssetMutation, 
    useUploadFileMutation, 
    useSubmitAssetForReviewMutation,
    useGetPartnerAssetByIdQuery,
    useUpdateAssetMutation 
} from "@/store/api/assetApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { validateFileUpload } from "@/utils/assetUtils";
import { Country, State, City } from "country-state-city";
import KYBModal from "./KYBModal";
import KYCModal from "./KYCModal";

const DROPDOWN_STYLES = `
  .dropdown-scroll::-webkit-scrollbar {
    width: 6px;
  }
  .dropdown-scroll::-webkit-scrollbar-track {
    background: transparent;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb {
    background: var(--sidebar-border);
    border-radius: 10px;
  }
  .dropdown-scroll::-webkit-scrollbar-thumb:hover {
    background: var(--sidebar-active-text);
  }
`;

function LocationDropdown({ label, options, value, onChange, placeholder, disabled = false }) {
    const [isOpen, setIsOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredOptions = options.filter(opt => 
        opt.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex flex-col gap-2 relative" ref={dropdownRef}>
            <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">{label}</label>
            <div 
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md px-4 py-3.5 text-sm font-montserrat cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--sidebar-active-text)]/30'} ${isOpen ? 'border-[var(--sidebar-active-text)]/30 ring-1 ring-[var(--sidebar-active-text)]/10' : ''}`}
            >
                <span className={value ? "text-[var(--foreground)]" : "text-[var(--sidebar-text)]/30"}>
                    {value || placeholder}
                </span>
                <svg className={`w-4 h-4 text-[var(--sidebar-text)]/50 transition-transform ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute z-[100] top-[calc(100%+8px)] left-0 right-0 bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-3 border-b border-[var(--sidebar-border)]">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 font-montserrat"
                            />
                        </div>
                        <div className="max-h-[250px] overflow-y-auto dropdown-scroll">
                            {filteredOptions.length > 0 ? (
                                filteredOptions.map((opt) => (
                                    <div
                                        key={opt.isoCode || opt.name}
                                        onClick={() => {
                                            onChange(opt);
                                            setIsOpen(false);
                                            setSearchTerm("");
                                        }}
                                        className={`px-4 py-2.5 text-sm font-montserrat cursor-pointer hover:bg-[var(--sidebar-active-bg)] hover:text-[var(--sidebar-active-text)] transition-colors ${value === opt.name ? 'bg-[var(--sidebar-active-text)] text-black' : 'text-[var(--foreground)]'}`}
                                    >
                                        {opt.name}
                                    </div>
                                ))
                            ) : (
                                <div className="px-4 py-3 text-xs text-[var(--sidebar-text)]/50 font-montserrat text-center italic">
                                    No results found
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

const CATEGORIES = [
    { label: "Skyscraper", value: "DUBAI_SKYSCRAPER" },
    { label: "Land", value: "LAND_PARCEL" },
    { label: "Commercial", value: "COMMERCIAL_REAL_ESTATE" },
    { label: "Residential", value: "RESIDENTIAL" }
];

const UploadArea = ({ label, onUpload, value, isUploading }) => {
    const fileInputRef = useRef(null);

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
            className={`flex-1 min-w-[200px] aspect-[3/2] rounded-md border border-[var(--sidebar-border)] bg-[var(--background)] hover:shadow-md flex flex-col items-center justify-center p-4 transition-all cursor-pointer group ${
                value ? 'border-[var(--sidebar-active-text)]/40 bg-[var(--sidebar-active-bg)]' : 'hover:border-[var(--sidebar-active-text)]/20'
            }`}
        >
            <input 
                type="file" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3 group-hover:bg-[var(--sidebar-active-bg)] transition-colors">
                {isUploading ? (
                    <LoadingSpinner className="w-5 h-5 text-[var(--sidebar-active-text)]" />
                ) : value ? (
                    <div className="w-6 h-6 rounded-full bg-[var(--sidebar-active-text)] flex items-center justify-center text-[var(--background)] text-[10px] font-bold">✓</div>
                ) : (
                    <UploadIcon className="w-5 h-5 text-[var(--sidebar-text)] opacity-60 group-hover:text-[var(--sidebar-active-text)] group-hover:opacity-100" />
                )}
            </div>
            <span className="text-[11px] font-medium text-[var(--sidebar-text)] opacity-60 text-center uppercase tracking-wider font-montserrat">
                {isUploading ? 'Uploading...' : value ? 'File Uploaded' : label}
            </span>
            {value && (
                <span className="text-[9px] text-[var(--sidebar-active-text)]/80 mt-1 font-montserrat truncate max-w-full px-2">
                    {value.split('/').pop()}
                </span>
            )}
        </div>
    );
};

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
        country: "",
        state: "",
        city: "",
        titleDeedUrl: "",
        valuationReportUrl: "",
        legalOpinionUrl: "",
        images: []
    });
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");

    const [showKybModal, setShowKybModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);

    const { data: assetData, isLoading: isLoadingAsset } = useGetPartnerAssetByIdQuery(editId, { skip: !editId });
    const { data: kybStatus } = useGetKybStatusQuery();
    const { data: kycStatus } = useGetKycStatusQuery();
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
                country: asset.country || "",
                state: asset.state || "",
                city: asset.city || "",
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
            const url = result.key || result.url || result.path; 
            
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
      
        const required = ['title', 'location', 'country', 'state', 'city', 'valuation', 'totalFractions', 'expectedYield', 'description', 'titleDeedUrl'];
        for (const field of required) {
            if (!formData[field]) {
                alert(`Please fill in ${field}`);
                return;
            }
        }

        if (kycStatus?.status !== 'VERIFIED') {
            setShowKycModal(true);
            return;
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
                await createAsset(payload).unwrap();
                alert('Asset created and saved as draft!');
                

                if (kybStatus?.status === 'APPROVED' || kybStatus?.status === 'VERIFIED' || kybStatus?.status === 'PENDING' || kybStatus?.status === 'UNDER_REVIEW') {
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

    useEffect(() => {
        // Drop we don't need script for custom dropdown
    }, []);

    return (
        <>
        <style>{DROPDOWN_STYLES}</style>
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="pb-12"
        >
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-xl lg:text-2xl font-semibold text-[var(--foreground)] font-montserrat tracking-tight">
                    {editId ? "Edit Property" : "New Property"}
                </h1>
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:opacity-80 text-[var(--sidebar-active-text)] px-4 py-2 rounded-md text-sm font-medium font-montserrat transition-all"
                >
                    Back to List
                </button>
            </div>

            {isLoadingAsset ? (
                <div className="flex items-center justify-center p-20">
                    <LoadingSpinner />
                </div>
            ) : (
                <div className="bg-[var(--form-surface)] border border-[var(--sidebar-border)] rounded-md p-4 sm:p-6 lg:p-10">
                  
                <div className="flex overflow-x-auto custom-scrollbar-hide whitespace-nowrap items-center md:justify-center gap-6 md:gap-12 mb-8 sm:mb-10 border-b border-[var(--sidebar-border)] pb-2 sm:pb-4 w-full">
                    {CATEGORIES.map((cat) => (
                        <button
                            key={cat.value}
                            onClick={() => setFormData(prev => ({ ...prev, category: cat.value }))}
                            className={`text-sm font-medium font-montserrat transition-colors relative pb-4 ${
                                formData.category === cat.value ? "text-[var(--foreground)]" : "text-[var(--sidebar-text)] opacity-60 hover:opacity-100 hover:text-[var(--foreground)]"
                            }`}
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
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Location</label>
                        <input
                            type="text"
                            value={formData.location}
                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <LocationDropdown
                        label="Country"
                        options={Country.getAllCountries()}
                        value={formData.country}
                        onChange={(opt) => {
                            setCountryIsoCode(opt.isoCode);
                            setFormData({ ...formData, country: opt.name, state: "", city: "" });
                            setStateIsoCode("");
                        }}
                        placeholder="Select Country"
                    />
                    <LocationDropdown
                        label="State"
                        options={countryIsoCode ? State.getStatesOfCountry(countryIsoCode) : []}
                        value={formData.state}
                        onChange={(opt) => {
                            setStateIsoCode(opt.isoCode);
                            setFormData({ ...formData, state: opt.name, city: "" });
                        }}
                        placeholder="Select State"
                        disabled={!countryIsoCode}
                    />
                    <LocationDropdown
                        label="City"
                        options={(countryIsoCode && stateIsoCode) ? City.getCitiesOfState(countryIsoCode, stateIsoCode) : []}
                        value={formData.city}
                        onChange={(opt) => {
                            setFormData({ ...formData, city: opt.name });
                        }}
                        placeholder="Select City"
                        disabled={!stateIsoCode}
                    />
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Valuation ($)</label>
                        <input
                            type="number"
                            value={formData.valuation}
                            onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Total Fractions</label>
                        <input
                            type="number"
                            value={formData.totalFractions}
                            onChange={(e) => setFormData({ ...formData, totalFractions: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-1">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Annual Yield (%)</label>
                        <input
                            type="number"
                            value={formData.expectedYield}
                            onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat md:max-w-[calc(50%-16px)]"
                        />
                    </div>
                    <div className="flex flex-col gap-2 md:col-span-2">
                        <label className="text-[10px] font-semibold text-[var(--sidebar-text)] opacity-50 tracking-widest uppercase font-montserrat">Description</label>
                        <textarea
                            rows={5}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="..."
                            className="bg-[var(--field-surface)] border border-[var(--sidebar-border)] rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--sidebar-active-text)]/30 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat resize-none"
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

                <div className="bg-[var(--color-status-warning-bg)] border border-[var(--color-status-warning-border)] rounded-md p-4 mb-8 flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0">
                            <BusinessPropertyIcon className="w-4 h-4 text-[var(--color-status-warning)]" />
                        </div>
                        <p className="text-base text-[var(--color-status-warning)]/90 font-montserrat font-medium">
                            Verification required before listing properties.
                        </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-3 ml-11">
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${kycStatus?.status === 'VERIFIED' ? 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)] text-[var(--color-status-success)]' : 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]'}`}>
                            <span className="text-[10px] font-bold uppercase font-montserrat">KYC: {kycStatus?.status || 'NOT SUBMITTED'}</span>
                            {kycStatus?.status !== 'VERIFIED' && (
                                <button onClick={() => setShowKycModal(true)} className="text-[9px] underline font-bold uppercase cursor-pointer bg-transparent border-0 text-inherit p-0">Verify</button>
                            )}
                        </div>
                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border ${kybStatus?.status === 'APPROVED' || kybStatus?.status === 'VERIFIED' ? 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)] text-[var(--color-status-success)]' : 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]'}`}>
                            <span className="text-[10px] font-bold uppercase font-montserrat">KYB: {kybStatus?.status || 'NOT SUBMITTED'}</span>
                            {kybStatus?.status !== 'APPROVED' && kybStatus?.status !== 'VERIFIED' && (
                                <button onClick={() => setShowKybModal(true)} className="text-[9px] underline font-bold uppercase cursor-pointer bg-transparent border-0 text-inherit p-0">Verify</button>
                            )}
                        </div>
                    </div>
                </div>

                <motion.button
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    className="w-full sm:w-auto bg-[var(--sidebar-active-text)] text-[var(--background)] font-bold text-sm px-8 py-3.5 rounded-md hover:opacity-90 transition-opacity font-montserrat min-w-[200px] flex items-center justify-center"
                >
                    {isSubmitting ? <LoadingSpinner /> : editId ? "Update Property" : "Save as Draft"}
                </motion.button>
            </div>
            )}

            <KYCModal 
                isOpen={showKycModal} 
                onClose={() => setShowKycModal(false)}
                onSubmit={() => setShowKycModal(false)}
            />
            <KYBModal 
                isOpen={showKybModal} 
                onClose={() => {
                    setShowKybModal(false);
                }}
                onSubmit={() => {
                    setShowKybModal(false);
                }}
            />
        </motion.div>
        </>
    );
}
