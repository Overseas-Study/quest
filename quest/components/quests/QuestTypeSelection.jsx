/** This component will handle quest selection, and quest forms redenring for different types of quests. */
"use client";

import { useState } from "react";
import InformationQuestForm from "./InformationQuestForm";
import SkillQuestForm from "./SkillQuestForm";
import HackingQuestForm from "./HackingQuestForm";
import MarketingQuestForm from "./MarketingQuestForm";

const QuestTypeSelection = () => {
  const [selectedType, setType] = useState("information");
  const chooseQuest = (e) => {
    setType(e.target.id);
  };

  return (
    <div className="flex flex-col gap-y-4">
      <buttonGroup>
        <span className="isolate inline-flex rounded-md shadow-sm">
          <button
            id="information"
            type="button"
            className="relative inline-flex items-center rounded-l-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={chooseQuest}
          >
            Information Quest
          </button>
          <button
            id="skill"
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={chooseQuest}
          >
            Skill Quest
          </button>
          <button
            id="hacking"
            type="button"
            className="relative -ml-px inline-flex items-center bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={chooseQuest}
          >
            Hacking Quest
          </button>
          <button
            id="marketing"
            type="button"
            className="relative -ml-px inline-flex items-center rounded-r-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-10"
            onClick={chooseQuest}
          >
            Marketing Quest
          </button>
        </span>
      </buttonGroup>
      {/* Display selected quest form. */}
      <questDisplay>
        {selectedType === "information" && <InformationQuestForm />}
        {selectedType === "skill" && <SkillQuestForm />}
        {selectedType === "hacking" && <HackingQuestForm />}
        {selectedType === "marketing" && <MarketingQuestForm />}
      </questDisplay>
    </div>
  );
};

export default QuestTypeSelection;
