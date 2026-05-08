import { ArrowLeft, FileText, Download, Share2 } from "lucide-react";
import { motion } from "framer-motion";

interface RequisitesPageProps {
  onBack: () => void;
}

const FILES = [
  {
    id: "klm",
    name: "Реквизиты КЛМ",
    driveId: "1UfchBqa3LKa1Kj7eHIXKGJBSFFIY8z4r",
  },
  {
    id: "si",
    name: "Реквизиты СИ",
    driveId: "1hCXBTCYkpnNiaKVp55qS2pVtcdsnqdjI",
  },
];

function getDownloadUrl(driveId: string) {
  return `https://drive.google.com/uc?export=download&id=${driveId}`;
}

function getViewUrl(driveId: string) {
  return `https://drive.google.com/file/d/${driveId}/view`;
}

function getShareText(name: string, driveId: string) {
  return encodeURIComponent(`${name}: ${getViewUrl(driveId)}`);
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
            className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5"
          >
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
              {/* Скачать */}
              <a
                href={getDownloadUrl(file.driveId)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl font-semibold text-sm text-white transition-opacity active:opacity-80"
                style={{ backgroundColor: "#c0392b" }}
              >
                <Download className="w-4 h-4" />
                Скачать
              </a>

              {/* Поделиться */}
              <div className="grid grid-cols-3 gap-2">
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
                  href={`https://t.me/share/url?url=${encodeURIComponent(getViewUrl(file.driveId))}&text=${encodeURIComponent(file.name)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-1.5 py-2 rounded-xl font-semibold text-xs text-white transition-opacity active:opacity-80"
                  style={{ backgroundColor: "#229ED9" }}
                >
                  <Share2 className="w-3.5 h-3.5" />
                  Telegram
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
          </motion.div>
        ))}
      </div>
    </div>
  );
}
