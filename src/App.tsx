import React, { useState } from 'react';
import { 
  Sparkles, 
  Facebook, 
  Video, 
  Youtube, 
  Image as ImageIcon, 
  Copy, 
  Check, 
  Loader2, 
  Send,
  Target,
  Layout
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { generateMarketingContent, generateImage, MarketingContent } from './services/gemini';

export default function App() {
  const [topic, setTopic] = useState('');
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState('');
  const [result, setResult] = useState<MarketingContent | null>(null);
  const [adImage, setAdImage] = useState<string | null>(null);
  const [thumbnailImage, setThumbnailImage] = useState<string | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setLoading(true);
    setResult(null);
    setAdImage(null);
    setThumbnailImage(null);
    
    try {
      setStatus('Đang phân tích insight và viết nội dung...');
      const content = await generateMarketingContent(topic);
      setResult(content);

      setStatus('Đang thiết kế hình ảnh quảng cáo...');
      const img = await generateImage(content.imagePrompt);
      setAdImage(img);

      setStatus('Đang thiết kế Thumbnail YouTube...');
      const thumb = await generateImage(content.thumbnailPrompt);
      setThumbnailImage(thumb);

      setStatus('');
    } catch (error) {
      console.error(error);
      setStatus('Có lỗi xảy ra. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-slate-900 font-sans">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white">
              <Sparkles size={24} />
            </div>
            <div>
              <h1 className="font-display font-bold text-xl tracking-tight">DUY ANH DIGITAL</h1>
              <p className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">AI Marketing Master</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        {/* Input Section */}
        <section className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-4xl font-display font-bold mb-4">Bạn muốn quảng bá điều gì?</h2>
            <p className="text-slate-500 max-w-2xl mx-auto">Nhập dịch vụ, sản phẩm hoặc chủ đề của bạn. AI sẽ lo phần còn lại: từ insight, content đến kịch bản video và hình ảnh.</p>
          </div>

          <form onSubmit={handleGenerate} className="relative max-w-3xl mx-auto">
            <input
              type="text"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="Ví dụ: Dịch vụ chăm sóc da chuyên sâu tại Spa..."
              className="w-full h-16 pl-6 pr-32 bg-white border-2 border-slate-200 rounded-2xl shadow-sm focus:border-indigo-500 focus:ring-0 transition-all text-lg outline-none"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !topic.trim()}
              className="absolute right-2 top-2 bottom-2 px-6 bg-indigo-600 text-white rounded-xl font-semibold flex items-center gap-2 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
              {loading ? 'Đang xử lý...' : 'Bắt đầu'}
            </button>
          </form>

          {status && (
            <p className="text-center mt-4 text-indigo-600 font-medium animate-pulse">{status}</p>
          )}
        </section>

        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Step 1: Insight */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center gap-3 mb-6">
                  <Target className="text-indigo-600" size={24} />
                  <h3 className="text-xl font-display font-bold">1️⃣ Customer Insight</h3>
                </div>
                <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 leading-relaxed">
                  {result.customerInsight}
                </div>
              </div>

              {/* Step 2: Facebook Content */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm flex flex-col">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Facebook className="text-blue-600" size={24} />
                      <h3 className="text-xl font-display font-bold">2️⃣ Content Facebook</h3>
                    </div>
                    <button 
                      onClick={() => handleCopy(result.facebookContent, 'fb')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    >
                      {copied === 'fb' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="prose prose-slate max-w-none whitespace-pre-wrap text-slate-700 text-sm leading-relaxed flex-1">
                    {result.facebookContent}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ImageIcon className="text-emerald-600" size={20} />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">Ảnh Quảng Cáo</h4>
                    </div>
                    {adImage && (
                      <button 
                        onClick={async () => {
                          setAdImage(null);
                          const img = await generateImage(result.imagePrompt);
                          setAdImage(img);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Sparkles size={14} /> Thử lại
                      </button>
                    )}
                  </div>
                  <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                    {adImage ? (
                      <img src={adImage} alt="Ad" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs">Đang tạo ảnh...</span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 bg-amber-50 border-t border-amber-100">
                    <p className="text-[10px] text-amber-700 leading-tight">
                      💡 <b>Mẹo:</b> AI có thể vẽ sai dấu tiếng Việt. Hãy chọn các từ ngắn hoặc bấm "Thử lại" để có kết quả tốt hơn.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3: TikTok Script */}
              <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <Video className="text-pink-600" size={24} />
                    <h3 className="text-xl font-display font-bold">3️⃣ Lời thoại TikTok (Copy tạo Voice)</h3>
                  </div>
                  <button 
                    onClick={() => handleCopy(result.tiktokScript, 'tiktok')}
                    className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                  >
                    {copied === 'tiktok' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                  </button>
                </div>
                <div className="bg-slate-50 rounded-2xl p-6 text-slate-700 leading-relaxed italic border border-slate-100">
                  {result.tiktokScript}
                </div>
              </div>

              {/* Step 4: YouTube Script & Thumbnail */}
              <div className="space-y-8">
                <div className="bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <Youtube className="text-red-600" size={24} />
                      <h3 className="text-xl font-display font-bold">4️⃣ Lời thoại YouTube (Copy tạo Voice)</h3>
                    </div>
                    <button 
                      onClick={() => handleCopy(result.youtubeScript, 'yt')}
                      className="p-2 hover:bg-slate-100 rounded-lg transition-colors text-slate-500"
                    >
                      {copied === 'yt' ? <Check size={18} className="text-green-600" /> : <Copy size={18} />}
                    </button>
                  </div>
                  <div className="bg-slate-50 rounded-2xl p-6 text-slate-700 leading-relaxed italic border border-slate-100">
                    {result.youtubeScript}
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
                  <div className="p-6 border-b border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Layout className="text-red-600" size={20} />
                      <h4 className="font-bold text-sm uppercase tracking-wider text-slate-500">YouTube Thumbnail</h4>
                    </div>
                    {thumbnailImage && (
                      <button 
                        onClick={async () => {
                          setThumbnailImage(null);
                          const thumb = await generateImage(result.thumbnailPrompt);
                          setThumbnailImage(thumb);
                        }}
                        className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                      >
                        <Sparkles size={14} /> Thử lại
                      </button>
                    )}
                  </div>
                  <div className="aspect-video bg-slate-100 flex items-center justify-center relative">
                    {thumbnailImage ? (
                      <img src={thumbnailImage} alt="Thumbnail" className="w-full h-full object-cover" />
                    ) : (
                      <div className="flex flex-col items-center gap-2 text-slate-400">
                        <Loader2 className="animate-spin" size={32} />
                        <span className="text-xs">Đang tạo thumbnail...</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="py-12 border-t border-slate-200 mt-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-slate-400 text-sm">© 2026 DUY ANH DIGITAL. Powered by Gemini AI.</p>
        </div>
      </footer>
    </div>
  );
}
