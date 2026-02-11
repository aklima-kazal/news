"use client";

export function ErrorAlert({ error, onRetry = null }) {
  return (
    <div className="bg-red-900/20 border border-red-700 text-red-300 p-4 rounded-lg">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-semibold text-red-400">⚠️ Something went wrong</p>
          <p className="text-sm mt-1">{error}</p>
        </div>
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1 bg-red-700/50 hover:bg-red-700 rounded text-xs font-medium whitespace-nowrap transition-colors"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-400"></div>
      <span className="ml-3 text-gray-300">Loading...</span>
    </div>
  );
}

export function SuccessAlert({ message, onDismiss = null }) {
  return (
    <div className="bg-green-900/20 border border-green-700 text-green-300 p-4 rounded-lg flex items-center justify-between">
      <p>✨ {message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-green-400 hover:text-green-300 text-xl"
        >
          ✕
        </button>
      )}
    </div>
  );
}
