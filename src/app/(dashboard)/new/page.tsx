import ChatInterface from '@/components/ChatInterface'

export default function NewProposalPage() {
    return (
        <main className="flex-grow flex flex-col items-center justify-center min-h-[85vh] p-8">
            <div className="w-full max-w-4xl">
                <ChatInterface />
            </div>
        </main>
    )
}
