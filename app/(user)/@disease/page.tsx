"use client";

import Image from "next/image";
import React, { useState } from "react";
import { useSession } from "next-auth/react";

import DiseaseModal from "@/components/modals/DiseaseModal";

const diseases = [
  {
    title: "Banana Black Sigatoka Disease",
    image: "/img/Banana-Black-Sigatoka.jpg",
    description:
      "Black Sigatoka, also known as black leaf streak, is a serious fungal disease caused by Mycosphaerella fijiensis. It primarily affects the leaves of banana plants, leading to dark streaks or spots that expand and coalesce, ultimately causing large areas of leaf necrosis. The disease reduces the photosynthetic area of the plant, which directly results in a significant decline in fruit yield and quality. It spreads through airborne spores and thrives in humid tropical climates, requiring rigorous management including fungicide application and resistant cultivars.",
  },
  {
    title: "Banana Cordana Disease",
    image: "/img/Banana-Cordana.jpg",
    description:
      "Cordana leaf spot is caused by the fungus Cordana musae. This disease is characterized by the appearance of brown to dark brown elliptical or irregular spots on banana leaves, often surrounded by yellow halos. Over time, these lesions may enlarge and merge, reducing the photosynthetic area. While it is generally considered less severe than other banana leaf diseases, heavy infestations can stress the plant and lead to decreased productivity. Proper field sanitation and fungicide treatments can help manage its spread.",
  },
  {
    title: "Banana Bract Mosaic Virus Disease",
    image: "/img/Banana-Bract-Mosaic-Virus.jpg",
    description:
      "Bract Mosaic Disease is a viral infection caused by a Potyvirus, often transmitted by aphids, particularly Pentalonia nigronervosa. The disease is identified by mosaic patterns, spindle-shaped streaks, and sometimes distortion on the leaves, bracts, and flowers of the banana plant. It can severely affect plant growth and reduce fruit yield. Since it is transmitted by insect vectors, controlling aphid populations and using virus-free planting materials are key strategies for disease management.",
  },
  {
    title: "Banana Moko Disease",
    image: "/img/Banana-Moko.jpg",
    description:
      "Moko disease is a lethal bacterial infection caused by Ralstonia solanacearum (race 2). It invades the vascular system of the banana plant, leading to internal vascular discoloration (browning), wilting of the leaves, and the eventual collapse of the plant. External symptoms include premature yellowing and wilting of the leaves, while internally, the pseudostem and fruit show darkened vascular strands. It is spread through contaminated tools, infected planting materials, and insect vectors, making proper sanitation and control measures critical.",
  },
  {
    title: "Banana Panama Disease",
    image: "/img/Banana-Panama.jpg",
    description:
      "Panama Disease, or Fusarium wilt, is a devastating soil-borne fungal disease caused by Fusarium oxysporum f. sp. cubense (Foc). It attacks the banana plant’s vascular system, leading to yellowing and wilting of older leaves, which eventually collapse around the pseudostem. The internal tissues show reddish-brown discoloration. The fungus can persist in the soil for decades, making it extremely difficult to eradicate. Management includes using resistant cultivars, crop rotation, and strict quarantine measures.",
  },
  {
    title: "Banana Weevil Disease",
    image: "/img/Banana-Weevil.jpg",
    description:
      "Banana weevil infestation, caused by Cosmopolites sordidus, is a major pest problem in banana cultivation. Adult weevils lay eggs near the base of the banana plant, and the emerging larvae bore into the pseudostem and rhizome, creating extensive galleries that damage the plant's internal tissues. This damage impairs nutrient and water transport, weakens the plant structure, and can lead to toppling and reduced fruit production. Integrated pest management strategies such as trapping, use of resistant varieties, and biological control are used to combat this pest.",
  },
];

function Page() {
  const { data: session } = useSession();
  const [selectedDisease, setSelectedDisease] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleLearnMore = (disease: any) => {
    setSelectedDisease(disease);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedDisease(null);
  };

  function shortenText(text: string, maxLength: number) {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  }

  return (
    <section
      className="mt-10 flex w-screen scroll-mt-20 flex-col items-center justify-center gap-3 px-6 md:px-10 lg:px-28"
      id="disease"
    >
      <div className="text-center">
        <p className="font-clash-grotesk text-primary text-2xl font-semibold md:text-4xl">
          <span className="text-secondary">Banana</span> Disease & Care
        </p>
        <p>Identify diseases and keep your banana plants thriving</p>
      </div>

      <div className="bg-primary/20 flex max-w-screen flex-col flex-wrap items-center justify-center gap-2 overflow-hidden px-6 py-6 md:flex-row md:rounded-md">
        {diseases.map((disease, index) => (
          <div
            key={index}
            className="bg-primary flex w-fit flex-col items-center justify-center rounded-md px-4 py-4 shadow-black/65 md:w-96"
          >
            <div className="relative h-96 w-full overflow-hidden rounded-t-md">
              <Image
                src={disease.image}
                fill
                alt={disease.title}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="bg-dark text-light w-full rounded-b-md px-4 py-4">
              <p className="text-lg font-semibold">{disease.title}</p>
              <p>
                {shortenText(disease.description, 60)}
                <span
                  onClick={() => handleLearnMore(disease)}
                  className="text-secondary cursor-pointer hover:underline"
                >
                  Read more...
                </span>
              </p>
            </div>
          </div>
        ))}
      </div>

      <DiseaseModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        disease={selectedDisease}
        session={session}
      />
    </section>
  );
}

export default Page;
