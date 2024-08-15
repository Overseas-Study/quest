#![no_std]

use gstd::{msg, prelude::*, exec};
use io::*;

static mut QUEST: Option<QuestState> = None;

#[no_mangle]
extern fn init() {
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

    let _ = msg::reply(QuestEvent::Published(msg::source()), 0).expect("Failed to reply to init message.");
}

#[no_mangle]
extern fn handle() {
    let quest_action: QuestAction = msg::load().expect("Failed to load quest action.");

    let quest = unsafe { QUEST.as_mut().expect("Quest state not initialized.") };

    // Once a quest is marked as completed or retracted, it can NOT:
    // 1. get completed/retracted again.
    // 2. get submitted to.
    match quest_action {
        // Action performed by participants.
        QuestAction::Submit(submission) => {
            let participant = msg::source();
            quest.add_participant(participant, submission);

            let _ = msg::reply(QuestEvent::Submitted(participant, exec::program_id()), 0).expect("Failed to reply to submit action.");
        },
        // Action performed by the quest publisher.
        QuestAction::Decide(participant, decision) => {
            let submission = quest.get_submission(participant.clone()).expect("Submission not found.");
            submission.status = decision.clone();

            if decision == Decision::Accepted {
                quest.status = QuestStatus::Completed;

                let _ = msg::reply(QuestEvent::Completed(exec::program_id(), participant), 0).expect("Failed to reply to decide action.");
            }

            let _ = msg::reply(QuestEvent::Decided(participant, exec::program_id()), 0).expect("Failed to reply to decide action.");
        },
        QuestAction::Retract => {
            quest.status = QuestStatus::Retracted;
        },
    }
}

#[no_mangle]
extern fn state() {}