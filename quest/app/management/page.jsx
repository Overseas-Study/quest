"use client";

import CompactQuestCard from "@/components/management/CompactQuestCard";
import QuestDetails from "@/components/management/QuestDetails";
import StatisticDisplay from "@/components/management/StatisticDisplay";
import { useState } from "react";

const data = {
  status: "Open",
  rewardAmount: 100,
  title: "Quest Title",
  deadline: "2022-12-31",
  publisher: "Publisher",
  description: "Description",
  submissionType: "Submission Type",
  requirements: "Requirements",
  submissionTotal: 25,
  decided: 4,
  logo: "questLogo.svg",
  participant: "Participant",
  link: "#",
  decision: "Pending...",
};

const questInfo = [
  {
    title: "Quest Title",
    deadline: "2022-12-31",
    status: "Open",
    description: "Description",
    logo: "questLogo.svg",
    publisher: "Publisher",
    submissionType: "Submission Type",
    requirements: "Requirements",
  },
  {
    title: "Quest Title 2",
    deadline: "2022-12-31",
    status: "Open",
    description: "Description",
    logo: "questLogo.svg",
    publisher: "Publisher",
    submissionType: "Submission Type",
    requirements: "Requirements",
  },
];

export default function Management() {
  const [selectedQuest, setSelectedQuest] = useState(null);

  const handleClick = (title) => {
    setSelectedQuest(title);
    console.log(`Selected quest: ${title}`);
  };

  return (
    <div className="flex">
      {/* The left-side pannel on the information quest page */}
      <div className="flex flex-col items-center mr-12 divide-y divide-solid">
        <div className="w-full mb-4">
          <StatisticDisplay
            submissionTotal={data.submissionTotal}
            decided={data.decided}
          />
        </div>
        {/* Show succint information about published quests. */}
        <ul className="flex flex-col p-4 gap-y-2">
          {questInfo.map((quest) => (
            <li onClick={() => handleClick(quest.title)}>
              <CompactQuestCard
                key={quest.title}
                title={quest.title}
                deadline={quest.deadline}
                status={quest.status}
                description={quest.description}
                logo={quest.logo}
              />
            </li>
          ))}
        </ul>
      </div>
      {/* The information quest form */}
      <div>
        {selectedQuest ? <QuestDetails title={selectedQuest} />: <p>Select a quest to view details</p>}
      </div>
    </div>
  );
}
