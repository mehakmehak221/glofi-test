import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BusinessPropertyIcon, UploadIcon, LoadingSpinner } from "../VectorImages";
import {
    useCreateAssetMutation,
    useUploadFileMutation,
    useSubmitAssetForReviewMutation,
    useGetAssetByIdQuery,
    useUpdateAssetByIdMutation,
} from "@/store/api/assetApi";
import { useGetKybStatusQuery } from "@/store/api/kybApi";
import { useGetKycStatusQuery } from "@/store/api/kycApi";
import { validateFileUpload, unwrapAssetResponse, type UpdateAssetPayload } from "@/utils/assetUtils";
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

  /* Remove arrows/spinners from number inputs */
  input::-webkit-outer-spin-button,
  input::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }

  input[type=number] {
    -moz-appearance: textfield;
  }
`;

function LocationDropdown({ label, options, value, onChange, placeholder, disabled = false, required = false }) {
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
        <div className={`flex flex-col gap-2 relative ${isOpen ? 'z-30' : 'z-10'}`} ref={dropdownRef}>
            <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                {label}
                {required ? (
                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                ) : (
                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                )}
            </label>
            <div
                onClick={() => !disabled && setIsOpen(!isOpen)}
                className={`flex justify-between items-center bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm font-montserrat cursor-pointer transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:border-[var(--foreground)]/50'} ${isOpen ? 'border-[var(--foreground)] ring-1 ring-[var(--foreground)]/50' : ''}`}
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
                        className="absolute z-[100] top-[calc(100%+8px)] left-0 right-0 bg-[var(--form-surface)] border border-[var(--foreground)]/20 rounded-xl shadow-2xl overflow-hidden backdrop-blur-xl"
                    >
                        <div className="p-3 border-b border-[var(--foreground)]/20">
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-lg px-3 py-2 text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 font-montserrat"
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

function toFormString(value: unknown): string {
    if (value == null || value === "") return "";
    return String(value);
}

function resolveLocationIsoCodes(countryName: string, stateName: string) {
    let countryIso = "";
    let stateIso = "";
    if (!countryName) return { countryIso, stateIso };

    const country = Country.getAllCountries().find(
        (c) => c.name === countryName || c.isoCode === countryName
    );
    if (!country) return { countryIso, stateIso };

    countryIso = country.isoCode;
    if (!stateName) return { countryIso, stateIso };

    const state = State.getStatesOfCountry(country.isoCode).find(
        (s) => s.name === stateName || s.isoCode === stateName
    );
    if (state) stateIso = state.isoCode;

    return { countryIso, stateIso };
}

function assetToFormData(asset: Record<string, unknown>) {
    return {
        title: toFormString(asset.title),
        location: toFormString(asset.location),
        valuation: toFormString(asset.valuation),
        totalFractions: toFormString(asset.totalFractions),
        expectedYield: toFormString(asset.expectedYield),
        expectedAnnualRent: toFormString(asset.expectedAnnualRent),
        rentalGrowthRate: toFormString(asset.rentalGrowthRate),
        expectedAppreciationRate: toFormString(asset.expectedAppreciationRate),
        operatingCostRate: toFormString(asset.operatingCostRate),
        holdingPeriod: toFormString(asset.holdingPeriod),
        description: toFormString(asset.description),
        riskRating: toFormString(asset.riskRating) || "MEDIUM",
        category: toFormString(asset.category) || "RESIDENTIAL",
        country: toFormString(asset.country),
        state: toFormString(asset.state),
        city: toFormString(asset.city),
        titleDeedUrl: toFormString(asset.titleDeedUrl),
        valuationReportUrl: toFormString(asset.valuationReportUrl),
        legalOpinionUrl: toFormString(asset.legalOpinionUrl),
        images: Array.isArray(asset.images) ? (asset.images as string[]) : [],
        isReraVerified: asset.isReraVerified === true,
        saleType: toFormString(asset.saleType) || "FRACTIONAL",
    };
}

