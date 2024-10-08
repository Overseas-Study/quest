import { Sails } from "sails-js";
import { GearApi } from "@gear-js/api";
import { Program } from "./infoQuest";

const idl = `
type UserInput = struct {
  login_method: str,
  deadline: str,
  title: str,
  description: str,
  submission_requirements: str,
  submission_type: str,
  reward_amount: str,
};

type InformationQuest = struct {
  login_method: str,
  deadline: str,
  title: str,
  description: str,
  submission_requirements: str,
  submission_type: str,
  reward_amount: str,
  submissions: Submissions,
};

type Submissions = struct {
  map: map (actor_id, str),
  status: map (actor_id, SubmissionStatus),
};

type SubmissionStatus = enum {
  Submitted,
  Rejected,
  Approved,
};

constructor {
  New : ();
};

service InfoQuestSvc {
  Publish : (quest_details: UserInput) -> null;
  query GetState : (user: actor_id) -> opt InformationQuest;

  events {
    Published: struct { actor_id, map (actor_id, InformationQuest) };
    SubmissionNotFound;
    QuestIsClosed;
    AlreadyDecided;
    QuestCompleted;
    SubmissionRejected;
  }
};
`;

const INFO_QUEST_ID =
  "0x726db3a23fc98b838572bfcc641776dd9f510071f400d77fac526266c0fcdca7";

export const init_info_quest = async (gearApi, programId) => {
  return new Program(gearApi, programId);
};
