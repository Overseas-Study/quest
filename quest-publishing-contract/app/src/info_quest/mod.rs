use cell::RefCell;
use gstd::collections::BTreeMap;
use gstd::msg;
use sails_rs::prelude::*;

pub struct InfoQuestData {
    // Who published which info quest.
    pub info_quest_map: BTreeMap<ActorId, InformationQuest>,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct InformationQuest {
    pub login_method: String,
    pub deadline: String,
    pub title: String,
    pub description: String,
    pub submission_requirements: String,
    pub submission_type: String,
    pub reward_amount: String,
    pub submissions: Submissions,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct UserInput {
    pub login_method: String,
    pub deadline: String,
    pub title: String,
    pub description: String,
    pub submission_requirements: String,
    pub submission_type: String,
    pub reward_amount: String,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub struct Submissions {
    // Who submitted what
    pub map: BTreeMap<ActorId, String>,
    pub status: BTreeMap<ActorId, SubmissionStatus>,
}

#[derive(Encode, Decode, TypeInfo, Default, Clone)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum SubmissionStatus {
    #[default]
    Submitted,
    Rejected,
    Approved,
}

#[derive(Encode, Decode, TypeInfo)]
#[codec(crate = sails_rs::scale_codec)]
#[scale_info(crate = sails_rs::scale_info)]
pub enum QuestEvents {
    Published(ActorId, BTreeMap<ActorId, InformationQuest>),
    SubmissionNotFound,
    QuestIsClosed,
    AlreadyDecided,
    QuestCompleted,
    SubmissionRejected,
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
            deadline: quest_details.deadline,
            title: quest_details.title,
            description: quest_details.description,
            submission_requirements: quest_details.submission_requirements,
            submission_type: quest_details.submission_type,
            reward_amount: quest_details.reward_amount,
            submissions: Submissions {
                map: BTreeMap::new(),
                status: BTreeMap::new(),
            },
        };
        self.data
            .borrow_mut()
            .info_quest_map
            .insert(msg::source(), new_info_quest);
        self.notify_on(QuestEvents::Published(
            msg::source(),
            self.data.borrow_mut().info_quest_map.clone(),
        ))
        .unwrap();
    }

    pub fn get_state(&self, user: ActorId) -> Option<InformationQuest> {
        self.data
            .borrow()
            .info_quest_map
            .get(&user)
            .cloned()
    }
}
