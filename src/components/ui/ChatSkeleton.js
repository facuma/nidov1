'use client'

export default function ChatSkeleton() {
  return (
    <div className="flex flex-col flex-1 p-4 space-y-4 overflow-hidden">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className={`
            flex ${i % 2 === 0 ? 'justify-start' : 'justify-end'}
          `}
        >
          <div
            className={`
              bg-gray-200 animate-pulse
              h-5
              ${i % 2 === 0 ? 'w-1/3' : 'w-1/2'}
              rounded-lg
            `}
          />
        </div>
      ))}
    </div>
  )
}
