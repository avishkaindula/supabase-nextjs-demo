export type Message =
  | { success: string }
  | { error: string }
  | { message: string };

export function FormMessage({ message }: { message: Message }) {
  return (
    <div className="flex flex-col gap-2 w-full max-w-md text-sm">
      {"success" in message && (
        <div className="text-green-700 bg-green-50 border-l-2 border-green-600 px-4 py-2 rounded">
          {message.success}
        </div>
      )}
      {"error" in message && (
        <div className="text-red-700 bg-red-50 border-l-2 border-red-600 px-4 py-2 rounded">
          {message.error}
        </div>
      )}
      {"message" in message && (
        <div className="text-gray-700 bg-gray-50 border-l-2 border-gray-400 px-4 py-2 rounded">
          {message.message}
        </div>
      )}
    </div>
  );
} 