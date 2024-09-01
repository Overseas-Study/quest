use cell::RefCell;
use gstd::collections::BTreeMap;
use gstd::msg;
use sails_rs::prelude::*;

pub struct InfoQuestData {
    // Who published which info quest.
    pub info_quest_map: BTreeMap<Title, InformationQuest>,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct InformationQuest {
    pub login_method: LoginMethod,
    pub publisher_id: ActorId,
    pub deadline: String,
    pub title: Title,
    pub description: Description,
    pub submission_requirements: Description,
    pub submission_type: SubmissionType,
    pub reward_amount: u128,
    pub submissions: Submissions,
    pub quest_status: QuestStatus,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum LoginMethod {
    #[default]
    Web3,
    Email,
    Username,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone, Ord, PartialOrd, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Title(String);
impl Title {
    pub fn sanity_check(&self) -> bool {
        self.character_check() && self.length_check() && self.uniqueness_check()
    }

    pub fn character_check(&self) -> bool {
        true
    }

    pub fn length_check(&self) -> bool {
        true
    }
    pub fn uniqueness_check(&self) -> bool {
        true
    }
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Description(String);
impl Description {
    pub fn sanity_check(&self) -> bool {
        self.length_check()
    }

    pub fn length_check(&self) -> bool {
        true
    }
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum SubmissionType {
    #[default]
    Text,
    Link,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum SubmissionStatus {
    #[default]
    Submitted,
    Approved,
    Rejected,
    // This happens when quest owner approved a submission before grading others.
    // This status is automatically assigned to submissions.
    NoDecision,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct UserInput {
    pub login_method: LoginMethod,
    pub deadline: String,
    pub title: Title,
    pub description: Description,
    pub submission_requirements: Description,
    pub submission_type: SubmissionType,
    pub reward_amount: u128,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Submissions {
    // Map quest participants to their submissions.
    map: BTreeMap<ActorId, String>,
    // Map quest participants to their current submission status.
    status: BTreeMap<ActorId, SubmissionStatus>,
}

// Functions used by queries & services.
impl Submissions {
    // For queries.
    pub fn get_submission(&self, participant: ActorId) -> Option<String> {
        self.map.get(&participant).cloned()
    }

    pub fn get_submission_status(&self, participant: ActorId) -> Option<SubmissionStatus> {
        self.status.get(&participant).cloned()
    }

    pub fn get_all(&self) -> Self {
        self.clone()
    }

    // For services.
    pub fn submit(&mut self, participant: ActorId, submission: String) -> Result<(), QuestEvents> {
        if self.map.contains_key(&participant) {
            return Err(QuestEvents::AlreadySubmitted);
        }
        self.map.insert(participant, submission);
        self.status.insert(participant, SubmissionStatus::Submitted);
        Ok(())
    }

    // TODO: The type of decision should be considered further.
    pub fn decide(
        &mut self,
        participant: ActorId,
        decision: SubmissionStatus,
    ) -> Result<(), QuestEvents> {
        if !self.map.contains_key(&participant) {
            return Err(QuestEvents::SubmissionNotFound);
        }

        if let Some(status) = self.status.get(&participant) {
            if *status != SubmissionStatus::Submitted {
                return Err(QuestEvents::AlreadyDecided);
            }
        }

        // When one submission is approved, other undecided submissions are marked as NoDecision automatically.
        if decision == SubmissionStatus::Approved {
            for (_, status) in self.status.iter_mut() {
                if *status == SubmissionStatus::Submitted {
                    *status = SubmissionStatus::NoDecision;
                }
            }
        }

        self.status.insert(participant, decision);
        Ok(())
    }

    pub fn close(&mut self) -> Result<(), QuestEvents> {
        for (_, status) in self.status.iter_mut() {
            if *status == SubmissionStatus::Submitted {
                *status = SubmissionStatus::NoDecision;
            }
        }
        // TODO: currently this function always return Ok, how to catch unknown error here?
        Ok(())
    }
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum QuestEvents {
    Published,
    Submitted,
    DecisionMade,
    Closed,
    SubmissionNotFound,
    QuestIsClosed,
    QuestDoesNotExist,
    AlreadyDecided,
    QuestCompleted,
    SubmissionRejected,
    AlreadySubmitted,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone, PartialEq, Eq)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum QuestStatus {
    #[default]
    Open,
    Completed,
    Closed,
}

pub struct InfoQuestService<'a> {
    data: &'a RefCell<InfoQuestData>,
}

#[service(events = QuestEvents)]
impl<'a> InfoQuestService<'a> {
    pub fn new(data: &'a RefCell<InfoQuestData>) -> Self {
        Self { data }
    }

    pub fn publish(&mut self, quest_details: UserInput) {
        let new_info_quest = InformationQuest {
            login_method: quest_details.login_method,
            publisher_id: msg::source(),
            deadline: quest_details.deadline,
            title: quest_details.title.clone(),
            description: quest_details.description,
            submission_requirements: quest_details.submission_requirements,
            submission_type: quest_details.submission_type,
            reward_amount: quest_details.reward_amount,
            submissions: Submissions {
                map: BTreeMap::new(),
                status: BTreeMap::new(),
            },
            quest_status: QuestStatus::Open,
        };
        self.data
            .borrow_mut()
            .info_quest_map
            .insert(quest_details.title, new_info_quest);

        self.notify_on(QuestEvents::Published).unwrap();
    }

    pub fn submit(&mut self, participant: ActorId, submission: String, title: Title) {
        if self.is_open(title.clone()) == false {
            self.notify_on(QuestEvents::QuestIsClosed).unwrap();
            return;
        }

        let mut data = self.data.borrow_mut();
        if let Some(info_quest) = data.info_quest_map.get_mut(&title) {
            if let Err(e) = info_quest.submissions.submit(participant, submission) {
                self.notify_on(e).unwrap();
            } else {
                self.notify_on(QuestEvents::Submitted).unwrap();
            }
        } else {
            self.notify_on(QuestEvents::QuestDoesNotExist).unwrap();
        }
    }

    pub fn decide(&mut self, participant: ActorId, decision: SubmissionStatus, title: Title) {
        if self.is_open(title.clone()) == false {
            self.notify_on(QuestEvents::QuestIsClosed).unwrap();
            return;
        }

        let mut data = self.data.borrow_mut();
        if let Some(info_quest) = data.info_quest_map.get_mut(&title) {
            if let Err(e) = info_quest.submissions.decide(participant, decision.clone()) {
                self.notify_on(e).unwrap();
            } else {
                // When one submission is approved, the quest is marked as Finished.
                if decision == SubmissionStatus::Approved {
                    info_quest.quest_status = QuestStatus::Completed;
                    self.notify_on(QuestEvents::QuestCompleted).unwrap();
                } else {
                    self.notify_on(QuestEvents::DecisionMade).unwrap();
                }
            }
        } else {
            self.notify_on(QuestEvents::QuestDoesNotExist).unwrap();
        }
    }

    pub fn close(&mut self, title: Title) {
        if self.is_open(title.clone()) == false {
            self.notify_on(QuestEvents::QuestIsClosed).unwrap();
            return;
        }

        let mut data = self.data.borrow_mut();
        if let Some(info_quest) = data.info_quest_map.get_mut(&title) {
            if let Err(e) = info_quest.submissions.close() {
                self.notify_on(e).unwrap();
            } else {
                self.notify_on(QuestEvents::Closed).unwrap();
            }
        } else {
            self.notify_on(QuestEvents::QuestDoesNotExist).unwrap();
        }
    }

    // Queries

    pub fn get_quest(&self, title: Title) -> Option<InformationQuest> {
        self.data.borrow().info_quest_map.get(&title).cloned()
    }

    pub fn get_all_quests(&self) -> Option<BTreeMap<Title, InformationQuest>> {
        Some(self.data.borrow().info_quest_map.clone())
    }

    // Helper functions
    fn is_open(&self, title: Title) -> bool {
        if let Some(info_quest) = self.data.borrow().info_quest_map.get(&title) {
            return info_quest.quest_status == QuestStatus::Open;
        }
        false
    }
}
