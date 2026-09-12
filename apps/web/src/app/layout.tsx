import type {Metadata} from 'next';
import './globals.css';
export const metadata: Metadata = {title:'ProofSettle — Verified Settlement',description:'Cross-chain settlement powered by Attestcoin and Creditcoin.'};
export default function RootLayout({children}:{children:React.ReactNode}) {return <html lang="en"><body>{children}</body></html>}
