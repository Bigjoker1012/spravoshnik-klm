import { useState, useRef, useCallback } from "react";
import { QRCodeSVG } from "qrcode.react";
import { X, Download, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SocialQRProps {
  label: string;
  url: string;
  color: string;
  icon: React.ReactNode;
}

export function SocialQR({ label, url, color, icon }: SocialQRProps) {
  const [open, setOpen] = useState(false);
  const qrRef = useRef<HTMLDivElement>(null);

  const handleDownload = useCallback(() => {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      const link = document.createElement("a");
      link.download = `qr-${label.replace(/\s+/g, "-").toLowerCase()}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [label]);

  const handleShare = useCallback(async () => {
    const svgEl = qrRef.current?.querySelector("svg");
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.onload = async () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx?.drawImage(img, 0, 0);
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        const file = new File([blob], `qr-${label.replace(/\s+/g, "-").toLowerCase()}.png`, { type: "image/png" });
        if (navigator.share && navigator.canShare?.({ files: [file] })) {
          try {
            await navigator.share({ files: [file], text: `${label} QR-код` });
          } catch {}
        } else {
          handleDownload();
        }
      }, "image/png");
    };
    img.src = "data:image/svg+xml;base64," + btoa(unescape(encodeURIComponent(svgData)));
  }, [label, handleDownload]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex flex-col items-center gap-2 active:scale-95 transition-transform"
      >
        <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white border-2 flex items-center justify-center shadow-sm" style={{ borderColor: color }}>
          <QRCodeSVG value={url} size={64} bgColor="transparent" fgColor={color} />
        </div>
        <span className="text-xs font-bold" style={{ color }}>{label}</span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm p-6"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white rounded-3xl p-8 flex flex-col items-center max-w-sm w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setOpen(false)}
                className="absolute top-4 right-4 w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center"
              >
                <X className="w-5 h-5 text-slate-600" />
              </button>

              <div className="mb-4">{icon}</div>
              <p className="font-extrabold text-lg text-slate-900 mb-1">{label}</p>
              <p className="text-xs text-slate-400 mb-6">Наведите камеру телефона</p>

              <div ref={qrRef} className="bg-white p-4 rounded-2xl border border-slate-100 mb-6">
                <QRCodeSVG value={url} size={220} bgColor="white" fgColor={color} level="H" />
              </div>

              <div className="flex flex-col gap-2 w-full">
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(`Сканируйте QR-код для перехода в ${label}: ${url}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white active:opacity-80"
                  style={{ backgroundColor: "#25D366" }}
                >
                  <Share2 className="w-4 h-4" />
                  Отправить в WhatsApp
                </a>
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`QR-код ${label}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white active:opacity-80"
                  style={{ backgroundColor: "#229ED9" }}
                >
                  <Share2 className="w-4 h-4" />
                  Отправить в Telegram
                </a>
                <a
                  href={`mailto:?subject=${encodeURIComponent(`QR-код ${label}`)}&body=${encodeURIComponent(`Сканируйте QR-код: ${url}`)}`}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm text-white active:opacity-80"
                  style={{ backgroundColor: "#6b7280" }}
                >
                  <Share2 className="w-4 h-4" />
                  Отправить на E-mail
                </a>
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl font-semibold text-sm border-2 active:opacity-80"
                  style={{ borderColor: color, color }}
                >
                  <Download className="w-4 h-4" />
                  Скачать QR-код
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
