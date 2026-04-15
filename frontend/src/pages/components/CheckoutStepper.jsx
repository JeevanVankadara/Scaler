import { Check } from 'lucide-react';

export default function CheckoutStepper({ currentStep = 1 }) {
    const steps = ['Address', 'Order Summary', 'Payment'];

    return (
        <div className="flex items-center justify-center gap-0 py-4 px-6">
            {steps.map((label, idx) => {
                const stepNum = idx + 1;
                const isCompleted = stepNum < currentStep;
                const isActive = stepNum === currentStep;
                const isPending = stepNum > currentStep;

                return (
                    <div key={label} className="flex items-center">
                        {/* Step circle + label */}
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-semibold transition-all ${
                                    isCompleted
                                        ? 'bg-[#26a541] text-white'
                                        : isActive
                                        ? 'bg-[#2874f0] text-white'
                                        : 'border-2 border-[#d9d9d9] text-[#878787] bg-white'
                                }`}
                            >
                                {isCompleted ? <Check size={14} strokeWidth={3} /> : stepNum}
                            </div>
                            <span
                                className={`text-xs mt-1.5 whitespace-nowrap ${
                                    isCompleted
                                        ? 'text-[#26a541] font-medium'
                                        : isActive
                                        ? 'text-[#2874f0] font-semibold'
                                        : 'text-[#878787]'
                                }`}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector line */}
                        {idx < steps.length - 1 && (
                            <div
                                className={`w-24 h-[2px] mx-2 mt-[-16px] ${
                                    stepNum < currentStep ? 'bg-[#26a541]' : 'bg-[#e0e0e0]'
                                }`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
}