function formDataToUpdatePayload(formData: ReturnType<typeof assetToFormData>): UpdateAssetPayload {
    return {
        title: formData.title,
        description: formData.description,
        category: formData.category,
        location: formData.location,
        city: formData.city,
        state: formData.state,
        country: formData.country,
        valuation: Number(formData.valuation),
        totalFractions: Number(formData.totalFractions),
        expectedYield: Number(formData.expectedYield),
        expectedAnnualRent: Number(formData.expectedAnnualRent),
        rentalGrowthRate: Number(formData.rentalGrowthRate),
        expectedAppreciationRate: Number(formData.expectedAppreciationRate),
        operatingCostRate: Number(formData.operatingCostRate),
        holdingPeriod: Number(formData.holdingPeriod),
        riskRating: formData.riskRating,
        titleDeedUrl: formData.titleDeedUrl,
        valuationReportUrl: formData.valuationReportUrl,
        legalOpinionUrl: formData.legalOpinionUrl,
        images: formData.images,
        isReraVerified: formData.isReraVerified,
        isreraverified: formData.isReraVerified,
        saleType: formData.saleType as "FRACTIONAL" | "WHOLE",
    };
}

const UploadArea = ({ label, onUpload, value, isUploading, required = false, optional = false }) => {
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
            className={`flex-1 min-w-[120px] h-28 lg:h-20 rounded-md border border-[var(--foreground)]/20 bg-[var(--background)] hover:shadow-md flex flex-col items-center justify-center p-3 transition-all cursor-pointer group ${value ? 'border-[var(--sidebar-active-text)]/40 bg-[var(--sidebar-active-bg)]' : 'hover:border-[var(--sidebar-active-text)]/20'
                }`}
        >
            <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileChange}
            />
            <div className="w-8 h-8 lg:w-7 lg:h-7 rounded-full flex items-center justify-center mb-2 lg:mb-1.5 group-hover:bg-[var(--sidebar-active-bg)] transition-colors">
                {isUploading ? (
                    <LoadingSpinner className="w-4 h-4 text-[var(--sidebar-active-text)]" />
                ) : value ? (
                    <div className="w-5 h-5 rounded-full bg-[var(--sidebar-active-text)] flex items-center justify-center text-[var(--background)] text-[9px] font-bold">✓</div>
                ) : (
                    <UploadIcon className="w-4 h-4 text-[var(--sidebar-text)] opacity-60 group-hover:text-[var(--sidebar-active-text)] group-hover:opacity-100" />
                )}
            </div>
            <span className="text-[10px] lg:text-[9px] font-medium text-[var(--sidebar-text)] opacity-60 text-center uppercase tracking-wider font-montserrat flex flex-col items-center gap-1">
                <span className="flex items-center gap-1.5">
                    {isUploading ? 'Uploading...' : label}
                    {!isUploading && required && <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>}
                    {!isUploading && optional && <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>}
                </span>
            </span>
            {value && (
                <span className="text-[8px] text-[var(--sidebar-active-text)]/80 mt-0.5 font-montserrat truncate max-w-full px-2">
                    {value.split('/').pop()}
                </span>
            )}
        </div>
    );
};

