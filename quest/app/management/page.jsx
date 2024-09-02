"use client";

import CompactQuestCard from "@/components/management/CompactQuestCard";
import QuestDetails from "@/components/management/QuestDetails";
import StatisticDisplay from "@/components/management/StatisticDisplay";
import { GearApi } from "@gear-js/api";
import { useState, useEffect } from "react";
import { Program } from "@/lib/infoQuest";

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

const INFO_QUEST_ID =
  "0xc28c32a6f0cc06befec060f74231b78b7e929ac72e082e1b2a9c91ab70b50306";

export default function Management() {
  const [selectedQuest, setSelectedQuest] = useState(null);
  const [gearApi, setGearApi] = useState(null);

  useEffect(() => {
    const connectToGearApi = async () => {
      try {
        // Initialize the Gear API
        const api = await GearApi.create({
          providerAddress: "wss://testnet.vara.network",
        });
        setGearApi(api);
        console.log("Connected to Vara testnet");
      } catch (error) {
        console.error("Failed to connect to Gear API:", error);
      }
    };

    
    connectToGearApi();
  }, []);
  
  const readStates = async () => {
    // Load the program
    const infoQuest = new Program(gearApi, INFO_QUEST_ID);
    const res = await infoQuest.infoQuestSvc.getAllQuests();
    console.log("Queries:", res);
  };

  const handleClick = (title) => {
    setSelectedQuest(title);
    console.log(`Selected quest: ${title}`);
    readStates();
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
        {selectedQuest ? (
          <QuestDetails title={selectedQuest} />
        ) : (
          <p>Select a quest to view details</p>
        )}
      </div>
    </div>
  );
}
