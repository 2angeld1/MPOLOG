'use client';

import { FadeIn, ScaleIn } from '@/animations';
import { FiX } from 'react-icons/fi';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  maxWidth?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  subtitle,
  maxWidth = 'max-w-md',
  children,
  footer,
}: ModalProps) {
  if (!isOpen) return null;

  return (
    <FadeIn
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4"
      onClick={onClose}
      duration={0.2}
    >
      <ScaleIn
        className={`bg-[#1a1c25] border border-white/10 rounded-2xl w-full ${maxWidth} shadow-2xl overflow-hidden flex flex-col max-h-[90vh]`}
        onClick={(e: React.MouseEvent) => e.stopPropagation()}
        duration={0.2}
      >
        {/* Header */}
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/[0.02] shrink-0">
          <div>
            <h3 className="font-display text-xl font-bold text-gray-100">{title}</h3>
            {subtitle && <p className="text-sm text-gray-400 mt-0.5">{subtitle}</p>}
          </div>
          <button
            className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-white/10 rounded-lg"
            onClick={onClose}
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="p-6 border-t border-white/10 bg-white/[0.02] shrink-0">
            {footer}
          </div>
        )}
      </ScaleIn>
    </FadeIn>
  );
}
