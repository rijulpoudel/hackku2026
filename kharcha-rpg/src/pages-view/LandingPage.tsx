import Image from "next/image";

export default function LandingPage() {
    return (
        <main className="landing-root">

            {/* ── L2: BG image ── */}
            <div className="landing-bg-wrap">
                <Image
                    src="/landing_assets/backg.svg"
                    alt="Background"
                    width={2392}
                    height={1598}
                    priority
                />
            </div>

            {/* ── L3: Book + Options + Envelope — centered on BG image ── */}
            <div className="landing-book-scene">
                <div className="landing-book-wrapper">

                    {/* Options — vertical, right side of book */}
                    <div className="landing-options">
                        <Image
                            src="/landing_assets/LOADSCENES.svg"
                            alt="Load Scenes"
                            width={150}
                            height={60}
                            className="landing-option-btn"
                        />
                        <Image
                            src="/landing_assets/PLAY.svg"
                            alt="Play"
                            width={150}
                            height={60}
                            className="landing-option-btn"
                        />
                        <Image
                            src="/landing_assets/CHARACTERS.svg"
                            alt="Characters"
                            width={150}
                            height={60}
                            className="landing-option-btn"
                        />
                    </div>

                    {/* Book */}
                    <Image
                        src="/landing_assets/book.svg"
                        alt="Book"
                        width={564}
                        height={400}
                        className="landing-book-img"
                        priority
                    />

                    {/* Envelope */}
                    <div className="landing-envelope">
                        <Image
                            src="/landing_assets/envelope.svg"
                            alt="Envelope"
                            width={120}
                            height={80}
                            style={{ width: "100%", height: "auto" }}
                        />
                    </div>

                </div>
            </div>

            {/* ── L4: Constellations scattered y=0 to y=150px ── */}
            <div className="landing-constellation-wrap landing-constellation-1">
                <Image src="/landing_assets/Constilation.svg" alt="" width={400} height={400} priority />
            </div>
            <div className="landing-constellation-wrap landing-constellation-2">
                <Image src="/landing_assets/Constilation.svg" alt="" width={400} height={400} />
            </div>
            <div className="landing-constellation-wrap landing-constellation-3">
                <Image src="/landing_assets/Constilation.svg" alt="" width={400} height={400} />
            </div>
            <div className="landing-constellation-wrap landing-constellation-4">
                <Image src="/landing_assets/Constilation.svg" alt="" width={400} height={400} />
            </div>
            <div className="landing-constellation-wrap landing-constellation-5">
                <Image src="/landing_assets/Constilation.svg" alt="" width={400} height={400} />
            </div>

            {/* ── L4: Lanterns at bottom of bg image ── */}
            <div className="landing-lanterns-anchor">
                <div className="landing-lantern-left-wrap">
                    <Image
                        src="/landing_assets/Lantern_left.svg"
                        alt="Left Lantern"
                        width={300}
                        height={600}
                        style={{ height: "100%", width: "auto" }}
                    />
                </div>
                <div className="landing-lantern-right-wrap">
                    <Image
                        src="/landing_assets/Lantern_right.svg"
                        alt="Right Lantern"
                        width={300}
                        height={600}
                        style={{ height: "100%", width: "auto" }}
                    />
                </div>
            </div>

            {/* Scroll spacer */}
            <div className="landing-spacer" />

        </main>
    );
}