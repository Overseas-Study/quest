#![no_std]

use collections::btree_map::BTreeMap;
use gmeta::{In, InOut, Metadata, Out};
use gstd::{prelude::*, ActorId};

pub struct InformationQuest;

impl Metadata for InformationQuest {
    type Init = In<QuestInit>;
    type Handle = InOut<QuestAction, Result<QuestEvent, QuestError>>;
    type State = Out<QuestState>;
    type Reply = ();
    type Others = ();
    type Signal = ();
}

// Internal quest state.
// TODO: should create some functions on types to make some fields private.
#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct QuestState {
    // Publisher info.
	pub publisher: ActorId,
	// Configurable quest attributes.
	pub title: String,
	pub description: String,
	pub reward: Option<TokenId>,
    // exec::block_timestamp
	pub deadline: Option<u64>,
	// Core quest states.
	pub publishing_time: u64,
	pub status: QuestStatus,
	pub participants: Option<BTreeMap<ActorId, Submission>>,
}

impl QuestState {
	pub fn add_participant(&mut self, actor_id: ActorId, submission: Submission) {
        if self.participants.is_none() {
            self.participants = Some(BTreeMap::new());
        }

        if let Some(ref mut participants) = self.participants {
            participants.insert(actor_id, submission);
        }
    }

	pub fn get_submission(&mut self, actor_id: ActorId) -> Option<&mut Submission> {
		if let Some(ref mut participants) = self.participants {
			participants.get_mut(&actor_id)
		} else {
			None
		}
	}
}

// Get configurable values from the user.
#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct QuestInit {
    pub title: String,
	pub description: String,
	pub reward: Option<TokenId>,
    pub deadline: Option<u64>,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum QuestAction {
	Submit(Submission),
	Decide(ActorId, Decision),
	Retract,
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum QuestEvent {
    Published(ActorId),
	// Which user submitted to which quest.
	Submitted(ActorId, ActorId),
	// Which user's submission get decided in which quest.
	Decided(ActorId, ActorId),
	// Which quest is marked as completed as a result of which user's submission.
	Completed(ActorId, ActorId),
	// Which quest is retracted by its publisher.
	Retracted(ActorId),
}

#[derive(Debug, Clone, Encode, Decode, TypeInfo)]
pub enum QuestError {
	QuestIsClosed,
	QuestAlreadyRetracted,
}

// This serves as a state machine to ensure correct quest state transitions.
#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub enum QuestStatus {
    #[default]
    Published,
    Completed,
    Retracted,
}

impl QuestStatus {
	pub fn is_published(&self) -> bool {
		matches!(self, QuestStatus::Published)
	}

	pub fn is_completed(&self) -> bool {
		matches!(self, QuestStatus::Completed)
	}

	pub fn is_retracted(&self) -> bool {
		matches!(self, QuestStatus::Retracted)
	}
}

#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo, PartialEq, Eq)]
pub enum Decision {
	#[default]
	Pending,
	Accepted,
	Denied,
}

#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct TokenId(String);

// Represent submission from the quest participants.
#[derive(Debug, Default, Clone, Encode, Decode, TypeInfo)]
pub struct Submission {
	pub content: String,
	pub status: Decision,
}