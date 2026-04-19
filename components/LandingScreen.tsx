"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface Props {
  onStart: () => void;
}

export function LandingScreen({ onStart }: Props) {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#020023]">
      <div className="absolute inset-0 z-[1]">
        <Image
          src="/landing/backg.svg"
          alt=""
          fill
          priority
          className="object-cover"
        />
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 mx-auto flex min-h-screen w-full max-w-[1300px] items-center justify-center px-4"
      >
        <div className="relative w-[min(92vw,860px)]">
          <Image
            src="/landing/book.svg"
            alt="LAUNCH main menu book"
            width={860}
            height={610}
            priority
            className="h-auto w-full"
          />

          <div className="absolute left-[6%] bottom-[7%] z-30 w-[24%]">
            <Image
              src="/landing/envelope.svg"
              alt="Envelope"
              width={180}
              height={120}
              className="h-auto w-full"
            />
          </div>

          <div className="absolute right-[6%] top-[28%] z-30 flex w-[34%] max-w-[230px] flex-col gap-2 sm:gap-3">
            <button
              type="button"
              aria-label="Load scenes"
              className="cursor-default"
            >
              <Image
                src="/landing/loadscenes.svg"
                alt="Load Scenes"
                width={230}
                height={72}
                className="h-auto w-full"
              />
            </button>

            <motion.button
              type="button"
              aria-label="Play"
              onClick={onStart}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
              className="outline-none"
            >
              <Image
                src="/landing/play.svg"
                alt="Play"
                width={230}
                height={72}
                className="h-auto w-full"
              />
            </motion.button>

            <button
              type="button"
              aria-label="Characters"
              className="cursor-default"
            >
              <Image
                src="/landing/characters.svg"
                alt="Characters"
                width={230}
                height={72}
                className="h-auto w-full"
              />
            </button>
          </div>
        </div>
      </motion.div>

      {[
        { top: "2%", left: "-3%", size: "17vw", delay: 0 },
        { top: "6%", left: "34%", size: "5vw", delay: 0.5 },
        { top: "11%", right: "18%", size: "4vw", delay: 1.2 },
        { top: "16%", left: "21%", size: "3.5vw", delay: 0.8 },
        { top: "18%", right: "4%", size: "3vw", delay: 1.6 },
      ].map((star, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0.5 }}
          animate={{ opacity: [0.5, 1, 0.6, 1] }}
          transition={{
            duration: 4,
            delay: star.delay,
            repeat: Infinity,
            repeatType: "mirror",
          }}
          className="pointer-events-none absolute z-30"
          style={{
            top: star.top,
            left: star.left,
            right: star.right,
            width: star.size,
          }}
        >
          <Image
            src="/landing/constellation-alt.svg"
            alt=""
            width={200}
            height={200}
            className="h-auto w-full"
          />
        </motion.div>
      ))}

      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="pointer-events-none absolute bottom-0 left-0 z-30 w-[clamp(130px,14vw,240px)]"
      >
        <Image
          src="/landing/lantern-left.svg"
          alt=""
          width={240}
          height={500}
          className="h-auto w-full"
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.9, delay: 0.25 }}
        className="pointer-events-none absolute bottom-0 right-0 z-30 w-[clamp(130px,14vw,240px)]"
      >
        <Image
          src="/landing/lantern-right.svg"
          alt=""
          width={240}
          height={500}
          className="h-auto w-full"
        />
      </motion.div>
    </main>
  );
}
