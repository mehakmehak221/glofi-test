'use client';

import React from 'react';

export default function ValueSection() {
    return (
        <section id="values" className="bg-[#004852] w-full flex justify-center overflow-hidden border-t border-b border-[#00F4C4]/30">
    {/* Stats Bar Section */}
     <div className="w-full bg-[#004852] py-10 sm:py-12 z-10">
     <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-around gap-8 md:gap-4">
         {/* Stat 1 */}
         <div className="flex flex-col items-center text-center">
             <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">11</span>
             <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Premium Assets</span>
         </div>

         {/* Separator Dot 1 */}
         <div className="hidden md:block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#00F4C4]" />

         {/* Stat 2 */}
         <div className="flex flex-col items-center text-center">
             <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">₹28.5k Cr +</span>
             <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Assets of Worth</span>
         </div>

         {/* Separator Dot 2 */}
         <div className="hidden md:block w-2.5 h-2.5 rounded-full bg-white shadow-[0_0_12px_#00F4C4]" />

         {/* Stat 3 */}
         <div className="flex flex-col items-center text-center">
             <span className="text-4xl sm:text-5xl font-Montserrat font-bold text-white tracking-tight">850+</span>
             <span className="text-sm sm:text-base text-[#8F8F9F] font-Montserrat mt-2 font-medium">Investors Across India</span>
         </div>
     </div>
 </div>
 </section>
 );
 }