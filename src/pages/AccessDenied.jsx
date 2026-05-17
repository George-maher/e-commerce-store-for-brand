export default function AccessDenied({ lang = 'en' }) {
  const isEn = lang === 'en';
  return (
    <main className={`min-h-screen flex items-center justify-center bg-luxury-black ${!isEn ? 'rtl' : ''}`}>
      <div className="text-center max-w-sm px-4">
        <div className="w-16 h-16 flex items-center justify-center border border-gold-400/20 rounded-xl mx-auto mb-6 bg-gold-400/5">
          <span className="text-2xl font-bold text-gold-400">!</span>
        </div>
        <h2 className="text-lg font-semibold text-white mb-2 tracking-tight">
          {isEn ? 'ACCESS DENIED' : 'تم رفض الوصول'}
        </h2>
        <p className="text-sm text-luxury-white/40">
          {isEn ? 'You do not have permission to view this page.' : 'ليس لديك الإذن لعرض هذه الصفحة.'}
        </p>
      </div>
    </main>
  );
}
