import LiveStream from '@/components/LiveStream';

export const metadata = {
  title: 'Live Stream - M K 26 Royal OS',
  description: 'Watch the live stream of M K 26 Royal OS wedding celebration',
};

export default function LivePage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-purple-900 via-black to-black p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">
            Live Stream
          </h1>
          <p className="text-purple-300 text-lg">
            M'K 26 Royal - Broadcast from the Reception
          </p>
        </div>

        {/* Video Container */}
        <div className="rounded-lg overflow-hidden shadow-2xl mb-8 border border-purple-800/50">
          <LiveStream
            videoId="dQw4w9WgXcQ"
            title="M K'26 Royal OS Live Stream"
          />
        </div>

        {/* Info Section */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Event Details */}
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-6 border border-purple-700/50">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-400 rounded" />
              Event Details
            </h2>
            <p className="text-gray-300 leading-relaxed">
              Join us for M K 26 Royal- An unforgettable celebration featuring
              live entertainment, exceptional cuisine, and exclusive experiences
              designed for our cherished guests.
            </p>
          </div>

          {/* Viewing Tips */}
          <div className="bg-purple-900/40 backdrop-blur-sm rounded-lg p-6 border border-purple-700/50">
            <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
              <span className="w-1 h-8 bg-purple-400 rounded" />
              Tips
            </h2>
            <ul className="text-gray-300 space-y-2">
              <li className="flex gap-2">
                <span className="text-purple-400">Γû╕</span>
                <span>Watch in full screen for the best experience</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">Γû╕</span>
                <span>Enable sound for live audio</span>
              </li>
              <li className="flex gap-2">
                <span className="text-purple-400">Γû╕</span>
                <span>Stream may take a moment to load</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </main>
  );
}
