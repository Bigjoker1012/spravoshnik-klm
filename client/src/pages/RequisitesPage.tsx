import { ArrowLeft, FileText, Download, Share2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";
import { SocialQR } from "@/components/SocialQR";

interface RequisitesPageProps {
  onBack: () => void;
}

const SOCIALS = [
  {
    id: "ig-klm",
    label: "Instagram КЛМ",
    url: "https://www.instagram.com/klmagro.by?utm_source=qr",
    color: "#E1306C",
    iconPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
  {
    id: "tt-klm",
    label: "TikTok КЛМ",
    url: "https://www.tiktok.com/@klm_agro?_r=1&t=ZS-981CNcO0gZp",
    color: "#000000",
    iconPath: "M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.28 6.28 0 00-.79-.05 6.28 6.28 0 00-6.28 6.28 6.28 6.28 0 006.28 6.28 6.28 6.28 0 006.28-6.28V8.87a8.18 8.18 0 004.77 1.53V6.95a4.84 4.84 0 01-1.16-.26z",
  },
  {
    id: "ig-agro",
    label: "Instagram Агрономия",
    url: "https://www.instagram.com/prosemena.by?utm_source=qr",
    color: "#E1306C",
    iconPath: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z",
  },
];

const FILES = [
  {
    id: "klm",
    name: "Реквизиты КЛМ",
    driveId: "1hCXBTCYkpnNiaKVp55qS2pVtcdsnqdjI",
  },
  {
    id: "si",
    name: "Реквизиты СИ",
    driveId: "1UfchBqa3LKa1Kj7eHIXKGJBSFFIY8z4r",
  },
];

function getPreviewUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/preview`;
}

function getViewUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/view`;
}

function getShareText(name: string, driveId: string) {
  return encodeURIComponent(`${name}: ${getViewUrl(driveId)}`);
}

function isIOS(): boolean {
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function FileCard({ file }: { file: typeof FILES[number] }) {
  const [copied, setCopied] = useState(false);
  const ios = isIOS();

  const handleDownload = () => {
    if (ios) {
      window.open(getPreviewUrl(file.driveId), "_blank");
    } else {
      const link = document.createElement("a");
      link.href = getViewUrl(file.driveId);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      link.click();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(getViewUrl(file.driveId));
    } catch {
      const input = document.createElement("input");
      input.value = getViewUrl(file.driveId);
      document.body.appendChild(input);
      input.select();
      document.execCommand("copy");
      document.body.removeChild(input);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5">
      <div className="flex items-center gap-3 mb-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: "#c0392b20" }}
        >
          <FileText className="w-6 h-6" style={{ color: "#c0392b" }} />
        </div>
        <div>
          <p className="font-bold text-slate-900">{file.name}</p>
          <p className="text-xs text-slate-400">PDF документ</p>
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <button
          onClick={handleDownload}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity active:opacity-80"
          style={{ backgroundColor: "#c0392b" }}
        >
          <Download className="w-4 h-4" />
          {ios ? "Открыть PDF" : "Скачать"}
        </button>

        <button
          onClick={handleCopyLink}
          className="flex items-center justify-center gap-2 w-full py-2 rounded-xl font-semibold text-xs border-2 border-slate-200 text-slate-600 active:opacity-80"
        >
          {copied ? "Скопировано!" : "Скопировать ссылку"}
        </button>

        <div className="grid grid-cols-2 gap-2">
          <a
            href={`https://wa.me/?text=${getShareText(file.name, file.driveId)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: "#25D366" }}
          >
            <Share2 className="w-3.5 h-3.5" />
            WhatsApp
          </a>
          <a
            href={`mailto:?subject=${encodeURIComponent(file.name)}&body=${getShareText(file.name, file.driveId)}`}
            className="flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white transition-opacity active:opacity-80"
            style={{ backgroundColor: "#6b7280" }}
          >
            <Share2 className="w-3.5 h-3.5" />
            E-mail
          </a>
        </div>
      </div>
    </div>
  );
}

export default function RequisitesPage({ onBack }: RequisitesPageProps) {
  return (
    <div className="min-h-[100dvh] pb-6" style={{ backgroundColor: "#e8f5f0" }}>
      <div
        className="border-b border-emerald-200 pt-[max(env(safe-area-inset-top),12px)] pb-4 px-4 sticky top-0 z-20"
        style={{ backgroundColor: "#f0faf6" }}
      >
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-1">
            <button
              onClick={onBack}
              className="inline-flex items-center gap-1 text-slate-600 font-semibold text-sm active:scale-95 transition-transform"
            >
              <ArrowLeft className="w-5 h-5" />
              Назад
            </button>
            <h1 className="text-lg font-extrabold text-slate-900 truncate">
              Реквизиты КЛМ и СИ
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-lg mx-auto px-4 mt-6 space-y-4">
        {FILES.map((file, idx) => (
          <motion.div
            key={file.id}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <FileCard file={file} />
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
        >
          <div className="flex items-center gap-3 mb-5">
            <div
              className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ backgroundColor: "#1e3a8a20" }}
            >
              <svg className="w-6 h-6" viewBox="0 0 24 24" fill="#1e3a8a">
                <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm4.441 16.892c-2.102.144-6.784.144-8.883 0C5.282 16.736 5.017 15.622 5 12c.017-3.629.285-4.736 2.558-4.892 2.099-.144 6.782-.144 8.883 0C18.718 7.264 18.982 8.378 19 12c-.018 3.629-.285 4.736-2.559 4.892zM10 9.658l4.917 2.338L10 14.342V9.658z"/>
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-900">Мы в соцсетях</p>
              <p className="text-xs text-slate-400">Отсканируйте QR-код</p>
            </div>
          </div>

          <div className="flex justify-center gap-5">
            {SOCIALS.map((social) => (
              <SocialQR
                key={social.id}
                label={social.label}
                url={social.url}
                color={social.color}
                icon={
                  <svg className="w-8 h-8" viewBox="0 0 24 24" fill={social.color}>
                    <path d={social.iconPath} />
                  </svg>
                }
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
