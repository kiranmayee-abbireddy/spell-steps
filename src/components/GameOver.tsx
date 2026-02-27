import { useGame } from '../context/GameContext';
import { RotateCcw, Menu, Trophy, Frown } from 'lucide-react';

const GameOver = () => {
  const { state, dispatch } = useGame();
  const { gameStatus, score, words } = state;

  const handlePlayAgain = () => {
    dispatch({ type: 'RESET_GAME' });
  };

  const handleSwitchMode = () => {
    dispatch({
      type: 'SET_GAME_MODE',
      payload: state.gameMode === 'casual' ? 'timed' : 'casual'
    });
    dispatch({ type: 'RESET_GAME' });
  };

  const isWin = gameStatus === 'won';

  return (
    <div className={`relative max-w-lg w-full bg-white/95 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden transform transition-all border-4 
      ${isWin ? 'border-green-400' : 'border-red-400'}`}>

      {/* Header */}
      <div className={`p-4 md:p-6 text-center relative overflow-hidden bg-gradient-to-br ${isWin ? 'from-green-400 via-green-500 to-emerald-600' : 'from-red-400 via-red-500 to-orange-600'
        }`}>
        {/* Decorative elements */}
        {isWin && (
          <>
            <div className="absolute top-2 left-4 text-white/30 text-5xl rotate-12">🌟</div>
            <div className="absolute top-8 right-6 text-white/30 text-4xl -rotate-12">✨</div>
          </>
        )}
        {!isWin && (
          <div className="absolute top-4 right-8 text-white/20 text-6xl rotate-12">🌧️</div>
        )}

        <h2 className="text-4xl md:text-5xl font-black text-white drop-shadow-md relative z-10 flex items-center justify-center mb-1">
          {isWin ? (
            <>
              <Trophy className="w-10 h-10 md:w-12 md:h-12 text-yellow-300 fill-current mr-2 drop-shadow-lg transform hover:scale-110 transition-transform" />
              YOU WIN! 🎉
            </>
          ) : (
            <>
              <Frown className="w-10 h-10 md:w-12 md:h-12 text-white mr-2 drop-shadow-lg" />
              GAME OVER! 😢
            </>
          )}
        </h2>
        <p className="text-white text-sm md:text-lg font-bold mt-1 relative z-10 bg-black/20 inline-block px-4 py-1 rounded-full shadow-inner">
          {state.message}
        </p>
      </div>

      {/* Content */}
      <div className="p-4 md:p-6 bg-sky-50 flex flex-col items-center">
        <div className="grid grid-cols-2 gap-4 mb-4 md:mb-6 w-full">
          <div className="bg-yellow-400 border-b-4 border-yellow-600 p-2 md:p-3 rounded-2xl text-center shadow-md">
            <div className="text-[10px] md:text-sm font-black text-yellow-900 uppercase tracking-widest bg-white/40 rounded-full inline-block px-2 py-0.5 mb-1">Final Score</div>
            <div className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{score}</div>
          </div>

          <div className="bg-sky-400 border-b-4 border-sky-600 p-2 md:p-3 rounded-2xl text-center shadow-md">
            <div className="text-[10px] md:text-sm font-black text-sky-900 uppercase tracking-widest bg-white/40 rounded-full inline-block px-2 py-0.5 mb-1">Words Used</div>
            <div className="text-3xl md:text-4xl font-black text-white drop-shadow-md">{words.length}</div>
          </div>
        </div>

        {/* Word list */}
        <div className="mb-6 w-full max-h-32 md:max-h-40 overflow-y-auto bg-white rounded-2xl border-4 border-sky-100 p-3 shadow-inner custom-scrollbar">
          {words.length > 0 ? (
            <div className="flex flex-wrap gap-2 justify-center">
              {words.map((word, index) => (
                <div
                  key={`${word.word}-${index}`}
                  className={`px-2 py-1 text-xs md:text-sm font-bold rounded-lg border-b-2 transform transition-transform hover:-translate-y-1 ${word.special
                    ? 'bg-amber-100 text-amber-800 border-amber-300 shadow-sm'
                    : 'bg-sky-100 text-sky-700 border-sky-200 shadow-sm'
                    }`}
                >
                  {word.word} <span className="opacity-60 text-[10px] md:text-xs ml-1 font-black">+{word.points}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-400 font-bold py-2 md:py-4">No magic words used yet!</div>
          )}
        </div>

        {/* Buttons */}
        <div className="flex flex-col space-y-3 w-full">
          <button
            onClick={handlePlayAgain}
            className="bg-gradient-to-b from-blue-400 to-blue-600 hover:from-blue-500 hover:to-blue-700 text-white py-3 px-4 rounded-2xl font-black text-lg transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(37,99,235)] flex items-center justify-center border-2 border-blue-300"
          >
            <RotateCcw className="w-5 h-5 mr-2 stroke-[3]" />
            PLAY AGAIN!
          </button>

          <button
            onClick={handleSwitchMode}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 py-3 px-4 rounded-2xl font-bold text-sm transition-all transform hover:scale-105 active:scale-95 shadow-[0_4px_0_rgb(156,163,175)] flex items-center justify-center border-2 border-white"
          >
            <Menu className="w-4 h-4 mr-2 stroke-[3]" />
            SWITCH TO {state.gameMode === 'casual' ? 'TIMED' : 'CASUAL'} MODE
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameOver;