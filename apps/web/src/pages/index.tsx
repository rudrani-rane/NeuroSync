import { useEffect } from 'react';
import { useRouter } from 'next/router';

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        router.push('/login');
    }, []);

    return (
        <div className="flex h-screen items-center justify-center bg-brain-dark text-white">
            <h1 className="text-4xl font-bold animate-pulse">Loading Second Brain...</h1>
        </div>
    )
}
