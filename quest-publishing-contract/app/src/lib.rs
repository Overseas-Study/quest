#![no_std]

use cell::RefCell;
use collections::btree_map::BTreeMap;
use info_quest::InfoQuestData;
use sails_rs::prelude::*;

mod info_quest;

pub struct QuestPublishing {
    info_quest_data: RefCell<InfoQuestData>,
}

#[program]
impl QuestPublishing {
    pub fn new() -> Self {
        Self {
            info_quest_data: RefCell::new(InfoQuestData {
                info_quest_map: BTreeMap::new(),
            }),
        }
    }

    pub fn info_quest_svc(&self) -> info_quest::InfoQuestService {
        info_quest::InfoQuestService::new(&self.info_quest_data)
    }
}
