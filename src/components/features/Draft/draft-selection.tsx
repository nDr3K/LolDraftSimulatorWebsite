export default function DraftSelection() {
    return (
      <div className="grid grid-cols-[70%_30%] gap-2 m-4">
        <div className="flex gap-2">
        {['top', 'jungle', 'mid', 'bot', 'support'].map((role) => (
          <div
            key={role}
            className="w-8 h-8 flex items-center justify-center brightness-75 hover:cursor-pointer hover:brightness-125 hover:drop-shadow-lg transition duration-200"
          >
            <img src={`src/assets/position-${role}.png`} alt={`${role} position`} />
          </div>
        ))}
        </div>
        <div className="me-10">
          <input
            type="text"
            placeholder="Search champions..."
            className="w-full bg-zinc-800 text-white rounded px-4 py-1 focus:outline-none focus:ring-1 focus:ring-amber-500"
          />
        </div>
      </div>
    )
}