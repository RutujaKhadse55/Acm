import Hero            from '../components/Hero';
import Achievements    from '../components/Achievements';
import About           from '../components/About';
import Gallery         from '../components/Gallery';
import JoinCommittee   from '../components/JoinCommittee';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Achievements />
      <About />
      <Gallery />
      <JoinCommittee />
    </main>
  );
}
