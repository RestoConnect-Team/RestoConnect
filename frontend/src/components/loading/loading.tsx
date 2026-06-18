export interface loadingProps {
    loading_sentence: string;
}

export default function Loading({
    loading_sentence
}: loadingProps) {
    return (
        <div className="flex items-center justify-center py-12">
            <div className="text-center">
                <div className="inline-block animate-spin mb-4">
                <div className="w-12 h-12 border-4 border-gray-200 border-t-[rgb(230,0,126)] rounded-full"></div>
                </div>
                <p className="text-gray-600">{loading_sentence}</p>
            </div>
        </div>
    );
}