function TopBar({ opacity = 0 }) {
    return (
        <div 
            className="sticky top-0 z-20 px-6 py-4 flex items-center justify-between transition-colors duration-300"
            style={{ backgroundColor: `rgba(18, 18, 18, ${opacity})` }}
            data-name="top-bar" data-file="components/TopBar.js"
        >
            <div className="flex items-center gap-3">
                <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <div className="icon-chevron-left text-xl"></div>
                </button>
                <button className="w-8 h-8 rounded-full bg-black/70 flex items-center justify-center cursor-pointer hover:scale-105 transition-transform">
                    <div className="icon-chevron-right text-xl"></div>
                </button>
            </div>
            
            <div className="flex items-center gap-4">
                <button className="hidden sm:block text-[var(--text-subdued)] font-bold text-sm hover:text-white hover:scale-105 transition-all">Sign up</button>
                <button className="bg-white text-black font-bold text-sm px-8 py-3 rounded-full hover:scale-105 transition-transform">Log in</button>
            </div>
        </div>
    );
}