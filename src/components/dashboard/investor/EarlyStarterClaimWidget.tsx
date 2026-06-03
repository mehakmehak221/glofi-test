import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGetProfileQuery, useRedeemEarlyStarterMutation } from "@/store/api/authApi";
import { LoadingSpinner } from "@/components/VectorImages";

const TagIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
  </svg>
);

const GiftIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
  </svg>
);

const ShareIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
  </svg>
);

const CheckIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M5 13l4 4L19 7"
    />
  </svg>
);

export function EarlyStarterClaimWidget() {
  const { data: profileData, isLoading: isProfileLoading } = useGetProfileQuery();
  const [redeemEarlyStarter, { isLoading: isRedeeming }] = useRedeemEarlyStarterMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [localClaimed, setLocalClaimed] = useState(false);

  const isClaimed = profileData?.earlyStarter || localClaimed;

  const handleClaim = async () => {
    if (isClaimed) return;
    try {
      await redeemEarlyStarter().unwrap();
      setLocalClaimed(true);
    } catch (error) {
      console.error("Failed to redeem:", error);
    }
  };

  const shareText = `Join me on GloFi Estates and earn rewards!\n\nDownload for Android:\nhttps://play.google.com/store/apps/details?id=app.glofiestates.com\n\nDownload for iOS:\nhttps://apps.apple.com/us/app/glofi-estates/id6764258977`;

  const handleRefer = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GloFi Estates',
          text: shareText,
        });
        return;
      } catch (error) {
        console.log("Share cancelled or failed", error);
      }
    }

    try {
      await navigator.clipboard.writeText(shareText);
      alert("App links copied to your clipboard! You can now paste and share it anywhere.");
    } catch (err) {
      console.error("Failed to copy", err);
      alert("Failed to copy the link. Please try again.");
    }
  };

  return (
    <>
      <motion.div
        whileHover={{ y: -2 }}
        className="bg-[#DDEAE6] rounded-[24px] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden h-full shadow-sm"
      >
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-[#C1D7D0] flex items-center justify-center shrink-0">
            <TagIcon className="w-6 h-6 text-[#0A4B3A]" />
          </div>
          <div>
            <h3 className="text-[#0A4B3A] text-lg sm:text-xl font-bold mb-0.5 tracking-tight">5% OFF Waitlist</h3>
            <p className="text-[#0A4B3A]/80 text-xs sm:text-sm font-medium">Early access deal</p>
          </div>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all shadow-sm self-start sm:self-auto ${isClaimed
            ? "bg-[#00A585] text-white"
            : "bg-[#00A585] text-white hover:bg-[#008F73] hover:shadow-md"
            }`}
        >
          {isClaimed ? "Claimed" : "Join"}
        </button>
      </motion.div>

      {/* Floating Action Button (Only visible if not claimed) */}
      {!isClaimed && (
        <motion.button
          onClick={() => setIsModalOpen(true)}
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="fixed bottom-8 right-8 z-[90] bg-[#056346] text-white px-5 py-3.5 rounded-full shadow-2xl flex items-center gap-2 hover:bg-[#044c36] hover:scale-105 transition-all group"
        >
          <GiftIcon className="w-5 h-5 animate-pulse" />
          <span className="font-semibold text-[15px]">Refer & Earn</span>
        </motion.button>
      )}

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-[360px] bg-white rounded-[28px] overflow-hidden shadow-2xl z-10"
            >
              {/* Header section */}
              <div className="bg-[#056346] pt-10 pb-8 px-6 flex flex-col items-center relative overflow-hidden">
                {/* Decorative circles */}
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 90, 0] }}
                  transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full translate-x-12 -translate-y-12"
                />
                <motion.div
                  animate={{ scale: [1, 1.2, 1], rotate: [0, -90, 0] }}
                  transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -translate-x-12 translate-y-12"
                />

                <motion.div
                  initial={{ scale: 0.8, rotate: -10 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 10 }}
                  className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-4 relative z-10 shadow-lg"
                >
                  <AnimatePresence mode="wait">
                    {isClaimed ? (
                      <motion.div
                        key="check"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ type: "spring", bounce: 0.5 }}
                      >
                        <CheckIcon className="w-8 h-8 text-black" />
                      </motion.div>
                    ) : (
                      <motion.div
                        key="gift"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                      >
                        <GiftIcon className="w-7 h-7 text-[#056346]" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>

                <h2 className="text-white text-2xl font-bold mb-3 relative z-10 text-center">
                  {isClaimed ? "5% Discount!" : "Claim 5% Discount!"}
                </h2>

                <span className="bg-white/20 border border-white/30 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full relative z-10">
                  Limited Time Offer
                </span>
              </div>

              {/* Body section */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: { opacity: 0 },
                  visible: { opacity: 1, transition: { staggerChildren: 0.1, delayChildren: 0.2 } }
                }}
                className="p-6 text-center bg-white flex flex-col items-center"
              >
                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-[#334155] text-[15px] font-medium leading-snug mb-8 px-2">
                  Refer a friend and earn <span className="text-[#056346]">10%</span> by referring others. Make it viral!
                </motion.p>

                <motion.div variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="w-full flex flex-col gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleRefer}
                    className="w-full bg-[#056346] text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2 transition-colors hover:bg-[#044c36]"
                  >
                    <ShareIcon className="w-5 h-5" />
                    Refer Now
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: isClaimed || isRedeeming ? 1 : 1.02 }}
                    whileTap={{ scale: isClaimed || isRedeeming ? 1 : 0.98 }}
                    onClick={handleClaim}
                    disabled={isClaimed || isRedeeming}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-colors flex items-center justify-center ${isClaimed
                      ? "bg-[#F1F5F9] text-[#056346]"
                      : "bg-[#F1F5F9] text-[#056346] hover:bg-[#E2E8F0]"
                      }`}
                  >
                    {isRedeeming ? (
                      <LoadingSpinner />
                    ) : isClaimed ? (
                      <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>Claimed</motion.span>
                    ) : (
                      "Claim Discount"
                    )}
                  </motion.button>
                </motion.div>

                <motion.p variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }} className="text-[#94A3B8] text-[10px] mt-6 px-4 leading-relaxed">
                  Terms and conditions apply. Referral credits are added instantly.
                </motion.p>
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
