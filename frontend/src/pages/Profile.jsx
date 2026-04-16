import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import NavBar from './components/NavBar';
import Footer from './components/Footer';
import AccountSidebar from './components/AccountSidebar';

export default function Profile() {
    const { profile, updateProfile } = useCart();

    // Editable sections
    const [editingPersonal, setEditingPersonal] = useState(false);
    const [editingEmail, setEditingEmail] = useState(false);
    const [editingMobile, setEditingMobile] = useState(false);
    const [editingAddress, setEditingAddress] = useState(false);

    // Draft values (copy of profile while editing)
    const [draft, setDraft] = useState({ ...profile });

    const handleSavePersonal = () => {
        updateProfile({ firstName: draft.firstName, lastName: draft.lastName, gender: draft.gender });
        setEditingPersonal(false);
    };

    const handleSaveEmail = () => {
        updateProfile({ email: draft.email });
        setEditingEmail(false);
    };

    const handleSaveMobile = () => {
        updateProfile({ mobile: draft.mobile });
        setEditingMobile(false);
    };

    const handleCancelPersonal = () => {
        setDraft((d) => ({ ...d, firstName: profile.firstName, lastName: profile.lastName, gender: profile.gender }));
        setEditingPersonal(false);
    };
    const handleCancelEmail = () => {
        setDraft((d) => ({ ...d, email: profile.email }));
        setEditingEmail(false);
    };
    const handleCancelMobile = () => {
        setDraft((d) => ({ ...d, mobile: profile.mobile }));
        setEditingMobile(false);
    };

    const handleSaveAddress = () => {
        updateProfile({ address: draft.address, city: draft.city, state: draft.state });
        setEditingAddress(false);
    };
    const handleCancelAddress = () => {
        setDraft((d) => ({ ...d, address: profile.address, city: profile.city, state: profile.state }));
        setEditingAddress(false);
    };

    return (
        <div className="min-h-screen bg-[#f1f3f6] flex flex-col">
            <NavBar />

            <main className="flex-1">
                <div className="max-w-[1250px] mx-auto px-3.5 py-3">
                    {/* Breadcrumb */}
                    <div className="flex items-center gap-1.5 text-xs text-[#878787] mb-3">
                        <Link to="/" className="hover:text-[#2874f0] cursor-pointer">Home</Link>
                        <ChevronRight size={14} />
                        <span className="hover:text-[#2874f0] cursor-pointer">My Account</span>
                        <ChevronRight size={14} />
                        <span className="text-[#212121]">Profile Information</span>
                    </div>

                    <div className="flex flex-col lg:flex-row gap-3">
                        {/* Left Sidebar */}
                        <aside className="w-full lg:w-[250px] shrink-0">
                            <AccountSidebar />
                        </aside>

                        {/* Right Content */}
                        <div className="flex-1">
                            <div className="bg-white shadow-sm rounded-sm">
                                <div className="p-6 lg:p-8">

                                    {/* ── Personal Information ── */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-4 mb-5">
                                            <h2 className="text-lg font-semibold text-[#212121]">Personal Information</h2>
                                            {!editingPersonal ? (
                                                <button
                                                    onClick={() => { setDraft((d) => ({ ...d, firstName: profile.firstName, lastName: profile.lastName, gender: profile.gender })); setEditingPersonal(true); }}
                                                    className="text-sm text-[#2874f0] font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCancelPersonal}
                                                    className="text-sm text-[#878787] font-medium hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 mb-5">
                                            <input
                                                type="text"
                                                value={editingPersonal ? draft.firstName : profile.firstName}
                                                onChange={(e) => setDraft({ ...draft, firstName: e.target.value })}
                                                disabled={!editingPersonal}
                                                className={`w-full sm:w-[280px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                    editingPersonal
                                                        ? 'border-[#2874f0] bg-white text-[#212121]'
                                                        : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                                }`}
                                                placeholder="First Name"
                                            />
                                            <input
                                                type="text"
                                                value={editingPersonal ? draft.lastName : profile.lastName}
                                                onChange={(e) => setDraft({ ...draft, lastName: e.target.value })}
                                                disabled={!editingPersonal}
                                                className={`w-full sm:w-[280px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                    editingPersonal
                                                        ? 'border-[#2874f0] bg-white text-[#212121]'
                                                        : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                                }`}
                                                placeholder="Last Name"
                                            />
                                        </div>

                                        {/* Gender */}
                                        <div className="mb-4">
                                            <p className="text-sm text-[#878787] mb-2.5">Your Gender</p>
                                            <div className="flex items-center gap-6">
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Male"
                                                        checked={(editingPersonal ? draft.gender : profile.gender) === 'Male'}
                                                        onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                                                        disabled={!editingPersonal}
                                                        className="w-4 h-4 text-[#2874f0] accent-[#2874f0]"
                                                    />
                                                    <span className="text-sm text-[#212121]">Male</span>
                                                </label>
                                                <label className="flex items-center gap-2 cursor-pointer">
                                                    <input
                                                        type="radio"
                                                        name="gender"
                                                        value="Female"
                                                        checked={(editingPersonal ? draft.gender : profile.gender) === 'Female'}
                                                        onChange={(e) => setDraft({ ...draft, gender: e.target.value })}
                                                        disabled={!editingPersonal}
                                                        className="w-4 h-4 text-[#2874f0] accent-[#2874f0]"
                                                    />
                                                    <span className="text-sm text-[#212121]">Female</span>
                                                </label>
                                            </div>
                                        </div>

                                        {editingPersonal && (
                                            <button
                                                onClick={handleSavePersonal}
                                                className="mt-4 bg-[#2874f0] hover:bg-[#1c5ed8] text-white text-sm font-medium px-12 py-3 rounded-sm transition-colors"
                                            >
                                                SAVE
                                            </button>
                                        )}
                                    </div>

                                    {/* ── Email Address ── */}
                                    <div className="mb-10">
                                        <div className="flex items-center gap-4 mb-5">
                                            <h2 className="text-lg font-semibold text-[#212121]">Email Address</h2>
                                            {!editingEmail ? (
                                                <button
                                                    onClick={() => { setDraft((d) => ({ ...d, email: profile.email })); setEditingEmail(true); }}
                                                    className="text-sm text-[#2874f0] font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCancelEmail}
                                                    className="text-sm text-[#878787] font-medium hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="email"
                                            value={editingEmail ? draft.email : profile.email}
                                            onChange={(e) => setDraft({ ...draft, email: e.target.value })}
                                            disabled={!editingEmail}
                                            className={`w-full sm:w-[360px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                editingEmail
                                                    ? 'border-[#2874f0] bg-white text-[#212121]'
                                                    : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                            }`}
                                            placeholder="Email Address"
                                        />

                                        {editingEmail && (
                                            <div>
                                                <button
                                                    onClick={handleSaveEmail}
                                                    className="mt-4 bg-[#2874f0] hover:bg-[#1c5ed8] text-white text-sm font-medium px-12 py-3 rounded-sm transition-colors"
                                                >
                                                    SAVE
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Mobile Number ── */}
                                    <div>
                                        <div className="flex items-center gap-4 mb-5">
                                            <h2 className="text-lg font-semibold text-[#212121]">Mobile Number</h2>
                                            {!editingMobile ? (
                                                <button
                                                    onClick={() => { setDraft((d) => ({ ...d, mobile: profile.mobile })); setEditingMobile(true); }}
                                                    className="text-sm text-[#2874f0] font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCancelMobile}
                                                    className="text-sm text-[#878787] font-medium hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        <input
                                            type="tel"
                                            value={editingMobile ? draft.mobile : profile.mobile}
                                            onChange={(e) => setDraft({ ...draft, mobile: e.target.value })}
                                            disabled={!editingMobile}
                                            className={`w-full sm:w-[360px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                editingMobile
                                                    ? 'border-[#2874f0] bg-white text-[#212121]'
                                                    : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                            }`}
                                            placeholder="Mobile Number"
                                        />

                                        {editingMobile && (
                                            <div>
                                                <button
                                                    onClick={handleSaveMobile}
                                                    className="mt-4 bg-[#2874f0] hover:bg-[#1c5ed8] text-white text-sm font-medium px-12 py-3 rounded-sm transition-colors"
                                                >
                                                    SAVE
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* ── Address Information ── */}
                                    <div className="mt-10">
                                        <div className="flex items-center gap-4 mb-5">
                                            <h2 className="text-lg font-semibold text-[#212121]">Delivery Address</h2>
                                            {!editingAddress ? (
                                                <button
                                                    onClick={() => { setDraft((d) => ({ ...d, address: profile.address, city: profile.city, state: profile.state })); setEditingAddress(true); }}
                                                    className="text-sm text-[#2874f0] font-medium hover:underline"
                                                >
                                                    Edit
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={handleCancelAddress}
                                                    className="text-sm text-[#878787] font-medium hover:underline"
                                                >
                                                    Cancel
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex flex-col gap-3 mb-5">
                                            <input
                                                type="text"
                                                value={editingAddress ? draft.address : profile.address}
                                                onChange={(e) => setDraft({ ...draft, address: e.target.value })}
                                                disabled={!editingAddress}
                                                className={`w-full sm:w-[500px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                    editingAddress
                                                        ? 'border-[#2874f0] bg-white text-[#212121]'
                                                        : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                                }`}
                                                placeholder="Address (Area & Street)"
                                            />
                                            <div className="flex flex-col sm:flex-row gap-3">
                                                <input
                                                    type="text"
                                                    value={editingAddress ? draft.city : profile.city}
                                                    onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                                                    disabled={!editingAddress}
                                                    className={`w-full sm:w-[244px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                        editingAddress
                                                            ? 'border-[#2874f0] bg-white text-[#212121]'
                                                            : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                                    }`}
                                                    placeholder="City"
                                                />
                                                <input
                                                    type="text"
                                                    value={editingAddress ? draft.state : profile.state}
                                                    onChange={(e) => setDraft({ ...draft, state: e.target.value })}
                                                    disabled={!editingAddress}
                                                    className={`w-full sm:w-[244px] px-4 py-3 rounded-sm text-sm border outline-none transition-colors ${
                                                        editingAddress
                                                            ? 'border-[#2874f0] bg-white text-[#212121]'
                                                            : 'border-[#e0e0e0] bg-[#f5f5f5] text-[#878787]'
                                                    }`}
                                                    placeholder="State"
                                                />
                                            </div>
                                        </div>

                                        {editingAddress && (
                                            <div>
                                                <button
                                                    onClick={handleSaveAddress}
                                                    className="mt-4 bg-[#2874f0] hover:bg-[#1c5ed8] text-white text-sm font-medium px-12 py-3 rounded-sm transition-colors"
                                                >
                                                    SAVE
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
