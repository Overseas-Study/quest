import { Sails } from "sails-js";
import { GearApi } from "@gear-js/api";

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
  "0xc3235a6ec2e26f5875c95d2a85eb34dc9506638c305adeb980daca04ba8b2da3";

export const init_sails = async (gearApi, programId) => {
  const sails = await Sails.new();
  sails.parseIdl(idl);
  sails.setApi(gearApi);
  sails.setProgramId(programId);

  return sails;
};
