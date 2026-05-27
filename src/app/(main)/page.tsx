import Hero        from '@/components/Hero'
import Marquee     from '@/components/Marquee'
import Features    from '@/components/Features'
import Collections from '@/components/Collections'
import SocialProof from '@/components/SocialProof'
import Pricing     from '@/components/Pricing'
import FAQ         from '@/components/FAQ'

export default function Home() {
  return (
    <main>
      <Hero />
      <Marquee />
      <Features />
      <Collections />
      <SocialProof />
      <Pricing />
      <FAQ />
    </main>
  )
}
