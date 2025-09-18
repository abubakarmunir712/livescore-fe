import { Loader2 } from "lucide-react";

export default function Loading() {
    return (
        <div className="flex items-center justify-center w-full h-full p-6">
            <Loader2 className="w-6 h-6 animate-spin text-accent" />
            <span className="ml-2 text-text">Loading...</span>
        </div>
    );
}
