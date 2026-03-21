function Sidebar({ activeTab, setActiveTab }) {
    return (
        <div className="w-[280px] bg-black flex flex-col h-full gap-2 p-2 hidden md:flex" data-name="sidebar" data-file="components/Sidebar.js">
            
            {/* Navigation Block */}
            <div className="bg-[var(--bg-surface)] rounded-lg p-6 flex flex-col gap-5">
                <div className="flex items-center gap-2 px-2 mb-2">
                     <div className="icon-waves text-3xl text-white"></div>
                     <span className="text-white font-bold text-xl tracking-tight">SurWave</span>
                </div>
                
                <nav className="flex flex-col gap-1">
                    <div 
                        className={`sidebar-link ${activeTab === 'home' ? 'active' : ''}`}
                        onClick={() => setActiveTab('home')}
                    >
                        <div className={`icon-house text-2xl ${activeTab === 'home' ? 'text-white' : ''}`}></div>
                        <span>Home</span>
                    </div>
                    <div 
                        className={`sidebar-link ${activeTab === 'search' ? 'active' : ''}`}
                        onClick={() => setActiveTab('search')}
                    >
                        <div className={`icon-search text-2xl ${activeTab === 'search' ? 'text-white' : ''}`}></div>
                        <span>Search</span>
                    </div>
                </nav>
            </div>

            {/* Library Block */}
            <div className="bg-[var(--bg-surface)] rounded-lg flex-1 flex flex-col overflow-hidden">
                <div className="p-4 shadow-lg z-10">
                    <div className="flex items-center justify-between text-[var(--text-subdued)] hover:text-white transition-colors cursor-pointer mb-4">
                        <div className="flex items-center gap-3">
                            <div className="icon-library text-2xl"></div>
                            <span className="font-bold">Your Library</span>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="icon-plus text-xl hover:bg-[var(--bg-highlight)] rounded-full p-1 transition-colors"></div>
                            <div className="icon-arrow-right text-xl hover:bg-[var(--bg-highlight)] rounded-full p-1 transition-colors"></div>
                        </div>
                    </div>
                    
                    {/* Tags */}
                    <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                        <span className="bg-[var(--bg-highlight)] text-sm px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors">Playlists</span>
                        <span className="bg-[var(--bg-highlight)] text-sm px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors">Artists</span>
                        <span className="bg-[var(--bg-highlight)] text-sm px-3 py-1.5 rounded-full whitespace-nowrap cursor-pointer hover:bg-[var(--bg-elevated)] transition-colors">Albums</span>
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto px-2 pb-2">
                    <div className="flex items-center justify-between px-2 mb-2 text-[var(--text-subdued)] text-sm">
                        <div className="hover:text-white cursor-pointer"><div className="icon-search text-lg"></div></div>
                        <div className="flex items-center gap-1 hover:text-white cursor-pointer">
                            <span>Recents</span>
                            <div className="icon-list text-lg"></div>
                        </div>
                    </div>
                    
                    {/* Fake Playlist Items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="flex items-center gap-3 p-2 rounded-md hover:bg-[var(--bg-highlight)] cursor-pointer group">
                            <div className="w-12 h-12 bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                <img src={`https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=100&h=100&fit=crop&q=80`} className="w-full h-full object-cover opacity-80 group-hover:opacity-100" alt="Playlist" />
                            </div>
                            <div className="flex flex-col truncate">
                                <span className="text-white font-medium truncate">My Playlist #{item}</span>
                                <span className="text-[var(--text-subdued)] text-sm truncate">Playlist • User</span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}