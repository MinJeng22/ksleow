import HomeImagePreloader from "../components/HomeImagePreloader";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Services from "../components/Services";
import Products from "../components/Products";
import OtherServices from "../components/OtherServices";
import OurTeam from "../components/OurTeam";
import Careers from "../components/Careers";
import Footer from "../components/Footer";

export default function Home({ onContact }) {
  return (
    <>
      <HomeImagePreloader />
      <div className="home-pinned-layout">
        <div className="home-hero-layer">
          <Hero onContact={onContact} />
        </div>
        <main className="home-content-layer">
          <Stats />
          <Services />
          <Products onContact={onContact} />
          <OtherServices onContact={onContact} />
          <OurTeam />
          <Careers />
          <Footer />
        </main>
      </div>
    </>
  );
}
