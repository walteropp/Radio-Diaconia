
import React, { useState, useEffect } from 'react';
import { Radio as RadioIcon, HandHeart, MessageSquare, Calendar, Home, Menu, X, Cross, Share2, Loader2, Sparkles, Send, RotateCcw } from 'lucide-react';
import { AppTab } from './types';
import RadioPlayer from './components/RadioPlayer';
import AIChat from './components/AIChat';
import Schedule from './components/Schedule';
import { generateDailyVerse, generateFeaturedImage, editImage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<AppTab>(AppTab.Radio);
  const [dailyVerse, setDailyVerse] = useState("Cargando palabra de hoy...");
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loadingImage, setLoadingImage] = useState(true);
  const [showEditInput, setShowEditInput] = useState(false);
  const [editPrompt, setEditPrompt] = useState("");
  const [isEditingImage, setIsEditingImage] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const verse = await generateDailyVerse();
      setDailyVerse(verse);
      
      const img = await generateFeaturedImage();
      setFeaturedImage(img);
      setOriginalImage(img);
      setLoadingImage(false);
    };
    fetchData();
  }, []);

  const handleEditSubmit = async () => {
    if (!editPrompt.trim() || !featuredImage) return;
    
    setIsEditingImage(true);
    setShowEditInput(false);
    
    const edited = await editImage(featuredImage, editPrompt);
    if (edited) {
      setFeaturedImage(edited);
    }
    
    setIsEditingImage(false);
    setEditPrompt("");
  };

  const handleResetImage = () => {
    setFeaturedImage(originalImage);
  };

  const renderContent = () => {
    switch (activeTab) {
      case AppTab.Radio:
        return (
          <div className="space-y-8 animate-fadeIn">
            {/* Powerful Spiritual Featured Image */}
            <div className="space-y-4">
              <div className="relative w-full aspect-square rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-blue-900">
                {(loadingImage || isEditingImage) ? (
                  <div className="absolute inset-0 bg-blue-950 flex flex-col items-center justify-center gap-4">
                    <Loader2 className="animate-spin text-yellow-500" size={32} />
                    <p className="text-xs font-cinzel text-white animate-pulse">
                      {isEditingImage ? "Transformando la Luz..." : "Sintonizando el Cielo..."}
                    </p>
                  </div>
                ) : featuredImage ? (
                  <img src={featuredImage} alt="Cruz de Poder" className="w-full h-full object-cover" />
                ) : (
                  <div className="absolute inset-0 bg-blue-900 flex items-center justify-center">
                    <Cross size={48} className="text-blue-200/20" />
                  </div>
                )}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-cinzel text-xs font-bold tracking-widest uppercase">La Luz del Mundo</p>
                  <p className="text-yellow-400 text-[10px]">Cristo es nuestra frecuencia</p>
                </div>
              </div>

              {/* Edit Controls */}
              <div className="flex flex-col gap-3">
                {!showEditInput ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowEditInput(true)}
                      className="flex-1 bg-white border border-blue-100 text-blue-900 py-3 px-4 rounded-2xl shadow-sm flex items-center justify-center gap-2 hover:bg-blue-50 transition-colors font-semibold text-sm"
                    >
                      <Sparkles size={18} className="text-yellow-500" />
                      Pedir un milagro visual
                    </button>
                    {featuredImage !== originalImage && (
                      <button 
                        onClick={handleResetImage}
                        className="bg-white border border-red-100 text-red-600 p-3 rounded-2xl shadow-sm hover:bg-red-50"
                        title="Restaurar original"
                      >
                        <RotateCcw size={18} />
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="bg-white p-3 rounded-2xl shadow-lg border border-blue-200 animate-fadeIn space-y-3">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[10px] font-bold text-blue-900 uppercase tracking-wider">Transformar la imagen</span>
                      <button onClick={() => setShowEditInput(false)}><X size={14} className="text-gray-400" /></button>
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={editPrompt}
                        onChange={(e) => setEditPrompt(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleEditSubmit()}
                        placeholder="Ej: 'Añade relámpagos de luz' o 'Efecto pintura antigua'"
                        className="flex-1 bg-gray-50 border-none rounded-xl px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        autoFocus
                      />
                      <button 
                        onClick={handleEditSubmit}
                        disabled={!editPrompt.trim()}
                        className="bg-blue-900 text-white p-2 rounded-xl hover:bg-blue-800 disabled:opacity-50"
                      >
                        <Send size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <RadioPlayer />
            
            <div className="bg-blue-900 text-white p-6 rounded-3xl shadow-lg relative overflow-hidden">
              <div className="absolute right-0 top-0 opacity-10">
                <Cross size={120} />
              </div>
              <h3 className="text-yellow-500 font-cinzel font-bold mb-2">Mensaje del Día</h3>
              <p className="italic text-lg mb-2">"{dailyVerse}"</p>
              <button className="flex items-center gap-2 text-xs text-blue-200 hover:text-white mt-4">
                <Share2 size={14} /> Compartir bendición
              </button>
            </div>
            
            <Schedule />
          </div>
        );
      case AppTab.Chat:
        return <AIChat />;
      case AppTab.Schedule:
        return <Schedule />;
      case AppTab.Prayers:
        return (
          <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 text-center animate-fadeIn">
            <div className="w-20 h-20 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center mx-auto mb-6">
              <HandHeart size={40} />
            </div>
            <h2 className="text-2xl font-cinzel font-bold text-blue-900 mb-4">Muro de Oraciones</h2>
            <p className="text-gray-600 mb-8">Oremos juntos bajo la cruz de Cristo por las intenciones de nuestra comunidad.</p>
            <button 
              onClick={() => setActiveTab(AppTab.Chat)}
              className="bg-blue-900 text-white px-8 py-3 rounded-full font-bold shadow-lg hover:bg-blue-800 transition-all"
            >
              Pedir Oración al Capellán
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col max-w-md mx-auto relative shadow-2xl overflow-x-hidden">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-900 rounded-xl text-white shadow-md">
            <RadioIcon size={24} />
          </div>
          <div>
            <h1 className="font-cinzel font-bold text-blue-900 text-lg leading-none">RADIO DIACONÍA</h1>
            <span className="text-[10px] text-yellow-600 font-semibold tracking-widest uppercase block mt-1 leading-tight">La Voz de Cristo</span>
          </div>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-blue-900 hover:bg-blue-50 p-2 rounded-lg">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-5 pb-24 overflow-y-auto">
        {renderContent()}
      </main>

      {/* Navigation Bar (Sticky Bottom) */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-white border-t border-gray-100 px-6 py-3 flex justify-between items-center z-50 shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)]">
        <NavButton 
          active={activeTab === AppTab.Radio} 
          onClick={() => setActiveTab(AppTab.Radio)} 
          icon={<RadioIcon size={20} />} 
          label="Radio" 
        />
        <NavButton 
          active={activeTab === AppTab.Chat} 
          onClick={() => setActiveTab(AppTab.Chat)} 
          icon={<MessageSquare size={20} />} 
          label="Asistente" 
        />
        <NavButton 
          active={activeTab === AppTab.Prayers} 
          onClick={() => setActiveTab(AppTab.Prayers)} 
          icon={<HandHeart size={20} />} 
          label="Oración" 
        />
        <NavButton 
          active={activeTab === AppTab.Schedule} 
          onClick={() => setActiveTab(AppTab.Schedule)} 
          icon={<Calendar size={20} />} 
          label="Agenda" 
        />
      </nav>

      {/* Side Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-blue-900/95 flex flex-col p-8 text-white animate-slideIn">
          <button onClick={() => setIsMobileMenuOpen(false)} className="self-end mb-12 bg-white/10 p-2 rounded-full">
            <X size={24} />
          </button>
          <div className="space-y-8">
            <h2 className="font-cinzel text-3xl font-bold border-b border-white/20 pb-4">Menú</h2>
            <ul className="space-y-6 text-xl">
              <li><button className="flex items-center gap-4 hover:text-yellow-500 transition-colors"><Home /> Inicio</button></li>
              <li><button className="flex items-center gap-4 hover:text-yellow-500 transition-colors"><Cross /> Donaciones</button></li>
              <li><button className="flex items-center gap-4 hover:text-yellow-500 transition-colors"><MessageSquare /> Contáctanos</button></li>
              <li><button className="flex items-center gap-4 hover:text-yellow-500 transition-colors"><Share2 /> Compartir App</button></li>
            </ul>
          </div>
          <div className="mt-auto text-center text-xs text-blue-300">
            © 2024 Radio Diaconía - V 1.1.0
          </div>
        </div>
      )}

      {/* Tailwind helper styles */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        .animate-fadeIn { animation: fadeIn 0.4s ease-out forwards; }
        .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
};

interface NavButtonProps {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

const NavButton: React.FC<NavButtonProps> = ({ active, onClick, icon, label }) => (
  <button 
    onClick={onClick}
    className={`flex flex-col items-center gap-1 transition-all duration-300 ${active ? 'text-blue-900 scale-110' : 'text-gray-400 hover:text-blue-400'}`}
  >
    <div className={`p-1 rounded-lg ${active ? 'bg-yellow-100' : ''}`}>
      {icon}
    </div>
    <span className={`text-[10px] font-bold ${active ? 'opacity-100' : 'opacity-60'}`}>{label}</span>
  </button>
);

export default App;