export default function NewListingForm({ onBack, editId, initialProperty = null }) {
    const [formData, setFormData] = useState({
        title: "",
        location: "",
        valuation: "",
        totalFractions: "",
        expectedYield: "",
        expectedAnnualRent: "",
        rentalGrowthRate: "",
        expectedAppreciationRate: "",
        operatingCostRate: "",
        holdingPeriod: "",
        description: "",
        riskRating: "MEDIUM",
        category: "RESIDENTIAL",
        country: "",
        state: "",
        city: "",
        titleDeedUrl: "",
        valuationReportUrl: "",
        legalOpinionUrl: "",
        images: [],
        isReraVerified: false,
        saleType: "FRACTIONAL"
    });
    const [countryIsoCode, setCountryIsoCode] = useState("");
    const [stateIsoCode, setStateIsoCode] = useState("");

    const [showKybModal, setShowKybModal] = useState(false);
    const [showKycModal, setShowKycModal] = useState(false);

    const {
        data: assetData,
        isLoading: isLoadingAsset,
        isError: isAssetLoadError,
    } = useGetAssetByIdQuery(editId, { skip: !editId });
    const { data: kybStatus, isLoading: isKybStatusLoading } = useGetKybStatusQuery();
    const { data: kycStatus, isLoading: isKycStatusLoading } = useGetKycStatusQuery();
    const [createAsset, { isLoading: isCreating }] = useCreateAssetMutation();
    const [updateAssetById, { isLoading: isUpdating }] = useUpdateAssetByIdMutation();
    const [submitAssetForReview] = useSubmitAssetForReviewMutation();
    const [uploadFile] = useUploadFileMutation();
    const [uploadingField, setUploadingField] = useState(null);
    const [errorMsg, setErrorMsg] = useState("");

    const isSubmitting = isCreating || isUpdating;

    useEffect(() => {
        if (!editId) return;

        const asset = unwrapAssetResponse(assetData) ?? unwrapAssetResponse(initialProperty);
        if (!asset) return;

        const nextForm = assetToFormData(asset);
        setFormData(nextForm);

        const { countryIso, stateIso } = resolveLocationIsoCodes(nextForm.country, nextForm.state);
        setCountryIsoCode(countryIso);
        setStateIsoCode(stateIso);
    }, [assetData, editId, initialProperty]);

    const handleFileUpload = async (file, field) => {
        setUploadingField(field);
        setErrorMsg("");
        try {
            const result = await uploadFile({ file, folder: 'assets' }).unwrap();
            const url = result.key || result.url || result.path;

            if (field === 'images') {
                setFormData(prev => ({ ...prev, images: [...prev.images, url] }));
            } else {
                setFormData(prev => ({ ...prev, [field]: url }));
            }
        } catch (err: any) {
            console.error('Upload failed:', err);
            const status = err?.status;
            if (status === 413) {
                setErrorMsg("The file is too large for the server. Please upload a smaller file or ask the administrator to increase the limit.");
            } else {
                setErrorMsg(err?.data?.message || err?.message || 'Upload failed. Please try again.');
            }
        } finally {
            setUploadingField(null);
        }
    };

    const handleSubmit = async () => {
        setErrorMsg("");
        const required = ['title', 'location', 'country', 'state', 'city', 'valuation', 'totalFractions', 'expectedYield', 'titleDeedUrl'];
        for (const field of required) {
            if (!formData[field]) {
                setErrorMsg(`Please fill in the ${field} field.`);
                return;
            }
        }

        if (!formData.images || formData.images.length === 0) {
            setErrorMsg("Please upload an Asset Image.");
            return;
        }

        if (kycStatus?.status !== 'VERIFIED') {
            setShowKycModal(true);
            return;
        }

        try {
            if (editId) {
                const updatePayload = formDataToUpdatePayload(formData);
                await updateAssetById({ id: editId, ...updatePayload }).unwrap();
                alert('Asset updated successfully!');
                onBack();
                return;
            }

            const payload = {
                ...formData,
                valuation: Number(formData.valuation),
                totalFractions: Number(formData.totalFractions),
                expectedYield: Number(formData.expectedYield),
                expectedAnnualRent: Number(formData.expectedAnnualRent),
                rentalGrowthRate: Number(formData.rentalGrowthRate),
                expectedAppreciationRate: Number(formData.expectedAppreciationRate),
                operatingCostRate: Number(formData.operatingCostRate),
                holdingPeriod: Number(formData.holdingPeriod),
                fractionPrice: Number(formData.valuation) / Number(formData.totalFractions),
                isreraverified: formData.isReraVerified,
            };

            await createAsset(payload).unwrap();
            alert('Asset created and saved as draft!');

            if (kybStatus?.status === 'APPROVED' || kybStatus?.status === 'VERIFIED' || kybStatus?.status === 'PENDING' || kybStatus?.status === 'UNDER_REVIEW') {
                onBack();
            } else {
                setShowKybModal(true);
            }
        } catch (err: any) {
            console.error('Failed to save asset. Full error:', err);
            setErrorMsg(err?.data?.message || err?.message || 'Failed to save asset. Please check all fields and try again.');
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
                        className="flex items-center gap-2 bg-[var(--sidebar-active-bg)] hover:bg-[var(--sidebar-active-text)]/20 hover:scale-[1.02] active:scale-[0.98] text-[var(--sidebar-active-text)] px-4 py-2 rounded-md text-sm font-medium font-montserrat transition-all cursor-pointer"
                    >
                        Back to List
                    </button>
                </div>

                {editId && isLoadingAsset && !initialProperty && !unwrapAssetResponse(assetData) ? (
                    <div className="flex items-center justify-center p-20">
                        <LoadingSpinner />
                    </div>
                ) : isAssetLoadError && editId && !initialProperty ? (
                    <div className="rounded-md border border-red-500/20 bg-red-500/10 p-6 text-center text-red-500 text-sm font-montserrat">
                        Could not load property details. Go back and try again.
                    </div>
                ) : !editId && !isKycStatusLoading && !isKybStatusLoading && (kycStatus?.status !== 'VERIFIED' || (kybStatus?.status !== 'APPROVED' && kybStatus?.status !== 'VERIFIED')) ? (
                    <div className="bg-[var(--form-surface)] border border-[var(--foreground)]/20 rounded-md p-8 sm:p-14 flex flex-col items-center text-center gap-6">
                        <div className="w-16 h-16 rounded-full bg-[var(--color-status-warning-bg)] flex items-center justify-center">
                            <BusinessPropertyIcon className="w-7 h-7 text-[var(--color-status-warning)]" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-[var(--foreground)] font-montserrat mb-2">Verification Required</h2>
                            <p className="text-sm text-[var(--sidebar-text)] opacity-70 font-montserrat max-w-sm mx-auto leading-relaxed">
                                Both KYC and KYB verification must be approved before you can create a new property listing.
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase font-montserrat ${kycStatus?.status === 'VERIFIED'
                                ? 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)] text-[var(--color-status-success)]'
                                : kycStatus?.status === 'UNDER_REVIEW' || kycStatus?.status === 'IN_REVIEW'
                                    ? 'bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]'
                                    : 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]'
                                }`}>
                                KYC: {kycStatus?.status || 'NOT SUBMITTED'}
                            </div>
                            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-[10px] font-bold uppercase font-montserrat ${kybStatus?.status === 'APPROVED' || kybStatus?.status === 'VERIFIED'
                                ? 'bg-[var(--color-status-success-bg)] border-[var(--color-status-success-border)] text-[var(--color-status-success)]'
                                : kybStatus?.status === 'UNDER_REVIEW' || kybStatus?.status === 'IN_REVIEW'
                                    ? 'bg-[var(--color-status-warning-bg)] border-[var(--color-status-warning-border)] text-[var(--color-status-warning)]'
                                    : 'bg-[var(--color-status-error-bg)] border-[var(--color-status-error-border)] text-[var(--color-status-error)]'
                                }`}>
                                KYB: {kybStatus?.status || 'NOT SUBMITTED'}
                            </div>
                        </div>
                        <div className="flex flex-wrap gap-3 justify-center">
                            {kycStatus?.status !== 'VERIFIED' && (
                                <button
                                    onClick={() => setShowKycModal(true)}
                                    className="px-6 py-2.5 rounded-md bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] text-sm font-bold font-montserrat transition-all cursor-pointer hover:bg-[var(--sidebar-active-text)]/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Complete KYC
                                </button>
                            )}
                            {kybStatus?.status !== 'APPROVED' && kybStatus?.status !== 'VERIFIED' && (
                                <button
                                    onClick={() => setShowKybModal(true)}
                                    className="px-6 py-2.5 rounded-md bg-[var(--sidebar-active-bg)] text-[var(--sidebar-active-text)] text-sm font-bold font-montserrat transition-all cursor-pointer hover:bg-[var(--sidebar-active-text)]/20 hover:scale-[1.02] active:scale-[0.98]"
                                >
                                    Complete KYB
                                </button>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-[var(--form-surface)] border border-[var(--foreground)]/20 rounded-md p-4 sm:p-6 lg:p-10 relative z-10">

                        {errorMsg && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mb-6 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-medium flex items-center gap-3"
                            >
                                <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                {errorMsg}
                            </motion.div>
                        )}



                        {/* Legend */}
                        <div className="flex items-center gap-4 mb-6 text-[10px] font-montserrat">
                            <span className="flex items-center gap-1 text-[var(--sidebar-text)]/60">
                                <span className="text-red-500 text-[11px] leading-none">*</span>
                                <span>Required</span>
                            </span>
                            <span className="flex items-center gap-1 text-[var(--sidebar-text)]/50">
                                <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                            </span>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6 mb-8">
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Title
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Location
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={formData.location}
                                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
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
                                required
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
                                required
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
                                required
                            />
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Category
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors font-montserrat cursor-pointer"
                                >
                                    {CATEGORIES.map((cat) => (
                                        <option key={cat.value} value={cat.value} className="bg-[var(--form-surface)] text-[var(--foreground)]">
                                            {cat.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Sale Type
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <select
                                    value={formData.saleType}
                                    onChange={(e) => setFormData({ ...formData, saleType: e.target.value })}
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors font-montserrat cursor-pointer"
                                >
                                    <option value="FRACTIONAL" className="bg-[var(--form-surface)] text-[var(--foreground)]">Fractional</option>
                                    <option value="WHOLE" className="bg-[var(--form-surface)] text-[var(--foreground)]">Whole</option>
                                </select>
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Valuation
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.valuation}
                                    onChange={(e) => setFormData({ ...formData, valuation: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Total Fractions
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.totalFractions}
                                    onChange={(e) => setFormData({ ...formData, totalFractions: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Annual Yield (%)
                                    <span className="text-red-500 text-[11px] leading-none" title="Required">*</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.expectedYield}
                                    onChange={(e) => setFormData({ ...formData, expectedYield: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Expected Annual Rent
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.expectedAnnualRent}
                                    onChange={(e) => setFormData({ ...formData, expectedAnnualRent: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Rental Growth Rate (%)
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.rentalGrowthRate}
                                    onChange={(e) => setFormData({ ...formData, rentalGrowthRate: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Expected Appreciation Rate (%)
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.expectedAppreciationRate}
                                    onChange={(e) => setFormData({ ...formData, expectedAppreciationRate: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Operating Cost Rate (%)
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.operatingCostRate}
                                    onChange={(e) => setFormData({ ...formData, operatingCostRate: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Holding Period (Years)
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <input
                                    type="number"
                                    value={formData.holdingPeriod}
                                    onChange={(e) => setFormData({ ...formData, holdingPeriod: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-md px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat"
                                />
                            </div>
                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="text-[10px] font-semibold text-[var(--foreground)] tracking-widest uppercase font-montserrat flex items-center gap-1.5">
                                    Description
                                    <span className="text-[8px] font-normal normal-case tracking-normal text-[var(--sidebar-text)]/70 border border-[var(--foreground)]/30 bg-[var(--sidebar-text)]/5 rounded px-1.5 py-0.5 font-montserrat">optional</span>
                                </label>
                                <textarea
                                    rows={5}
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="..."
                                    className="bg-[var(--field-surface)] border border-[var(--foreground)]/20 rounded-xl px-4 py-3.5 text-sm text-[var(--foreground)] focus:outline-none focus:border-[var(--foreground)] focus:ring-1 focus:ring-[var(--foreground)]/50 transition-colors placeholder:text-[var(--sidebar-text)]/30 font-montserrat resize-none"
                                />
                            </div>

                            <div className="flex flex-col gap-2 md:col-span-2">
                                <label className="flex items-center gap-3 cursor-pointer group">
                                    <div className="relative flex items-center justify-center w-5 h-5">
                                        <input
                                            type="checkbox"
                                            checked={formData.isReraVerified}
                                            onChange={(e) => setFormData({ ...formData, isReraVerified: e.target.checked })}
                                            className="peer appearance-none w-5 h-5 border-2 border-[var(--foreground)]/30 rounded focus:ring-2 focus:ring-[var(--foreground)]/50 focus:outline-none transition-colors checked:bg-[var(--sidebar-active-text)] checked:border-[var(--sidebar-active-text)]"
                                        />
                                        <svg className="absolute w-3.5 h-3.5 text-[var(--background)] opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    </div>
                                    <span className="text-[12px] font-semibold text-[var(--foreground)] tracking-wide font-montserrat">
                                        Is your asset RERA verified?
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-4 mb-8">
                            <UploadArea
                                label="Ownership Proof / Backing Document"
                                onUpload={(file) => handleFileUpload(file, 'titleDeedUrl')}
                                value={formData.titleDeedUrl}
                                isUploading={uploadingField === 'titleDeedUrl'}
                                required
                            />
                            <UploadArea
                                label="Valuation Report"
                                onUpload={(file) => handleFileUpload(file, 'valuationReportUrl')}
                                value={formData.valuationReportUrl}
                                isUploading={uploadingField === 'valuationReportUrl'}
                                optional
                            />
                            <UploadArea
                                label="Legal Opinion"
                                onUpload={(file) => handleFileUpload(file, 'legalOpinionUrl')}
                                value={formData.legalOpinionUrl}
                                isUploading={uploadingField === 'legalOpinionUrl'}
                                optional
                            />
                            <UploadArea
                                label="Asset Image"
                                onUpload={(file) => handleFileUpload(file, 'images')}
                                value={formData.images[0]}
                                isUploading={uploadingField === 'images'}
                                required
                            />
                        </div>

                        <motion.button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            whileHover={{ scale: 1.02, opacity: 0.9 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full sm:w-auto bg-[var(--sidebar-active-text)] text-[var(--background)] font-bold text-sm px-8 py-3.5 rounded-md transition-all cursor-pointer font-montserrat min-w-[200px] flex items-center justify-center hover:shadow-glow-primary"
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
