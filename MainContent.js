function MainContent({ onPlay }) {
    const [scrollOpacity, setScrollOpacity] = React.useState(0);
    
    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        const opacity = Math.min(scrollTop / 150, 1);
        setScrollOpacity(opacity);
    };

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div 
            className="flex-1 bg-[var(--bg-surface)] rounded-lg overflow-y-auto relative mr-2 my-2 ml-0"
            onScroll={handleScroll}
            data-name="main-content" data-file="components/MainContent.js"
        >
            {/* Gradient Background */}
            <div className="absolute top-0 left-0 w-full h-[300px] bg-gradient-to-b from-indigo-900/50 to-[var(--bg-surface)] pointer-events-none"></div>

            <TopBar opacity={scrollOpacity} />

            <div className="px-6 pb-24 relative z-10 mt-2">
                {/* Greeting Section */}
                <h2 className="text-3xl font-bold mb-6">{getGreeting()}</h2>
                
                {/* Recent Grid (Small Cards) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                    {mockPlaylists.slice(0, 6).map((playlist) => (
                        <div 
                            key={playlist.id} 
                            className="bg-[var(--bg-elevated)] hover:bg-[var(--bg-highlight)] transition-colors rounded-md flex items-center overflow-hidden cursor-pointer group"
                            onClick={() => onPlay(playlist)}
                        >
                            <div className="h-16 w-16 shadow-lg flex-shrink-0">
                                <img src={playlist.image} alt={playlist.title} className="h-full w-full object-cover" />
                            </div>
                            <div className="px-4 font-bold truncate flex-1">{playlist.title}</div>
                            
                            <div className="mr-4 w-10 h-10 bg-[var(--primary)] rounded-full flex items-center justify-center shadow-xl opacity-0 group-hover:opacity-100 transition-opacity">
                                <div className="icon-play text-xl ml-1 text-black fill-black"></div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Made For You Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold hover:underline cursor-pointer">Made For You</h2>
                        <span className="text-[var(--text-subdued)] text-sm font-bold hover:underline cursor-pointer">Show all</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                        {mockPlaylists.map((playlist) => (
                            <SongCard 
                                key={playlist.id}
                                title={playlist.title}
                                description={playlist.description}
                                image={playlist.image}
                                onClick={() => {}}
                                onPlay={() => onPlay(playlist)}
                            />
                        ))}
                    </div>
                </div>

                {/* Recently Played Section */}
                <div className="mb-8">
                     <div className="flex items-center justify-between mb-4">
                        <h2 className="text-2xl font-bold hover:underline cursor-pointer">Recently Played</h2>
                        <span className="text-[var(--text-subdued)] text-sm font-bold hover:underline cursor-pointer">Show all</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                         {mockPlaylists.slice().reverse().map((playlist) => (
                            <SongCard 
                                key={`recent-${playlist.id}`}
                                title={playlist.title}
                                description={playlist.description}
                                image={playlist.image}
                                onClick={() => {}}
                                onPlay={() => onPlay(playlist)}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}