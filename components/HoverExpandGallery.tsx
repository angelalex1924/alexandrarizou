"use client";

import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HoverExpandGalleryProps {
    images: string[];
    className?: string;
}

const HoverExpandGallery = ({
    images,
    className,
}: HoverExpandGalleryProps) => {
    const [activeImage, setActiveImage] = useState<number | null>(0);

    return (
        <motion.div
            initial={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{
                duration: 0.3,
                delay: 0.5,
            }}
            className={cn("relative w-full max-w-6xl px-5", className)}
        >
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="w-full"
            >
                <div className="flex w-full flex-col items-center justify-center gap-1">
                    {images.map((image, index) => (
                        <motion.div
                            key={image + index}
                            className="group relative cursor-pointer overflow-hidden rounded-3xl w-full max-w-md"
                            initial={{ height: "2.5rem" }}
                            animate={{
                                height: activeImage === index ? "24rem" : "2.5rem",
                            }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                            onClick={() => setActiveImage(activeImage === index ? null : index)}
                            onHoverStart={() => setActiveImage(index)}
                        >
                            <AnimatePresence>
                                {activeImage === index && (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 h-full w-full bg-gradient-to-t from-black/50 to-transparent"
                                    />
                                )}
                            </AnimatePresence>
                            <div className="relative h-full w-full">
                                <Image
                                    src={image}
                                    alt={`Alexandra Rizou gallery image ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 90vw, 384px"
                                    priority={index === 0}
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>
        </motion.div>
    );
};

export default HoverExpandGallery;

