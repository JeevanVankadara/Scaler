export default function Footer() {
    return (
        <footer className="bg-[#212121] text-white mt-2">
            {/* Top section */}
            <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-5">
                    {/* ABOUT */}
                    <div>
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">ABOUT</h4>
                        <ul className="space-y-[7px] text-[11px] leading-[16px] font-normal">
                            <li className="hover:underline cursor-pointer">Contact Us</li>
                            <li className="hover:underline cursor-pointer">About Us</li>
                            <li className="hover:underline cursor-pointer">Careers</li>
                            <li className="hover:underline cursor-pointer">Flipkart Stories</li>
                            <li className="hover:underline cursor-pointer">Press</li>
                            <li className="hover:underline cursor-pointer">Corporate Information</li>
                        </ul>
                    </div>

                    {/* GROUP COMPANIES */}
                    <div>
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">GROUP COMPANIES</h4>
                        <ul className="space-y-[7px] text-[11px] leading-[16px] font-normal">
                            <li className="hover:underline cursor-pointer">Myntra</li>
                            <li className="hover:underline cursor-pointer">Cleartrip</li>
                            <li className="hover:underline cursor-pointer">Shopsy</li>
                        </ul>
                    </div>

                    {/* HELP */}
                    <div>
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">HELP</h4>
                        <ul className="space-y-[7px] text-[11px] leading-[16px] font-normal">
                            <li className="hover:underline cursor-pointer">Payments</li>
                            <li className="hover:underline cursor-pointer">Shipping</li>
                            <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
                            <li className="hover:underline cursor-pointer">FAQ</li>
                        </ul>
                    </div>

                    {/* CONSUMER POLICY */}
                    <div>
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">CONSUMER POLICY</h4>
                        <ul className="space-y-[7px] text-[11px] leading-[16px] font-normal">
                            <li className="hover:underline cursor-pointer">Cancellation & Returns</li>
                            <li className="hover:underline cursor-pointer">Terms Of Use</li>
                            <li className="hover:underline cursor-pointer">Security</li>
                            <li className="hover:underline cursor-pointer">Privacy</li>
                            <li className="hover:underline cursor-pointer">Sitemap</li>
                            <li className="hover:underline cursor-pointer">Grievance Redressal</li>
                            <li className="hover:underline cursor-pointer">EPR Compliance</li>
                            <li className="hover:underline cursor-pointer">FSSAI Food Safety</li>
                            <li className="hover:underline cursor-pointer">Connect App</li>
                        </ul>
                    </div>

                    {/* Mail Us */}
                    <div className="lg:border-l lg:border-[#3e3e3e] lg:pl-5">
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">Mail Us:</h4>
                        <p className="text-[11px] leading-[18px] font-normal">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India
                        </p>
                        <h4 className="text-[#878787] text-[11px] font-medium mt-4 mb-1.5">Social:</h4>
                        <div className="flex items-center gap-3">
                            <img src="/Footer/facebook.svg" alt="Facebook" className="w-[18px] h-[18px] cursor-pointer hover:opacity-80" />
                            <img src="/Footer/X.svg" alt="X" className="w-[18px] h-[18px] cursor-pointer hover:opacity-80" />
                            <img src="/Footer/Youtube.svg" alt="Youtube" className="w-[18px] h-[18px] cursor-pointer hover:opacity-80" />
                            <img src="/Footer/instagram.svg" alt="Instagram" className="w-[18px] h-[18px] cursor-pointer hover:opacity-80" />
                        </div>
                    </div>

                    {/* Registered Office */}
                    <div>
                        <h4 className="text-[#878787] text-[11px] font-medium mb-2">Registered Office Address:</h4>
                        <p className="text-[11px] leading-[18px] font-normal">
                            Flipkart Internet Private Limited,<br />
                            Buildings Alyssa, Begonia &<br />
                            Clove Embassy Tech Village,<br />
                            Outer Ring Road, Devarabeesanahalli Village,<br />
                            Bengaluru, 560103,<br />
                            Karnataka, India<br />
                            CIN : U51109KA2012PTC066107<br />
                            <span className="mt-0.5 inline-block">Telephone: <span className="text-[#2874f0]">044-45614700</span> / <span className="text-[#2874f0]">044-67415800</span></span>
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom bar */}
            <div className="border-t border-[#3e3e3e]">
                <div className="max-w-[1300px] mx-auto px-6 lg:px-10 py-3 flex flex-wrap items-center justify-between gap-3 text-[11px]">
                    <div className="flex items-center gap-8 flex-wrap">
                        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                            <img src="/Footer/sell-image.svg" alt="" className="w-[14px] h-[14px]" />
                            <span>Become a Seller</span>
                        </div>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                            <img src="/Footer/advertise-image.svg" alt="" className="w-[14px] h-[14px]" />
                            <span>Advertise</span>
                        </div>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                            <img src="/Footer/gift-cards-image.svg" alt="" className="w-[14px] h-[14px]" />
                            <span>Gift Cards</span>
                        </div>
                        <div className="flex items-center gap-1.5 cursor-pointer hover:opacity-80">
                            <img src="/Footer/help-centre-image.svg" alt="" className="w-[14px] h-[14px]" />
                            <span>Help Center</span>
                        </div>
                        <span>© 2007-2026 Flipkart.com</span>
                    </div>

                    <img
                        src="https://static-assets-web.flixcart.com/fk-p-linchpin-web/fk-cp-zion/img/payment-method_69e7ec.svg"
                        alt="payments"
                        className="h-[18px]"
                    />
                </div>
            </div>
        </footer>
    );
}