#![no_std]

use gstd::{exec, msg, prelude::*};
use io::*;

static mut QUEST: Option<QuestState> = None;

#[no_mangle]
extern "C" fn init() {
    let init_msg: QuestInit = msg::load().expect("Failed to load init message.");

    unsafe {
        QUEST = Some(QuestState {
            publisher: msg::source(),
            title: init_msg.title,
            description: init_msg.description,
            reward: init_msg.reward,
            deadline: init_msg.deadline,
            publishing_time: exec::block_timestamp(),
            status: QuestStatus::default(),
            participants: None,
        })
    }

    let _ = msg::reply(QuestEvent::Published(msg::source()), 0)
        .expect("Failed to reply to init message.");
}

#[no_mangle]
extern "C" fn handle() {
    let quest_action: QuestAction = msg::load().expect("Failed to load quest action.");

    let quest = unsafe { QUEST.as_mut().expect("Quest state not initialized.") };

    match quest_action {
        // Action performed by participants.
        QuestAction::Submit(submission) => {
            // State check first.
            if !quest.status.is_published() {
                let _ = msg::reply(Err::<QuestEvent, QuestError>(QuestError::QuestIsClosed), 0)
                    .expect("Failed to reply to submit error.");
            }

            let participant = msg::source();
            quest.add_participant(participant, submission);

            let _ = msg::reply(
                Ok::<QuestEvent, QuestError>(QuestEvent::Submitted(participant, exec::program_id())),
                0,
            )
            .expect("Failed to reply to submit action.");
        }

        // Actions performed by the quest publisher.
        QuestAction::Decide(participant, decision) => {
            // State check first.
            if !quest.status.is_published() {
                let _ = msg::reply(Err::<QuestEvent, QuestError>(QuestError::QuestIsClosed), 0)
                    .expect("Failed to reply to decide error.");
            }

            let submission = quest
                .get_submission(participant.clone())
                .expect("Submission not found.");
            submission.status = decision.clone();

            if decision == Decision::Accepted {
                quest.status = QuestStatus::Completed;

                let _ = msg::reply(
                    Ok::<QuestEvent, QuestError>(QuestEvent::Completed(exec::program_id(), participant)),
                    0,
                )
                .expect("Failed to reply to decide action.");
            }

            let _ = msg::reply(Ok::<QuestEvent, QuestError>(QuestEvent::Decided(participant, exec::program_id())), 0)
                .expect("Failed to reply to decide action.");
        }

        QuestAction::Retract => {
            // State check first.
            if !quest.status.is_retracted() {
                let _ = msg::reply(Err::<QuestEvent, QuestError>(QuestError::QuestAlreadyRetracted), 0)
                    .expect("Failed to reply to retract error.");
            }

            quest.status = QuestStatus::Retracted;

            let _ = msg::reply(Ok::<QuestEvent, QuestError>(QuestEvent::Retracted(exec::program_id())), 0)
                .expect("Failed to reply to retract action.");
        }
    }
}

#[no_mangle]
extern "C" fn state() {}
