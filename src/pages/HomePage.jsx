import Hero from '../components/Hero';
import Achievements from '../components/Achievements';
import About from '../components/About';
import Gallery from '../components/Gallery';
import JoinCommittee from '../components/JoinCommittee';
import Viralsection from '../components/Viralsection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Achievements />
      <Viralsection />
      <About />
      <Gallery />
      <JoinCommittee />
    </main>
  );
}
