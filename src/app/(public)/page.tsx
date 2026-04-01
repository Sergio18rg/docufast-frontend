import Image from "next/image";

const LandingPage = () => {
  return (
    <section className="px-6 py-10">
      <div className="mx-auto flex min-h-screen max-w-7xl justify-center">
        <div className="relative h-175 w-full max-w-5xl">
          <Image
            src="/images/landing.png"
            alt="DocuFast landing illustration"
            fill
            priority
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default LandingPage;
