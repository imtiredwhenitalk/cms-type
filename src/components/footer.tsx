import Link from "next/link";

interface FooterProps {
  brand: string;
  note: string;
}

export function Footer({ brand, note }: FooterProps) {
  return (
    <footer className="border-t border-slate-800/50 bg-slate-950/50 backdrop-blur-sm">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {/* Brand */}
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-400 to-cyan-400 font-semibold text-slate-950 text-sm">
              ★
            </div>
            <span className="font-semibold text-white">{brand}</span>
          </div>

          {/* Note */}
          <p className="text-center md:text-right text-sm text-slate-400">{note}</p>
        </div>

        {/* Bottom line */}
        <div className="mt-8 pt-8 border-t border-slate-800/30 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 {brand}. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-300 transition">
              Privacy
            </Link>
            <Link href="#" className="hover:text-slate-300 transition">
              Terms
            </Link>
            <Link href="#" className="hover:text-slate-300 transition">
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
