import "./BackgroundBlobs.css";

export default function BackgroundBlobs() {
    return (
        <div className="bg-blobs-wrapper">
            <svg className="circuit-svg" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice">

                {/* static circuit traces */}
                <path className="trace" d="M -20 60  L 160 60  L 230 130 L 230 240 L 340 350" />
                <path className="trace" d="M 100 -20 L 100 140 L 220 260 L 220 420 L 360 560" />
                <path className="trace trace--bright" d="M -20 320 L 140 320 L 260 440 L 480 440 L 620 580 L 620 760 L 760 900" />
                <path className="trace" d="M 980 40 L 800 40 L 720 120 L 720 260 L 600 380" />
                <path className="trace trace--bright" d="M 1020 220 L 840 220 L 760 300 L 600 300 L 480 420 L 480 560 L 360 680" />
                <path className="trace" d="M 1020 480 L 880 480 L 800 560 L 800 700 L 700 800" />
                <path className="trace" d="M 1020 700 L 900 700 L 820 780 L 660 780 L 580 860" />
                <path className="trace" d="M -20 600 L 100 600 L 180 680 L 340 680 L 420 760 L 420 1020" />
                <path className="trace" d="M 200 1020 L 200 880 L 320 760 L 480 760 L 580 660" />
                <path className="trace" d="M 600 1020 L 600 900 L 700 800" />

                {/* traveling light pulses along the bright traces */}
                <path className="pulse" style={{ animationDuration: "6.5s", animationDelay: "0s" }}
                    d="M -20 320 L 140 320 L 260 440 L 480 440 L 620 580 L 620 760 L 760 900" />
                <path className="pulse" style={{ animationDuration: "8s", animationDelay: "2.2s" }}
                    d="M 1020 220 L 840 220 L 760 300 L 600 300 L 480 420 L 480 560 L 360 680" />
                <path className="pulse" style={{ animationDuration: "7.2s", animationDelay: "4s" }}
                    d="M 100 -20 L 100 140 L 220 260 L 220 420 L 360 560" />
                <path className="pulse" style={{ animationDuration: "9s", animationDelay: "1s" }}
                    d="M -20 600 L 100 600 L 180 680 L 340 680 L 420 760 L 420 1020" />

                {/* glowing node dots */}
                <circle className="node" cx="230" cy="130" r="3" style={{ animationDelay: "0s" }} />
                <circle className="node" cx="340" cy="350" r="2.4" style={{ animationDelay: "0.6s" }} />
                <circle className="node" cx="620" cy="580" r="3" style={{ animationDelay: "1.2s" }} />
                <circle className="node" cx="480" cy="420" r="2.4" style={{ animationDelay: "0.3s" }} />
                <circle className="node" cx="800" cy="560" r="2.4" style={{ animationDelay: "1.8s" }} />
                <circle className="node" cx="220" cy="260" r="2.2" style={{ animationDelay: "2.1s" }} />
                <circle className="node" cx="700" cy="800" r="3" style={{ animationDelay: "0.9s" }} />
                <circle className="node" cx="420" cy="760" r="2.4" style={{ animationDelay: "1.5s" }} />
                <circle className="node" cx="580" cy="660" r="2.2" style={{ animationDelay: "2.4s" }} />
                <circle className="node" cx="600" cy="300" r="2.2" style={{ animationDelay: "0.4s" }} />
                <circle className="node" cx="180" cy="680" r="2" style={{ animationDelay: "1.1s" }} />
                <circle className="node" cx="760" cy="300" r="2" style={{ animationDelay: "1.9s" }} />

            </svg>
        </div>
    );
}