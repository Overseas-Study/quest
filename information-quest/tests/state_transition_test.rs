use gtest::{Log, Program, System};
use io::*;

//-----------------------------------Success Scenarios--------------------------------------

#[test]
fn quest_publishment_success() {
    let system = System::new();
    let program = Program::from_file(
        &system,
        "../target/wasm32-unknown-unknown/wasm32-unknown-unknown/release/information_quest.opt.wasm",
    );
    
    let publisher = ActorId::from(42);
    let prog_id = program.id();

    // Initialize quest.
    let init_msg = QuestInit {
        title: "Test Quest".to_string(),
        description: "Test quest description.".to_string(),
        reward: Some(1),
        deadline: Some(1000),
    };

    // Init logger.
    system.init_logger();

    let success_log = Log::builder()
        .source(prog_id)
        .dest(publisher.clone())
        .payload(Ok(QuestEvent::Published(publisher.clone())));

    // Send init message.
    let res = program.send(publisher, init_msg);

    // Check if the message was sent successfully.
    assert!(!res.main_failed());
    assert!(!res.others_failed());
    assert!(res.contains(&success_log));
}

//-----------------------------------Failure Scenarios--------------------------------------

//-----------------------------------Helper Functions--------------------------------------

